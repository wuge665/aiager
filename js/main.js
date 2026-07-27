// ===== State =====
let TOOLS = []; let NEWS = []; let PROJECTS = []; let TUTORIALS = [];
let currentPage = 'home'; let currentCategory = 'all';

const CATEGORIES = {
  writing: { name: 'AI 写作', icon: 'fa-pencil-square-o', subs: [] },
  image: { name: 'AI 图像', icon: 'fa-picture-o', subs: ['AI 绘画', 'AI 修图', 'AI 设计'] },
  video: { name: 'AI 视频', icon: 'fa-video-camera', subs: [] },
  code: { name: 'AI 编程', icon: 'fa-code', subs: [] },
  agent: { name: 'AI 智能体', icon: 'fa-robot', subs: [] },
  audio: { name: 'AI 音频', icon: 'fa-music', subs: [] },
  productivity: { name: 'AI 效率', icon: 'fa-tasks', subs: [] }
};

const ICON_COLORS = ['#5961f9','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4'];

document.addEventListener('DOMContentLoaded', init);

async function init() {
  document.getElementById('loader').classList.add('hidden');
  parseData();
  buildSidebar();
  loadPage('home');
  bindEvents();
  fetchNews();
  fetchProjects();
  fetchTutorials();
}

function parseData() {
  TOOLS = TOOLS_DATA || [];
  if (window.TUTORIALS_DATA) window.__tuts = TUTORIALS_DATA;
  // 加载中文项目描述映射
  if (window.PROJECTS_CN) window.PROJECTS_CN = window.PROJECTS_CN;
}

// ===== Sidebar =====
function buildSidebar() {
  const nav = document.getElementById('sidebarNav');
  nav.innerHTML = '';
  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const li = document.createElement('li');
    li.className = 'sidebar-item';
    const hasSub = cat.subs && cat.subs.length;
    const count = TOOLS.filter(t => t.category === key).length;
    const expandIcon = hasSub ? `<i class="fa fa-chevron-right sidebar-more"></i>` : '';
    li.innerHTML = `
      <a href="#" data-cat="${key}" onclick="filterByCategory('${key}')">
        <i class="fa ${cat.icon}"></i><span>${cat.name}</span><span style="margin-left:auto;font-size:11px;color:var(--text-muted)">${count}</span>
      </a>${expandIcon}
      ${hasSub ? `<div class="sidebar-sub">${cat.subs.map(s => `<a href="#" onclick="filterByCategory('${key}')">${s}</a>`).join('')}</div>` : ''}`;
    nav.appendChild(li);
  });
}

// ===== Page Routing =====
function loadPage(page, data) {
  currentPage = page;
  document.querySelectorAll('.header-nav a').forEach(a => a.classList.toggle('active', a.dataset.page === page));
  const container = document.getElementById('pageContent');
  const pages = { home: renderHome, news: renderNews, tutorials: renderTutorials, projects: renderProjects };
  if (pages[page]) container.innerHTML = pages[page](data);
}

// ===== Home: Hero + Category Sections =====
function renderHome() {
  const hero = `
    <div class="hero">
      <img src="assets/icons/logo.svg" alt="AI 百宝箱"/>
      <h1>AI 百宝箱</h1>
      <p>精选 AI 工具，提升工作效率</p>
      <div class="search-box">
        <input id="searchInput" placeholder="搜索 AI 工具..." autocomplete="off"/>
        <button onclick="doSearch()"><i class="fa fa-search"></i></button>
      </div>
    </div>`;
  let sections = '';
  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const tools = TOOLS.filter(t => t.category === key);
    if (!tools.length) return;
    sections += `
      <div class="section" id="section-${key}">
        <div class="section-header">
          <h2><i class="fa ${cat.icon}" style="color:var(--primary);margin-right:8px"></i>${cat.name}</h2>
        </div>
        <div class="tool-grid">${tools.map(t => renderToolCard(t)).join('')}</div>
      </div>`;
  });
  return hero + sections;
}

