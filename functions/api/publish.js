export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'GET') {
    const env = context.env || {};
    const keys = Object.keys(env).sort().join(', ');
    const tokenInfo = env.GITHUB_TOKEN ? 'present len='+env.GITHUB_TOKEN.length : 'MISSING';
    return new Response('OK env_keys: ' + keys + ' | token: ' + tokenInfo, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  }
  if (request.method !== 'POST') {
    return new Response('only POST', { status: 405 });
  }

  try {
    const text = await request.text();
    const data = JSON.parse(text);
    const id = String(Date.now());

    // Try WordPress XML-RPC
    let wpResult = 'skipped';
    try {
      const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
      const xml = '<?xml version="1.0"?><methodCall><methodName>wp.newPost</methodName><params><param><value><int>1</int></value></param><param><value><string>aiager</string></value></param><param><value><string>9X0C16Rs</string></value></param><param><value><struct><member><name>post_title</name><value><string>'+esc(data.title)+'</string></value></member><member><name>post_content</name><value><string>'+esc(data.content)+'</string></value></member><member><name>post_status</name><value><string>'+(data.status==='draft'?'draft':'publish')+'</string></value></member></struct></value></param></params></methodCall>';

      const auth = btoa('aiager:9X0C16Rs');
      const res = await fetch('https://aiager.wordpress.com/xmlrpc.php', {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml', 'Authorization': 'Basic '+auth },
        body: xml
      });
      const body = await res.text();
      const m = body.match(/<string>(\d+)<\/string>/);
      wpResult = m ? 'OK id='+m[1] : 'FAIL status='+res.status+' body='+body.slice(0,100);
    } catch (e) {
      wpResult = 'ERROR '+e.message;
    }

    // Try GitHub commit
    let ghResult = 'no-token';
    const token = context.env?.GITHUB_TOKEN;
    if (token) {
      try {
        const h = { 'Authorization': 'Bearer '+token, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };
        const g = await fetch('https://api.github.com/repos/wuge665/aiager/contents/data/news.json?ref=master', { headers: h });
        if (!g.ok) { ghResult = 'GET fail '+g.status; } else {
          const f = await g.json();
          const cur = JSON.parse(atob(f.content));
          cur.unshift({ id: 'test-'+id, title: data.title, content: data.content, date: new Date().toISOString().slice(0,10), userEdited: true });
          const p = await fetch('https://api.github.com/repos/wuge665/aiager/contents/data/news.json', {
            method: 'PUT', headers: h,
            body: JSON.stringify({ message: 'test: '+data.title, content: btoa(JSON.stringify(cur, null, 2)), sha: f.sha, branch: 'master' })
          });
          ghResult = p.ok ? 'OK' : 'PUT fail '+p.status;
        }
      } catch (e) { ghResult = 'ERROR '+e.message; }
    }

    return new Response(JSON.stringify({ success: true, wpResult, ghResult }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message || String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
