let clerk = null;
let currentUser = null;

async function initAuth() {
  if (!AUTH_CONFIG?.clerkPublishableKey) return;
  if (typeof Clerk === 'undefined') return;

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

function openAuthModal(tab) {
  if (!clerk) { showTip('⏳ 认证服务加载中，请稍后再试'); return; }
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
