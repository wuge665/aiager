// ===== WeChat Official Account Config =====
const WECHAT_CONFIG = {
  officialAccount: 'AI 百宝箱',
  qrCode: 'assets/images/wechat-qr.png',
  enabled: false,
  toolKeywords: {}
};

// Auto-generate keywords from tool data (if available)
if (typeof TOOLS_DATA !== 'undefined') {
  TOOLS_DATA.forEach(t => {
    WECHAT_CONFIG.toolKeywords[t.id] = t.name;
  });
}

function initWechat() {
  const float = document.getElementById('wechatFloat');
  if (!float) return;
  if (WECHAT_CONFIG.enabled) {
    float.style.display = 'flex';
  }
  float.addEventListener('click', function (e) {
    if (e.target.closest('.wechat-qrcode')) return;
    const keyword = 'AI工具';
    navigator.clipboard.writeText(keyword).then(() => {
      showTip('✅ 已复制【' + keyword + '】，去公众号回复获取教程');
    }).catch(() => {
      showTip('请回复【' + keyword + '】获取教程');
    });
  });
  // Check URL params for WeChat source
  const params = new URLSearchParams(window.location.search);
  const fromWechat = params.get('from');
  if (fromWechat) {
    highlightWechatTools(fromWechat);
  }
}

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

function showTip(msg) {
  const tip = document.createElement('div');
  tip.className = 'toast';
  tip.textContent = msg;
  document.body.appendChild(tip);
  setTimeout(() => { if (tip.parentNode) tip.remove(); }, 3000);
}

// Init on load
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initWechat();
} else {
  document.addEventListener('DOMContentLoaded', initWechat);
}