function renderToolCard(t) {
  const color = ICON_COLORS[Math.floor(Math.random() * ICON_COLORS.length)];
  const isEmoji = t.icon && t.icon.length <= 2;
  return `
    <div class="tool-card" onclick="openTool('${t.id}')">
      <div class="tool-icon" style="background:${color}20">${isEmoji ? `<span class="emoji">${t.icon}</span>` : `<img src="${t.icon}" alt=""/>`}</div>
      <div class="tool-info">
        <h3>${t.name}</h3>
        <p>${t.desc || ''}</p>
        <div class="tool-tags">${(t.tags || []).slice(0,3).map(tag => `<span class="tool-tag">${tag}</span>`).join('')}</div>
      </div>
    </div>`;
}

// ===== News =====
function renderNews(items) {
  const list = items || NEWS;
  if (!list.length) return '<div class="page-header"><h1>AI 资讯</h1><p class="subtitle">加载中...</p></div>';
  const groups = {};
  list.forEach(n => {
    const d = n.date ? n.date.slice(0,10) : '未知';
    if (!groups[d]) groups[d] = [];
    groups[d].push(n);
  });
  let html = '<div class="page-header"><h1>AI 资讯</h1><p class="subtitle">全球 AI 新闻，自动翻译中文</p></div><div class="news-timeline">';
  Object.entries(groups).forEach(([date, items]) => {
    html += `<div class="news-date-group"><div class="news-date-label">${date}</div>`;
    items.forEach(n => {
      html += `
        <div class="news-card" onclick="openNews('${n.id || n.title}')">
          <div class="meta">${n.source || 'AI 百宝箱'} · ${n.date || ''}</div>
          <h3>${n.title}</h3>
          <p>${n.desc || n.content?.slice(0,150) || ''}</p>
        </div>`;
    });
    html += '</div>';
  });
  html += '</div>';
  return html;
}

async function fetchNews() {
  try {
    const res = await fetch('/api/news');
    if (res.ok) { NEWS = await res.json(); if (currentPage === 'news') loadPage('news'); }
  } catch {}
}

// ===== Tutorials =====
function renderTutorials(items) {
  const list = items || TUTORIALS;
  if (!list.length) return '<div class="page-header"><h1>AI 教程资源</h1><p class="subtitle">加载中...</p></div>';
  let html = '<div class="page-header"><h1>AI 教程资源</h1><p class="subtitle">从入门到精通的 AI 学习资料</p></div>';
  html += '<div class="filter-bar">';
  ['全部','入门','进阶','高级'].forEach(lv => {
    html += `<span class="filter-btn ${lv === '全部' ? 'active' : ''}" onclick="filterTutorials('${lv}')">${lv}</span>`;
  });
  html += '</div><div class="content-grid">';
  list.forEach(t => {
    const levelClass = t.level === '入门' ? 'green' : t.level === '进阶' ? 'orange' : 'red';
    html += `
      <div class="content-card" onclick="openTutorial('${t.id || t.title}')">
        <h3>${t.title}</h3>
        <div class="desc">${t.desc}</div>
        <div class="stats">
          ${t.level ? `<span class="tool-tag ${levelClass}"><i class="fa fa-signal"></i> ${t.level}</span>` : ''}
          ${(t.tags || []).slice(0,3).map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
        </div>
        <div class="meta">
          <span><i class="fa fa-user"></i> ${t.source || 'AI 百宝箱'}</span>
          <span>${t.date || ''}</span>
        </div>
      </div>`;
  });
  html += '</div>';
  return html;
}

async function fetchTutorials() {
  const fallback = window.TUTORIALS_DATA || [];
  try {
    const res = await fetch('/data/tutorials.json?_t=' + Date.now());
    if (res.ok) {
      const remote = await res.json();
      const seen = new Set();
      // Remote first (newer), then static as fallback for any missing
      remote.forEach(t => seen.add(t.id || t.title));
      TUTORIALS = [...remote, ...fallback.filter(t => !seen.has(t.id || t.title))];
    } else { TUTORIALS = fallback; }
  } catch { TUTORIALS = fallback; }
  if (currentPage === 'tutorials') loadPage('tutorials');
}

