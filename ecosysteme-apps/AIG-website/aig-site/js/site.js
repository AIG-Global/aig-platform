// ============================================================
// AIG site — shared behavior across all pages.
// No backend; account/balance state is mocked via localStorage
// purely so the dashboard pages feel real when clicked through.
// ============================================================
(function () {
  "use strict";

  // ---------- Mobile nav ----------
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("nav-links-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // ---------- Scroll reveal (progressive enhancement only) ----------
  // Content is visible by default (.reveal has opacity:1 in CSS).
  // We only ADD a fade-in animation on top, and guarantee visibility
  // no matter what — a stuck observer, slow scroll, or programmatic
  // navigation can never leave content hidden.
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    revealEls.forEach(function (el) { el.classList.add("reveal-armed"); });
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { obs.observe(el); });

    // Hard fallback: whatever hasn't revealed itself in 2.5s, reveal anyway.
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }, 2500);
  }

  // ---------- Mock account state (store credit, not investment) ----------
  var STORAGE_KEY = "aig_account_state_v1";

  function defaultAccount() {
    return {
      name: "Markus Lindholm",
      email: "markus@example.com",
      balanceCents: 184000, // €1,840.00 account balance — plain store credit
      orders: [
        { id: "WDM-10239", item: "Private jet charter — Nice to Geneva", status: "Confirmed", amountCents: 920000, date: "2026-06-18" },
        { id: "WDM-10184", item: "Annual concierge membership", status: "Active", amountCents: 240000, date: "2026-05-02" }
      ],
      ledger: [
        { label: "Account top-up", deltaCents: 200000, date: "2026-06-01" },
        { label: "Annual concierge membership", deltaCents: -240000, date: "2026-05-02" },
        { label: "Account top-up", deltaCents: 300000, date: "2026-04-15" }
      ]
    };
  }

  window.AIG = window.AIG || {};

  window.AIG.getAccount = function () {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        var fresh = defaultAccount();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        return fresh;
      }
      return JSON.parse(raw);
    } catch (e) {
      return defaultAccount();
    }
  };

  window.AIG.saveAccount = function (account) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    } catch (e) { /* ignore */ }
  };

  window.AIG.resetAccount = function () {
    var fresh = defaultAccount();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  };

  window.AIG.formatEUR = function (cents) {
    var value = cents / 100;
    var sign = value < 0 ? "-" : "";
    return sign + "€" + Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  window.AIG.formatDate = function (isoDate) {
    var d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };
})();
