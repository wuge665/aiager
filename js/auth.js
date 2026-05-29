let clerk = null;
let currentUser = null;
let clerkPromise = null;

async function initAuth() {
  if (!AUTH_CONFIG?.clerkPublishableKey) return;
  try { await loadClerkSDK(); } catch (e) { return; }

  clerk = new Clerk(AUTH_CONFIG.clerkPublishableKey);
  try {
    await clerk.load();
    currentUser = clerk.user;
  } catch (e) {
    clerk = null;
    return;
  }

  clerk.addListener(({ user }) => {
    currentUser = user;
    updateAuthUI();
  });
  updateAuthUI();
}

function loadClerkSDK() {
  return new Promise((resolve, reject) => {
    if (typeof Clerk !== 'undefined') { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js';
    s.crossOrigin = 'anonymous';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Clerk SDK load failed'));
    document.head.appendChild(s);
  });
}

async function openAuthModal(tab) {
  if (!clerk) {
    if (!clerkPromise) clerkPromise = initAuth().catch(() => {});
    await clerkPromise;
    if (!clerk) { showTip('❌ 认证服务加载失败，请刷新重试'); return; }
  }
  if (tab === 'signup') { clerk.openSignUp(); }
  else { clerk.openSignIn(); }
}

function closeAuthModal() {}

async function signOut() {
  if (!clerk) return;
  try { await clerk.signOut(); } catch (e) {}
  currentUser = null;
  updateAuthUI();
  showTip('已退出登录');
}

function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');
  if (!loginBtn || !userMenu) return;
  if (currentUser) {
    loginBtn.style.display = 'none';
    userMenu.style.display = 'flex';
    userName.textContent = currentUser.primaryEmailAddress?.emailAddress || currentUser.username || '用户';
  } else {
    loginBtn.style.display = 'flex';
    userMenu.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', initAuth);