function filterTutorials(level) {
  if (level === '全部') { loadPage('tutorials'); return; }
  loadPage('tutorials', TUTORIALS.filter(t => t.level === level));
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.textContent === level));
}

function openTutorial(id) {
  const t = TUTORIALS.find(x => x.id === id || x.title === id);
  if (!t) return;
  const levelClass = t.level === '入门' ? 'green' : t.level === '进阶' ? 'orange' : 'red';
  const body = t.content ? t.content.split('\n').filter(Boolean).map(line => {
    if (line.startsWith('## ')) return `<h3 style="margin:16px 0 8px">${line.slice(3)}</h3>`;
    if (line.startsWith('- ')) return `<li style="margin:4px 0 4px 16px;color:var(--text-muted)">${line.slice(2)}</li>`;
    return `<p style="margin:6px 0;line-height:1.8">${line}</p>`;
  }).join('') : `<p>${t.desc}</p>`;
  openOverlay(`<h2>${t.title}</h2><div class="meta">${t.source || 'AI 百宝箱'} · ${t.date || ''} · <span class="tool-tag ${levelClass}">${t.level}</span></div><div class="body">${body}${t.url && t.url !== '#' ? `<p style="margin-top:20px"><a href="${t.url}" target="_blank">使用该工具 →</a></p>` : ''}</div>`);
}

// ===== Projects (GitHub Trending) =====
function renderProjects(items) {
  const list = items || PROJECTS;
  if (!list.length) return '<div class="page-header"><h1>AI 项目</h1><p class="subtitle">加载中...</p></div>';
  
  // 中文项目分类标题
  const categoryTitles = {
    llm: { icon: '🤖', title: '大语言模型 (LLM)', desc: '本地部署、推理优化、模型管理' },
    code: { icon: '💻', title: 'AI 编程工具', desc: '智能补全、代码生成、自动化开发' },
    image: { icon: '🎨', title: 'AI 绘图/图像', desc: '文生图、图生图、图像处理' },
    video: { icon: '🎬', title: 'AI 视频生成', desc: '文生视频、图生视频、视频编辑' },
    audio: { icon: '🎵', title: 'AI 音频处理', desc: '语音合成、音乐生成、音频编辑' },
    other: { icon: '📦', title: '其他热门项目', desc: '工具、框架、数据集等' }
  };
  
  // 按分类分组
  const grouped = {};
  list.forEach(p => {
    const cn = window.PROJECTS_CN?.[p.name] || window.PROJECTS_CN?.[p.full_name?.split('/')?.[1]];
    const category = cn?.category || 'other';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({ ...p, cnData: cn });
  });
  
  // 优先显示有中文映射的分类
  const order = ['llm', 'code', 'image', 'video', 'audio', 'other'];
  
  let html = '<div class="page-header"><h1>🔥 热门 AI 项目</h1><p class="subtitle">发掘 GitHub 近期飙升的 AI 开源项目 · 每日更新</p></div>';
  
  order.forEach(cat => {
    const projects = grouped[cat];
    if (!projects || !projects.length) return;
    const catInfo = categoryTitles[cat];
    
    html += `
      <div class="section" id="project-section-${cat}">
        <div class="section-header">
          <h2>${catInfo.icon} ${catInfo.title}</h2>
          <p style="color:var(--text-muted);margin:4px 0 0;font-size:14px">${catInfo.desc}</p>
        </div>
        <div class="content-grid">`;
    
    projects.forEach(p => {
      // 使用中文数据（如果有），否则保留英文
      const displayName = p.cnData?.name || p.name || p.full_name;
      const displayDesc = p.cnData?.desc || p.description || p.desc || '';
      const displayTags = p.cnData?.tags || [];
      
      html += `
        <div class="content-card" onclick="window.open('${p.url || p.html_url}','_blank')">
          <h3><i class="fa fa-github-alt" style="color:var(--primary)"></i> ${displayName}</h3>
          <div class="desc">${displayDesc}</div>
          ${displayTags.length ? `<div class="stats">${displayTags.map(t => `<span class="tool-tag">${t}</span>`).join('')}</div>` : ''}
          <div class="stats">
            ${p.stars ? `<span class="tool-tag"><i class="fa fa-star"></i> ${p.stars}</span>` : ''}
            ${p.language ? `<span class="tool-tag green">${p.language}</span>` : ''}
            ${p.license ? `<span class="tool-tag">${p.license}</span>` : ''}
          </div>
          <div class="meta" style="margin-top:8px">
            <span><i class="fa fa-code-fork"></i> ${p.forks || ''}</span>
            <span><i class="fa fa-clock-o"></i> ${p.updated || ''}</span>
          </div>
        </div>`;
    });
    
    html += '</div></div>';
  });
  
  return html;
}

