export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'GET') {
    return new Response('OK env=' + (typeof context.env) + ' token=' + (context.env?.GITHUB_TOKEN ? 'yes' : 'no'), { status: 200 });
  }
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try { body = await request.text(); } catch(e) { return new Response('read fail: '+e, { status: 500 }); }

  let data;
  try { data = JSON.parse(body); } catch(e) { return new Response('json fail: '+e, { status: 400 }); }

  if (!data || !data.title || !data.content) {
    return new Response('missing fields', { status: 400 });
  }

  // Step 1: build XML
  try {
    const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
    const xml = '<?xml version="1.0"?><methodCall><methodName>wp.newPost</methodName><params><param><value><int>1</int></value></param><param><value><string>aiager</string></value></param><param><value><string>9X0C16Rs</string></value></param><param><value><struct><member><name>post_title</name><value><string>'+esc(data.title)+'</string></value></member><member><name>post_content</name><value><string>'+esc(data.content)+'</string></value></member><member><name>post_status</name><value><string>'+(data.status==='draft'?'draft':'publish')+'</string></value></member></struct></value></param></params></methodCall>';

    const auth = btoa('aiager:9X0C16Rs');
    const res = await fetch('https://aiager.wordpress.com/xmlrpc.php', {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml', 'Authorization': 'Basic '+auth },
      body: xml
    });
    const text = await res.text();
    const m = text.match(/<string>(\d+)<\/string>/);
    if (!m) {
      return new Response('xmlrpc fail: '+res.status+' '+text.slice(0,200), { status: 500 });
    }

    return new Response('OK wpId='+m[1], { status: 200 });
  } catch(e) {
    return new Response('error: '+(e.message||e)+' stack:'+((e.stack||'').split('\n').slice(0,2).join('|')), { status: 500 });
  }
}

function b64(s) {
  if (typeof btoa !== 'undefined') return btoa(s);
  return Buffer.from(s).toString('base64');
}

async function xmlrpcPost(data) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

  let members = '';
  members += `<member><name>post_title</name><value><string>${esc(data.title)}</string></value></member>`;
  members += `<member><name>post_content</name><value><string>${esc(data.content)}</string></value></member>`;
  members += `<member><name>post_status</name><value><string>${data.status === 'draft' ? 'draft' : 'publish'}</string></value></member>`;

  const xml = `<?xml version="1.0"?>
<methodCall>
  <methodName>wp.newPost</methodName>
  <params>
    <param><value><int>1</int></value></param>
    <param><value><string>aiager</string></value></param>
    <param><value><string>9X0C16Rs</string></value></param>
    <param><value><struct>${members}</struct></value></param>
  </params>
</methodCall>`;

  const res = await fetch('https://aiager.wordpress.com/xmlrpc.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml',
      'Authorization': 'Basic ' + b64('aiager:9X0C16Rs')
    },
    body: xml
  });

  const text = await res.text();
  const m = text.match(/<string>(\d+)<\/string>/);
  if (m) return m[1];

  // Try REST API as fallback
  const r2 = await fetch('https://aiager.wordpress.com/?rest_route=/wp/v2/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + b64('aiager:9X0C16Rs')
    },
    body: JSON.stringify({ title: data.title, content: data.content, status: data.status === 'draft' ? 'draft' : 'publish' })
  });
  const j2 = await r2.json();
  if (j2?.id) return String(j2.id);

  throw new Error('All WP APIs failed. XML-RPC status: ' + res.status + ' body: ' + text.slice(0, 100) + ' | REST status: ' + r2.status);
}

function buildEntry(data, wpId) {
  const date = new Date().toISOString().slice(0, 10);
  return {
    id: 'wp-' + wpId + '-' + date,
    title: data.title,
    desc: data.desc || (data.content.length > 120 ? data.content.slice(0, 120) + '…' : data.content),
    url: 'https://aiager.wordpress.com/?p=' + wpId,
    source: data.source || 'AI 百宝箱',
    date,
    content: data.content,
    userEdited: true
  };
}

async function githubCommit(token, entry) {
  const h = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };

  const g = await fetch('https://api.github.com/repos/wuge665/aiager/contents/data/news.json?ref=master', { headers: h });
  if (!g.ok) throw new Error('GitHub GET ' + g.status);
  const f = await g.json();
  const cur = JSON.parse(atob(f.content));
  cur.unshift(entry);
  if (cur.length > 100) cur.length = 100;

  const p = await fetch('https://api.github.com/repos/wuge665/aiager/contents/data/news.json', {
    method: 'PUT',
    headers: h,
    body: JSON.stringify({ message: 'publish: ' + entry.title, content: btoa(JSON.stringify(cur, null, 2)), sha: f.sha, branch: 'master' })
  });
  if (!p.ok) throw new Error('GitHub PUT ' + p.status + ' ' + (await p.text()).slice(0, 200));
}
