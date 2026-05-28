// ===== State =====
let currentTools = TOOLS_DATA;
let searchTimeout = null;
let SITE_CONFIG = {};

// ===== Init =====
document.addEventListener('DOMContentLoaded', async () => {
  SITE_CONFIG = await loadConfig();
  applyConfig(SITE_CONFIG);

  // Render ads before tools so ad cards are included
  initAds();

  initParticles();
  renderScenes();
  renderTools(TOOLS_DATA);
  bindEvents();
  initScrollTop();

  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 300);
});

// ===== Load Config =====
async function loadConfig() {
  try {
    const res = await fetch('config.json?_t=' + Date.now());
    if (res.ok) return await res.json();
  } catch {}
  // Fallback: check window.__AD_CONFIG
  return {};
}

function applyConfig(config) {
  const ads = config.ads || {};
  if (ads.enabled && ads.adsensePublisherId && ads.adsensePublisherId !== 'ca-pub-XXXXXXXXXXXXXXXX') {
    window.__AD_CONFIG = {
      enabled: true,
      adsensePublisherId: ads.adsensePublisherId,
      adsenseSlot: ads.adsenseSlot || {},
      adInterval: ads.adInterval || 4
    };
    window.__ADS_ENABLED = true;
  }

  const wechat = config.wechat || {};
  if (wechat.enabled && typeof WECHAT_CONFIG !== 'undefined') {
    WECHAT_CONFIG.enabled = true;
    WECHAT_CONFIG.officialAccount = wechat.name || WECHAT_CONFIG.officialAccount;
    WECHAT_CONFIG.qrCode = wechat.qr || WECHAT_CONFIG.qrCode;
    if (typeof window.initWechat === 'function') window.initWechat();
  }

  // Analytics
  const analytics = config.analytics || {};
  if (analytics.enabled && analytics.measurementId && analytics.measurementId !== 'G-XXXXXXXXXX') {
    // gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', analytics.measurementId);

    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.measurementId}`;
    document.head.appendChild(gaScript);
  }

  // Update page metadata
  const site = config.site || {};
  if (site.title) document.title = site.title;
  if (site.description) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', site.description);
  }
  if (site.keywords) {
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', site.keywords);
  }
}

// ===== Particles =====
function initParticles() {
  if (typeof particlesJS === 'undefined') return;
  const isMobile = window.innerWidth < 768;
  particlesJS('particles', {
    particles: {
      number: { value: isMobile ? 25 : 50, density: { enable: true, value_area: isMobile ? 1200 : 800 } },
      color: { value: '#6366f1' },
      shape: { type: 'circle' },
      opacity: { value: 0.2, random: false, anim: { enable: false } },
      size: { value: 2, random: false },
      line_linked: { enable: true, distance: 150, color: '#06b6d4', opacity: 0.1, width: 1 },
      move: { enable: true, speed: 0.8, direction: 'none', random: false, straight: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: false }, onclick: { enable: false } }
    },
    retina_detect: true
  });
}

// ===== Render Scenes =====
function renderScenes() {
  const container = document.getElementById('sceneTags');
  container.innerHTML = SCENES.map(scene =>
    `<div class="scene-tag" data-scene="${scene.id}" onclick="filterByScene('${scene.id}', this)">${scene.label}</div>`
  ).join('');
}

// ===== Render Tools =====
function renderTools(tools) {
  const grid = document.getElementById('toolsGrid');
  currentTools = tools;

  if (!tools || tools.length === 0) {
    grid.innerHTML = `<div class="empty-state"><h3>😕 未找到匹配工具</h3><p>试试其他关键词或分类</p></div>`;
    return;
  }

  grid.innerHTML = '';

  tools.forEach((tool, index) => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.dataset.tool = tool.id;
    card.dataset.tags = tool.tags.join(',');
    card.style.animationDelay = `${(index % 12) * 0.04}s`;

    card.innerHTML = `
      <div class="tool-header">
        <div class="tool-icon">${tool.icon}</div>
        <div class="tool-name">${escapeHtml(tool.name)}</div>
      </div>
      <div class="tool-desc">${escapeHtml(tool.desc)}</div>
      <div class="tool-tags">
        ${tool.tags.map(t => `<span class="tag" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</span>`).join('')}
      </div>
      <div class="tool-footer">
        <span class="tool-link" onclick="handleToolClick(event, '${tool.id}', '${escapeHtml(tool.url)}')">立即使用 →</span>
        ${tool.relations?.length
          ? `<span class="tool-relation" onclick="event.stopPropagation();showRelations('${tool.id}')">🔗 关联</span>`
          : ''}
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (!e.target.closest('a') && !e.target.closest('.tool-relation') && !e.target.closest('.tag') && !e.target.closest('.tool-link')) {
        handleToolClick(e, tool.id, tool.url);
      }
    });

    grid.appendChild(card);
  });
}

