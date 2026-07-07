// ============================================================
// AIG HELO — GPS-based emergency number finder and embassy locator.
//
// Location flow: browser Geolocation API -> BigDataCloud's free,
// keyless, client-side reverse-geocoding endpoint (built specifically
// for direct browser calls, no API key, no CORS proxy needed) -> country
// code -> look up curated emergency numbers for that country.
//
// If GPS is denied/unavailable, or the country isn't in the curated
// list, the person can always set their country manually — this app
// never silently fails without offering a next step.
// ============================================================

(function () {
  "use strict";

  const { EMERGENCY_NUMBERS, EMBASSY_FINDERS, EMERGENCY_NUMBERS_REFERENCE_URL, findEmergencyNumbers, findEmbassyFinder, buildEmbassySearchFallbackUrl, ALL_COUNTRIES } = window.AIGHelpData;

  const state = {
    currentCountryCode: null,
    currentCountryName: null,
    lastKnownCoords: null,
    homeCountryCode: localStorage.getItem("aighelp_home_country") || ""
  };

  const el = {
    noticeBanner: document.getElementById("noticeBanner"),
    currentCountryName: document.getElementById("currentCountryName"),
    currentLocationDetail: document.getElementById("currentLocationDetail"),
    retryGpsBtn: document.getElementById("retryGpsBtn"),
    refreshLocationBtn: document.getElementById("refreshLocationBtn"),
    manualCountryToggleBtn: document.getElementById("manualCountryToggleBtn"),
    countrySelectRow: document.getElementById("countrySelectRow"),
    manualCountrySelect: document.getElementById("manualCountrySelect"),
    emergencyGrid: document.getElementById("emergencyGrid"),
    shareLocationBtn: document.getElementById("shareLocationBtn"),
    copyFeedback: document.getElementById("copyFeedback"),
    referenceLink: document.getElementById("referenceLink"),
    homeCountrySelect: document.getElementById("homeCountrySelect"),
    embassyLinkArea: document.getElementById("embassyLinkArea"),
    nationalityUnsetRow: document.getElementById("nationalityUnsetRow"),
    nationalitySetRow: document.getElementById("nationalitySetRow"),
    nationalityName: document.getElementById("nationalityName"),
    changeNationalityBtn: document.getElementById("changeNationalityBtn"),
    onboardModal: document.getElementById("onboardModal"),
    onboardNationalitySelect: document.getElementById("onboardNationalitySelect"),
    onboardContinueBtn: document.getElementById("onboardContinueBtn"),
    onboardSkipBtn: document.getElementById("onboardSkipBtn")
  };

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function showNotice(html) { el.noticeBanner.innerHTML = html; el.noticeBanner.classList.add("show"); }
  function clearNotice() { el.noticeBanner.classList.remove("show"); }

  el.referenceLink.href = EMERGENCY_NUMBERS_REFERENCE_URL;

  // ============================================================
  // Populate dropdowns
  // ============================================================
  function populateCountryDropdown(selectEl, includeBlankLabel) {
    const options = ALL_COUNTRIES.slice().sort((a, b) => a[1].localeCompare(b[1]));
    selectEl.innerHTML = (includeBlankLabel ? `<option value="">${escapeHtml(includeBlankLabel)}</option>` : "")
      + options.map(([code, name]) => `<option value="${code}">${escapeHtml(name)}</option>`).join("");
  }
  populateCountryDropdown(el.manualCountrySelect, "Select a country\u2026");
  populateCountryDropdown(el.homeCountrySelect, "Your nationality\u2026");
  populateCountryDropdown(el.onboardNationalitySelect, "Select your country\u2026");
  if (state.homeCountryCode) el.homeCountrySelect.value = state.homeCountryCode;

  // ============================================================
  // Nationality onboarding — asked up front, but never required.
  // Shown once, on first visit (no nationality saved yet). Skipping
  // is always available and one tap away, since someone opening this
  // app already in a stressful situation needs the emergency numbers
  // immediately, not a setup flow standing between them and a phone
  // number.
  // ============================================================
  function setNationality(code) {
    state.homeCountryCode = code;
    localStorage.setItem("aighelp_home_country", code);
    el.homeCountrySelect.value = code;
    updateNationalityDisplay();
    renderEmbassyLink();
  }

  function updateNationalityDisplay() {
    if (state.homeCountryCode) {
      const name = ALL_COUNTRIES.find(c => c[0] === state.homeCountryCode);
      el.nationalityUnsetRow.style.display = "none";
      el.nationalitySetRow.style.display = "block";
      el.nationalityName.textContent = name ? name[1] : state.homeCountryCode;
    } else {
      el.nationalityUnsetRow.style.display = "block";
      el.nationalitySetRow.style.display = "none";
    }
  }

  function openOnboarding() { el.onboardModal.classList.add("show"); }
  function closeOnboarding() { el.onboardModal.classList.remove("show"); }

  el.onboardContinueBtn.addEventListener("click", () => {
    const code = el.onboardNationalitySelect.value;
    if (!code) { el.onboardNationalitySelect.focus(); return; }
    setNationality(code);
    closeOnboarding();
  });
  el.onboardSkipBtn.addEventListener("click", closeOnboarding);
  el.changeNationalityBtn.addEventListener("click", () => {
    el.onboardNationalitySelect.value = state.homeCountryCode || "";
    openOnboarding();
  });

  if (!state.homeCountryCode) openOnboarding();
  updateNationalityDisplay();

  // ============================================================
  // Location detection
  // ============================================================
  async function detectLocation() {
    clearNotice();
    el.currentCountryName.textContent = "Detecting your location\u2026";
    el.currentLocationDetail.textContent = "\u2014";

    if (!navigator.geolocation) {
      handleLocationFailure("Your browser doesn't support GPS location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        state.lastKnownCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        try {
          const country = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          setCurrentCountry(country.code, country.name, "GPS \u00b7 " + pos.coords.latitude.toFixed(3) + ", " + pos.coords.longitude.toFixed(3));
        } catch (e) {
          handleLocationFailure("Got your GPS position, but couldn't resolve it to a country: " + e.message);
        }
      },
      err => {
        const msg = err.code === 1 ? "Location permission was denied."
          : err.code === 2 ? "Your device couldn't determine a location right now."
          : "Location request timed out.";
        handleLocationFailure(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  async function reverseGeocode(lat, lon) {
    const url = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat + "&longitude=" + lon + "&localityLanguage=en";
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data.countryCode) throw new Error("No country returned for these coordinates.");
    return { code: data.countryCode, name: data.countryName || data.countryCode };
  }

  function handleLocationFailure(message) {
    const cached = loadCachedCountry();
    if (cached) {
      setCurrentCountry(cached.code, cached.name, "Last known location (offline/cached)");
      showNotice("<b>Couldn't refresh your location.</b> " + escapeHtml(message) + " Showing your last known country \u2014 use \u201cSet country manually\u201d if you've since traveled.");
    } else {
      el.currentCountryName.textContent = "Location unavailable";
      el.currentLocationDetail.textContent = message;
      showNotice("<b>Couldn't detect your location.</b> " + escapeHtml(message) + " Use \u201cSet country manually\u201d below to pick your country directly.");
      renderEmergencyNumbers(null);
    }
  }

  function setCurrentCountry(code, name, detail) {
    state.currentCountryCode = code;
    state.currentCountryName = name;
    el.currentCountryName.textContent = name;
    el.currentLocationDetail.textContent = detail;
    localStorage.setItem("aighelp_last_country", JSON.stringify({ code, name }));
    renderEmergencyNumbers(code);
    renderEmbassyLink();
  }

  function loadCachedCountry() {
    try { return JSON.parse(localStorage.getItem("aighelp_last_country") || "null"); }
    catch (e) { return null; }
  }

  el.retryGpsBtn.addEventListener("click", detectLocation);
  el.refreshLocationBtn.addEventListener("click", detectLocation);

  el.manualCountryToggleBtn.addEventListener("click", () => {
    el.countrySelectRow.classList.toggle("show");
  });
  el.manualCountrySelect.addEventListener("change", () => {
    const code = el.manualCountrySelect.value;
    if (!code) return;
    const name = ALL_COUNTRIES.find(c => c[0] === code)[1];
    setCurrentCountry(code, name, "Set manually");
    clearNotice();
  });

  // ============================================================
  // Emergency numbers rendering
  // ============================================================
  function renderEmergencyNumbers(countryCode) {
    if (!countryCode) {
      el.emergencyGrid.innerHTML = `<div class="emergency-empty">Set your location or country to see local emergency numbers.</div>`;
      return;
    }
    const entry = findEmergencyNumbers(countryCode);
    if (!entry) {
      el.emergencyGrid.innerHTML = `
        <div class="emergency-empty">
          We don't have a curated number for this country yet.
          <br><a href="${EMERGENCY_NUMBERS_REFERENCE_URL}" target="_blank" rel="noopener">Check the live reference list &rarr;</a>
        </div>`;
      return;
    }

    const buttons = [];
    if (entry.general) buttons.push({ label: "General emergency", number: entry.general, primary: true });
    if (entry.touristPolice) buttons.push({ label: "Tourist police", number: entry.touristPolice, primary: !entry.general });
    if (entry.police && entry.police !== entry.general) buttons.push({ label: "Police", number: entry.police, primary: false });
    if (entry.ambulance && entry.ambulance !== entry.general) buttons.push({ label: "Ambulance", number: entry.ambulance, primary: false });
    if (entry.fire && entry.fire !== entry.general) buttons.push({ label: "Fire", number: entry.fire, primary: false });
    if (entry.secondary) buttons.push({ label: "Also works", number: entry.secondary, primary: false });

    const buttonsHtml = buttons.map(b => `
      <a class="emergency-btn ${b.primary ? "" : "secondary"}" href="tel:${encodeURIComponent(b.number.replace(/\/.*/, ""))}">
        <div class="emergency-btn-label">${escapeHtml(b.label)}</div>
        <div class="emergency-btn-number">${escapeHtml(b.number)}</div>
      </a>`).join("");

    // Rendered once per country, below the whole button group — not tied
    // to any single button's "primary" flag. An earlier version attached
    // this to the primary button specifically, which (a) misattributed
    // UK's note (about the SECONDARY 112 number) to the 999 button right
    // next to it, and (b) silently dropped Japan's note entirely, since
    // Japan has no "general" number and therefore no primary button for
    // it to attach to.
    const notesHtml = entry.notes ? `<div class="emergency-notes">${escapeHtml(entry.notes)}</div>` : "";

    el.emergencyGrid.innerHTML = buttonsHtml + notesHtml;
  }

  // ============================================================
  // Embassy finder
  // ============================================================
  function renderEmbassyLink() {
    const homeCode = state.homeCountryCode;
    if (!homeCode || !state.currentCountryName) {
      el.embassyLinkArea.innerHTML = "";
      return;
    }
    const homeName = ALL_COUNTRIES.find(c => c[0] === homeCode)[1];
    const finder = findEmbassyFinder(homeCode);
    const url = finder ? finder.url : buildEmbassySearchFallbackUrl(homeName, state.currentCountryName);
    const label = finder ? "Find " + homeName + " embassies" : "Search for " + homeName + " embassy in " + state.currentCountryName;
    el.embassyLinkArea.innerHTML = `<a class="action-btn" style="display:inline-block; margin-top:4px;" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(label)} &rarr;</a>`;
  }

  el.homeCountrySelect.addEventListener("change", () => {
    if (!el.homeCountrySelect.value) return;
    setNationality(el.homeCountrySelect.value);
  });

  // ============================================================
  // Share location
  // ============================================================
  el.shareLocationBtn.addEventListener("click", async () => {
    if (!state.lastKnownCoords) {
      showNotice("<b>No GPS position yet.</b> Try refreshing your location first.");
      return;
    }
    const url = "https://maps.google.com/?q=" + state.lastKnownCoords.lat + "," + state.lastKnownCoords.lon;
    try {
      await navigator.clipboard.writeText(url);
      el.copyFeedback.classList.add("show");
      setTimeout(() => el.copyFeedback.classList.remove("show"), 3000);
    } catch (e) {
      // Clipboard API can fail in some contexts (e.g. no HTTPS, permission denied) —
      // fall back to just showing the link directly so it's still usable.
      showNotice(`<b>Couldn't copy automatically.</b> Here's your location link: <a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(url)}</a>`);
    }
  });

  // ============================================================
  // Init
  // ============================================================
  detectLocation();
  renderEmbassyLink();
})();
