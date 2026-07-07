// ============================================================
// AIG MoneyGames — main app.
// ============================================================

(function () {
  "use strict";

  const G = window.AIGGames;
  const A = window.AIGMGAuth;

  const state = { currentUser: null, bjState: null, rouletteSelection: null };
  const el = {};
  [
    "authShell", "appShell", "authError", "loginPanel", "registerPanel",
    "navLobbyBtn", "navLeaderboardBtn", "balanceDisplay", "signOutBtn", "globalNotice",
    "lobbyView", "lobbyBalance", "lobbyNetChange", "monthLabel",
    "slotsView", "reel0", "reel1", "reel2", "slotsResult", "slotsBetAmount", "slotsBetDown", "slotsBetUp", "slotsSpinBtn", "slotsPaytable", "slotsRtpLink",
    "blackjackView", "dealerCards", "dealerTotal", "playerCards", "playerTotal", "bjResult", "bjBetRow", "bjBetAmount", "bjDealBtn", "bjActionsRow", "bjHitBtn", "bjStandBtn", "bjDoubleBtn",
    "rouletteView", "rouletteResultArea", "rouletteGrid", "rouletteOutsideBets", "rouletteBetAmount", "rouletteSpinBtn", "rouletteSelectionLabel",
    "leaderboardView", "leaderboardPanel"
  ].forEach(id => { el[id] = document.getElementById(id); });

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function showNotice(html) { el.globalNotice.innerHTML = html; el.globalNotice.classList.add("show"); }
  function fmt(n) { return n.toLocaleString(); }

  // ============================================================
  // Auth wiring
  // ============================================================
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach(t => t.classList.toggle("active", t === tab));
      const target = tab.getAttribute("data-tab");
      el.loginPanel.classList.toggle("active", target === "login");
      el.registerPanel.classList.toggle("active", target === "register");
    });
  });
  document.querySelectorAll("[data-switch]").forEach(btn => {
    btn.addEventListener("click", () => document.querySelector(`.auth-tab[data-tab="${btn.getAttribute("data-switch")}"]`).click());
  });

  function showAuthError(msg) { el.authError.textContent = msg; el.authError.classList.add("show"); }
  function clearAuthError() { el.authError.classList.remove("show"); }

  el.loginPanel.addEventListener("submit", async e => {
    e.preventDefault();
    clearAuthError();
    try {
      await A.login({ email: document.getElementById("loginEmail").value, password: document.getElementById("loginPassword").value });
      boot();
    } catch (err) { showAuthError(err.message); }
  });

  el.registerPanel.addEventListener("submit", async e => {
    e.preventDefault();
    clearAuthError();
    try {
      await A.register({
        nickname: document.getElementById("registerNickname").value,
        email: document.getElementById("registerEmail").value,
        password: document.getElementById("registerPassword").value
      });
      boot();
    } catch (err) { showAuthError(err.message); }
  });

  el.signOutBtn.addEventListener("click", () => { A.logout(); location.reload(); });

  // ============================================================
  // View switching
  // ============================================================
  function showView(name) {
    ["lobbyView", "slotsView", "blackjackView", "rouletteView", "leaderboardView"].forEach(v => {
      el[v].style.display = v === name ? "block" : "none";
    });
    if (name === "lobbyView") renderLobby();
    if (name === "leaderboardView") renderLeaderboard("monthly");
  }
  el.navLobbyBtn.addEventListener("click", () => showView("lobbyView"));
  el.navLeaderboardBtn.addEventListener("click", () => showView("leaderboardView"));
  document.querySelectorAll("[data-back]").forEach(btn => btn.addEventListener("click", () => showView("lobbyView")));
  document.querySelectorAll(".game-card").forEach(card => {
    card.addEventListener("click", () => {
      const game = card.getAttribute("data-game");
      if (game === "slots") { showView("slotsView"); renderSlotsPaytable(); }
      else if (game === "blackjack") { showView("blackjackView"); resetBlackjackUI(); }
      else if (game === "roulette") { showView("rouletteView"); renderRouletteBoard(); }
    });
  });

  function refreshBalanceDisplay() {
    const user = A.getCurrentUser();
    state.currentUser = user;
    el.balanceDisplay.textContent = fmt(user.balance);
  }

  function renderLobby() {
    refreshBalanceDisplay();
    const user = state.currentUser;
    el.lobbyBalance.textContent = fmt(user.balance);
    const net = user.balance - A.MONTHLY_GRANT;
    el.lobbyNetChange.textContent = (net >= 0 ? "+" : "") + fmt(net) + " \ud83e\ude99";
    el.lobbyNetChange.style.color = net >= 0 ? "var(--green)" : "var(--red-bright)";
    el.monthLabel.textContent = "Month: " + A.currentMonthKey();
  }

  // ============================================================
  // Bet helpers — every game shares the same guard: never bet more
  // than the current balance, never allow a non-positive bet.
  // ============================================================
  function validateBet(amount) {
    if (!Number.isFinite(amount) || amount <= 0) { showNotice("<b>Enter a valid bet amount.</b>"); return false; }
    if (amount > state.currentUser.balance) { showNotice("<b>You can't bet more than your current balance.</b>"); return false; }
    return true;
  }
  function applyBalanceChange(delta) {
    const user = A.getCurrentUser();
    const newBalance = user.balance + delta;
    A.updateBalance(user.email, newBalance);
    refreshBalanceDisplay();
  }

  // ============================================================
  // SLOTS
  // ============================================================
  function renderSlotsPaytable() {
    const rtp = G.computeSlotsRTP();
    el.slotsPaytable.innerHTML = `
      <div class="paytable-row"><span>Three matching \ud83c\udf52</span><span>${G.SLOTS_PAYTABLE.cherry}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Three matching \ud83c\udf4b</span><span>${G.SLOTS_PAYTABLE.lemon}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Three matching \ud83d\udd14</span><span>${G.SLOTS_PAYTABLE.bell}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Three matching \u2b50</span><span>${G.SLOTS_PAYTABLE.star}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Three matching 7\ufe0f\u20e3</span><span>${G.SLOTS_PAYTABLE.seven}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Three matching \ud83d\udc8e</span><span>${G.SLOTS_PAYTABLE.diamond}\u00d7 bet</span></div>
      <div class="paytable-row"><span>Any two \ud83c\udf52 (cherry pair)</span><span>${G.CHERRY_PAIR_PAYOUT}\u00d7 bet</span></div>
      <div class="paytable-row" style="color:var(--text-faint);"><span>Theoretical return-to-player</span><span>${(rtp * 100).toFixed(1)}%</span></div>`;
  }
  el.slotsRtpLink.addEventListener("click", e => {
    e.preventDefault();
    alert("RTP (return-to-player) is the % of all money wagered that's paid back out on average, computed exactly from the disclosed paytable above — not a marketing number. " + (G.computeSlotsRTP() * 100).toFixed(2) + "% here means the house edge is " + (100 - G.computeSlotsRTP() * 100).toFixed(2) + "%, same ballpark as a real slot machine, and it never changes based on how long you've played or how much you've won or lost.");
  });

  el.slotsBetDown.addEventListener("click", () => { el.slotsBetAmount.value = Math.max(10, parseInt(el.slotsBetAmount.value || 10, 10) - 10); });
  el.slotsBetUp.addEventListener("click", () => { el.slotsBetAmount.value = parseInt(el.slotsBetAmount.value || 10, 10) + 10; });

  let slotsSpinning = false;
  el.slotsSpinBtn.addEventListener("click", async () => {
    if (slotsSpinning) return;
    const bet = parseInt(el.slotsBetAmount.value, 10);
    if (!validateBet(bet)) return;

    slotsSpinning = true;
    el.slotsSpinBtn.disabled = true;
    [el.reel0, el.reel1, el.reel2].forEach(r => r.classList.add("spinning"));
    el.slotsResult.textContent = "";

    const result = G.spinSlots(bet);
    await new Promise(r => setTimeout(r, 700)); // brief spin animation, not a manipulated delay tied to outcome

    [el.reel0, el.reel1, el.reel2].forEach(r => r.classList.remove("spinning"));
    el.reel0.textContent = result.reels[0].label;
    el.reel1.textContent = result.reels[1].label;
    el.reel2.textContent = result.reels[2].label;

    applyBalanceChange(result.netChange);

    if (result.isWin) {
      el.slotsResult.className = "slots-result win";
      el.slotsResult.textContent = (result.winType === "triple" ? "Triple match! " : "Cherry pair! ") + "+" + fmt(result.payout) + " \ud83e\ude99";
    } else {
      el.slotsResult.className = "slots-result lose";
      el.slotsResult.textContent = "No match this time.";
    }

    slotsSpinning = false;
    el.slotsSpinBtn.disabled = false;
  });

  // ============================================================
  // BLACKJACK
  // ============================================================
  function resetBlackjackUI() {
    state.bjState = null;
    el.dealerCards.innerHTML = ""; el.playerCards.innerHTML = "";
    el.dealerTotal.textContent = ""; el.playerTotal.textContent = "";
    el.bjResult.textContent = "";
    el.bjBetRow.style.display = "flex";
    el.bjActionsRow.style.display = "none";
  }

  function cardHtml(card, hidden) {
    if (hidden) return `<div class="bj-card hidden">??</div>`;
    const isRed = card.suit === "\u2665" || card.suit === "\u2666";
    return `<div class="bj-card ${isRed ? "red" : ""}">${card.rank}${card.suit}</div>`;
  }
  function renderBjHands(revealDealer) {
    const bj = state.bjState;
    el.dealerCards.innerHTML = bj.dealer.map((c, i) => cardHtml(c, i === 1 && !revealDealer)).join("");
    el.playerCards.innerHTML = bj.player.map(c => cardHtml(c)).join("");
    const pv = G.handValue(bj.player);
    el.playerTotal.textContent = pv.total + (pv.isSoft ? " (soft)" : "") + (pv.isBust ? " \u2014 bust" : "");
    if (revealDealer) {
      const dv = G.handValue(bj.dealer);
      el.dealerTotal.textContent = dv.total + (dv.isBust ? " \u2014 bust" : "");
    } else {
      el.dealerTotal.textContent = "?";
    }
  }

  el.bjDealBtn.addEventListener("click", () => {
    const bet = parseInt(el.bjBetAmount.value, 10);
    if (!validateBet(bet)) return;
    const shoe = G.freshShoe(1);
    state.bjState = { shoe, player: [shoe.pop(), shoe.pop()], dealer: [shoe.pop(), shoe.pop()], bet, doubled: false, resolved: false };
    el.bjResult.textContent = "";
    renderBjHands(false);

    const pv = G.handValue(state.bjState.player);
    if (pv.isBlackjack) { resolveBlackjack(); return; }

    el.bjBetRow.style.display = "none";
    el.bjActionsRow.style.display = "flex";
  });

  el.bjHitBtn.addEventListener("click", () => {
    const bj = state.bjState;
    bj.player.push(bj.shoe.pop());
    renderBjHands(false);
    const pv = G.handValue(bj.player);
    if (pv.isBust) resolveBlackjack();
  });

  el.bjDoubleBtn.addEventListener("click", () => {
    const bj = state.bjState;
    if (bj.bet > state.currentUser.balance) { showNotice("<b>Not enough balance to double.</b>"); return; }
    bj.doubled = true;
    bj.player.push(bj.shoe.pop());
    renderBjHands(false);
    const pv = G.handValue(bj.player);
    if (pv.isBust) resolveBlackjack();
    else resolveBlackjack(); // double = one card then must stand
  });

  el.bjStandBtn.addEventListener("click", () => resolveBlackjack());

  function resolveBlackjack() {
    const bj = state.bjState;
    if (bj.resolved) return;
    bj.resolved = true;

    let playerValue = G.handValue(bj.player);
    if (!playerValue.isBust) {
      while (G.dealerShouldHit(bj.dealer)) bj.dealer.push(bj.shoe.pop());
    }
    renderBjHands(true);

    const dealerValue = G.handValue(bj.dealer);
    const effectiveBet = bj.doubled ? bj.bet * 2 : bj.bet;
    let netChange, message, cls;

    if (playerValue.isBust) { netChange = -effectiveBet; message = "Bust \u2014 you lose."; cls = "lose"; }
    else if (playerValue.isBlackjack && !dealerValue.isBlackjack) { netChange = Math.round(bj.bet * 1.5); message = "Blackjack! +" + fmt(netChange) + " \ud83e\ude99 (pays 3:2)"; cls = "win"; }
    else if (dealerValue.isBust) { netChange = effectiveBet; message = "Dealer busts \u2014 you win! +" + fmt(netChange) + " \ud83e\ude99"; cls = "win"; }
    else if (playerValue.total > dealerValue.total) { netChange = effectiveBet; message = "You win! +" + fmt(netChange) + " \ud83e\ude99"; cls = "win"; }
    else if (playerValue.total < dealerValue.total) { netChange = -effectiveBet; message = "Dealer wins."; cls = "lose"; }
    else { netChange = 0; message = "Push \u2014 bet returned."; cls = "lose"; }

    applyBalanceChange(netChange);
    el.bjResult.className = "slots-result " + cls;
    el.bjResult.textContent = message;
    el.bjActionsRow.style.display = "none";
    el.bjBetRow.style.display = "flex";
  }

  // ============================================================
  // ROULETTE
  // ============================================================
  function renderRouletteBoard() {
    state.rouletteSelection = null;
    el.rouletteResultArea.innerHTML = "";
    el.rouletteSelectionLabel.textContent = "Pick a bet above";

    let numsHtml = `<div class="roulette-num green" data-bet-type="straight" data-bet-value="0">0</div>`;
    for (let n = 1; n <= 36; n++) {
      numsHtml += `<div class="roulette-num ${G.rouletteColor(n)}" data-bet-type="straight" data-bet-value="${n}">${n}</div>`;
    }
    el.rouletteGrid.innerHTML = numsHtml;

    el.rouletteOutsideBets.innerHTML = `
      <button data-bet-type="red" data-bet-value="">Red (1:1)</button>
      <button data-bet-type="black" data-bet-value="">Black (1:1)</button>
      <button data-bet-type="odd" data-bet-value="">Odd (1:1)</button>
      <button data-bet-type="even" data-bet-value="">Even (1:1)</button>
      <button data-bet-type="low" data-bet-value="">1-18 (1:1)</button>
      <button data-bet-type="high" data-bet-value="">19-36 (1:1)</button>
      <button data-bet-type="dozen" data-bet-value="1">1st 12 (2:1)</button>
      <button data-bet-type="dozen" data-bet-value="2">2nd 12 (2:1)</button>
      <button data-bet-type="dozen" data-bet-value="3">3rd 12 (2:1)</button>`;

    document.querySelectorAll("#rouletteGrid .roulette-num, #rouletteOutsideBets button").forEach(el2 => {
      el2.addEventListener("click", () => {
        document.querySelectorAll("#rouletteGrid .roulette-num, #rouletteOutsideBets button").forEach(x => x.classList.remove("selected"));
        el2.classList.add("selected");
        const betType = el2.getAttribute("data-bet-type");
        const betValueRaw = el2.getAttribute("data-bet-value");
        const betValue = betValueRaw ? parseInt(betValueRaw, 10) : null;
        state.rouletteSelection = { betType, betValue };
        const multiplier = G.ROULETTE_PAYOUTS[betType];
        el.rouletteSelectionLabel.textContent = "Betting on: " + betType + (betValueRaw ? " " + betValueRaw : "") + " (pays " + multiplier + ":1)";
      });
    });
  }

  el.rouletteSpinBtn.addEventListener("click", async () => {
    if (!state.rouletteSelection) { showNotice("<b>Pick a bet first.</b>"); return; }
    const bet = parseInt(el.rouletteBetAmount.value, 10);
    if (!validateBet(bet)) return;

    el.rouletteSpinBtn.disabled = true;
    el.rouletteResultArea.innerHTML = `<div style="color:var(--text-faint);">Spinning\u2026</div>`;
    const winningNumber = G.spinRoulette();
    await new Promise(r => setTimeout(r, 600));

    const { betType, betValue } = state.rouletteSelection;
    const evalResult = G.evaluateRouletteBet(betType, betValue, winningNumber);
    const netChange = evalResult.won ? bet * evalResult.payoutMultiplier : -bet;
    applyBalanceChange(netChange);

    const color = G.rouletteColor(winningNumber);
    const bg = color === "red" ? "#b5473a" : color === "black" ? "#2a2d33" : "#2e7d5b";
    el.rouletteResultArea.innerHTML = `
      <div class="roulette-ball-display" style="background:${bg};">${winningNumber}</div>
      <div style="margin-top:10px; font-weight:700; color:${evalResult.won ? "var(--green)" : "var(--red-bright)"};">
        ${evalResult.won ? "You won! +" + fmt(netChange) + " \ud83e\ude99" : "No win this spin \u2014 " + fmt(bet) + " \ud83e\ude99 lost"}
      </div>`;
    el.rouletteSpinBtn.disabled = false;
  });

  // ============================================================
  // LEADERBOARDS
  // ============================================================
  document.querySelectorAll(".lb-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".lb-tab").forEach(t => t.classList.toggle("active", t === tab));
      renderLeaderboard(tab.getAttribute("data-lb"));
    });
  });

  function renderLeaderboard(type) {
    const rows = type === "monthly" ? A.monthlyLeaderboard() : A.yearlyLeaderboard();
    const myNickname = state.currentUser.nickname;
    if (!rows.length) {
      el.leaderboardPanel.innerHTML = `<div style="text-align:center; color:var(--text-faint); padding:30px 0;">No players yet this ${type === "monthly" ? "month" : "year"}.</div>`;
      return;
    }
    el.leaderboardPanel.innerHTML = rows.map((r, i) => {
      const score = type === "monthly" ? r.netChange : r.total;
      const isMe = r.nickname === myNickname;
      return `
        <div class="lb-row ${isMe ? "lb-you" : ""}">
          <span class="lb-rank ${i < 3 ? "top3" : ""}">#${i + 1}</span>
          <span class="lb-nickname">${escapeHtml(r.nickname)}${isMe ? " (you)" : ""}</span>
          <span class="lb-score ${score >= 0 ? "positive" : "negative"}">${score >= 0 ? "+" : ""}${fmt(score)} \ud83e\ude99</span>
        </div>`;
    }).join("");
  }

  // ============================================================
  // Boot
  // ============================================================
  function boot() {
    const user = A.getCurrentUser();
    if (!user) { el.authShell.style.display = "flex"; el.appShell.style.display = "none"; return; }
    state.currentUser = user;
    el.authShell.style.display = "none";
    el.appShell.style.display = "block";
    refreshBalanceDisplay();
    showView("lobbyView");
  }

  boot();
})();
