const SOURCES = [
  { name: 'Hacker News', url: 'https://hnrss.org/frontpage?count=30' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'ArsTechnica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab' },
  { name: '36氪', url: 'https://36kr.com/feed' },
  { name: 'InfoQ', url: 'https://www.infoq.cn/feed' },
];

const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'deep learning',
  'llm', 'large language model', 'gpt', 'claude', 'gemini', 'openai',
  '人工智能', '机器学习', '深度学习', '大模型', '语言模型',
  'agent', '智能体', 'neural', 'transformer', 'diffusion',
  'copilot', 'chatbot', 'agi', 'multimodal', '多模态',
];

function extractRssItems(xml, sourceName) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, 'title');
    if (!title) continue;
    const link = extractTag(block, 'link');
    const descRaw = extractTag(block, 'description') || '';
    const desc = descRaw.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim().slice(0, 200);
    const dateStr = extractTag(block, 'pubDate') || extractTag(block, 'dc:date') || '';
    items.push({
      id: slugify(title) + '-' + Date.now(),
      title: title.replace(/&[^;]+;/g, '').trim(),
      desc,
      url: link,
      source: sourceName,
      date: parseDate(dateStr),
    });
  }
  return items;
}

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = re.exec(xml);
  if (!m) return '';
  return (m[1] || m[2] || '').trim();
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function parseDate(str) {
  if (!str) return new Date().toISOString().slice(0, 10);
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch {}
  return new Date().toISOString().slice(0, 10);
}

function hasAiRelevance(item) {
  const text = (item.title + ' ' + item.desc).toLowerCase();
  return AI_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
}

async function fetchFeed(source) {
  try {
    const res = await fetch(source.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AIHubNewsBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return extractRssItems(xml, source.name);
  } catch {
    return [];
  }
}

export async function onRequest(context) {
  const allItems = (await Promise.all(SOURCES.map(s => fetchFeed(s)))).flat();
  const aiItems = allItems.filter(hasAiRelevance);

  aiItems.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });

  const seen = new Set();
  const deduped = [];
  for (const item of aiItems) {
    const key = item.title.slice(0, 30).toLowerCase();
    if (!seen.has(key)) { seen.add(key); deduped.push(item); }
  }

  return new Response(JSON.stringify(deduped.slice(0, 20)), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