async function fetchProjects() {
  try {
    const res = await fetch('/api/github-trending');
    if (res.ok) { PROJECTS = await res.json(); if (currentPage === 'projects') loadPage('projects'); }
  } catch {}
}

// ===== Navigation Events =====
function bindEvents() {
  document.querySelectorAll('.header-nav a').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); loadPage(a.dataset.page); });
  });
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('show');
  });
  document.getElementById('sidebarOverlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeArticle(); });
}

function filterByCategory(cat) {
  currentCategory = cat;
  loadPage('home');
  setTimeout(() => {
    const el = document.getElementById('section-' + cat);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

function doSearch() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!q) return;
  const results = TOOLS.filter(t => t.name.toLowerCase().includes(q) || (t.desc || '').toLowerCase().includes(q) || (t.tags || []).some(tag => tag.toLowerCase().includes(q)));
  if (!results.length) { showToast('未找到匹配工具'); return; }
  // Show results as home page with only matching tools
  const hero = document.querySelector('.hero')?.outerHTML || '';
  const grid = `<div class="section"><div class="section-header"><h2>搜索结果 (${results.length})</h2></div><div class="tool-grid">${results.map(t => renderToolCard(t)).join('')}</div></div>`;
  document.getElementById('pageContent').innerHTML = hero + grid;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== Theme =====
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  document.getElementById('themeToggle').textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') { document.body.classList.add('dark-mode'); document.getElementById('themeToggle').textContent = '☀️'; }

// ===== Overlay =====
function openTool(id) {
  const t = TOOLS.find(x => x.id === id);
  if (!t) return;
  openOverlay(`<h2>${t.icon || ''} ${t.name}</h2><div class="meta">${t.url ? `<a href="${t.url}" target="_blank">${t.url}</a>` : ''} · ${(t.tags || []).join(' / ')}</div><div class="body"><p>${t.desc || ''}</p></div>`);
}

function contentParagraphs(content) {
  if (!content) return [];
  if (Array.isArray(content)) return content.map(s => String(s).trim()).filter(Boolean);
  let parts = String(content).split(/\n{2,}|\n/).map(s => s.trim()).filter(Boolean);
  // 兼容旧数据：没有换行的长文本按句子切分成段，避免一大坨
  if (parts.length <= 1 && String(content).length > 300) {
    const sentences = String(content).match(/[^。！？.!?]+[。！？.!?]?/g) || [String(content)];
    parts = [];
    let buf = '';
    for (const s of sentences) {
      buf += s;
      if (buf.length > 180) { parts.push(buf.trim()); buf = ''; }
    }
    if (buf.trim()) parts.push(buf.trim());
  }
  return parts;
}

function openNews(id) {
  const n = NEWS.find(x => x.id === id || x.title === id);
  if (!n) return;
  const paras = contentParagraphs(n.content || n.desc);
  const bodyHtml = paras.length
    ? paras.map(p => `<p>${p}</p>`).join('')
    : '<p>暂无正文内容</p>';
  openOverlay(`<h2>${n.title}</h2><div class="meta">${n.source || ''} · ${n.date || ''}</div><div class="body">${bodyHtml}</div>`);
}

function openOverlay(html) {
  document.getElementById('articleInner').innerHTML = html;
  document.getElementById('articleOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeArticle() {
  document.getElementById('articleOverlay').classList.remove('show');
  document.body.style.overflow = '';
}
