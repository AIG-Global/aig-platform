// ============================================================
// public/pages-monitoring.js — Overview, Daily Usage, Top
// Sharers, Biggest Users, Topics, Segmentation pages.
// ============================================================

(function () {
  const { api, el, fmtNum, fmtPct, timeAgo, colorForIndex, pageHeader } = window.ONE_ADMIN;

  // ---------------- Overview ----------------
  window.PageOverview = async function (main) {
    const ov = await api('/api/admin/overview');
    main.innerHTML = '';
    main.appendChild(el(pageHeader('Overview', 'Top-line numbers across every ONE user, free and paid.')));

    const grid = el('<div class="grid grid-4"></div>');
    const cards = [
      ['Total users', fmtNum(ov.totalUsers), `${fmtNum(ov.freeUsers)} free · ${fmtNum(ov.paidUsers)} paid`],
      ['Conversion rate', fmtPct(ov.conversionRatePct), 'free → paid, all time'],
      ['Active today', fmtNum(ov.activeToday), `${fmtNum(ov.activeThisWeek)} active this week`],
      ['Total events logged', fmtNum(ov.totalEvents), `${fmtNum(ov.pendingInvites)} invites pending`],
    ];
    cards.forEach(([label, value, foot]) => {
      grid.appendChild(el(`<div class="card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-foot">${foot}</div></div>`));
    });
    main.appendChild(grid);

    main.appendChild(el('<div class="section-title">7-day usage snapshot</div>'));
    const usage = await api('/api/admin/daily-usage?days=7');
    const maxEvents = Math.max(...usage.map(d => d.events), 1);
    const chart = el('<div class="card"><div class="bars-chart"></div></div>');
    const barsWrap = chart.querySelector('.bars-chart');
    usage.forEach(d => {
      const h = Math.max(4, (d.events / maxEvents) * 120);
      const day = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' });
      barsWrap.appendChild(el(`
        <div class="bar-col">
          <div style="font-size:10px;color:var(--text-mid);font-family:var(--font-mono);">${d.events}</div>
          <div class="bar-fill" style="height:${h}px;background:var(--amber);"></div>
          <div style="font-size:10px;color:var(--text-low);">${day}</div>
        </div>
      `));
    });
    main.appendChild(chart);

    const twoCol = el('<div class="grid grid-2" style="margin-top:20px;"></div>');
    const sharers = await api('/api/admin/top-sharers?limit=5');
    const sharerCard = el('<div><div class="section-title">Top 5 sharers</div></div>');
    const sharerList = el('<div class="list-card"></div>');
    sharers.forEach((s, i) => {
      sharerList.appendChild(el(`
        <div class="list-row">
          <div class="rank-badge ${i < 3 ? 'top3' : ''}">${i + 1}</div>
          <div class="list-main"><div class="list-title">${s.name}</div><div class="list-sub">${s.invitesJoined} joined of ${s.invitesSent} invited</div></div>
          <div class="list-aux"><span class="badge ${s.tier === 'paid' ? 'gold' : 'neutral'}">${s.tier}</span></div>
        </div>
      `));
    });
    sharerCard.appendChild(sharerList);
    twoCol.appendChild(sharerCard);

    const topics = await api('/api/admin/top-topics?limit=5');
    const topicCard = el('<div><div class="section-title">Top 5 topics</div></div>');
    const topicCardInner = el('<div class="card"></div>');
    topics.forEach((t, i) => {
      topicCardInner.appendChild(el(`
        <div class="mini-bar-row">
          <div class="mini-bar-label">${t.topic}</div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${t.sharePct * 4}%;background:${colorForIndex(i)}"></div></div>
          <div class="mini-bar-value">${fmtPct(t.sharePct)}</div>
        </div>
      `));
    });
    topicCard.appendChild(topicCardInner);
    twoCol.appendChild(topicCard);
    main.appendChild(twoCol);
  };

  // ---------------- Daily Usage ----------------
  window.PageUsage = async function (main) {
    main.innerHTML = '';
    main.appendChild(el(pageHeader('Daily Usage', 'Events logged and unique active users, day by day.')));

    const rangeWrap = el(`
      <div class="tabs">
        <button class="tab-btn active" data-days="7">7 days</button>
        <button class="tab-btn" data-days="30">30 days</button>
        <button class="tab-btn" data-days="90">90 days</button>
      </div>
    `);
    main.appendChild(rangeWrap);
    const chartHost = el('<div></div>');
    main.appendChild(chartHost);

    async function load(days) {
      const usage = await api(`/api/admin/daily-usage?days=${days}`);
      const inputSplit = await api(`/api/admin/input-mode-split?windowDays=${days}`);
      chartHost.innerHTML = '';

      const maxEvents = Math.max(...usage.map(d => d.events), 1);
      const chart = el('<div class="card"><div class="bars-chart" style="height:180px;"></div></div>');
      const barsWrap = chart.querySelector('.bars-chart');
      usage.forEach(d => {
        const h = Math.max(3, (d.events / maxEvents) * 150);
        barsWrap.appendChild(el(`
          <div class="bar-col">
            <div class="bar-fill" style="height:${h}px;background:var(--amber);" title="${d.date}: ${d.events} events, ${d.activeUsers} users"></div>
            ${days <= 14 ? `<div class="bar-label">${d.date.slice(5)}</div>` : ''}
          </div>
        `));
      });
      chartHost.appendChild(chart);

      const grid = el('<div class="grid grid-3" style="margin-top:18px;"></div>');
      const totalEvents = usage.reduce((a, b) => a + b.events, 0);
      const avgActive = Math.round(usage.reduce((a, b) => a + b.activeUsers, 0) / usage.length);
      grid.appendChild(el(`<div class="card"><div class="stat-label">Total events</div><div class="stat-value">${fmtNum(totalEvents)}</div><div class="stat-foot">over ${days} days</div></div>`));
      grid.appendChild(el(`<div class="card"><div class="stat-label">Avg daily active users</div><div class="stat-value">${fmtNum(avgActive)}</div></div>`));
      grid.appendChild(el(`
        <div class="card">
          <div class="stat-label">Voice vs typed commands</div>
          <div style="display:flex;align-items:center;gap:10px;margin-top:10px;">
            <div style="flex:1;height:12px;border-radius:999px;overflow:hidden;display:flex;background:var(--panel-3)">
              <div style="width:${inputSplit.total ? (inputSplit.voice / inputSplit.total) * 100 : 0}%;background:var(--amber)"></div>
              <div style="width:${inputSplit.total ? (inputSplit.typed / inputSplit.total) * 100 : 0}%;background:var(--panel-3);border:1px solid var(--hairline-2)"></div>
            </div>
          </div>
          <div class="stat-foot">${fmtNum(inputSplit.voice)} voice · ${fmtNum(inputSplit.typed)} typed</div>
        </div>
      `));
      chartHost.appendChild(grid);
    }

    rangeWrap.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        rangeWrap.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        load(Number(btn.dataset.days));
      });
    });
    await load(7);
  };

  // ---------------- Top Sharers ----------------
  window.PageSharers = async function (main) {
    const sharers = await api('/api/admin/top-sharers?limit=25');
    main.innerHTML = '';
    main.appendChild(el(pageHeader('Top Sharers', 'Ranked by number of invites that converted into a joined member.')));

    const list = el('<div class="table-wrap"></div>');
    const table = el(`
      <table>
        <thead><tr><th>#</th><th>Name</th><th>Tier</th><th>Invites sent</th><th>Joined</th><th>Free</th><th>Paid</th><th>Conversion</th></tr></thead>
        <tbody></tbody>
      </table>
    `);
    const tbody = table.querySelector('tbody');
    sharers.forEach((s, i) => {
      tbody.appendChild(el(`
        <tr>
          <td>${i + 1}</td>
          <td style="font-weight:600;">${s.name}</td>
          <td><span class="badge ${s.tier === 'paid' ? 'gold' : 'neutral'}">${s.tier}</span></td>
          <td>${s.invitesSent}</td>
          <td>${s.invitesJoined}</td>
          <td>${s.joinedFree}</td>
          <td>${s.joinedPaid}</td>
          <td>${s.conversionRate}%</td>
        </tr>
      `));
    });
    list.appendChild(table);
    main.appendChild(list);
    if (!sharers.length) main.appendChild(el('<div class="empty-note">No referral activity yet.</div>'));
  };

  // ---------------- Biggest Users ----------------
  window.PageTopUsers = async function (main) {
    main.innerHTML = '';
    main.appendChild(el(pageHeader('Biggest Users', 'Ranked by total activity volume in the selected window.')));

    const rangeWrap = el(`
      <div class="tabs">
        <button class="tab-btn" data-days="7">7 days</button>
        <button class="tab-btn active" data-days="30">30 days</button>
        <button class="tab-btn" data-days="90">90 days</button>
      </div>
    `);
    main.appendChild(rangeWrap);
    const host = el('<div></div>');
    main.appendChild(host);

    async function load(days) {
      const users = await api(`/api/admin/top-users?limit=25&windowDays=${days}`);
      host.innerHTML = '';
      const list = el('<div class="list-card"></div>');
      users.forEach((u, i) => {
        list.appendChild(el(`
          <div class="list-row">
            <div class="rank-badge ${i < 3 ? 'top3' : ''}">${i + 1}</div>
            <div class="list-main"><div class="list-title">${u.name}</div><div class="list-sub">${u.country} · assistant “${u.assistantName}”</div></div>
            <div class="list-aux"><div class="list-value">${fmtNum(u.eventCount)} events</div></div>
            <div class="list-aux"><span class="badge ${u.tier === 'paid' ? 'gold' : 'neutral'}">${u.tier}</span></div>
          </div>
        `));
      });
      host.appendChild(list);
      if (!users.length) host.appendChild(el('<div class="empty-note">No activity in this window.</div>'));
    }
    rangeWrap.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        rangeWrap.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        load(Number(btn.dataset.days));
      });
    });
    await load(30);
  };

  // ---------------- Topics & Fields of Use ----------------
  window.PageTopics = async function (main) {
    const topics = await api('/api/admin/top-topics?limit=20&windowDays=30');
    const domains = await api('/api/admin/domain-breakdown?windowDays=30');
    main.innerHTML = '';
    main.appendChild(el(pageHeader('Topics & Fields of Use', 'What people actually ask ONE about, and which domains they spend time in — last 30 days.')));

    const twoCol = el('<div class="grid grid-2"></div>');

    const topicWrap = el('<div></div>');
    topicWrap.appendChild(el('<div class="section-title">Top topics<span class="count">' + topics.length + '</span></div>'));
    const topicCard = el('<div class="card"></div>');
    const maxTopicPct = Math.max(...topics.map(t => t.sharePct), 1);
    topics.forEach((t, i) => {
      topicCard.appendChild(el(`
        <div class="mini-bar-row">
          <div class="mini-bar-label" title="${t.topic}">${t.topic}</div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${(t.sharePct / maxTopicPct) * 100}%;background:${colorForIndex(i)}"></div></div>
          <div class="mini-bar-value">${fmtNum(t.count)}</div>
        </div>
      `));
    });
    topicWrap.appendChild(topicCard);
    twoCol.appendChild(topicWrap);

    const domainWrap = el('<div></div>');
    domainWrap.appendChild(el('<div class="section-title">Fields of use (navigation domains)</div>'));
    const domainCard = el('<div class="card"></div>');
    const maxDomainPct = Math.max(...domains.map(d => d.sharePct), 1);
    domains.forEach((d, i) => {
      domainCard.appendChild(el(`
        <div class="mini-bar-row">
          <div class="mini-bar-label">${d.domain}</div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${(d.sharePct / maxDomainPct) * 100}%;background:${colorForIndex(i + 2)}"></div></div>
          <div class="mini-bar-value">${fmtPct(d.sharePct)}</div>
        </div>
      `));
    });
    domainWrap.appendChild(domainCard);
    twoCol.appendChild(domainWrap);

    main.appendChild(twoCol);
  };

  // ---------------- Free vs Paid Segmentation ----------------
  window.PageSegmentation = async function (main) {
    const seg = await api('/api/admin/segmentation');
    const byCountry = await api('/api/admin/by-country?limit=10');
    main.innerHTML = '';
    main.appendChild(el(pageHeader('Free vs Paid', 'How the two tiers compare, and where upgrades actually come from.')));

    const grid = el('<div class="grid grid-2"></div>');
    grid.appendChild(el(`
      <div class="card">
        <div class="stat-label">Free members</div>
        <div class="stat-value">${fmtNum(seg.free.count)}</div>
        <div class="stat-foot">Avg ${seg.free.avgEventsPerUser} events/user in last 30 days</div>
      </div>
    `));
    grid.appendChild(el(`
      <div class="card" style="border-color:var(--gold);">
        <div class="stat-label" style="color:var(--gold);">Paid members</div>
        <div class="stat-value" style="color:var(--gold);">${fmtNum(seg.paid.count)}</div>
        <div class="stat-foot">Avg ${seg.paid.avgEventsPerUser} events/user in last 30 days</div>
      </div>
    `));
    main.appendChild(grid);

    main.appendChild(el('<div class="section-title">How paid members got there</div>'));
    const upgradeCard = el('<div class="card"></div>');
    const total = seg.upgradeSources.network + seg.upgradeSources.adminOverride || 1;
    upgradeCard.appendChild(el(`
      <div class="mini-bar-row">
        <div class="mini-bar-label">Normal network upgrade</div>
        <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${(seg.upgradeSources.network/total)*100}%;background:var(--good)"></div></div>
        <div class="mini-bar-value">${fmtNum(seg.upgradeSources.network)}</div>
      </div>
      <div class="mini-bar-row">
        <div class="mini-bar-label">Admin override (no bonus)</div>
        <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${(seg.upgradeSources.adminOverride/total)*100}%;background:var(--purple)"></div></div>
        <div class="mini-bar-value">${fmtNum(seg.upgradeSources.adminOverride)}</div>
      </div>
    `));
    main.appendChild(upgradeCard);

    main.appendChild(el('<div class="section-title">Users by country</div>'));
    const countryCard = el('<div class="card"></div>');
    const maxC = Math.max(...byCountry.map(c => c.count), 1);
    byCountry.forEach((c, i) => {
      countryCard.appendChild(el(`
        <div class="mini-bar-row">
          <div class="mini-bar-label">${c.country}</div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${(c.count/maxC)*100}%;background:${colorForIndex(i)}"></div></div>
          <div class="mini-bar-value">${fmtNum(c.count)}</div>
        </div>
      `));
    });
    main.appendChild(countryCard);
  };
})();
