// GitHub AI Trending Projects — Cloudflare Pages Function
// 每日从 GitHub 搜索热门 AI 项目，缓存至 KV 或返回实时数据
// 缓存策略：60 分钟 (s-maxage=3600)

// 搜索关键词组合
const QUERIES = [
  'topic:ai topic:machine-learning',
  'topic:deep-learning topic:llm',
  'topic:artificial-intelligence',
  'topic:computer-vision topic:nlp',
  'topic:generative-ai',
  'topic:large-language-model',
  'topic:chatgpt topic:gpt',
  'topic:diffusion topic:stable-diffusion',
];

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;

  // Try cache first
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  // Get from GitHub API
  try {
    const token = env.GITHUB_TOKEN || '';
    const headers = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'aiager-top' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Fetch multiple queries in parallel
    const perPage = 5;
    const promises = QUERIES.slice(0, 4).map(q =>
      fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${perPage}`, { headers })
        .then(r => r.ok ? r.json() : { items: [] })
        .catch(() => ({ items: [] }))
    );

    const results = await Promise.all(promises);
    const seen = new Set();
    const projects = [];

    results.forEach(res => {
      (res.items || []).forEach(item => {
        if (seen.has(item.id)) return;
        seen.add(item.id);
        projects.push({
          id: item.id,
          name: item.name,
          full_name: item.full_name,
          description: item.description,
          url: item.html_url,
          stars: item.stargazers_count,
          forks: item.forks_count,
          language: item.language,
          license: item.license?.spdx_id || '',
          updated: item.updated_at?.slice(0, 10) || '',
          topics: item.topics || [],
        });
      });
    });

    // Sort by stars descending
    projects.sort((a, b) => b.stars - a.stars);
    const topProjects = projects.slice(0, 30);

    const response = new Response(JSON.stringify(topProjects), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });

    // Store in cache
    context.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, items: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
