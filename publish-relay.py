import asyncio, base64, json, re, os, urllib.request
from aiohttp import web, ClientSession

WP_URL = 'https://aiager.wordpress.com/xmlrpc.php'
WP_USER = 'aiager'
WP_PASS = '9X0C16Rs'
GH_REPO = 'wuge665/aiager'
GH_BRANCH = 'master'
GH_FILE = 'data/news.json'
GH_TOKEN = os.environ.get('GITHUB_TOKEN', '')

def esc(s):
    s = str(s)
    for c in [('&','&amp;'),('<','&lt;'),('>','&gt;'),('"','&quot;'),("'","&apos;")]:
        s = s.replace(*c)
    return s

async def wp_post(title, content, status):
    auth = base64.b64encode(f'{WP_USER}:{WP_PASS}'.encode()).decode()
    xml = f'''<?xml version="1.0"?>
<methodCall><methodName>wp.newPost</methodName>
<params><param><value><int>1</int></value></param>
<param><value><string>{WP_USER}</string></value></param>
<param><value><string>{WP_PASS}</string></value></param>
<param><value><struct>
<member><name>post_title</name><value><string>{esc(title)}</string></value></member>
<member><name>post_content</name><value><string>{esc(content)}</string></value></member>
<member><name>post_status</name><value><string>{'draft' if status == 'draft' else 'publish'}</string></value></member>
</struct></value></param></params></methodCall>'''

    async def _do_post():
        async with ClientSession() as sess:
            async with sess.post(WP_URL, data=xml.encode(), headers={
                'Content-Type': 'text/xml',
                'Authorization': f'Basic {auth}',
                'User-Agent': 'aiager-relay/1.0'
            }) as resp:
                text = await resp.text()
                m = re.search(r'<string>(\d+)</string>', text)
                if m:
                    return m.group(1)
                raise Exception(f'WP XML-RPC {resp.status}: {text[:200]}')
    return await asyncio.wait_for(_do_post(), timeout=15)

async def gh_commit(title, wp_id, src, content, desc):
    if not GH_TOKEN:
        return 'no-token'
    from datetime import date
    today = date.today().isoformat()
    entry = {
        'id': f'wp-{wp_id}-{today}',
        'title': title,
        'desc': desc or (content[:120] + '...' if len(content) > 120 else content),
        'url': f'https://aiager.wordpress.com/?p={wp_id}',
        'source': src or 'AI 百宝箱',
        'date': today,
        'content': content,
        'userEdited': True
    }
    async with ClientSession() as sess:
        h = {'Authorization': f'Bearer {GH_TOKEN}', 'Accept': 'application/vnd.github.v3+json'}
        async with sess.get(f'https://api.github.com/repos/{GH_REPO}/contents/{GH_FILE}?ref={GH_BRANCH}', headers=h) as r:
            if r.status != 200:
                return f'GH GET {r.status}'
            f = await r.json()
        cur = json.loads(base64.b64decode(f['content']).decode())
        cur.insert(0, entry)
        if len(cur) > 100:
            cur = cur[:100]
        new_enc = base64.b64encode(json.dumps(cur, ensure_ascii=False, indent=2).encode()).decode()
        async with sess.put(f'https://api.github.com/repos/{GH_REPO}/contents/{GH_FILE}', headers=h, json={
            'message': f'publish: {title}',
            'content': new_enc,
            'sha': f['sha'],
            'branch': GH_BRANCH
        }) as r:
            return 'OK' if r.status == 200 else f'GH PUT {r.status}'

API_KEY = 'aiager-relay-2026-secret'

async def handle(request):
    if request.headers.get('X-Api-Key', '') != API_KEY and request.headers.get('x-api-key', '') != API_KEY:
        return web.json_response({'error': 'unauthorized'}, status=401)
    try:
        data = await request.json()
    except Exception as e:
        return web.json_response({'error': f'bad json: {e}'}, status=400)

    if not data.get('title') or not data.get('content'):
        return web.json_response({'error': 'title and content required'}, status=400)

    wp_result = 'skipped'
    wp_id = '0'
    try:
        wp_id = await wp_post(data['title'], data['content'], data.get('status', ''))
        wp_result = f'OK id={wp_id}'
    except Exception as e:
        wp_result = f'FAIL {e}'

    gh_result = 'no-token'
    if GH_TOKEN and wp_id != '0':
        gh_result = await gh_commit(data['title'], wp_id, data.get('source', ''), data['content'], data.get('desc', ''))

    return web.json_response({
        'success': True,
        'wpResult': wp_result,
        'ghResult': gh_result,
        'wordpress': {
            'id': wp_id,
            'url': f'https://aiager.wordpress.com/?p={wp_id}',
            'editUrl': f'https://aiager.wordpress.com/wp-admin/post.php?post={wp_id}&action=edit'
        } if wp_id != '0' else None,
        'newsEntry': {
            'synced': gh_result == 'OK',
            '_note': 'GITHUB_TOKEN not configured — add to Cloudflare Pages env vars' if gh_result == 'no-token' else None
        }
    })

app = web.Application()
app.router.add_post('/publish', handle)
app.router.add_get('/health', lambda r: web.json_response({'status': 'ok', 'token': bool(GH_TOKEN)}))

if __name__ == '__main__':
    web.run_app(app, host='0.0.0.0', port=8088)
