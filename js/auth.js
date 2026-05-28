const SUPABASE_URL = typeof AUTH_CONFIG !== 'undefined' ? AUTH_CONFIG.supabaseUrl : '';
const SUPABASE_ANON_KEY = typeof AUTH_CONFIG !== 'undefined' ? AUTH_CONFIG.supabaseAnonKey : '';
const SUPABASE_READY = SUPABASE_URL && SUPABASE_ANON_KEY;

if (!SUPABASE_READY) {
  console.warn('[Auth] Supabase 未配置，参考 js/auth-config.example.js 设置');
}

let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined' && SUPABASE_READY) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch(e) {
  console.warn('[Auth] Supabase init failed:', e.message);
}

let currentUser = null;

async function initAuth() {
  if (!supabaseClient) {
    document.getElementById('authGuard')?.remove();
    return;
  }
  const { data: { session } } = await supabaseClient.auth.getSession();
  currentUser = session?.user || null;
  updateAuthUI();
}

async function signUp(email, password) {
  if (!supabaseClient) throw new Error('认证系统未配置');
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

async function signIn(email, password) {
  if (!supabaseClient) throw new Error('认证系统未配置');
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  currentUser = data.user;
  updateAuthUI();
  closeAuthModal();
  return data;
}

async function signOut() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  currentUser = null;
  updateAuthUI();
  showTip('已退出登录');
}

function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');
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
  document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`form-${tab}`).style.display = 'block';
}

async function handleAuthSubmit(e, type) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value.trim();
  const btn = form.querySelector('button[type="submit"]');
  const msg = form.querySelector('.auth-msg');

  if (!email || password.length < 6) {
    msg.textContent = '邮箱必填，密码至少6位';
    msg.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = type === 'login' ? '登录中...' : '注册中...';
  msg.style.display = 'none';

  try {
    if (type === 'login') {
      await signIn(email, password);
      showTip('✅ 登录成功');
    } else {
      const data = await signUp(email, password);
      if (data?.user?.identities?.length === 0) {
        showTip('该邮箱已注册，请直接登录');
      } else {
        showTip('✅ 注册成功！已自动登录');
      }
      document.body.classList.remove('auth-required');
      closeAuthModal();
    }
  } catch (err) {
    msg.textContent = type === 'login' ? '登录失败：' + err.message : '注册失败：' + err.message;
    msg.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = type === 'login' ? '登录' : '注册';
  }
}

document.addEventListener('DOMContentLoaded', initAuth);

document.getElementById('authModal')?.addEventListener('click', function (e) {
  if (e.target === this) closeAuthModal();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeAuthModal();
});