// ===== Ad unit creator (called after render if needed) =====
function pushAdUnits() {
  if (!window.__ADS_ENABLED) return;
  try {
    if (window.adsbygoogle) {
      document.querySelectorAll('.adsbygoogle').forEach(() => {
        (adsbygoogle = window.adsbygoogle || []).push({});
      });
    }
  } catch (e) {
    if (location.hostname === 'localhost') console.warn('[Ads] push error:', e);
  }
}

// ===== Filter by Scene =====
function filterByScene(sceneId, el) {
  document.querySelectorAll('.scene-tag').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');

  const scene = SCENES.find(s => s.id === sceneId);
  if (!scene) return;

  const filtered = TOOLS_DATA.filter(t => scene.tools.includes(t.id));
  renderTools(filtered);
  document.getElementById('toolsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Category Filter =====
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const cat = this.dataset.cat;
    const filtered = cat === 'all' ? TOOLS_DATA : TOOLS_DATA.filter(t => t.category === cat);
    renderTools(filtered);
  });
});

// ===== Search =====
const searchInput = document.getElementById('searchInput');
const searchHints = document.getElementById('searchHints');

searchInput.addEventListener('input', function () {
  clearTimeout(searchTimeout);
  const keyword = this.value.toLowerCase().trim();

  if (keyword.length < 1) {
    searchHints.classList.remove('show');
    return;
  }

  searchTimeout = setTimeout(() => {
    const matches = TOOLS_DATA.filter(t =>
      t.name.toLowerCase().includes(keyword) ||
      t.desc.toLowerCase().includes(keyword) ||
      t.tags.some(tag => tag.toLowerCase().includes(keyword))
    ).slice(0, 6);

    if (matches.length > 0) {
      searchHints.innerHTML = matches.map(m =>
        `<div onclick="selectSearchResult('${m.id}')" role="option">
          ${m.name}
          <small style="color:var(--text-dim)">${m.desc.slice(0, 28)}...</small>
        </div>`
      ).join('');
      searchHints.classList.add('show');
    } else {
      searchHints.innerHTML = '<div style="color:var(--text-dim);cursor:default">未找到匹配工具</div>';
      searchHints.classList.add('show');
    }
  }, 200);
});

// Search submit on Enter
searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const keyword = this.value.toLowerCase().trim();
    if (keyword.length < 1) return;

    const filtered = TOOLS_DATA.filter(t =>
      t.name.toLowerCase().includes(keyword) ||
      t.desc.toLowerCase().includes(keyword) ||
      t.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
    renderTools(filtered);
    searchHints.classList.remove('show');
  }
});

window.selectSearchResult = function (toolId) {
  const tool = TOOLS_DATA.find(t => t.id === toolId);
  if (tool) {
    window.open(tool.url, '_blank');
    trackClick(toolId, 'search');
  }
  searchHints.classList.remove('show');
  searchInput.value = '';
};

// ===== Role Filter =====
document.getElementById('roleSelect').addEventListener('change', function () {
  const role = this.value;
  const filtered = role === 'all'
    ? TOOLS_DATA
    : TOOLS_DATA.filter(t => t.roles?.includes(role));
  renderTools(filtered);
});

// ===== Relations =====
window.showRelations = function (toolId) {
  const tool = TOOLS_DATA.find(t => t.id === toolId);
  if (!tool?.relations?.length) return;

  const panel = document.getElementById('relationsPanel');
  const chain = document.getElementById('relationChain');

  chain.innerHTML = tool.relations.map(rel => {
    const relTool = TOOLS_DATA.find(t => t.id === rel.id);
    const name = relTool ? relTool.name : rel.id;
    const url = relTool?.url || '#';
    return `
      <div class="relation-item">
        <div style="font-weight:600;margin-bottom:0.25rem">${escapeHtml(name)}</div>
        <div style="font-size:0.85rem;color:var(--text-dim)">${escapeHtml(rel.reason)}</div>
        <div style="margin-top:0.5rem">
          <a href="${url}" target="_blank" rel="noopener" style="font-size:0.9rem">查看 →</a>
        </div>
      </div>
    `;
  }).join('');

  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Auto-hide after 8s
  if (window._relationsTimer) clearTimeout(window._relationsTimer);
  window._relationsTimer = setTimeout(() => {
    closeRelations();
  }, 8000);
};

window.closeRelations = function () {
  const panel = document.getElementById('relationsPanel');
  if (panel) panel.hidden = true;
  if (window._relationsTimer) clearTimeout(window._relationsTimer);
};

// ===== Tag Click Filter =====
document.addEventListener('click', function (e) {
  const tagEl = e.target.closest('[data-tag]');
  if (tagEl) {
    const tag = tagEl.dataset.tag;
    const filtered = TOOLS_DATA.filter(t => t.tags.includes(tag));
    renderTools(filtered);
  }
});

