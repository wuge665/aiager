const SB_URL = typeof AUTH_CONFIG !== 'undefined' ? AUTH_CONFIG.supabaseUrl : '';
const SB_KEY = typeof AUTH_CONFIG !== 'undefined' ? AUTH_CONFIG.supabaseAnonKey : '';
const SB_READY = SB_URL && SB_KEY;

async function sbFetch(path, body) {
  const r = await fetch(SB_URL + '/auth/v1/' + path, {
    headers: {
      'apikey': SB_KEY,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined,
    method: body ? 'POST' : 'GET'
  });
  const text = await r.text();
  if (!r.ok && !text.startsWith('{')) throw new Error('网络错误 ' + r.status);
  try { return JSON.parse(text); } catch (e) { throw new Error('服务器响应异常'); }
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
      }
    } catch(e) {}
  }
  updateAuthUI();
}

async function signUp(email, password) {
  if (!SB_READY) throw new Error('认证系统未配置');
  const data = await sbFetch('signup', { email, password });
  if (data.error || data.error_code || data.code) {
    const msg = (data.error_description || data.msg || data.error || data.message || '').toLowerCase();
    if (msg.includes('rate_limit') || msg.includes('rate limit') || msg.includes('email rate') || msg.includes('over_email')) throw new Error('注册太频繁，请等待一小时后重试');
    if (msg.includes('already') || msg.includes('exist')) throw new Error('该邮箱已注册，请直接登录');
    throw new Error('注册失败：' + (msg || '请检查邮箱格式或稍后再试'));
  }
  if (data.access_token && data.user) {
    localStorage.setItem('sb_token', data.access_token);
    currentUser = data.user;
    updateAuthUI();
    closeAuthModal();
  } else if (data.user && data.user.id) {
    closeAuthModal();
    showTip('✅ 注册成功！请查看邮箱完成验证。');
  } else {
    throw new Error('注册失败：服务器异常，请稍后再试');
  }
  return data;
}

async function signIn(email, password) {
  if (!SB_READY) throw new Error('认证系统未配置');
  const data = await sbFetch('token?grant_type=password', { email, password });
  if (data.error || data.error_code || data.code) throw new Error('未注册，请先注册');
  if (!data.access_token || !data.user) throw new Error('未注册，请先注册');
  localStorage.setItem('sb_token', data.access_token);
  currentUser = data.user;
  updateAuthUI();
  closeAuthModal();
  return data;
}

async function resetPassword() {
  const email = prompt('输入注册时使用的邮箱，重置链接将发送到该邮箱：');
  if (!email) return;
  try {
    await sbFetch('recover', { email });
    showTip('✅ 重置链接已发送，请查看邮箱');
  } catch (e) {
    showTip('❌ 发送失败，请稍后再试');
  }
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
  if (type === 'signup') {
    const confirm = form.querySelector('#signupConfirm');
    if (confirm && password !== confirm.value) {
      msg.innerHTML = '两次密码输入不一致';
      msg.style.display = 'block'; return;
    }
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
