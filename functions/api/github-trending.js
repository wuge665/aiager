// GitHub AI Trending Projects — Cloudflare Pages Function
// 查询"近期新创建、快速增长"的 AI 项目（真正的趋势），而非历史总星数榜
// 历史总榜（sort=stars 全量）永远不变，无法体现"趋势"
// 缓存策略：60 分钟 (s-maxage=3600)

function daysAgo(n) {
  const d = new Date(Date.now() - n * 86400000);
  return d.toISOString().slice(0, 10);
}

function timeoutSignal(ms) {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

// 近 30 天新创建、星数快速增长的 AI 项目（随时间自然轮换）
function buildQueries() {
  const d30 = daysAgo(30);
  const d60 = daysAgo(60);
  return [
    `created:>${d30} stars:>100 topic:ai`,
    `created:>${d30} stars:>100 topic:llm`,
    `created:>${d30} stars:>50 topic:generative-ai`,
    `created:>${d30} stars:>50 topic:ai-agents`,
    `created:>${d60} stars:>300 ai in:name`,
    `created:>${d60} stars:>300 (llm OR gpt OR agent) in:description`,
  ];
}

// 兜底：如果近期项目太少，补充近 90 天的高星项目
function fallbackQuery() {
  return `created:>${daysAgo(90)} stars:>500 (ai OR llm OR machine-learning)`;
}

function isEnglish(text) {
  if (!text) return false;
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  return letters / text.length > 0.3;
}

async function translateZh(text) {
  if (!text) return '';
  try {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=' + encodeURIComponent(text.slice(0, 300));
    const res = await fetch(url, { signal: timeoutSignal(3000) });
    if (!res.ok) return text;
    const data = await res.json();
    return data[0].map(s => s[0]).join('') || text;
  } catch { return text; }
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;

  // Try cache first
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const token = env.GITHUB_TOKEN || '';
    const headers = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'aiager-top' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const perPage = 8;
    const search = (q) =>
      fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${perPage}`, { headers, signal: timeoutSignal(8000) })
        .then(r => r.ok ? r.json() : { items: [] })
        .catch(() => ({ items: [] }));

    const results = await Promise.all(buildQueries().map(search));
    const seen = new Set();
    let projects = [];

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
          created: item.created_at?.slice(0, 10) || '',
          topics: item.topics || [],
        });
      });
    });

    // 兜底：近期项目不足 10 个时，补充近 90 天高星项目
    if (projects.length < 10) {
      const fb = await search(fallbackQuery());
      (fb.items || []).forEach(item => {
        if (seen.has(item.id)) return;
        seen.add(item.id);
        projects.push({
          id: item.id, name: item.name, full_name: item.full_name,
          description: item.description, url: item.html_url,
          stars: item.stargazers_count, forks: item.forks_count,
          language: item.language, license: item.license?.spdx_id || '',
          updated: item.updated_at?.slice(0, 10) || '', created: item.created_at?.slice(0, 10) || '',
          topics: item.topics || [],
        });
      });
    }

    // Sort by stars descending
    projects.sort((a, b) => b.stars - a.stars);
    const topProjects = projects.slice(0, 30);

    // 英文描述翻译为中文（失败则保留英文）
    await Promise.all(topProjects.map(async p => {
      if (isEnglish(p.description)) {
        p.description = await translateZh(p.description);
      }
    }));

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
