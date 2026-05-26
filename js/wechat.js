// ===== WeChat Official Account Config =====
const WECHAT_CONFIG = {
  officialAccount: '您的公众号名称',
  qrCode: 'assets/images/wechat-qr.png',
  enabled: false,
  toolKeywords: {}
};

// Auto-generate keywords from tool data
TOOLS_DATA.forEach(t => {
  WECHAT_CONFIG.toolKeywords[t.id] = t.name;
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  const float = document.getElementById('wechatFloat');

  // If not enabled via config, hide. Config may load asynchronously.
  if (!WECHAT_CONFIG.enabled) {
    float.style.display = 'none';
  }

  // Expose a re-init function for when config loads
  window.initWechat = function () {
    if (WECHAT_CONFIG.enabled) {
      float.style.display = 'flex';
    }
  };

  float.addEventListener('click', function (e) {
    if (e.target.closest('.wechat-qrcode')) return;

    const currentTool = getCurrentToolFromPage();
    const keyword = currentTool && WECHAT_CONFIG.toolKeywords[currentTool]
      ? WECHAT_CONFIG.toolKeywords[currentTool]
      : 'AI工具';

    navigator.clipboard.writeText(keyword).then(() => {
      showTip(`✅ 已复制【${keyword}】，去公众号回复获取教程`);
    }).catch(() => {
      showTip(`请回复【${keyword}】获取教程`);
    });
  });

  // Check URL params for WeChat source
  const params = new URLSearchParams(window.location.search);
  const fromWechat = params.get('from');
  if (fromWechat) {
    highlightWechatTools(fromWechat);
  }
});

// ===== Get Current Tool from Hash =====
function getCurrentToolFromPage() {
  return window.location.hash.replace('#', '') || null;
}

// ===== Highlight WeChat Recommended Tools =====
function highlightWechatTools(source) {
  document.querySelectorAll('.tool-card').forEach(card => {
    if (card.dataset.tool === source) {
      card.style.borderColor = '#ec4899';
      card.style.boxShadow = '0 0 25px rgba(236,72,153,0.5)';
      const badge = document.createElement('span');
      badge.className = 'badge-wechat';
      badge.textContent = '🔥 公众号推荐';
      card.appendChild(badge);
    }
  });
}

// ===== Toast Notification =====
function showTip(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const tip = document.createElement('div');
  tip.className = 'toast';
  tip.textContent = msg;
  document.body.appendChild(tip);

  setTimeout(() => {
    if (tip.parentNode) tip.remove();
  }, 3000);
}
