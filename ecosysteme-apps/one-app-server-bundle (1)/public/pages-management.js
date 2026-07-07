// ============================================================
// public/pages-management.js — All Users (with the no-bonus
// upgrade override action), Admin Action Log, API Keys.
// ============================================================

(function () {
  const { api, el, fmtNum, timeAgo, toast, pageHeader } = window.ONE_ADMIN;

  // ---------------- All Users ----------------
  window.PageUsers = async function (main) {
    main.innerHTML = '';
    main.appendChild(el(pageHeader('All Users', 'Search, filter, and manage tier upgrades outside the normal purchase flow.')));

    const controls = el(`
      <div style="display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap;">
        <input type="text" id="user-search" placeholder="Search name, email, or member code…" style="flex:1;min-width:220px;" />
        <select id="user-tier-filter">
          <option value="">All tiers</option>
          <option value="free">Free only</option>
          <option value="paid">Paid only</option>
        </select>
      </div>
    `);
    main.appendChild(controls);

    const resultCount = el('<div class="section-title"></div>');
    main.appendChild(resultCount);
    const listHost = el('<div></div>');
    main.appendChild(listHost);

    async function load() {
      const q = document.getElementById('user-search').value.trim();
      const tier = document.getElementById('user-tier-filter').value;
      const params = new URLSearchParams({ limit: '40' });
      if (q) params.set('q', q);
      if (tier) params.set('tier', tier);
      const result = await api(`/api/admin/users?${params.toString()}`);
      resultCount.innerHTML = `Showing ${result.users.length} of ${result.total} users`;
      listHost.innerHTML = '';
      const list = el('<div class="list-card"></div>');
      result.users.forEach(u => {
        const row = el(`
          <div class="list-row">
            <div class="list-main">
              <div class="list-title">${u.name} <span style="color:var(--text-low);font-weight:400;">· ${u.memberCode}</span></div>
              <div class="list-sub">${u.email} · ${u.country} · joined ${timeAgo(u.createdAt)}</div>
            </div>
            <div class="list-aux"><span class="badge ${u.tier === 'paid' ? 'gold' : 'neutral'}">${u.tier}</span>
              ${u.upgradeSource === 'admin_override' ? '<div style="margin-top:4px;"><span class="badge purple">admin override</span></div>' : ''}
            </div>
            <button class="btn small view-user-btn" data-id="${u.id}" style="margin-left:10px;">Manage</button>
          </div>
        `);
        row.querySelector('.view-user-btn').addEventListener('click', () => openUserModal(u.id, load));
        list.appendChild(row);
      });
      listHost.appendChild(list);
      if (!result.users.length) listHost.appendChild(el('<div class="empty-note">No users match.</div>'));
    }

    document.getElementById('user-search').addEventListener('input', debounce(load, 250));
    document.getElementById('user-tier-filter').addEventListener('change', load);
    await load();
  };

  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  async function openUserModal(userId, onChange) {
    const detail = await api(`/api/admin/users/${userId}`);
    const u = detail.user;
    const overlay = el(`<div class="modal-overlay"></div>`);
    const card = el(`
      <div class="modal-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
          <div>
            <div style="font-family:var(--font-head);font-size:18px;font-weight:700;">${u.name}</div>
            <div style="font-size:12px;color:var(--text-low);">${u.email}</div>
          </div>
          <span class="badge ${u.tier === 'paid' ? 'gold' : 'neutral'}">${u.tier}</span>
        </div>

        <div class="kv-row"><span>Member code</span><span style="font-family:var(--font-mono);">${u.memberCode}</span></div>
        <div class="kv-row"><span>Country</span><span>${u.country}</span></div>
        <div class="kv-row"><span>Assistant name</span><span>${u.assistantName}</span></div>
        <div class="kv-row"><span>Joined</span><span>${new Date(u.createdAt).toLocaleDateString()}</span></div>
        <div class="kv-row"><span>Upgrade source</span><span>${u.upgradeSource || '—'}</span></div>

        <div style="margin-top:18px;">
          ${u.tier === 'free' ? `
            <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;">Reason for override (required, audit-logged)</label>
            <input type="text" id="override-reason" placeholder="e.g. Customer support goodwill — ticket #4471" style="width:100%;margin-top:6px;margin-bottom:10px;" />
            <button class="btn gold" id="override-btn" style="width:100%;padding:10px;">Upgrade to paid — no network bonus</button>
            <div style="font-size:10.5px;color:var(--text-low);margin-top:8px;line-height:1.5;">
              This bypasses the normal purchase flow entirely. No sponsor commission or network pool credit is
              generated. The action is written to the permanent admin audit log with your username and this reason.
            </div>
          ` : `
            <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;">Reason for downgrade</label>
            <input type="text" id="downgrade-reason" placeholder="e.g. Reversing accidental override" style="width:100%;margin-top:6px;margin-bottom:10px;" />
            <button class="btn bad" id="downgrade-btn" style="width:100%;padding:10px;">Downgrade to free</button>
          `}
        </div>

        ${detail.adminActions.length ? `
          <div style="margin-top:18px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;margin-bottom:8px;">Admin history</div>
            ${detail.adminActions.map(a => `
              <div style="font-size:11.5px;color:var(--text-mid);padding:6px 0;border-bottom:1px solid var(--hairline);">
                <strong style="color:var(--text-hi);">${a.action}</strong> — ${a.details?.reason || ''} <span style="color:var(--text-low);">(${timeAgo(a.createdAt)})</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <button class="btn" id="modal-close-btn" style="width:100%;margin-top:16px;">Close</button>
      </div>
    `);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    card.querySelector('#modal-close-btn').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    const overrideBtn = card.querySelector('#override-btn');
    if (overrideBtn) {
      overrideBtn.addEventListener('click', async () => {
        const reason = card.querySelector('#override-reason').value.trim();
        if (!reason) { toast('A reason is required for an admin override.', true); return; }
        overrideBtn.disabled = true;
        try {
          await api(`/api/admin/users/${userId}/upgrade-override`, { method: 'POST', body: JSON.stringify({ reason }) });
          toast(`${u.name} upgraded to paid — no network bonus generated.`);
          overlay.remove();
          onChange && onChange();
        } catch (e) {
          toast(e.message, true);
          overrideBtn.disabled = false;
        }
      });
    }
    const downgradeBtn = card.querySelector('#downgrade-btn');
    if (downgradeBtn) {
      downgradeBtn.addEventListener('click', async () => {
        const reason = card.querySelector('#downgrade-reason').value.trim();
        downgradeBtn.disabled = true;
        try {
          await api(`/api/admin/users/${userId}/downgrade`, { method: 'POST', body: JSON.stringify({ reason }) });
          toast(`${u.name} reverted to free.`);
          overlay.remove();
          onChange && onChange();
        } catch (e) {
          toast(e.message, true);
          downgradeBtn.disabled = false;
        }
      });
    }
  }

  // ---------------- Admin Action Log ----------------
  window.PageActions = async function (main) {
    const actions = await api('/api/admin/actions');
    main.innerHTML = '';
    main.appendChild(el(pageHeader('Admin Action Log', 'Permanent audit trail of every admin override, downgrade, and API key change.')));

    if (!actions.length) {
      main.appendChild(el('<div class="empty-note">No admin actions recorded yet.</div>'));
      return;
    }

    const list = el('<div class="table-wrap"></div>');
    const table = el(`
      <table>
        <thead><tr><th>When</th><th>Admin</th><th>Action</th><th>Target user</th><th>Details</th></tr></thead>
        <tbody></tbody>
      </table>
    `);
    const tbody = table.querySelector('tbody');
    actions.forEach(a => {
      tbody.appendChild(el(`
        <tr>
          <td>${new Date(a.createdAt).toLocaleString()}</td>
          <td>${a.adminUsername || '—'}</td>
          <td><span class="badge ${a.action === 'upgrade_override' ? 'purple' : 'neutral'}">${a.action}</span></td>
          <td>${a.targetUserName || '—'}</td>
          <td style="color:var(--text-mid);">${a.details?.reason || ''} ${a.details && 'bonusGenerated' in a.details ? `<span class="badge ${a.details.bonusGenerated ? 'good' : 'bad'}" style="margin-left:6px;">${a.details.bonusGenerated ? 'bonus generated' : 'no bonus'}</span>` : ''}</td>
        </tr>
      `));
    });
    list.appendChild(table);
    main.appendChild(list);
  };

  // ---------------- API Keys ----------------
  window.PageApiKeys = async function (main) {
    main.innerHTML = '';
    main.appendChild(el(pageHeader('API Keys', 'Keys for the upcoming webservice integration to call the public API.')));

    const createBar = el(`
      <div class="card" style="margin-bottom:20px;">
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;">
          <div style="flex:1;min-width:200px;">
            <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;">Label</label>
            <input type="text" id="new-key-label" placeholder="e.g. Marketing site integration" style="width:100%;margin-top:6px;" />
          </div>
          <div>
            <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;">Scopes</label>
            <div style="display:flex;gap:10px;margin-top:8px;font-size:12px;">
              <label><input type="checkbox" class="scope-cb" value="analytics:read" checked /> analytics:read</label>
              <label><input type="checkbox" class="scope-cb" value="users:read" /> users:read</label>
              <label><input type="checkbox" class="scope-cb" value="events:write" /> events:write</label>
            </div>
          </div>
          <button class="btn primary" id="create-key-btn">Generate key</button>
        </div>
        <div id="new-key-reveal" style="margin-top:14px;"></div>
      </div>
    `);
    main.appendChild(createBar);

    const listHost = el('<div></div>');
    main.appendChild(listHost);

    async function load() {
      const keys = await api('/api/admin/api-keys');
      listHost.innerHTML = '';
      const list = el('<div class="list-card"></div>');
      keys.forEach(k => {
        list.appendChild(el(`
          <div class="list-row">
            <div class="list-main">
              <div class="list-title">${k.label}</div>
              <div class="list-sub" style="font-family:var(--font-mono);">${k.keyPreview} · scopes: ${k.scopes.join(', ')}</div>
              <div class="list-sub">${k.lastUsedAt ? 'Last used ' + timeAgo(k.lastUsedAt) : 'Never used'} · created ${timeAgo(k.createdAt)}</div>
            </div>
            <div class="list-aux">
              <span class="badge ${k.active ? 'good' : 'bad'}">${k.active ? 'active' : 'revoked'}</span>
            </div>
            ${k.active ? `<button class="btn small bad revoke-btn" data-id="${k.id}" style="margin-left:10px;">Revoke</button>` : ''}
          </div>
        `));
      });
      listHost.appendChild(list);
      listHost.querySelectorAll('.revoke-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          await api(`/api/admin/api-keys/${btn.dataset.id}/revoke`, { method: 'POST' });
          toast('API key revoked.');
          load();
        });
      });
    }

    document.getElementById('create-key-btn').addEventListener('click', async () => {
      const label = document.getElementById('new-key-label').value.trim();
      if (!label) { toast('Give the key a label first.', true); return; }
      const scopes = [...document.querySelectorAll('.scope-cb:checked')].map(cb => cb.value);
      const result = await api('/api/admin/api-keys', { method: 'POST', body: JSON.stringify({ label, scopes }) });
      document.getElementById('new-key-reveal').innerHTML = `
        <div style="background:var(--panel-2);border:1px solid var(--gold);border-radius:10px;padding:14px;">
          <div style="font-size:11.5px;color:var(--gold);font-weight:700;margin-bottom:6px;">Copy this now — it won't be shown again</div>
          <div style="font-family:var(--font-mono);font-size:13px;word-break:break-all;">${result.rawKey}</div>
        </div>
      `;
      document.getElementById('new-key-label').value = '';
      load();
    });

    await load();
  };
  // ---------------- Payments (NOWPayments) ----------------
  window.PagePayments = async function (main) {
    main.innerHTML = '';
    main.appendChild(el(pageHeader('Payments', 'Account-level upgrades paid for via NOWPayments — crypto checkout, real revenue, network bonus generated on confirmation.')));

    const config = await api('/api/admin/payments/config');
    if (!config.configured) {
      main.appendChild(el(`
        <div class="card" style="border-color:var(--warn);margin-bottom:20px;">
          <div style="display:flex;gap:10px;align-items:flex-start;">
            <div>
              <div style="font-weight:700;color:var(--warn);margin-bottom:4px;">NOWPayments is not yet configured</div>
              <div style="font-size:12.5px;color:var(--text-mid);line-height:1.6;">
                Set <code style="background:var(--panel-3);padding:1px 5px;border-radius:4px;">NOWPAYMENTS_API_KEY</code> and
                <code style="background:var(--panel-3);padding:1px 5px;border-radius:4px;">NOWPAYMENTS_IPN_SECRET</code> as environment
                variables (see <code style="background:var(--panel-3);padding:1px 5px;border-radius:4px;">.env.example</code>) to accept
                real crypto payments. Until then, payment creation returns a clearly-labelled placeholder so the rest of the
                system keeps working for testing.
              </div>
            </div>
          </div>
        </div>
      `));
    } else {
      main.appendChild(el(`
        <div class="card" style="border-color:var(--good);margin-bottom:20px;">
          <div style="font-weight:700;color:var(--good);margin-bottom:4px;">NOWPayments connected${config.sandbox ? ' (sandbox mode)' : ''}</div>
          <div style="font-size:12.5px;color:var(--text-mid);">IPN signature verification: ${config.ipnConfigured ? 'enabled' : 'NOT configured — webhooks will be rejected'}</div>
        </div>
      `));
    }

    const result = await api('/api/admin/payments?limit=100');
    const grid = el('<div class="grid grid-4"></div>');
    const confirmed = result.payments.filter(p => p.status === 'confirmed');
    const pending = result.payments.filter(p => ['pending', 'waiting', 'confirming', 'partially_paid'].includes(p.status));
    const totalRevenue = confirmed.reduce((sum, p) => sum + (p.priceUSD || 0), 0);
    grid.appendChild(el(`<div class="card"><div class="stat-label">Total payments</div><div class="stat-value">${result.total}</div></div>`));
    grid.appendChild(el(`<div class="card" style="border-color:var(--good);"><div class="stat-label">Confirmed</div><div class="stat-value" style="color:var(--good);">${confirmed.length}</div></div>`));
    grid.appendChild(el(`<div class="card" style="border-color:var(--warn);"><div class="stat-label">Pending / in progress</div><div class="stat-value" style="color:var(--warn);">${pending.length}</div></div>`));
    grid.appendChild(el(`<div class="card" style="border-color:var(--gold);"><div class="stat-label">Revenue confirmed</div><div class="stat-value" style="color:var(--gold);">$${fmtNum(totalRevenue)}</div></div>`));
    main.appendChild(grid);

    main.appendChild(el('<div class="section-title">Transaction history</div>'));
    const list = el('<div class="table-wrap"></div>');
    const table = el(`
      <table>
        <thead><tr><th>When</th><th>User</th><th>Package</th><th>Price</th><th>Pay currency</th><th>Status</th><th>Bonus</th></tr></thead>
        <tbody></tbody>
      </table>
    `);
    const tbody = table.querySelector('tbody');
    const statusBadge = {
      confirmed: 'good', waiting: 'warn', confirming: 'warn', pending: 'neutral',
      partially_paid: 'warn', failed: 'bad', refunded: 'bad', expired: 'bad',
    };
    result.payments.forEach(p => {
      tbody.appendChild(el(`
        <tr>
          <td>${new Date(p.createdAt).toLocaleDateString()}</td>
          <td style="font-weight:600;">${p.userName || '—'}</td>
          <td>${p.packageCode}</td>
          <td>$${fmtNum(p.priceUSD)}</td>
          <td style="font-family:var(--font-mono);text-transform:uppercase;">${p.payCurrency || '—'}</td>
          <td><span class="badge ${statusBadge[p.status] || 'neutral'}">${p.status}</span></td>
          <td>${p.upgradeApplied ? '<span class="badge gold">bonus generated</span>' : '—'}</td>
        </tr>
      `));
    });
    list.appendChild(table);
    main.appendChild(list);
    if (!result.payments.length) main.appendChild(el('<div class="empty-note">No payments yet.</div>'));
  };
})();
