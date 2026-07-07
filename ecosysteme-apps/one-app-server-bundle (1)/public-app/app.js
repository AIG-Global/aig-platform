// ============================================================
// ONE Business Console — Application Logic
// Vanilla JS, no framework, no build step.
// ============================================================

(function(){
  const root = document.getElementById('app');

  const state = {
    domain: 'home',
    sidebarOpen: false,
    lastResponse: null,
  };

  const NAV = [
    { group: 'Overview', items: [
      { id:'home', label:'Briefing', icon:'home', accent:'amber' },
    ]},
    { group: 'Business', gated: true, items: [
      { id:'finance', label:'Finance & Cash', icon:'cash', accent:'amber', badge: 2 },
      { id:'sales', label:'Sales & Revenue', icon:'sales', accent:'amber', badge: 3 },
      { id:'ops', label:'Operations', icon:'ops', accent:'amber', badge: 2 },
      { id:'people', label:'People', icon:'people', accent:'amber', badge: 2 },
      { id:'legal', label:'Legal & Risk', icon:'legal', accent:'amber', badge: 2 },
    ]},
    { group: 'AIG Network', gated: true, items: [
      { id:'aig', label:'Wallet & Network', icon:'network', accent:'gold' },
    ]},
    { group: 'Personal', items: [
      { id:'health', label:'Health & Safety', icon:'heart', accent:'amber' },
      { id:'invite', label:'Invite & Grow', icon:'userPlus', accent:'gold' },
    ]},
    { group: 'System', items: [
      { id:'memory', label:'Memory & Trust', icon:'memory', accent:'amber' },
      { id:'settings', label:'Settings', icon:'neutral', accent:'amber' },
    ]},
  ];

  // ---------------- helpers ----------------
  function el(html){
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function fmtEUR(n){
    const sign = n < 0 ? '-' : '';
    n = Math.abs(n);
    return sign + '€' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  function fmtNum(n){ return n.toLocaleString('en-US'); }
  function icon(name, color, size=18){
    return `<span style="display:inline-flex;width:${size}px;height:${size}px;color:${color||'currentColor'}">${ICON[name] ? ICON[name](color||'currentColor') : ''}</span>`;
  }
  // invert=true means "a positive delta is bad" (e.g. burn rate rising is bad).
  // invert=false (default) means "a positive delta is good" (e.g. cash, MRR rising is good).
  function deltaSpan(delta, invert=false){
    const flat = delta === 0;
    const positive = invert ? delta < 0 : delta > 0;
    const cls = flat ? 'flat' : (positive ? 'up' : 'down');
    const arrow = flat ? '' : (delta > 0 ? icon('arrowUp','currentColor',12) : icon('arrowDown','currentColor',12));
    return `<span class="stat-delta ${cls}">${arrow}${Math.abs(delta)}%</span>`;
  }
  function sevBadge(sev){
    const map = { high:'bad', med:'warn', low:'good', bad:'bad', warn:'warn', good:'good' };
    const labelMap = { high:'High risk', med:'Medium', low:'Low risk', bad:'Action needed', warn:'Monitor', good:'Healthy' };
    return `<span class="badge ${map[sev]||'neutral'}">${labelMap[sev]||sev}</span>`;
  }

  // ---------------- sparkline (tiny inline SVG chart) ----------------
  function sparkline(values, color, w=120, h=32){
    const min = Math.min(...values), max = Math.max(...values);
    const range = (max - min) || 1;
    const step = w / (values.length - 1);
    const pts = values.map((v,i)=> `${i*step},${h - ((v-min)/range)*h}`).join(' ');
    const last = values[values.length-1];
    const lastX = (values.length-1)*step;
    const lastY = h - ((last-min)/range)*h;
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${lastX}" cy="${lastY}" r="3" fill="${color}"/>
    </svg>`;
  }

  // ============================================================
  // SHELL RENDER
  // ============================================================
  function renderShell(){
    root.innerHTML = '';
    const app = el(`<div id="app-inner" style="display:flex;height:100vh;width:100vw;overflow:hidden;"></div>`);

    app.appendChild(renderSidebar());
    app.appendChild(renderMain());
    root.appendChild(app);
  }

  function renderSidebar(){
    const sidebar = el(`<div class="sidebar ${state.sidebarOpen ? 'open' : ''}"></div>`);
    const assistantName = DATA.user.assistantName || 'ONE';
    const isPaid = DATA.membership.tier === 'paid';
    const markHtml = assistantName === 'ONE'
      ? `<img src="./assets/logo-icon.svg" alt="ONE" style="width:36px;height:36px;flex-shrink:0;" />`
      : `<div class="brand-mark">${assistantName.charAt(0).toUpperCase()}</div>`;

    sidebar.appendChild(el(`
      <div class="brand">
        ${markHtml}
        <div class="brand-text">
          <div class="brand-name">${assistantName}</div>
          <div class="brand-sub">AIG ASSISTANT</div>
        </div>
      </div>
    `));

    NAV.forEach(group => {
      sidebar.appendChild(el(`<div class="nav-group-label">${group.group}</div>`));
      const navWrap = el(`<div class="nav"></div>`);
      group.items.forEach(item => {
        const isActive = state.domain === item.id;
        const locked = group.gated && !isPaid;
        const btn = el(`
          <button class="nav-item ${isActive ? 'active' : ''}" data-domain="${item.id}" style="--accent: var(--${item.accent})">
            <span class="nav-icon">${icon(item.icon, isActive ? `var(--${item.accent})` : 'var(--text-mid)', 17)}</span>
            <span>${item.label}</span>
            ${locked ? `<span class="nav-icon" style="margin-left:auto;opacity:0.55;">${icon('lock','var(--text-low)',13)}</span>`
              : item.badge ? `<span class="nav-badge">${item.badge}</span>` : `<span class="nav-dot"></span>`}
          </button>
        `);
        btn.addEventListener('click', () => {
          state.sidebarOpen = false;
          if(locked){ state.domain = 'upgrade'; renderShell(); return; }
          state.domain = item.id;
          renderShell();
        });
        navWrap.appendChild(btn);
      });
      sidebar.appendChild(navWrap);
    });

    sidebar.appendChild(el(`
      <div class="sidebar-footer">
        <div class="avatar">${DATA.user.initials}</div>
        <div class="footer-text">
          <div class="footer-name">@${DATA.user.username || 'you'}</div>
          <div class="footer-role">${isPaid ? DATA.user.role : 'Free member'}</div>
        </div>
        <div class="autonomy-pill" title="Autonomy level — how much ${assistantName} can act without asking">${DATA.user.autonomy}</div>
      </div>
    `));

    return sidebar;
  }

  function renderMain(){
    const main = el(`<div class="main"></div>`);

    // mobile toggle
    const mobileToggle = el(`<button class="mobile-nav-toggle">${icon('menu','currentColor',16)} Menu</button>`);
    mobileToggle.style.display = window.innerWidth <= 860 ? 'flex' : 'none';
    mobileToggle.addEventListener('click', () => { state.sidebarOpen = !state.sidebarOpen; renderShell(); });

    main.appendChild(renderCommandZone());
    main.appendChild(renderResponseZone());

    const content = el(`<div class="content"></div>`);
    content.appendChild(mobileToggle);
    content.appendChild(renderDomain(state.domain));
    main.appendChild(content);

    return main;
  }

  // ============================================================
  // COMMAND BAR
  // ============================================================
  function renderCommandZone(){
    const assistantName = DATA.user.assistantName || 'ONE';
    const hasSpeech = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    const zone = el(`
      <div class="command-zone">
        <div class="command-bar">
          <span class="command-glyph">${icon('one','var(--amber)',20)}</span>
          <input class="command-input" type="text" placeholder="Ask ${assistantName} anything — type, or tap the mic to speak…" />
          <button class="command-mic" title="${hasSpeech ? 'Speak to ' + assistantName : 'Voice input not supported in this browser'}"
            style="background:${hasSpeech ? 'var(--panel-2)' : 'var(--panel-3)'};border:1px solid var(--hairline-2);
            border-radius:11px;width:40px;height:40px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
            color:${hasSpeech ? 'var(--text-mid)' : 'var(--text-low)'};opacity:${hasSpeech?1:0.6};">
            ${icon('micWave','currentColor',18)}
          </button>
          <button class="command-send">${icon('send','var(--ink)',14)} Ask</button>
        </div>
        <div class="command-suggestions">
          ${[
            'How much runway do we have left?',
            'What does the sales pipeline look like?',
            'Any contracts I should worry about?',
            'How is the AIG network doing?',
          ].map(q => `<button class="suggestion-chip" data-q="${q}">${q}</button>`).join('')}
        </div>
      </div>
    `);

    const input = zone.querySelector('.command-input');
    const sendBtn = zone.querySelector('.command-send');
    const micBtn = zone.querySelector('.command-mic');

    function submit(){
      const val = input.value.trim();
      if(!val) return;
      handleCommand(val);
      input.value = '';
    }
    sendBtn.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => { if(e.key === 'Enter') submit(); });
    zone.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => handleCommand(chip.dataset.q));
    });

    micBtn.addEventListener('click', () => {
      if(!hasSpeech){
        input.placeholder = 'Voice input is not supported in this browser — try Chrome or Edge, or type your question.';
        return;
      }
      try{
        const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new Rec();
        rec.lang = 'en-US';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        micBtn.style.background = 'var(--bad-tint)';
        micBtn.style.color = 'var(--bad)';
        micBtn.style.animation = 'pulse 1s infinite';
        let heard = false;
        rec.onresult = (e) => {
          heard = true;
          const transcript = e.results[0][0].transcript;
          input.value = transcript;
          micBtn.style.background = 'var(--panel-2)';
          micBtn.style.color = 'var(--text-mid)';
          micBtn.style.animation = '';
          handleCommand(transcript);
          input.value = '';
        };
        rec.onerror = () => {
          micBtn.style.background = 'var(--panel-2)';
          micBtn.style.color = 'var(--text-mid)';
          micBtn.style.animation = '';
          if(!heard) input.placeholder = `Didn't catch that — microphone may be blocked. Try typing instead.`;
        };
        rec.onend = () => {
          micBtn.style.background = 'var(--panel-2)';
          micBtn.style.color = 'var(--text-mid)';
          micBtn.style.animation = '';
        };
        rec.start();
      }catch(err){
        input.placeholder = 'Voice input unavailable right now — try typing instead.';
      }
    });

    return zone;
  }

  function handleCommand(query){
    const lower = query.toLowerCase();
    let match = DATA.responses.find(r => r.keys.some(k => lower.includes(k)));
    if(!match){
      match = {
        accent:'amber', query,
        html: `ONE is still learning this one. In the full product this would route to live business data — for this prototype, try one of the suggested questions, or explore a domain from the left to see ONE's reasoning on real figures.`,
        meta: [],
        goto: null,
      };
    }
    state.lastResponse = match;
    if(match.goto) state.domain = match.goto;
    renderShell();
  }

  function renderResponseZone(){
    const zone = el(`<div class="response-zone"></div>`);
    if(!state.lastResponse) return zone;
    const r = state.lastResponse;
    const assistantName = DATA.user.assistantName || 'ONE';
    const card = el(`
      <div class="response-card ${r.accent === 'gold' ? 'gold' : ''}">
        <button class="response-close">${icon('close','currentColor',14)}</button>
        <div class="response-head">
          <span class="response-one-badge ${r.accent === 'gold' ? 'gold' : ''}">${assistantName}</span>
          <span class="response-query">“${r.query}”</span>
        </div>
        <div class="response-body">${r.html}</div>
        ${r.meta && r.meta.length ? `
          <div class="response-meta-row">
            ${r.meta.map(m => `
              <div class="response-meta-item">
                <div class="response-meta-label">${m.label}</div>
                <div class="response-meta-value" style="color:${r.accent==='gold' ? 'var(--gold)' : 'var(--amber)'}">${m.value}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `);
    card.querySelector('.response-close').addEventListener('click', () => {
      state.lastResponse = null;
      renderShell();
    });
    zone.appendChild(card);
    return zone;
  }

  // ============================================================
  // DOMAIN ROUTER
  // ============================================================
  function renderDomain(domain){
    const renderers = {
      home: renderHome,
      finance: renderFinance,
      sales: renderSales,
      ops: renderOps,
      people: renderPeople,
      legal: renderLegal,
      aig: renderAIG,
      memory: renderMemory,
      health: renderHealth,
      invite: renderInvite,
      settings: renderSettings,
      upgrade: renderUpgrade,
    };
    return (renderers[domain] || renderHome)();
  }

  // ============================================================
  // HOME / BRIEFING
  // ============================================================
  function renderHome(){
    const b = DATA.briefing;
    const assistantName = DATA.user.assistantName || 'ONE';
    const isPaid = DATA.membership.tier === 'paid';
    const firstName = DATA.user.username || 'there';
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div class="domain-header">
        <div>
          <div class="domain-title">Good morning, ${firstName}.</div>
          <div class="domain-sub">${b.date} — here is everything ${assistantName} thinks matters before you start.</div>
        </div>
      </div>
    `));

    const list = el(`<div class="list-card"></div>`);
    const accentVarMap = { amber:'var(--amber)', bad:'var(--bad)', warn:'var(--warn)', gold:'var(--gold)', good:'var(--good)' };
    const tintVarMap = { amber:'var(--amber-tint)', bad:'var(--bad-tint)', warn:'var(--warn-tint)', gold:'var(--gold-tint)', good:'var(--good-tint)' };
    const finalItems = isPaid ? b.items : b.items.filter(i => i.icon === 'calendar' || i.icon === 'plane');
    finalItems.forEach(item => {
      list.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:${tintVarMap[item.accent]}">${icon(item.icon, accentVarMap[item.accent], 18)}</div>
          <div class="list-main">
            <div class="list-title">${item.title}</div>
            <div class="list-sub">${item.sub}</div>
          </div>
        </div>
      `));
    });
    if(!isPaid){
      list.appendChild(el(`
        <div class="list-row" style="cursor:pointer;" id="home-upgrade-row">
          <div class="list-icon" style="background:var(--gold-tint)">${icon('lockOpen','var(--gold)',18)}</div>
          <div class="list-main">
            <div class="list-title">Business & AIG network briefing — paid members only</div>
            <div class="list-sub">Unlock finance, sales, AIG wallet and network updates in this briefing</div>
          </div>
          <div class="list-aux"><span class="badge gold">Upgrade</span></div>
        </div>
      `));
    }
    wrap.appendChild(list);
    const upgradeRow = list.querySelector('#home-upgrade-row');
    if(upgradeRow) upgradeRow.addEventListener('click', () => { state.domain='upgrade'; renderShell(); });

    wrap.appendChild(el(`<div class="section-title">Quick stats${isPaid ? ' across the business' : ''}</div>`));
    const grid = el(`<div class="grid grid-4"></div>`);
    if(isPaid){
      grid.appendChild(statCard('Cash runway', DATA.finance.runwayMonths + ' mo', DATA.finance.runwayDelta, false, 'amber'));
      grid.appendChild(statCard('Sales pipeline', fmtEUR(DATA.sales.pipelineValue), DATA.sales.pipelineDelta, false, 'amber'));
      grid.appendChild(statCard('AIG wallet', fmtNum(DATA.aig.walletBalance) + ' tokens', DATA.aig.walletDeltaPct, false, 'gold'));
      grid.appendChild(statCard('Network size', fmtNum(DATA.aig.networkSize) + ' members', null, false, 'gold', '+' + DATA.aig.networkNewWeek + ' this week'));
    } else {
      grid.appendChild(statCard('Heart rate', DATA.health.vitals.heartRate + ' bpm', null, false, 'amber', 'Synced from ' + DATA.health.connected.watchModel));
      grid.appendChild(statCard('Steps today', fmtNum(DATA.health.vitals.steps), null, false, 'amber', 'Goal: ' + fmtNum(DATA.health.vitals.stepsGoal)));
      grid.appendChild(statCard('Your invites', DATA.network.invitesJoined + ' joined', null, false, 'gold', DATA.network.invitesSent + ' sent total'));
      const upCard = el(`<div class="card stat-card" style="cursor:pointer;border-color:var(--gold);" id="home-upgrade-card">
        <div class="stat-label" style="color:var(--gold);">Membership</div>
        <div class="stat-value" style="color:var(--gold);font-size:20px;">Free</div>
        <div class="stat-foot">Tap to see what paid unlocks</div>
      </div>`);
      grid.appendChild(upCard);
    }
    wrap.appendChild(grid);
    const upCard2 = wrap.querySelector('#home-upgrade-card');
    if(upCard2) upCard2.addEventListener('click', () => { state.domain='upgrade'; renderShell(); });

    return wrap;
  }

  function statCard(label, value, delta, invert, accent, footOverride){
    const card = el(`
      <div class="card stat-card">
        <div class="stat-label">${label}</div>
        <div class="stat-value" style="${accent==='gold' ? 'color:var(--gold)' : ''}">${value}</div>
        ${delta !== null && delta !== undefined ? deltaSpan(delta, invert) : ''}
        ${footOverride ? `<div class="stat-foot">${footOverride}</div>` : ''}
      </div>
    `);
    return card;
  }

  // ============================================================
  // FINANCE
  // ============================================================
  function renderFinance(){
    const f = DATA.finance;
    const wrap = el(`<div></div>`);
    wrap.appendChild(domainHeader('Finance & Cash', 'ONE reconciles accounts, tracks runway, and chases receivables automatically.', 'amber'));

    const grid = el(`<div class="grid grid-4"></div>`);
    const cashCard = statCard('Cash on hand', fmtEUR(f.cash), f.cashDelta, true, 'amber');
    cashCard.querySelector('.stat-card') ; cashCard.appendChild(el(`<div style="margin-top:6px">${sparkline(f.sparkCash, 'var(--amber)')}</div>`));
    grid.appendChild(cashCard);
    grid.appendChild(statCard('Monthly burn', fmtEUR(f.burn), f.burnDelta, true, 'amber'));
    grid.appendChild(statCard('Runway', f.runwayMonths + ' months', f.runwayDelta, true, 'amber'));
    grid.appendChild(statCard('MRR', fmtEUR(f.mrr), f.mrrDelta, false, 'amber'));
    wrap.appendChild(grid);

    wrap.appendChild(el(`<div class="section-title">What ONE flagged <span class="count">${f.alerts.length}</span></div>`));
    const alertsWrap = el(`<div style="display:flex;flex-direction:column;gap:10px;"></div>`);
    f.alerts.forEach(a => {
      alertsWrap.appendChild(el(`
        <div class="card tight" style="border-left:3px solid var(--${a.sev === 'bad' ? 'bad' : a.sev === 'warn' ? 'warn' : 'good'})">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
            ${sevBadge(a.sev)}
            <div style="font-weight:600;font-size:13.5px;">${a.title}</div>
          </div>
          <div style="font-size:12.5px;color:var(--text-mid);line-height:1.5;">${a.detail}</div>
        </div>
      `));
    });
    wrap.appendChild(alertsWrap);

    const twoCol = el(`<div class="two-col" style="margin-top:24px;"></div>`);

    const left = el(`<div></div>`);
    left.appendChild(el(`<div class="section-title">Accounts</div>`));
    const accCard = el(`<div class="list-card"></div>`);
    f.accounts.forEach(a => {
      accCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:var(--amber-tint)">${icon('wallet','var(--amber)',16)}</div>
          <div class="list-main"><div class="list-title">${a.name}</div><div class="list-sub">${a.type}</div></div>
          <div class="list-aux"><div class="list-value">${fmtEUR(a.balance)}</div></div>
        </div>
      `));
    });
    left.appendChild(accCard);

    left.appendChild(el(`<div class="section-title" style="margin-top:24px;">Receivables ONE is chasing</div>`));
    const arCard = el(`<div class="list-card"></div>`);
    f.receivables.forEach(r => {
      arCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:${r.status==='overdue' ? 'var(--bad-tint)' : 'var(--panel-3)'}">${icon('invoice', r.status==='overdue' ? 'var(--bad)' : 'var(--text-mid)', 16)}</div>
          <div class="list-main">
            <div class="list-title">${r.client}</div>
            <div class="list-sub">${r.status==='overdue' ? `${r.daysOverdue} days overdue — 2nd reminder sent` : 'Due in 7 days — on schedule'}</div>
          </div>
          <div class="list-aux"><div class="list-value">${fmtEUR(r.amount)}</div></div>
        </div>
      `));
    });
    left.appendChild(arCard);
    twoCol.appendChild(left);

    const right = el(`<div></div>`);
    right.appendChild(el(`<div class="section-title">Spend by category</div>`));
    const expCard = el(`<div class="card"></div>`);
    const maxExp = Math.max(...f.expenseCategories.map(e=>e.value));
    f.expenseCategories.forEach(e => {
      expCard.appendChild(el(`
        <div class="mini-bar-row">
          <div class="mini-bar-label">${e.label}</div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${(e.value/maxExp)*100}%;background:${e.color}"></div></div>
          <div class="mini-bar-value">${fmtEUR(e.value)}</div>
        </div>
      `));
    });
    right.appendChild(expCard);
    twoCol.appendChild(right);

    wrap.appendChild(twoCol);
    return wrap;
  }

  // ============================================================
  // SALES
  // ============================================================
  function renderSales(){
    const s = DATA.sales;
    const wrap = el(`<div></div>`);
    wrap.appendChild(domainHeader('Sales & Revenue', 'ONE tracks every deal, flags stalls, and predicts churn before it happens.', 'amber'));

    const grid = el(`<div class="grid grid-4"></div>`);
    grid.appendChild(statCard('Pipeline value', fmtEUR(s.pipelineValue), s.pipelineDelta, false, 'amber'));
    grid.appendChild(statCard('Win rate', s.winRate + '%', null, false, 'amber'));
    grid.appendChild(statCard('Avg deal size', fmtEUR(s.avgDealSize), null, false, 'amber'));
    grid.appendChild(statCard('Deals at risk', s.dealsAtRisk, null, false, 'amber'));
    wrap.appendChild(grid);

    wrap.appendChild(el(`<div class="section-title">Pipeline by stage</div>`));
    const stageCard = el(`<div class="card"></div>`);
    const maxStage = Math.max(...s.stages.map(st=>st.value));
    s.stages.forEach(st => {
      stageCard.appendChild(el(`
        <div class="mini-bar-row">
          <div class="mini-bar-label">${st.name} <span style="color:var(--text-low)">(${st.count})</span></div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${(st.value/maxStage)*100}%;background:var(--amber)"></div></div>
          <div class="mini-bar-value">${fmtEUR(st.value)}</div>
        </div>
      `));
    });
    wrap.appendChild(stageCard);

    wrap.appendChild(el(`<div class="section-title">Deals ONE is watching <span class="count">${s.deals.length}</span></div>`));
    const dealsCard = el(`<div class="list-card"></div>`);
    s.deals.forEach(d => {
      dealsCard.appendChild(el(`
        <div class="list-row" style="align-items:flex-start;">
          <div class="list-icon" style="background:var(--amber-tint);margin-top:2px;">${icon('pipeline','var(--amber)',16)}</div>
          <div class="list-main">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <div class="list-title">${d.name}</div>
              ${sevBadge(d.risk)}
              <span class="badge neutral">${d.stage}</span>
            </div>
            <div class="list-sub" style="margin-top:4px;">${d.note}</div>
            <div class="list-sub" style="margin-top:2px;color:var(--text-low)">Last touch: ${d.lastTouch}</div>
          </div>
          <div class="list-aux"><div class="list-value">${fmtEUR(d.value)}</div></div>
        </div>
      `));
    });
    wrap.appendChild(dealsCard);

    wrap.appendChild(el(`<div class="section-title">Churn risk signals</div>`));
    const churnCard = el(`<div class="list-card"></div>`);
    s.churnRisk.forEach(c => {
      churnCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:${c.severity==='high' ? 'var(--bad-tint)' : 'var(--panel-3)'}">${icon('flag', c.severity==='high' ? 'var(--bad)' : 'var(--text-mid)', 16)}</div>
          <div class="list-main"><div class="list-title">${c.client}</div><div class="list-sub">${c.signal}</div></div>
          <div class="list-aux">${sevBadge(c.severity)}</div>
        </div>
      `));
    });
    wrap.appendChild(churnCard);

    return wrap;
  }

  // ============================================================
  // OPERATIONS
  // ============================================================
  function renderOps(){
    const o = DATA.ops;
    const wrap = el(`<div></div>`);
    wrap.appendChild(domainHeader('Operations', 'ONE tracks every project, contract renewal, and vendor relationship.', 'amber'));

    const grid = el(`<div class="grid grid-3"></div>`);
    grid.appendChild(statCard('Active projects', o.activeProjects, null, false, 'amber'));
    grid.appendChild(statCard('On track', o.onTrack, null, false, 'amber'));
    grid.appendChild(statCard('At risk', o.atRisk, null, false, 'amber'));
    wrap.appendChild(grid);

    wrap.appendChild(el(`<div class="section-title">Projects</div>`));
    const projCard = el(`<div class="list-card"></div>`);
    o.projects.forEach(p => {
      const statusColor = p.status === 'on-track' ? 'good' : 'warn';
      projCard.appendChild(el(`
        <div class="list-row" style="align-items:flex-start;">
          <div class="list-icon" style="background:var(--${statusColor}-tint)">${icon('ops', `var(--${statusColor})`, 16)}</div>
          <div class="list-main">
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="list-title">${p.name}</div>
              <span class="badge ${statusColor}">${p.status === 'on-track' ? 'On track' : 'At risk'}</span>
            </div>
            <div class="list-sub">Owner: ${p.owner} · Due ${p.due}${p.note ? ' — ' + p.note : ''}</div>
            <div class="progress-track"><div class="progress-fill" style="width:${p.progress}%;background:var(--${statusColor==='good'?'amber':'warn'})"></div></div>
          </div>
          <div class="list-aux"><div class="list-value">${p.progress}%</div></div>
        </div>
      `));
    });
    wrap.appendChild(projCard);

    const twoCol = el(`<div class="two-col" style="margin-top:24px;"></div>`);
    const left = el(`<div></div>`);
    left.appendChild(el(`<div class="section-title">Contract renewals</div>`));
    const contractCard = el(`<div class="list-card"></div>`);
    o.contracts.forEach(c => {
      contractCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:var(--${c.flag}-tint)">${icon('contract', `var(--${c.flag==='bad'?'bad':c.flag==='warn'?'warn':'good'})`, 16)}</div>
          <div class="list-main"><div class="list-title">${c.vendor}</div><div class="list-sub">${c.type} · renews in ${c.renews}</div></div>
          <div class="list-aux"><div class="list-value" style="color:${c.delta.startsWith('+') && c.delta!=='+0%' ? 'var(--bad)' : 'var(--text-hi)'}">${c.delta}</div></div>
        </div>
      `));
    });
    left.appendChild(contractCard);
    twoCol.appendChild(left);

    const right = el(`<div></div>`);
    right.appendChild(el(`<div class="section-title">Vendor performance</div>`));
    const vendorCard = el(`<div class="card"></div>`);
    o.vendors.forEach(v => {
      vendorCard.appendChild(el(`
        <div class="mini-bar-row">
          <div class="mini-bar-label">${v.name}</div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${v.onTimeRate}%;background:${v.onTimeRate>90?'var(--good)':v.onTimeRate>80?'var(--warn)':'var(--bad)'}"></div></div>
          <div class="mini-bar-value">${v.onTimeRate}%</div>
        </div>
      `));
    });
    right.appendChild(vendorCard);
    twoCol.appendChild(right);
    wrap.appendChild(twoCol);

    return wrap;
  }

  // ============================================================
  // PEOPLE
  // ============================================================
  function renderPeople(){
    const p = DATA.people;
    const wrap = el(`<div></div>`);
    wrap.appendChild(domainHeader('People', 'ONE tracks hiring, performance cycles, and quiet attrition signals.', 'amber'));

    const grid = el(`<div class="grid grid-4"></div>`);
    grid.appendChild(statCard('Headcount', p.headcount, null, false, 'amber'));
    grid.appendChild(statCard('Open roles', p.openRoles, null, false, 'amber'));
    grid.appendChild(statCard('Avg tenure', p.avgTenure + ' yrs', null, false, 'amber'));
    grid.appendChild(statCard('Attrition signals', p.attritionRiskCount, null, false, 'amber'));
    wrap.appendChild(grid);

    wrap.appendChild(el(`<div class="section-title">Hiring pipeline</div>`));
    const hireCard = el(`<div class="list-card"></div>`);
    p.pipeline.forEach(h => {
      hireCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:var(--amber-tint)">${icon('people','var(--amber)',16)}</div>
          <div class="list-main"><div class="list-title">${h.role}</div><div class="list-sub">${h.candidate} · ${h.next}</div></div>
          <div class="list-aux"><span class="badge amber">${h.stage}</span></div>
        </div>
      `));
    });
    wrap.appendChild(hireCard);

    const twoCol = el(`<div class="two-col" style="margin-top:24px;"></div>`);
    const left = el(`<div></div>`);
    left.appendChild(el(`<div class="section-title">Performance reviews</div>`));
    const revCard = el(`<div class="list-card"></div>`);
    p.reviews.forEach(r => {
      const statusMap = { 'draft-ready':['amber','Draft ready'], 'scheduled':['neutral','Scheduled'], 'not-started':['warn','Not started'] };
      const [cls,label] = statusMap[r.status];
      revCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:var(--panel-3)">${icon('calendar','var(--text-mid)',16)}</div>
          <div class="list-main"><div class="list-title">${r.name}</div><div class="list-sub">${r.team} · due ${r.due}</div></div>
          <div class="list-aux"><span class="badge ${cls}">${label}</span></div>
        </div>
      `));
    });
    left.appendChild(revCard);
    twoCol.appendChild(left);

    const right = el(`<div></div>`);
    right.appendChild(el(`<div class="section-title">Attrition risk signals</div>`));
    const attrCard = el(`<div class="list-card"></div>`);
    p.attritionSignals.forEach(a => {
      attrCard.appendChild(el(`
        <div class="list-row" style="align-items:flex-start;">
          <div class="list-icon" style="background:var(--bad-tint);margin-top:2px;">${icon('flag','var(--bad)',16)}</div>
          <div class="list-main"><div class="list-title">${a.name} <span style="color:var(--text-low);font-weight:400;">— ${a.team}</span></div><div class="list-sub">${a.signal}</div></div>
        </div>
      `));
    });
    right.appendChild(attrCard);

    right.appendChild(el(`<div class="section-title">Compliance deadlines</div>`));
    const compCard = el(`<div class="list-card"></div>`);
    p.compliance.forEach(c => {
      compCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:var(--panel-3)">${icon('shield','var(--text-mid)',16)}</div>
          <div class="list-main"><div class="list-title">${c.item}</div></div>
          <div class="list-aux"><div class="list-value-sub">due ${c.due}</div></div>
        </div>
      `));
    });
    right.appendChild(compCard);
    twoCol.appendChild(right);
    wrap.appendChild(twoCol);

    return wrap;
  }

  // ============================================================
  // LEGAL & RISK
  // ============================================================
  function renderLegal(){
    const l = DATA.legal;
    const wrap = el(`<div></div>`);
    wrap.appendChild(domainHeader('Legal & Risk', 'ONE reads every contract against your standard playbook and tracks renewals.', 'amber'));

    const grid = el(`<div class="grid grid-3"></div>`);
    grid.appendChild(statCard('Active contracts', l.activeContracts, null, false, 'amber'));
    grid.appendChild(statCard('Flagged clauses', l.flaggedClauses, null, false, 'amber'));
    grid.appendChild(statCard('IP renewals due', l.ipRenewals, null, false, 'amber'));
    wrap.appendChild(grid);

    wrap.appendChild(el(`<div class="section-title">Contract review</div>`));
    const contCard = el(`<div class="list-card"></div>`);
    l.contractsReview.forEach(c => {
      contCard.appendChild(el(`
        <div class="list-row" style="align-items:flex-start;">
          <div class="list-icon" style="background:${c.severity==='high' ? 'var(--bad-tint)' : c.severity==='med' ? 'var(--warn-tint)' : 'var(--good-tint)'};margin-top:2px;">${icon('contract', c.severity==='high'?'var(--bad)':c.severity==='med'?'var(--warn)':'var(--good)', 16)}</div>
          <div class="list-main">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <div class="list-title">${c.name}</div>
              ${sevBadge(c.severity)}
            </div>
            <div class="list-sub">${c.type} — ${c.flag}</div>
          </div>
        </div>
      `));
    });
    wrap.appendChild(contCard);

    const twoCol = el(`<div class="two-col" style="margin-top:24px;"></div>`);
    const left = el(`<div></div>`);
    left.appendChild(el(`<div class="section-title">IP & trademarks</div>`));
    const ipCard = el(`<div class="list-card"></div>`);
    l.ip.forEach(i => {
      ipCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:var(--panel-3)">${icon('shield','var(--text-mid)',16)}</div>
          <div class="list-main"><div class="list-title">${i.mark}</div><div class="list-sub">${i.jurisdiction}</div></div>
          <div class="list-aux"><div class="list-value-sub">renews ${i.renews}</div></div>
        </div>
      `));
    });
    left.appendChild(ipCard);
    twoCol.appendChild(left);

    const right = el(`<div></div>`);
    right.appendChild(el(`<div class="section-title">Regulatory deadlines</div>`));
    const regCard = el(`<div class="list-card"></div>`);
    l.regulatory.forEach(r => {
      regCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:var(--panel-3)">${icon('flag','var(--text-mid)',16)}</div>
          <div class="list-main"><div class="list-title">${r.item}</div><div class="list-sub">${r.note}</div></div>
          <div class="list-aux"><div class="list-value-sub">due ${r.due}</div></div>
        </div>
      `));
    });
    right.appendChild(regCard);
    twoCol.appendChild(right);
    wrap.appendChild(twoCol);

    const assistantName = DATA.user.assistantName || 'ONE';
    wrap.appendChild(el(`<div class="section-title">Draft a legal document — ${DATA.legal.jurisdiction}</div>`));
    const draftIntro = el(`<div class="card" style="margin-bottom:14px;border-color:var(--hairline);">
      <div style="font-size:12.5px;color:var(--text-mid);line-height:1.6;">
        ${assistantName} drafts using your registered jurisdiction — <strong style="color:var(--text-hi);">${DATA.legal.jurisdiction}</strong> —
        as the governing law baseline. Drafts are a starting point only; ${assistantName} always recommends a qualified
        lawyer review anything before it's signed.
      </div>
    </div>`);
    wrap.appendChild(draftIntro);

    const tplGrid = el(`<div class="grid grid-3"></div>`);
    DATA.legal.documentTemplates.forEach(t => {
      const card = el(`
        <div class="card tight" style="cursor:pointer;" data-tpl="${t.id}">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div class="list-icon" style="background:var(--amber-tint);width:32px;height:32px;">${icon('contract','var(--amber)',15)}</div>
            <div style="font-weight:700;font-size:13px;">${t.name}</div>
          </div>
          <div style="font-size:11.5px;color:var(--text-low);line-height:1.4;margin-bottom:8px;">${t.desc}</div>
          <div style="font-size:10.5px;color:var(--amber);">${t.est}</div>
        </div>
      `);
      card.addEventListener('click', () => draftLegalDocument(t));
      tplGrid.appendChild(card);
    });
    wrap.appendChild(tplGrid);

    return wrap;
  }

  function draftLegalDocument(template){
    const assistantName = DATA.user.assistantName || 'ONE';
    const overlay = el(`
      <div style="position:fixed;inset:0;background:rgba(7,10,20,0.88);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;">
        <div style="background:var(--panel);border:1px solid var(--hairline-2);border-radius:20px;padding:28px;max-width:520px;width:100%;">
          <div style="display:flex;align-items:center;justify-content:between;gap:10px;margin-bottom:14px;">
            <div style="font-family:var(--font-head);font-size:17px;font-weight:700;flex:1;">Drafting: ${template.name}</div>
            <button class="response-close" id="draft-close" style="position:static;">${icon('close','currentColor',14)}</button>
          </div>
          <div id="draft-progress-text" style="font-size:12.5px;color:var(--text-mid);margin-bottom:14px;">
            Preparing a ${DATA.legal.jurisdiction}-law baseline draft…
          </div>
          <div class="progress-track" style="margin-bottom:18px;"><div id="draft-progress-fill" class="progress-fill" style="width:0%;background:var(--amber);"></div></div>
          <div id="draft-result" style="display:none;">
            <div style="background:var(--panel-2);border:1px solid var(--hairline-2);border-radius:10px;padding:14px;font-size:11.5px;
              color:var(--text-mid);line-height:1.7;max-height:220px;overflow-y:auto;font-family:var(--font-mono);">
              <strong style="color:var(--text-hi);">${template.name.toUpperCase()}</strong><br/>
              Governing law: ${DATA.legal.jurisdiction}<br/>
              Parties: [Your Company] and [Counterparty]<br/>
              Effective date: [Today's date]<br/><br/>
              1. Purpose — ${template.desc}.<br/>
              2. Term — effective until terminated per Section 6.<br/>
              3. Confidentiality / IP / Payment terms — per ${DATA.legal.jurisdiction} baseline statute.<br/>
              4. Governing law and jurisdiction — courts of ${DATA.legal.jurisdiction}.<br/>
              5. Signatures — [ ] [ ]<br/><br/>
              <em>— Draft preview only. Full text available in document. —</em>
            </div>
            <div style="font-size:10.5px;color:var(--text-low);margin-top:10px;">
              Not legal advice. Have a licensed attorney in ${DATA.legal.jurisdiction} review before use.
            </div>
            <button class="btn primary" style="width:100%;margin-top:14px;padding:10px;" id="draft-done-btn">Save to documents</button>
          </div>
        </div>
      </div>
    `);
    document.body.appendChild(overlay);
    overlay.querySelector('#draft-close').addEventListener('click', () => document.body.removeChild(overlay));

    const fill = overlay.querySelector('#draft-progress-fill');
    const text = overlay.querySelector('#draft-progress-text');
    const result = overlay.querySelector('#draft-result');
    let p = 0;
    const steps = ['Applying ' + DATA.legal.jurisdiction + ' baseline terms…', 'Inserting standard clauses…', 'Finalizing draft…'];
    const interval = setInterval(() => {
      p += 8;
      fill.style.width = Math.min(p,100) + '%';
      if(p > 30 && p < 60) text.textContent = steps[1];
      if(p >= 60) text.textContent = steps[2];
      if(p >= 100){
        clearInterval(interval);
        result.style.display = 'block';
        overlay.querySelector('#draft-done-btn').addEventListener('click', () => document.body.removeChild(overlay));
      }
    }, 110);
  }

  // ============================================================
  // AIG NETWORK
  // ============================================================
  function renderAIG(){
    const a = DATA.aig;
    const wrap = el(`<div></div>`);
    wrap.appendChild(domainHeader('AIG Wallet & Network', 'The same assistant that runs your business also runs your AIG network.', 'gold'));

    const grid = el(`<div class="grid grid-4"></div>`);
    const wCard = statCard('Wallet balance', fmtNum(a.walletBalance) + ' AIG', a.walletDeltaPct, false, 'gold');
    grid.appendChild(wCard);
    grid.appendChild(statCard('Network size', fmtNum(a.networkSize), null, false, 'gold', '+' + a.networkNewWeek + ' this week'));
    grid.appendChild(statCard('Commission MTD', fmtEUR(a.monthCommission), null, false, 'gold'));
    grid.appendChild(statCard('LT matures in', a.ltMatures + ' days', null, false, 'gold'));
    wrap.appendChild(grid);

    const twoCol = el(`<div class="two-col" style="margin-top:8px;"></div>`);

    const left = el(`<div></div>`);
    left.appendChild(el(`<div class="section-title">Where this month's commission came from</div>`));
    const srcCard = el(`<div class="card"></div>`);
    const maxSrc = Math.max(...a.commissionSources.map(s=>s.value));
    a.commissionSources.forEach(s => {
      srcCard.appendChild(el(`
        <div class="mini-bar-row">
          <div class="mini-bar-label">${s.label}</div>
          <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${(s.value/maxSrc)*100}%;background:var(--gold)"></div></div>
          <div class="mini-bar-value">${fmtEUR(s.value)}</div>
        </div>
      `));
    });
    left.appendChild(srcCard);

    left.appendChild(el(`<div class="section-title">WDM marketplace bookings</div>`));
    const wdmCard = el(`<div class="list-card"></div>`);
    a.wdmBookings.forEach(b => {
      wdmCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:var(--purple-tint)">${icon('store','var(--purple)',16)}</div>
          <div class="list-main">
            <div class="list-title">${b.name}</div>
            <div class="list-sub">${b.status}</div>
            <div class="progress-track"><div class="progress-fill" style="width:${(b.step/b.totalSteps)*100}%;background:var(--purple)"></div></div>
          </div>
          <div class="list-aux"><div class="list-value-sub">${b.step}/${b.totalSteps}</div></div>
        </div>
      `));
    });
    left.appendChild(wdmCard);
    twoCol.appendChild(left);

    const right = el(`<div></div>`);
    right.appendChild(el(`<div class="section-title">Plan allocation</div>`));
    const allocCard = el(`<div class="card"></div>`);
    allocCard.appendChild(el(`
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="flex:1;height:14px;border-radius:999px;overflow:hidden;display:flex;background:var(--panel-3)">
          <div style="width:${a.ltAllocation}%;background:var(--gold)"></div>
          <div style="width:${a.stAllocation}%;background:var(--teal)"></div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:12px;">
        <span style="color:var(--gold)">● Long-Term ${a.ltAllocation}%</span>
        <span style="color:var(--teal)">● Short-Term ${a.stAllocation}%</span>
      </div>
    `));
    right.appendChild(allocCard);

    right.appendChild(el(`<div class="section-title">Tag Markets trading</div>`));
    const tradeCard = el(`<div class="card"></div>`);
    tradeCard.appendChild(el(`
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="badge good">Position ${a.tradingStatus.position}</span>
        <span class="badge neutral">No risk alerts</span>
      </div>
      <div class="stat-foot" style="margin-top:8px;">Last checked ${a.tradingStatus.lastChecked}</div>
    `));
    right.appendChild(tradeCard);

    right.appendChild(el(`<div class="section-title">Compliance</div>`));
    const compCard = el(`<div class="card"></div>`);
    compCard.appendChild(el(`
      <div style="display:flex;justify-content:space-between;padding:6px 0;"><span style="color:var(--text-mid);font-size:12.5px;">KYC status</span><span class="badge good">${a.compliance.kycStatus}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;"><span style="color:var(--text-mid);font-size:12.5px;">Fund insurance</span><span class="badge gold">${a.compliance.insurance}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;"><span style="color:var(--text-mid);font-size:12.5px;">Next review</span><span style="font-size:12.5px;font-family:var(--font-mono);">${a.compliance.nextReview}</span></div>
    `));
    right.appendChild(compCard);

    twoCol.appendChild(right);
    wrap.appendChild(twoCol);

    return wrap;
  }

  // ============================================================
  // MEMORY & TRUST
  // ============================================================
  function renderMemory(){
    const wrap = el(`<div></div>`);
    wrap.appendChild(domainHeader('Memory & Trust', 'What ONE remembers, and exactly how much authority it has.', 'amber'));

    wrap.appendChild(el(`<div class="section-title">Autonomy by function</div>`));
    const rungs = [
      { area:'Calendar & travel', rung: 2, desc:'Acts automatically, logs everything' },
      { area:'Email & messages', rung: 2, desc:'Auto-replies to routine mail, escalates the rest' },
      { area:'Finance & payments', rung: 1, desc:'Suggests only — waits for your approval' },
      { area:'AIG wallet & trading', rung: 1, desc:'Suggests only — waits for your approval' },
      { area:'Contract review', rung: 2, desc:'Flags issues automatically, drafts redlines' },
      { area:'Hiring decisions', rung: 1, desc:'Drafts offers, never sends without sign-off' },
    ];
    const rungCard = el(`<div class="list-card"></div>`);
    rungs.forEach(r => {
      rungCard.appendChild(el(`
        <div class="list-row">
          <div class="list-main"><div class="list-title">${r.area}</div><div class="list-sub">${r.desc}</div></div>
          <div class="list-aux"><span class="badge ${r.rung >= 3 ? 'gold' : r.rung === 2 ? 'amber' : 'neutral'}">Rung ${r.rung}</span></div>
        </div>
      `));
    });
    wrap.appendChild(rungCard);

    wrap.appendChild(el(`<div class="section-title">Privacy & data</div>`));
    const grid = el(`<div class="grid grid-2"></div>`);
    [
      ['On-device processing', 'Sensitive reasoning, including wallet activity, happens locally first.'],
      ['European data sovereignty', 'Data stored and processed under EU law, never sold or modeled for ads.'],
      ['Private business vault', 'Negotiation notes, recordings and financial history are visible only to you.'],
      ['You own the relationship', 'Switch providers or wipe history at any time — nothing is held hostage.'],
    ].forEach(([t,d]) => {
      grid.appendChild(el(`<div class="card"><div style="font-weight:700;margin-bottom:6px;">${t}</div><div style="font-size:12.5px;color:var(--text-mid);line-height:1.5;">${d}</div></div>`));
    });
    wrap.appendChild(grid);

    return wrap;
  }

  // ---------------- shared domain header ----------------
  function domainHeader(title, sub, accent){
    const assistantName = DATA.user.assistantName || 'ONE';
    return el(`
      <div class="domain-header">
        <div>
          <div class="domain-title">${title}</div>
          <div class="domain-sub">${sub}</div>
        </div>
        <span class="domain-tag" style="background:var(--${accent}-tint);color:var(--${accent})">Live from ${assistantName}</span>
      </div>
    `);
  }

  // ============================================================
  // HEALTH & SAFETY
  // ============================================================
  function renderHealth(){
    const h = DATA.health;
    const assistantName = DATA.user.assistantName || 'ONE';
    const wrap = el(`<div></div>`);
    wrap.appendChild(domainHeader('Health & Safety', `${assistantName} watches your vitals through connected health apps and your smartwatch — quietly, and only for safety.`, 'amber'));

    const grid = el(`<div class="grid grid-4"></div>`);
    grid.appendChild(statCard('Heart rate', h.vitals.heartRate + ' bpm', null, false, 'amber'));
    const hrCard = grid.lastElementChild;
    hrCard.appendChild(el(`<div style="margin-top:6px">${sparkline(h.vitals.heartRateTrend, 'var(--amber)')}</div>`));
    grid.appendChild(statCard('Blood oxygen', h.vitals.spo2 + '%', null, false, 'amber'));
    grid.appendChild(statCard('Sleep last night', h.vitals.sleepHoursLastNight + ' hrs', null, false, 'amber'));
    grid.appendChild(statCard('Steps today', fmtNum(h.vitals.steps), null, false, 'amber', 'Goal ' + fmtNum(h.vitals.stepsGoal)));
    wrap.appendChild(grid);

    wrap.appendChild(el(`<div class="section-title">Connected sources</div>`));
    const connCard = el(`<div class="list-card"></div>`);
    connCard.appendChild(el(`
      <div class="list-row">
        <div class="list-icon" style="background:var(--good-tint)">${icon('heart','var(--good)',16)}</div>
        <div class="list-main"><div class="list-title">Google Health</div><div class="list-sub">Connected — syncing continuously</div></div>
        <div class="list-aux"><span class="badge good">Active</span></div>
      </div>
    `));
    connCard.appendChild(el(`
      <div class="list-row">
        <div class="list-icon" style="background:var(--good-tint)">${icon('watch','var(--good)',16)}</div>
        <div class="list-main"><div class="list-title">${h.connected.watchModel}</div><div class="list-sub">Smartwatch — connected</div></div>
        <div class="list-aux"><span class="badge good">Active</span></div>
      </div>
    `));
    wrap.appendChild(connCard);

    const twoCol = el(`<div class="two-col" style="margin-top:24px;"></div>`);
    const left = el(`<div></div>`);
    left.appendChild(el(`<div class="section-title">Emergency contacts</div>`));
    const contactCard = el(`<div class="list-card"></div>`);
    h.emergencyContacts.forEach(c => {
      contactCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:var(--panel-3)">${icon('people','var(--text-mid)',16)}</div>
          <div class="list-main"><div class="list-title">${c.name}</div><div class="list-sub">${c.relation} · ${c.phone}</div></div>
        </div>
      `));
    });
    left.appendChild(contactCard);

    left.appendChild(el(`<div class="section-title">Activity log</div>`));
    const logCard = el(`<div class="list-card"></div>`);
    h.log.forEach(l => {
      logCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:var(--panel-3)">${icon('clock','var(--text-mid)',16)}</div>
          <div class="list-main"><div class="list-title">${l.event}</div><div class="list-sub">${l.time}</div></div>
        </div>
      `));
    });
    left.appendChild(logCard);
    twoCol.appendChild(left);

    const right = el(`<div></div>`);
    right.appendChild(el(`<div class="section-title">Emergency response</div>`));
    const emCard = el(`<div class="card" style="border-color:var(--bad);"></div>`);
    emCard.appendChild(el(`
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        ${icon('siren','var(--bad)',22)}
        <div style="font-weight:700;font-size:13.5px;">If vitals reach a critical level</div>
      </div>
      <div style="font-size:12px;color:var(--text-mid);line-height:1.6;margin-bottom:14px;">
        ${assistantName} watches for signs of a life-threatening event — for example heart rate above
        <strong style="color:var(--text-hi);">${h.thresholds.heartRateHigh} bpm</strong>, below
        <strong style="color:var(--text-hi);">${h.thresholds.heartRateLow} bpm</strong>, or blood oxygen under
        <strong style="color:var(--text-hi);">${h.thresholds.spo2Low}%</strong>. If that happens, with your prior consent
        ${assistantName} can call for emergency help and share your live location automatically — even if you can't respond.
      </div>
      <button class="btn" id="health-sim-btn" style="width:100%;background:var(--bad-tint);color:#E8967B;border-color:var(--bad);padding:10px;">
        Simulate a critical event (demo)
      </button>
      <div style="font-size:10.5px;color:var(--text-low);margin-top:8px;text-align:center;">
        This is a safety demo only — no real call is placed.
      </div>
    `));
    right.appendChild(emCard);
    twoCol.appendChild(right);
    wrap.appendChild(twoCol);

    wrap.querySelector('#health-sim-btn').addEventListener('click', () => runEmergencyDemo(wrap));

    return wrap;
  }

  function runEmergencyDemo(container){
    const assistantName = DATA.user.assistantName || 'ONE';
    const overlay = el(`
      <div style="position:fixed;inset:0;background:rgba(7,10,20,0.88);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;">
        <div style="background:var(--panel);border:2px solid var(--bad);border-radius:20px;padding:32px;max-width:460px;width:100%;text-align:center;">
          <div id="em-icon" style="width:64px;height:64px;border-radius:50%;background:var(--bad-tint);margin:0 auto 16px auto;display:flex;align-items:center;justify-content:center;">
            ${icon('siren','var(--bad)',30)}
          </div>
          <div id="em-title" style="font-family:var(--font-head);font-size:19px;font-weight:700;margin-bottom:8px;">Critical vitals detected</div>
          <div id="em-sub" style="font-size:13px;color:var(--text-mid);line-height:1.6;margin-bottom:20px;">
            Heart rate spiked to 178 bpm with no movement detected. ${assistantName} is starting the emergency sequence.
          </div>
          <div id="em-steps" style="display:flex;flex-direction:column;gap:8px;text-align:left;margin-bottom:20px;"></div>
          <button class="btn ghost" id="em-cancel" style="width:100%;padding:10px;">I'm okay — cancel</button>
        </div>
      </div>
    `);
    document.body.appendChild(overlay);

    const steps = [
      'Checking for response… none detected',
      'Notifying Liisa Eklund (Spouse)',
      'Sharing live location with emergency contacts',
      'Connecting to local emergency services',
      'Emergency services notified — help is on the way',
    ];
    const stepsWrap = overlay.querySelector('#em-steps');
    let i = 0;
    let cancelled = false;
    const interval = setInterval(() => {
      if(cancelled) return;
      if(i >= steps.length){ clearInterval(interval); return; }
      stepsWrap.appendChild(el(`
        <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-hi);">
          ${icon('check','var(--good)',14)} ${steps[i]}
        </div>
      `));
      i++;
    }, 1100);

    overlay.querySelector('#em-cancel').addEventListener('click', () => {
      cancelled = true;
      clearInterval(interval);
      document.body.removeChild(overlay);
    });
  }

  // ============================================================
  // INVITE & GROW
  // ============================================================
  function renderInvite(){
    const n = DATA.network;
    const assistantName = DATA.user.assistantName || 'ONE';
    const wrap = el(`<div></div>`);
    wrap.appendChild(domainHeader('Invite & Grow', 'Share your link — anyone who joins is added to your AIG network automatically.', 'gold'));

    const grid = el(`<div class="grid grid-4"></div>`);
    grid.appendChild(statCard('Invites sent', n.invitesSent, null, false, 'gold'));
    grid.appendChild(statCard('Joined', n.invitesJoined, null, false, 'gold'));
    grid.appendChild(statCard('Free members', n.freeJoined, null, false, 'gold'));
    grid.appendChild(statCard('Paid members', n.paidJoined, null, false, 'gold'));
    wrap.appendChild(grid);

    wrap.appendChild(el(`<div class="section-title">Your invite link</div>`));
    const linkCard = el(`<div class="card"></div>`);
    linkCard.appendChild(el(`
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;background:var(--panel-2);border:1px solid var(--hairline-2);border-radius:10px;
          padding:11px 14px;font-family:var(--font-mono);font-size:13px;color:var(--gold);overflow-x:auto;white-space:nowrap;">
          ${n.inviteLink}
        </div>
        <button class="btn gold" id="invite-copy-btn">${icon('share','var(--ink)',13)} Copy link</button>
      </div>
      <div style="font-size:11.5px;color:var(--text-low);margin-top:10px;">
        Your code: <strong style="color:var(--text-hi);font-family:var(--font-mono);">${n.inviteCode}</strong> —
        anyone who registers with this link or code joins your network directly, as a free member by default.
      </div>
      <div id="invite-copy-hint" style="font-size:12px;color:var(--good);margin-top:8px;display:none;">Link copied to clipboard ✓</div>
    `));
    wrap.appendChild(linkCard);
    linkCard.querySelector('#invite-copy-btn').addEventListener('click', async () => {
      const hint = linkCard.querySelector('#invite-copy-hint');
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){
          await navigator.clipboard.writeText(n.inviteLink);
        }
        if(navigator.share){
          try{ await navigator.share({ title: assistantName, text: 'Join me on ' + assistantName, url: n.inviteLink }); }catch(e){}
        }
        hint.style.display = 'block';
        setTimeout(()=>{ hint.style.display='none'; }, 2200);
      }catch(e){
        hint.textContent = 'Could not copy automatically — long-press the link above to copy it.';
        hint.style.display = 'block';
        hint.style.color = 'var(--warn)';
      }
    });

    wrap.appendChild(el(`<div class="section-title">Recent invites</div>`));
    const inviteCard = el(`<div class="list-card"></div>`);
    const statusMap = {
      'joined-paid': ['gold','Joined · Paid'],
      'joined-free': ['neutral','Joined · Free'],
      'pending': ['warn','Pending'],
    };
    n.recentInvites.forEach(inv => {
      const [cls,label] = statusMap[inv.status];
      inviteCard.appendChild(el(`
        <div class="list-row">
          <div class="list-icon" style="background:var(--panel-3)">${icon('userPlus','var(--text-mid)',16)}</div>
          <div class="list-main"><div class="list-title">${inv.name}</div><div class="list-sub">${inv.when}</div></div>
          <div class="list-aux"><span class="badge ${cls}">${label}</span></div>
        </div>
      `));
    });
    wrap.appendChild(inviteCard);

    wrap.appendChild(el(`
      <div class="card" style="margin-top:20px;border-color:var(--gold);">
        <div style="font-weight:700;margin-bottom:6px;color:var(--gold);">How network enrollment works</div>
        <div style="font-size:12.5px;color:var(--text-mid);line-height:1.6;">
          Every person who registers — with or without an invite — is enrolled in the AIG network as a
          <strong style="color:var(--text-hi);">free member</strong> automatically. Free members get the full
          ${assistantName} assistant experience. If they later upgrade to a paid package, they remain permanently
          attached under your invite as part of your network, and you earn from their activity exactly as described
          in the AIG commission structure.
        </div>
      </div>
    `));

    return wrap;
  }

  // ============================================================
  // SETTINGS — assistant identity, language, membership toggle
  // ============================================================
  function renderSettings(){
    const assistantName = DATA.user.assistantName || 'ONE';
    const isPaid = DATA.membership.tier === 'paid';
    const wrap = el(`<div></div>`);
    wrap.appendChild(domainHeader('Settings', 'Your assistant\'s identity, language, and account.', 'amber'));

    wrap.appendChild(el(`<div class="section-title">Assistant identity</div>`));
    const idCard = el(`<div class="card"></div>`);
    idCard.appendChild(el(`
      <div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--hairline);">
          <span style="font-size:12.5px;color:var(--text-mid);">Name</span>
          <span style="font-size:12.5px;font-weight:700;">${assistantName}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--hairline);">
          <span style="font-size:12.5px;color:var(--text-mid);">Voice</span>
          <span style="font-size:12.5px;font-weight:700;text-transform:capitalize;">${(DATA.user.assistantGender||'female')} — ${DATA.user.assistantVoiceId||'aria'}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;">
          <span style="font-size:12.5px;color:var(--text-mid);">Jurisdiction for legal documents</span>
          <span style="font-size:12.5px;font-weight:700;">${DATA.legal.jurisdiction}</span>
        </div>
        <button class="btn primary" id="settings-redo-btn" style="width:100%;margin-top:16px;padding:10px;">Redo voice & identity setup</button>
      </div>
    `));
    wrap.appendChild(idCard);
    idCard.querySelector('#settings-redo-btn').addEventListener('click', () => {
      if(window.ONE_ONBOARDING_RESTART) window.ONE_ONBOARDING_RESTART();
    });

    wrap.appendChild(el(`<div class="section-title">Account & username</div>`));
    const acctCard = el(`<div class="card"></div>`);
    acctCard.appendChild(el(`
      <div>
        <div style="font-size:12.5px;color:var(--text-mid);margin-bottom:14px;line-height:1.5;">
          Your username is what's shown across the network — leaderboards, referrals, and commission
          records. Your real name stays private, used only for legal documents and compliance.
        </div>
        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;">Username</label>
        <div style="display:flex;gap:8px;margin-top:6px;">
          <input id="settings-username-input" type="text" value="${DATA.user.username || ''}" maxlength="20"
            style="flex:1;padding:10px 14px;background:var(--panel-2);border:1px solid var(--hairline-2);
            border-radius:9px;color:var(--text-hi);font-size:13.5px;" />
          <button class="btn primary" id="settings-username-save">Save</button>
        </div>
        <div id="settings-username-hint" style="font-size:11px;color:var(--text-low);margin-top:8px;min-height:14px;"></div>
      </div>
    `));
    wrap.appendChild(acctCard);

    const usernameInput = acctCard.querySelector('#settings-username-input');
    const usernameHint = acctCard.querySelector('#settings-username-hint');
    acctCard.querySelector('#settings-username-save').addEventListener('click', () => {
      const v = usernameInput.value.trim();
      if(!/^[a-z0-9_]{3,20}$/i.test(v)){
        usernameHint.textContent = 'Only letters, numbers, and underscores — 3 to 20 characters.';
        usernameHint.style.color = 'var(--bad)';
        return;
      }
      DATA.user.username = v;
      DATA.user.initials = v.slice(0,2).toUpperCase();
      usernameHint.textContent = 'Username updated.';
      usernameHint.style.color = 'var(--good)';
      renderShell();
    });

    wrap.appendChild(el(`<div class="section-title">Language & interpretation</div>`));
    const langCard = el(`<div class="card"></div>`);
    langCard.appendChild(el(`
      <div style="font-size:12.5px;color:var(--text-mid);margin-bottom:12px;line-height:1.5;">
        ${assistantName} can interpret between languages in real time during calls or meetings. Try a quick demo phrase below.
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
        ${Object.keys(DATA.phraseBook["good morning"]).map(code => {
          const lang = DATA.languages.find(l=>l.code===code);
          return `<button class="suggestion-chip lang-demo-chip" data-lang="${code}" style="background:var(--panel-2);">${lang?lang.label:code}</button>`;
        }).join('')}
      </div>
      <div id="lang-demo-output" style="background:var(--panel-2);border:1px solid var(--hairline-2);border-radius:10px;padding:12px 14px;font-size:13px;min-height:20px;">
        <span style="color:var(--text-low);">Select a language to translate: “Good morning, thank you for your time.”</span>
      </div>
    `));
    wrap.appendChild(langCard);
    langCard.querySelectorAll('.lang-demo-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const code = chip.dataset.lang;
        const out = langCard.querySelector('#lang-demo-output');
        const greet = DATA.phraseBook["good morning"][code];
        const thanks = DATA.phraseBook["thank you for your time"][code];
        out.innerHTML = `<span style="color:var(--amber);font-weight:600;">${greet}, ${thanks}.</span>`;
      });
    });

    wrap.appendChild(el(`<div class="section-title">Membership (demo control)</div>`));
    const memCard = el(`<div class="card" style="border-color:${isPaid?'var(--gold)':'var(--hairline)'}"></div>`);
    memCard.appendChild(el(`
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-weight:700;font-size:13.5px;">Current tier: <span style="color:${isPaid?'var(--gold)':'var(--text-hi)'}">${isPaid?'Paid':'Free'}</span></div>
          <div style="font-size:11.5px;color:var(--text-low);margin-top:2px;">${DATA.membership.paidPriceNote}</div>
        </div>
        <button class="btn ${isPaid?'ghost':'gold'}" id="settings-toggle-tier">${isPaid ? 'Downgrade to free' : 'Simulate upgrade'}</button>
      </div>
    `));
    wrap.appendChild(memCard);
    memCard.querySelector('#settings-toggle-tier').addEventListener('click', () => {
      DATA.membership.tier = isPaid ? 'free' : 'paid';
      state.domain = 'settings';
      renderShell();
    });

    return wrap;
  }

  // ============================================================
  // UPGRADE PROMPT
  // ============================================================
  function renderUpgrade(){
    const assistantName = DATA.user.assistantName || 'ONE';
    const wrap = el(`<div></div>`);
    wrap.appendChild(el(`
      <div style="max-width:640px;margin:30px auto;text-align:center;">
        <div style="width:64px;height:64px;border-radius:50%;background:var(--gold-tint);margin:0 auto 18px auto;
          display:flex;align-items:center;justify-content:center;">${icon('lockOpen','var(--gold)',30)}</div>
        <div style="font-family:var(--font-head);font-size:24px;font-weight:700;margin-bottom:10px;">This is a paid AIG feature</div>
        <div style="font-size:13.5px;color:var(--text-mid);line-height:1.6;margin-bottom:24px;">
          Free members get the full ${assistantName} personal assistant — calendar, mail, health, voice, and invites.
          Paid AIG membership additionally unlocks Finance, Sales, Operations, People, Legal, and the AIG Wallet & Network
          dashboards you just tried to open.
        </div>
        <div class="card" style="text-align:left;margin-bottom:20px;">
          <div style="font-weight:700;margin-bottom:10px;">${DATA.membership.paidPriceNote}</div>
          ${['Full business intelligence across Finance, Sales, Ops, People, Legal','AIG token wallet, Tag Markets trading, WDM marketplace access',"Earn commissions from your network's activity"]
            .map(t => `<div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;font-size:12.5px;color:var(--text-mid);">${icon('check','var(--good)',14)} ${t}</div>`).join('')}
        </div>
        <button class="btn gold" id="upgrade-sim-btn" style="padding:12px 22px;font-size:13.5px;">Simulate upgrade to paid (demo)</button>
        <div style="margin-top:14px;">
          <button class="btn ghost" id="upgrade-back-btn" style="padding:8px 16px;font-size:12px;">Back to briefing</button>
        </div>
      </div>
    `));
    wrap.querySelector('#upgrade-sim-btn').addEventListener('click', () => {
      DATA.membership.tier = 'paid';
      state.domain = 'aig';
      renderShell();
    });
    wrap.querySelector('#upgrade-back-btn').addEventListener('click', () => {
      state.domain = 'home';
      renderShell();
    });
    return wrap;
  }

  // ---------------- init ----------------
  window.addEventListener('resize', () => {
    const toggle = document.querySelector('.mobile-nav-toggle');
    if(toggle) toggle.style.display = window.innerWidth <= 860 ? 'flex' : 'none';
  });

  function boot(){ renderShell(); }
  document.addEventListener('one:onboarding-complete', boot);
  window.ONE_ONBOARDING_RESTART = function(){
    if(window.ONE_ONBOARDING) window.ONE_ONBOARDING.restart();
  };
  // Fallback: if onboarding script didn't run (e.g. loaded standalone), boot immediately.
  if(!window.ONE_ONBOARDING) boot();
})();