// ===== Reset All =====
window.resetAll = function () {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.cat-btn[data-cat="all"]')?.classList.add('active');
  document.querySelectorAll('.scene-tag').forEach(t => t.classList.remove('active'));
  document.getElementById('roleSelect').value = 'all';
  searchInput.value = '';
  searchHints.classList.remove('show');
  renderTools(TOOLS_DATA);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ===== Scroll to Top Button =====
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
}

// ===== Ads =====
function getAdConfig() {
  if (window.__AD_CONFIG) return window.__AD_CONFIG;
  try {
    const raw = document.querySelector('script[data-ad-config]');
    if (raw) return JSON.parse(raw.dataset.adConfig);
  } catch {}
  return null;
}

function initAds() {
  const adConfig = getAdConfig();
  const enabled = adConfig?.enabled && window.__ADS_ENABLED;

  window.__ADS_ENABLED = enabled;

  // Populate ad slots with AdSense units
  const inContent = document.getElementById('adInContent');
  const banner = document.getElementById('adBanner');

  if (enabled && adConfig) {
    [inContent, banner].forEach((el, i) => {
      if (!el) return;
      el.style.display = 'flex';
      el.innerHTML = '';

      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.cssText = 'display:block;text-align:center;min-height:90px;';
      ins.dataset.adClient = adConfig.adsensePublisherId;
      ins.dataset.adSlot = i === 0
        ? (adConfig.adsenseSlot?.inContent || '')
        : (adConfig.adsenseSlot?.banner || '');
      ins.dataset.adFormat = 'auto';
      ins.dataset.fullWidthResponsive = 'true';
      el.appendChild(ins);
    });

    // Push ad units after a delay for script to load
    setTimeout(pushAdUnits, 1000);
  } else {
    [inContent, banner].forEach(el => {
      if (el) el.style.display = 'none';
    });
  }
}

// ===== Tracking =====
function trackClick(toolId, source) {
  // Console log in dev
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log(`[track] tool:${toolId} source:${source}`);
  }
  // GA4 gtag
  if (typeof gtag === 'function') {
    gtag('event', 'tool_click', { tool_id: toolId, source });
  }
}

// ===== Escape HTML =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Tool Click Guard =====
window.handleToolClick = function (e, toolId, toolUrl) {
  e.preventDefault();
  e.stopPropagation();
  const tool = TOOLS_DATA.find(t => t.id === toolId);
  if (!tool?.login || currentUser) {
    window.open(toolUrl, '_blank');
    trackClick(toolId, 'card');
  } else {
    openAuthModal('login');
  }
};

// ===== Submit Tool Modal =====
document.getElementById('submitToolBtn')?.addEventListener('click', function (e) {
  e.preventDefault();
  document.getElementById('submitModal').hidden = false;
  document.body.style.overflow = 'hidden';
});

window.closeSubmitModal = function () {
  document.getElementById('submitModal').hidden = true;
  document.body.style.overflow = '';
};

// Close on overlay click
document.getElementById('submitModal')?.addEventListener('click', function (e) {
  if (e.target === this) closeSubmitModal();
});

// Close on Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeSubmitModal();
});

window.handleSubmit = function (e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.toolName.value.trim(),
    desc: form.toolDesc.value.trim(),
    url: form.toolUrl.value.trim(),
    category: form.toolCategory.value,
    tags: form.toolTags.value.trim()
  };
  if (!data.name || !data.desc || !data.url) return;

  // Build mailto link for manual review
  const subject = encodeURIComponent(`提交工具：${data.name}`);
  const body = encodeURIComponent(
    `工具名称：${data.name}\n简介：${data.desc}\n链接：${data.url}\n分类：${data.category}\n标签：${data.tags}`
  );
  window.open(`mailto:hi@aihub.pro?subject=${subject}&body=${body}`, '_blank');

  form.reset();
  closeSubmitModal();
  showTip('✅ 已收到，我会尽快审核添加！');
};

// ===== Bind Global Events =====
function bindEvents() {
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-box')) {
      searchHints.classList.remove('show');
    }
  });
}

// ===== Background Music =====
let musicStarted = false;
window.toggleMusic = function () {
  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicToggle');
  if (!audio) return;
  if (audio.paused) {
    audio.play().then(() => {
      btn.textContent = '🔊';
      btn.classList.add('playing');
      localStorage.setItem('bgMusic', 'playing');
    }).catch(() => {});
  } else {
    audio.pause();
    btn.textContent = '🎵';
    btn.classList.remove('playing');
    localStorage.setItem('bgMusic', 'paused');
  }
};

document.addEventListener('click', function startMusic() {
  if (musicStarted) return;
  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicToggle');
  if (!audio) return;
  const state = localStorage.getItem('bgMusic');
  if (state === 'playing') {
    audio.play().then(() => {
      if (btn) { btn.textContent = '🔊'; btn.classList.add('playing'); }
    }).catch(() => {});
  }
  musicStarted = true;
  document.removeEventListener('click', startMusic);
}, { once: true });
