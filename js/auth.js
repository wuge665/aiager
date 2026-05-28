const SB_URL = typeof AUTH_CONFIG !== 'undefined' ? AUTH_CONFIG.supabaseUrl : '';
const SB_KEY = typeof AUTH_CONFIG !== 'undefined' ? AUTH_CONFIG.supabaseAnonKey : '';
const SB_READY = SB_URL && SB_KEY;

function sbFetch(path, body) {
  return fetch(SB_URL + '/auth/v1/' + path, {
    headers: {
      'apikey': SB_KEY,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined,
    method: body ? 'POST' : 'GET'
  }).then(r => r.json());
}

let currentUser = null;

async function initAuth() {
  const token = localStorage.getItem('sb_token');
  if (token && SB_READY) {
    try {
      const data = await fetch(SB_URL + '/auth/v1/user', {
        headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + token }
      }).then(r => r.json());
      if (data && data.id) {
        currentUser = data;
        document.body.classList.remove('auth-required');
      }
    } catch(e) {}
  }
  updateAuthUI();
}

async function signUp(email, password) {
  if (!SB_READY) throw new Error('认证系统未配置');
  const data = await sbFetch('signup', { email, password });
  if (data.error) throw new Error(data.error_description || data.msg || '注册失败');
  if (data.access_token) {
    localStorage.setItem('sb_token', data.access_token);
    currentUser = data.user;
    updateAuthUI();
    closeAuthModal();
  }
  return data;
}

async function signIn(email, password) {
  if (!SB_READY) throw new Error('认证系统未配置');
  const data = await sbFetch('token?grant_type=password', { email, password });
  if (data.error) throw new Error(data.error_description || data.msg || '登录失败');
  localStorage.setItem('sb_token', data.access_token);
  currentUser = data.user;
  updateAuthUI();
  closeAuthModal();
  return data;
}

async function signOut() {
  localStorage.removeItem('sb_token');
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
    userName.textContent = currentUser.email || '用户';
  } else {
    loginBtn.style.display = 'flex';
    userMenu.style.display = 'none';
  }
}

function openAuthModal(tab) {
  document.getElementById('authModal').hidden = false;
  document.body.style.overflow = 'hidden';
  switchAuthTab(tab || 'login');
}

function closeAuthModal() {
  document.getElementById('authModal').hidden = true;
  document.body.style.overflow = '';
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.style.display = 'none');
  document.querySelector('.auth-tab[data-tab="' + tab + '"]').classList.add('active');
  document.getElementById('form-' + tab).style.display = 'block';
}

async function handleAuthSubmit(e, type) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value.trim();
  const btn = form.querySelector('button[type="submit"]');
  const msg = form.querySelector('.auth-msg');
  if (!email || password.length < 6) {
    msg.innerHTML = '邮箱必填，密码至少6位';
    msg.style.display = 'block'; return;
  }
  btn.disabled = true;
  btn.textContent = type === 'login' ? '登录中...' : '注册中...';
  msg.style.display = 'none';
  try {
    if (type === 'login') {
      await signIn(email, password);
      showTip('✅ 登录成功');
    } else {
      await signUp(email, password);
      showTip('✅ 注册成功');
    }
  } catch (err) {
    msg.innerHTML = err.message;
    msg.style.display = 'block';
  }
  btn.disabled = false;
  btn.textContent = type === 'login' ? '登录' : '注册';
}

document.addEventListener('DOMContentLoaded', initAuth);
document.getElementById('authModal')?.addEventListener('click', function (e) {
  if (e.target === this) closeAuthModal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeAuthModal();
});
