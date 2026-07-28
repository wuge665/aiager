// 每日抓取 GitHub 近期飙升的 AI 项目，翻译为中文，写入 data/projects.json
// 由 GitHub Action 定时调用（与 fetch-news.js 同一流程）
// 说明：不在 Cloudflare 函数里实时翻译（边缘节点调 Google 翻译被限流），
//       改为在 GitHub runner 上翻译好后存静态文件，网站直接读取。

const fs = require('fs');
const path = require('path');

function daysAgo(n) {
  return new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
}

// 近 3/7/30/60 天新创建、星数快速增长的 AI 项目（随时间自然轮换）
// 3 天短窗口保证"昨天/今天"刚冒头的新项目能被抓到并排到最前
function buildQueries() {
  const d3 = daysAgo(3);
  const d7 = daysAgo(7);
  const d30 = daysAgo(30);
  const d60 = daysAgo(60);
  return [
    `created:>${d3} stars:>25 topic:ai`,
    `created:>${d3} stars:>20 ai in:name`,
    `created:>${d7} stars:>60 topic:ai`,
    `created:>${d7} stars:>60 topic:llm`,
    `created:>${d7} stars:>50 ai in:name`,
    `created:>${d30} stars:>100 topic:llm`,
    `created:>${d30} stars:>50 topic:generative-ai`,
    `created:>${d60} stars:>300 ai in:name`,
  ];
}

function fallbackQuery() {
  return `created:>${daysAgo(90)} stars:>500 (ai OR llm OR machine-learning)`;
}

// 骗局/垃圾仓库关键词黑名单
const SCAM_KEYWORDS = [
  '股票', '炒股', '赚钱', '理财', '返利', '免费领', '空投', '撸毛', '兼职', '刷单',
  'giveaway', 'airdrop', 'free money', 'passive income', 'earn daily',
  'crypto signal', 'pump', 'memecoin',
];

// 质量过滤：剔除空壳、刷星、骗局仓库
function isQualityProject(p) {
  // 必须有实质性描述（空描述/一句话的多为垃圾仓库）
  if (!p.description || p.description.trim().length < 15) return false;
  // 必须检测到编程语言（说明有真实代码；纯链接/空壳仓库无语言）
  if (!p.language) return false;
  // 仓库要有实际内容（size 单位 KB，排除空壳）
  if ((p.size || 0) < 5) return false;
  // 排除已归档仓库
  if (p.archived) return false;
  // 排除骗局关键词
  const text = ((p.name || '') + ' ' + (p.description || '') + ' ' + (p.topics || []).join(' ')).toLowerCase();
  if (SCAM_KEYWORDS.some(kw => text.includes(kw.toLowerCase()))) return false;
  return true;
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
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return text;
    const data = await res.json();
    return data[0].map(s => s[0]).join('') || text;
  } catch { return text; }
}

async function searchRepos(q, perPage = 8) {
  try {
    const headers = { 'User-Agent': 'aiager-top', 'Accept': 'application/vnd.github.v3+json' };
    if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${perPage}`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) { console.warn(`[search] HTTP ${res.status} for: ${q}`); return []; }
    const data = await res.json();
    return data.items || [];
  } catch (e) {
    console.warn(`[search] error for "${q}": ${e.message}`);
    return [];
  }
}

async function main() {
  console.log('Fetching trending AI projects from GitHub...');
  const queries = buildQueries();
  const seen = new Set();
  let projects = [];

  for (const q of queries) {
    const items = await searchRepos(q);
    console.log(`  [${q.slice(0, 40)}...] -> ${items.length} items`);
    for (const item of items) {
      if (seen.has(item.id)) continue;
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
        size: item.size || 0,
        archived: item.archived || false,
      });
    }
  }

  // 兜底：不足 10 个时补充近 90 天高星项目
  if (projects.length < 10) {
    console.log('  [fallback] not enough recent projects, fetching 90-day high-star...');
    const items = await searchRepos(fallbackQuery());
    for (const item of items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      projects.push({
        id: item.id, name: item.name, full_name: item.full_name,
        description: item.description, url: item.html_url,
        stars: item.stargazers_count, forks: item.forks_count,
        language: item.language, license: item.license?.spdx_id || '',
        updated: item.updated_at?.slice(0, 10) || '', created: item.created_at?.slice(0, 10) || '',
        topics: item.topics || [],
        size: item.size || 0, archived: item.archived || false,
      });
    }
  }

  // 质量过滤：剔除空壳/刷星/骗局仓库
  const beforeFilter = projects.length;
  projects = projects.filter(isQualityProject);
  console.log(`Quality filter: ${beforeFilter} -> ${projects.length} (removed ${beforeFilter - projects.length} low-quality/scam)`);

  // 按创建时间排序：最新的在前面，越老的越往后（同日期按星数）
  projects.sort((a, b) => (b.created || '').localeCompare(a.created || '') || b.stars - a.stars);
  projects = projects.slice(0, 30);
  console.log(`Collected ${projects.length} trending projects`);

  // 英文描述翻译为中文（逐个翻译避免限流）
  let translatedCount = 0;
  for (const p of projects) {
    if (isEnglish(p.description)) {
      const zh = await translateZh(p.description);
      if (zh !== p.description) translatedCount++;
      p.description = zh;
    }
  }
  console.log(`Translated ${translatedCount} descriptions to Chinese`);

  const outputPath = path.join(__dirname, '..', 'data', 'projects.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2), 'utf-8');
  console.log(`Written ${projects.length} projects to data/projects.json`);
  console.log('Top 5:');
  projects.slice(0, 5).forEach((p, i) => console.log(`  ${i + 1}. ${p.full_name} | ${p.stars} stars | ${p.description?.slice(0, 40)}`));
}

main().catch(e => { console.error(e); process.exit(1); });
