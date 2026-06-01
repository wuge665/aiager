const WP_USER = 'aiager';
const WP_PASS = '9X0C16Rs';
const WP_URL = 'https://aiager.wordpress.com/xmlrpc.php';

const GITHUB_REPO = 'wuge665/aiager';
const GITHUB_BRANCH = 'master';
const NEWS_FILE = 'data/news.json';

export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() });
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const data = await request.json();
    if (!data.title || !data.content) {
      return new Response(JSON.stringify({ error: 'title and content required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const result = { wordpress: null, newsEntry: null };

    // 1. Publish to WordPress
    const wpPostId = await wpNewPost(data);
    result.wordpress = {
      id: wpPostId,
      url: `https://aiager.wordpress.com/?p=${wpPostId}`,
      editUrl: `https://aiager.wordpress.com/wp-admin/post.php?post=${wpPostId}&action=edit`
    };

    // 2. Update data/news.json via GitHub API
    const ghToken = context.env?.GITHUB_TOKEN;
    if (ghToken) {
      const entry = buildNewsEntry(data, wpPostId);
      await updateNewsJson(ghToken, entry);
      result.newsEntry = entry;
    } else {
      result.newsEntry = buildNewsEntry(data, wpPostId);
      result.newsEntry._note = 'GITHUB_TOKEN not configured — add to Cloudflare Pages env vars';
    }

    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack?.split('\n').slice(0,3).join(' ') }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

function buildNewsEntry(data, wpPostId) {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  return {
    id: `wp-${wpPostId}-${dateStr}`,
    title: data.title,
    desc: data.desc || data.content.slice(0, 120) + '…',
    url: `https://aiager.wordpress.com/?p=${wpPostId}`,
    source: data.source || 'AI 百宝箱',
    date: dateStr,
    content: data.content,
    userEdited: true
  };
}

async function wpNewPost(data) {
  const auth = btoa(`${WP_USER}:${WP_PASS}`);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

  // Try XML-RPC with Basic Auth header
  const members = [
    ['post_title', 'string', esc(data.title)],
    ['post_content', 'string', esc(data.content)],
    ['post_status', 'string', data.status === 'draft' ? 'draft' : 'publish'],
  ];
  if (data.excerpt) members.push(['post_excerpt', 'string', esc(data.excerpt)]);

  let structXml = members.map(([k, t, v]) =>
    `<member><name>${k}</name><value><${t}>${v}</${t}></value></member>`
  ).join('');

  const xml = `<?xml version="1.0"?><methodCall><methodName>wp.newPost</methodName><params><param><value><int>1</int></value></param><param><value><string>${esc(WP_USER)}</string></value></param><param><value><string>${esc(WP_PASS)}</string></value></param><param><value><struct>${structXml}</struct></value></param></params></methodCall>`;

  const xrRes = await fetch('https://aiager.wordpress.com/xmlrpc.php', {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml', Authorization: `Basic ${auth}` },
    body: xml
  });

  const xrText = await xrRes.text();
  const xrMatch = xrText.match(/<string>(\d+)<\/string>/);
  if (xrMatch) return xrMatch[1];

  // Fallback: WordPress REST API with rest_route param
  const wpRes = await fetch('https://aiager.wordpress.com/?rest_route=/wp/v2/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify({ title: data.title, content: data.content, status: data.status === 'draft' ? 'draft' : 'publish' })
  });
  const wpText = await wpRes.text();
  try {
    const wpData = JSON.parse(wpText);
    if (wpData?.id) return wpData.id.toString();
  } catch (_) {}

  throw new Error(`WP API failed. XMLRPC(${xrRes.status}): ${xrText.slice(0,100)} REST(${wpRes.status}): ${wpText.slice(0,100)}`);
}

async function updateNewsJson(token, entry) {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  // Get current file
  const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${NEWS_FILE}?ref=${GITHUB_BRANCH}`, { headers });
  if (!getRes.ok) throw new Error(`GitHub get failed: ${getRes.status}`);

  const fileData = await getRes.json();
  const currentContent = JSON.parse(atob(fileData.content));
  const sha = fileData.sha;

  // Prepend new entry
  currentContent.unshift(entry);

  // Keep max 100 entries
  if (currentContent.length > 100) currentContent.length = 100;

  const newContent = btoa(JSON.stringify(currentContent, null, 2));

  const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${NEWS_FILE}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `publish: ${entry.title}`,
      content: newContent,
      sha,
      branch: GITHUB_BRANCH
    })
  });

  if (!putRes.ok) throw new Error(`GitHub put failed: ${putRes.status} ${await putRes.text()}`);
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
