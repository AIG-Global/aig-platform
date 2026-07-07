// ============================================================
// public/app.js — Admin & Monitoring Dashboard
// Vanilla JS, no build step, talks to the same-origin admin API.
// ============================================================

(function () {
  const root = document.getElementById('app');
  const state = { admin: null, page: 'overview', cache: {}, sidebarOpen: false };

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function fmtNum(n) { return Number(n || 0).toLocaleString('en-US'); }
  function fmtPct(n) { return Number(n || 0).toFixed(1) + '%'; }
  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    return Math.floor(hrs / 24) + 'd ago';
  }

  async function api(path, opts = {}) {
    const res = await fetch(path, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      credentials: 'include',
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Request failed');
    return body;
  }

  function toast(message, isError = false) {
    let stack = document.querySelector('.toast-stack');
    if (!stack) { stack = el('<div class="toast-stack"></div>'); document.body.appendChild(stack); }
    const t = el(`<div class="toast ${isError ? 'error' : ''}">${message}</div>`);
    stack.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }

  // ================= LOGIN =================
  function renderLogin() {
    root.innerHTML = '';
    root.appendChild(el(`
      <div class="login-screen">
        <div class="login-card">
          <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:24px;">
            <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(145deg,#D98E3B,#C9A227);
              display:flex;align-items:center;justify-content:center;font-family:Cambria,serif;font-weight:700;font-size:24px;color:#0F1830;margin-bottom:10px;">1</div>
            <div style="font-family:Cambria,serif;font-size:19px;font-weight:700;">ONE — Admin & Monitoring</div>
            <div style="font-size:11px;color:#7984A0;margin-top:2px;">Internal use only</div>
          </div>
          <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#7984A0;font-weight:700;">Username</label>
          <input id="login-user" type="text" style="width:100%;margin-top:6px;margin-bottom:14px;" value="admin" />
          <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#7984A0;font-weight:700;">Password</label>
          <input id="login-pass" type="password" style="width:100%;margin-top:6px;margin-bottom:18px;" />
          <button class="btn primary" id="login-btn" style="width:100%;padding:11px;">Sign in</button>
          <div id="login-error" style="color:#E8967B;font-size:12px;margin-top:12px;min-height:16px;"></div>
        </div>
      </div>
    `));
    const passInput = document.getElementById('login-pass');
    passInput.focus();
    const doLogin = async () => {
      const username = document.getElementById('login-user').value.trim();
      const password = passInput.value;
      const errEl = document.getElementById('login-error');
      try {
        const result = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) });
        state.admin = result.admin;
        renderShell();
      } catch (e) {
        errEl.textContent = e.message;
      }
    };
    document.getElementById('login-btn').addEventListener('click', doLogin);
    passInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
  }

  // ================= SHELL =================
  const NAV = [
    { group: 'Monitoring', items: [
      { id: 'overview', label: 'Overview' },
      { id: 'usage', label: 'Daily Usage' },
      { id: 'sharers', label: 'Top Sharers' },
      { id: 'users-top', label: 'Biggest Users' },
      { id: 'topics', label: 'Topics & Fields of Use' },
      { id: 'segmentation', label: 'Free vs Paid' },
    ]},
    { group: 'Management', items: [
      { id: 'users', label: 'All Users' },
      { id: 'actions', label: 'Admin Action Log' },
    ]},
    { group: 'Integration', items: [
      { id: 'api-keys', label: 'API Keys' },
      { id: 'payments', label: 'Payments (NOWPayments)' },
    ]},
  ];

  function renderShell() {
    root.innerHTML = '';
    const app = el('<div id="app-inner" style="display:flex;height:100vh;width:100vw;overflow:hidden;"></div>');
    app.appendChild(renderSidebar());

    const mainWrap = el('<div class="main"></div>');
    const toggle = el('<button class="mobile-nav-toggle">☰ Menu</button>');
    toggle.addEventListener('click', () => { state.sidebarOpen = !state.sidebarOpen; renderShell(); });
    mainWrap.appendChild(toggle);

    const main = el('<div id="main-content"></div>');
    mainWrap.appendChild(main);
    app.appendChild(mainWrap);

    // Tapping the page content (outside the sidebar) while the
    // mobile sidebar is open should close it, same as most apps.
    if (state.sidebarOpen) {
      const backdrop = el('<div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:35;"></div>');
      backdrop.addEventListener('click', () => { state.sidebarOpen = false; renderShell(); });
      app.appendChild(backdrop);
    }

    root.appendChild(app);
    renderPage();
  }

  function renderSidebar() {
    const sidebar = el(`<div class="sidebar ${state.sidebarOpen ? 'open' : ''}"></div>`);
    sidebar.appendChild(el(`
      <div class="brand">
        <div class="brand-mark">1</div>
        <div>
          <div class="brand-name">ONE</div>
          <div class="brand-sub">ADMIN & MONITORING</div>
        </div>
      </div>
    `));
    NAV.forEach(group => {
      sidebar.appendChild(el(`<div class="nav-group-label">${group.group}</div>`));
      const navWrap = el('<div class="nav"></div>');
      group.items.forEach(item => {
        const btn = el(`<button class="nav-item ${state.page === item.id ? 'active' : ''}" data-page="${item.id}">${item.label}</button>`);
        btn.addEventListener('click', () => { state.page = item.id; state.sidebarOpen = false; renderShell(); });
        navWrap.appendChild(btn);
      });
      sidebar.appendChild(navWrap);
    });
    sidebar.appendChild(el(`
      <div class="sidebar-footer">
        <div style="font-size:12px;color:var(--text-mid);margin-bottom:8px;">Signed in as <strong style="color:var(--text-hi)">${state.admin?.username || 'admin'}</strong></div>
        <button class="btn small" id="logout-btn" style="width:100%;">Log out</button>
      </div>
    `));
    sidebar.querySelector('#logout-btn').addEventListener('click', async () => {
      await api('/api/admin/logout', { method: 'POST' }).catch(() => {});
      state.admin = null;
      renderLogin();
    });
    return sidebar;
  }

  async function renderPage() {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="empty-note">Loading…</div>';
    const renderers = {
      overview: PageOverview,
      usage: PageUsage,
      sharers: PageSharers,
      'users-top': PageTopUsers,
      topics: PageTopics,
      segmentation: PageSegmentation,
      users: PageUsers,
      actions: PageActions,
      'api-keys': PageApiKeys,
      payments: PagePayments,
    };
    const fn = renderers[state.page] || PageOverview;
    try {
      await fn(main);
    } catch (e) {
      main.innerHTML = `<div class="empty-note">Failed to load: ${e.message}</div>`;
    }
  }

  function pageHeader(title, sub) {
    return `<div class="page-header"><div><div class="page-title">${title}</div><div class="page-sub">${sub}</div></div></div>`;
  }

  function colorForIndex(i) {
    const palette = ['var(--amber)', 'var(--gold)', 'var(--good)', 'var(--purple)', '#5B9BD5', '#D9A23B', '#C5572E', '#3E7C7C'];
    return palette[i % palette.length];
  }

  window.ONE_ADMIN = { api, el, fmtNum, fmtPct, timeAgo, toast, state, colorForIndex, renderShell, pageHeader };

  // ---------------- boot ----------------
  async function boot() {
    try {
      const result = await api('/api/admin/me');
      state.admin = result.admin;
      renderShell();
    } catch (e) {
      renderLogin();
    }
  }
  window.ONE_ADMIN_BOOT = boot;
})();
