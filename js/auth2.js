let currentUser = null;

async function hashPassword(password) {
  const buf = new TextEncoder().encode(password + 'aiager2024');
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem('aiager_users') || '{}'); } catch { return {}; }
}

function saveUsers(users) {
  localStorage.setItem('aiager_users', JSON.stringify(users));
}

function initAuth() {
  const saved = localStorage.getItem('aiager_user');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
      updateAuthUI();
    } catch { localStorage.removeItem('aiager_user'); }
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
  document.querySelectorAll('.auth-msg').forEach(m => m.style.display = 'none');
}

async function handleAuthSubmit(e, type) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value.trim();
  const btn = form.querySelector('button[type="submit"]');
  const msg = form.querySelector('.auth-msg');
  msg.style.display = 'none';

  if (!email || password.length < 4) {
    msg.innerHTML = '邮箱必填，密码至少4位';
    msg.style.display = 'block'; return;
  }

  if (type === 'signup') {
    const confirm = form.querySelector('#signupConfirm');
    if (confirm && password !== confirm.value) {
      msg.innerHTML = '两次密码不一致';
      msg.style.display = 'block'; return;
    }
  }

  btn.disabled = true;
  btn.textContent = type === 'login' ? '登录中...' : '注册中...';

  try {
    const users = getUsers();
    if (type === 'login') {
      const hash = await hashPassword(password);
      if (!users[email] || users[email] !== hash) {
        throw new Error('邮箱或密码错误，请重新输入');
      }
      currentUser = { email };
      localStorage.setItem('aiager_user', JSON.stringify(currentUser));
      updateAuthUI();
      closeAuthModal();
      showTip('✅ 登录成功');
    } else {
      if (users[email]) {
        throw new Error('该邮箱已注册，请直接登录');
      }
      users[email] = await hashPassword(password);
      saveUsers(users);
      currentUser = { email };
      localStorage.setItem('aiager_user', JSON.stringify(currentUser));
      updateAuthUI();
      closeAuthModal();
      showTip('✅ 注册成功');
    }
  } catch (err) {
    msg.innerHTML = err.message;
    msg.style.display = 'block';
  }

  btn.disabled = false;
  btn.textContent = type === 'login' ? '登录' : '注册';
}

function resetPassword() {
  const email = prompt('输入注册时使用的邮箱，密码将重置为：123456');
  if (!email) return;
  const users = getUsers();
  if (!users[email.trim().toLowerCase()]) {
    showTip('❌ 该邮箱未注册');
    return;
  }
  (async () => {
    users[email.trim().toLowerCase()] = await hashPassword('123456');
    saveUsers(users);
    showTip('✅ 密码已重置为 123456，请登录后修改');
  })();
}

async function signOut() {
  localStorage.removeItem('aiager_user');
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

document.addEventListener('DOMContentLoaded', initAuth);
document.getElementById('authModal')?.addEventListener('click', function (e) {
  if (e.target === this) closeAuthModal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeAuthModal();
});
