// GitHub AI Trending Projects — Cloudflare Pages Function
// 优先返回每日由 GitHub Action 生成的静态 data/projects.json（已翻译中文、内容每日轮换）
// 静态文件不可用时才实时查询 GitHub 兜底
// 缓存策略：30 分钟 (s-maxage=1800)

function timeoutSignal(ms) {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;

  // Try cache first
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const jsonHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, s-maxage=1800, max-age=60',
    'Access-Control-Allow-Origin': '*',
  };

  // 1) 优先读取每日生成的静态 projects.json（中文、每日更新）
  try {
    const staticUrl = new URL('/data/projects.json', request.url);
    const res = await fetch(staticUrl.toString(), { signal: timeoutSignal(4000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const response = new Response(JSON.stringify(data), { headers: jsonHeaders });
        context.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
      }
    }
  } catch { /* fall through to live query */ }

  // 2) 兜底：实时查询 GitHub 近期飙升项目
  try {
    const d30 = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    const q = `created:>${d30} stars:>100 topic:ai`;
    const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=30`, {
      headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'aiager-top' },
      signal: timeoutSignal(8000),
    });
    const data = res.ok ? await res.json() : { items: [] };
    const projects = (data.items || []).map(item => ({
      id: item.id, name: item.name, full_name: item.full_name,
      description: item.description, url: item.html_url,
      stars: item.stargazers_count, forks: item.forks_count,
      language: item.language, license: item.license?.spdx_id || '',
      updated: item.updated_at?.slice(0, 10) || '', created: item.created_at?.slice(0, 10) || '',
      topics: item.topics || [],
    }));
    const response = new Response(JSON.stringify(projects), { headers: jsonHeaders });
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, items: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
