// ============================================================
// AIG Business Weather
//
// Regular weather: Open-Meteo (free, keyless, CORS-open — fetched directly).
// Hazards, three independent sources, each fetched independently so one
// failing never blocks the others:
//   - USGS Earthquake Hazards Program (keyless, CORS-open — direct fetch)
//   - GDACS (cyclones, floods, volcanoes, wildfires — routed through a
//     CORS proxy since GDACS doesn't document CORS support)
//   - NOAA/NWS active alerts (US locations only — routed through a CORS
//     proxy; api.weather.gov does NOT reliably send CORS headers, this
//     is a confirmed real limitation, not a guess)
//
// This app supplements, never replaces, official emergency alert
// systems. That's stated in the UI itself, not just here.
// ============================================================

(function () {
  "use strict";

  const RSS_PROXY = "https://api.allorigins.win/raw?url=";

  // ============================================================
  // Background push config — empty/disabled today. Once a real
  // backend exists (see /backend-example), set BACKEND_URL and
  // VAPID_PUBLIC_KEY here and the "Subscribe" button in Settings
  // becomes live automatically — nothing else in this file needs to
  // change. This is the same own-key/backend seam pattern used in
  // AIG Ask.
  // ============================================================
  const PUSH_CONFIG = {
    backendUrl: "",       // e.g. "https://your-backend.example.com/api/subscribe"
    vapidPublicKey: ""    // the VAPID public key your backend generated
  };

  // Anonymous usage ping — separate from push subscription. If a
  // backend is configured, a rounded, non-identifying location ping
  // is sent once per location-set so an admin can see AGGREGATE usage
  // on a map (see backend-example/admin-dashboard.html). This never
  // sends anything that could identify a specific person or device —
  // no endpoint, no subscription ID, nothing beyond lat/lon, which the
  // backend rounds to ~11km before ever storing it. Disclosed to the
  // person directly in the location banner, not just here.
  const USAGE_PING_CONFIG = {
    backendBaseUrl: "" // e.g. "https://your-backend.example.com" (no trailing /api/...)
  };

  const state = {
    location: null,          // {lat, lon, name}
    weather: null,
    hazards: [],              // normalized hazard list from all sources
    hazardStatus: { usgs: "pending", gdacs: "pending", nws: "pending" },
    weatherAlerts: [],         // conversational forecast-based alerts ("bring an umbrella")
    seenWeatherAlertIds: loadSeenWeatherAlerts(),
    settings: loadSettings(),
    seenHazardIds: loadSeenHazards(),
    autoRefreshTimer: null
  };

  function loadSettings() {
    try {
      return Object.assign({ radiusKm: 500, autoRefresh: true, notifPermission: false }, JSON.parse(localStorage.getItem("aigweather_settings_v1") || "{}"));
    } catch (e) {
      return { radiusKm: 500, autoRefresh: true, notifPermission: false };
    }
  }
  function saveSettings() { localStorage.setItem("aigweather_settings_v1", JSON.stringify(state.settings)); }

  function loadSeenHazards() {
    try { return new Set(JSON.parse(localStorage.getItem("aigweather_seen_hazards_v1") || "[]")); }
    catch (e) { return new Set(); }
  }
  function saveSeenHazards() {
    // Cap stored history so this never grows unbounded across long sessions.
    const arr = Array.from(state.seenHazardIds).slice(-500);
    localStorage.setItem("aigweather_seen_hazards_v1", JSON.stringify(arr));
  }

  function loadSeenWeatherAlerts() {
    try { return new Set(JSON.parse(localStorage.getItem("aigweather_seen_wx_alerts_v1") || "[]")); }
    catch (e) { return new Set(); }
  }
  function saveSeenWeatherAlerts() {
    const arr = Array.from(state.seenWeatherAlertIds).slice(-200);
    localStorage.setItem("aigweather_seen_wx_alerts_v1", JSON.stringify(arr));
  }

  const el = {
    weatherStatusLed: document.getElementById("weatherStatusLed"),
    weatherStatusText: document.getElementById("weatherStatusText"),
    hazardStatusLed: document.getElementById("hazardStatusLed"),
    hazardStatusText: document.getElementById("hazardStatusText"),
    refreshBtn: document.getElementById("refreshBtn"),
    settingsBtn: document.getElementById("settingsBtn"),
    noticeBanner: document.getElementById("noticeBanner"),
    locationName: document.getElementById("locationName"),
    locationCoords: document.getElementById("locationCoords"),
    useGpsBtn: document.getElementById("useGpsBtn"),
    manualLocationBtn: document.getElementById("manualLocationBtn"),
    manualLocationRow: document.getElementById("manualLocationRow"),
    manualLat: document.getElementById("manualLat"),
    manualLon: document.getElementById("manualLon"),
    manualLocationSaveBtn: document.getElementById("manualLocationSaveBtn"),
    hazardRadiusLabel: document.getElementById("hazardRadiusLabel"),
    hazardList: document.getElementById("hazardList"),
    weatherAlertList: document.getElementById("weatherAlertList"),
    currentWeatherPanel: document.getElementById("currentWeatherPanel"),
    currentWeatherBody: document.getElementById("currentWeatherBody"),
    hourlyStrip: document.getElementById("hourlyStrip"),
    dailyStrip: document.getElementById("dailyStrip"),
    alertToastWrap: document.getElementById("alertToastWrap"),
    settingsModal: document.getElementById("settingsModal"),
    closeSettingsBtn: document.getElementById("closeSettingsBtn"),
    radiusSlider: document.getElementById("radiusSlider"),
    radiusValueLabel: document.getElementById("radiusValueLabel"),
    notifPermBtn: document.getElementById("notifPermBtn"),
    autoRefreshToggle: document.getElementById("autoRefreshToggle"),
    pushStatusDesc: document.getElementById("pushStatusDesc"),
    enablePushBtn: document.getElementById("enablePushBtn"),
    saveSettingsBtn: document.getElementById("saveSettingsBtn")
  };

  function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }

  // ============================================================
  // Keep the alert toast stack positioned just below the topbar,
  // whatever its actual height is. Fixed pixel offsets are fragile
  // here: the topbar wraps onto 2-3 lines on narrow screens, and a
  // static "top: 20px" was found (via real click-actionability testing,
  // not just visual inspection) to overlap and functionally block the
  // refresh/settings buttons for as long as any toast was showing —
  // a real usability bug, not just a cosmetic one.
  // ============================================================
  function repositionToastWrap() {
    const topbar = document.querySelector(".topbar");
    if (!topbar || !el.alertToastWrap) return;
    const bottom = topbar.getBoundingClientRect().bottom;
    el.alertToastWrap.style.top = (bottom + 12) + "px";
  }
  window.addEventListener("resize", repositionToastWrap);
  window.addEventListener("load", repositionToastWrap);
  repositionToastWrap();

  // ============================================================
  // Distance — haversine, standard great-circle distance in km.
  // ============================================================
  function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ============================================================
  // Location
  // ============================================================
  function setLocation(lat, lon, name) {
    state.location = { lat: parseFloat(lat), lon: parseFloat(lon), name: name || (lat.toFixed(3) + ", " + lon.toFixed(3)) };
    el.locationName.textContent = state.location.name;
    el.locationCoords.textContent = state.location.lat.toFixed(4) + ", " + state.location.lon.toFixed(4);
    localStorage.setItem("aigweather_location_v1", JSON.stringify(state.location));
    sendAnonymousUsagePing(state.location.lat, state.location.lon);
    loadAll();
  }

  // Fire-and-forget — a usage ping failing or being unconfigured should
  // never block or affect the actual weather/hazard functionality.
  function sendAnonymousUsagePing(lat, lon) {
    if (!USAGE_PING_CONFIG.backendBaseUrl) return;
    fetch(USAGE_PING_CONFIG.backendBaseUrl.replace(/\/$/, "") + "/api/usage-ping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lon })
    }).catch(() => { /* best-effort; not user-visible */ });
  }

  el.useGpsBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      showNotice("<b>GPS not available.</b> Your browser doesn't support geolocation — use \u201cEnter manually\u201d instead.");
      return;
    }
    el.useGpsBtn.textContent = "Locating\u2026";
    navigator.geolocation.getCurrentPosition(
      pos => {
        el.useGpsBtn.textContent = "Use my GPS location";
        setLocation(pos.coords.latitude, pos.coords.longitude, "Your GPS location");
      },
      err => {
        el.useGpsBtn.textContent = "Use my GPS location";
        const msg = err.code === 1 ? "Location permission was denied — allow it in your browser's site settings, or enter a location manually."
          : err.code === 2 ? "Your device couldn't determine a location right now — try again, or enter one manually."
          : "Location request timed out — try again, or enter one manually.";
        showNotice("<b>Couldn't get your GPS location.</b> " + msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });

  el.manualLocationBtn.addEventListener("click", () => {
    el.manualLocationRow.classList.toggle("show");
  });
  el.manualLocationSaveBtn.addEventListener("click", () => {
    const lat = parseFloat(el.manualLat.value);
    const lon = parseFloat(el.manualLon.value);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      showNotice("<b>Invalid coordinates.</b> Latitude must be -90 to 90, longitude -180 to 180.");
      return;
    }
    setLocation(lat, lon, "Manual location");
    el.manualLocationRow.classList.remove("show");
  });

  function showNotice(html) {
    el.noticeBanner.innerHTML = html;
    el.noticeBanner.classList.add("show");
  }

  // ============================================================
  // Weather — Open-Meteo, direct fetch (real CORS support, no key)
  // ============================================================
  const WEATHER_CODE_ICONS = {
    0: "\u2600\ufe0f", 1: "\ud83c\udf24\ufe0f", 2: "\u26c5", 3: "\u2601\ufe0f",
    45: "\ud83c\udf2b\ufe0f", 48: "\ud83c\udf2b\ufe0f",
    51: "\ud83c\udf27\ufe0f", 53: "\ud83c\udf27\ufe0f", 55: "\ud83c\udf27\ufe0f",
    61: "\ud83c\udf27\ufe0f", 63: "\ud83c\udf27\ufe0f", 65: "\ud83c\udf27\ufe0f",
    71: "\ud83c\udf28\ufe0f", 73: "\ud83c\udf28\ufe0f", 75: "\ud83c\udf28\ufe0f",
    80: "\ud83c\udf26\ufe0f", 81: "\ud83c\udf26\ufe0f", 82: "\u26c8\ufe0f",
    95: "\u26c8\ufe0f", 96: "\u26c8\ufe0f", 99: "\u26c8\ufe0f"
  };
  function weatherIcon(code) { return WEATHER_CODE_ICONS[code] || "\ud83c\udf24\ufe0f"; }
  function weatherDesc(code) {
    const map = {
      0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Fog", 48: "Freezing fog",
      51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
      61: "Light rain", 63: "Rain", 65: "Heavy rain",
      71: "Light snow", 73: "Snow", 75: "Heavy snow",
      80: "Rain showers", 81: "Rain showers", 82: "Violent rain showers",
      95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail"
    };
    return map[code] || "Unknown conditions";
  }

  // ============================================================
  // Graphical weather theming — maps a weather code to one of six
  // visual themes, each with its own animated decorative background
  // (pure CSS/SVG-free DOM elements, randomized positions for an
  // organic look, regenerated each time so it never looks identical
  // twice). This is purely decorative: the actual data (temperature,
  // %, etc.) is unaffected and always rendered from the real values.
  // ============================================================
  function weatherTheme(code) {
    if ([95, 96, 99].includes(code)) return "storm";
    if ([71, 73, 75, 85, 86].includes(code)) return "snow";
    if ([51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
    if ([45, 48].includes(code)) return "fog";
    if ([2, 3].includes(code)) return "cloudy";
    return "clear"; // 0, 1
  }

  function randRange(min, max) { return min + Math.random() * (max - min); }

  function buildWeatherUnderlay(theme) {
    const parts = [];
    if (theme === "clear") {
      parts.push('<div class="wx-sun-glow"></div>');
    } else if (theme === "cloudy" || theme === "fog") {
      parts.push('<div class="wx-cloud c1"></div><div class="wx-cloud c2"></div>');
    } else if (theme === "rain" || theme === "storm") {
      for (let i = 0; i < 18; i++) {
        const left = randRange(0, 100).toFixed(1);
        const duration = randRange(0.6, 1.3).toFixed(2);
        const delay = randRange(0, 1.5).toFixed(2);
        parts.push(`<div class="wx-rain-streak" style="left:${left}%; animation-duration:${duration}s; animation-delay:-${delay}s;"></div>`);
      }
      if (theme === "storm") parts.push('<div class="wx-lightning-flash"></div>');
    } else if (theme === "snow") {
      for (let i = 0; i < 16; i++) {
        const left = randRange(0, 100).toFixed(1);
        const size = randRange(3, 7).toFixed(1);
        const duration = randRange(4, 8).toFixed(2);
        const delay = randRange(0, 6).toFixed(2);
        parts.push(`<div class="wx-snowflake" style="left:${left}%; width:${size}px; height:${size}px; animation-duration:${duration}s; animation-delay:-${delay}s;"></div>`);
      }
    }
    return parts.join("");
  }

  async function fetchWeather(lat, lon) {
    const url = "https://api.open-meteo.com/v1/forecast"
      + "?latitude=" + lat + "&longitude=" + lon
      + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl"
      + "&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,wind_gusts_10m"
      + "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code"
      + "&timezone=auto&forecast_days=8";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Open-Meteo returned HTTP " + res.status);
    return res.json();
  }

  function feelsLikeNote(actual, apparent) {
    const diff = Math.round(apparent - actual);
    if (Math.abs(diff) < 3) return null; // not a meaningful enough gap to call out
    if (diff <= -3) return "Feels " + Math.abs(diff) + "\u00b0 colder than the actual temperature \u2014 likely wind chill.";
    return "Feels " + diff + "\u00b0 warmer than the actual temperature \u2014 likely humidity.";
  }

  function renderWeather(data) {
    const c = data.current;
    const theme = weatherTheme(c.weather_code);

    el.currentWeatherPanel.className = "panel wx-theme-panel wx-theme-" + theme;
    const note = feelsLikeNote(c.temperature_2m, c.apparent_temperature);

    el.currentWeatherBody.innerHTML = `
      <div class="wx-theme-underlay">${buildWeatherUnderlay(theme)}</div>
      <div class="current-weather">
        <div style="font-size:44px;">${weatherIcon(c.weather_code)}</div>
        <div>
          <div class="current-temp">${Math.round(c.temperature_2m)}\u00b0C</div>
          <div class="current-desc">${escapeHtml(weatherDesc(c.weather_code))}</div>
          <div class="current-feelslike">Feels like <b>${Math.round(c.apparent_temperature)}\u00b0C</b></div>
          ${note ? `<div class="current-feelslike-note">${escapeHtml(note)}</div>` : ""}
        </div>
        <div class="current-meta-grid">
          <div class="current-meta-item"><span class="current-meta-label">Humidity</span><span class="current-meta-value">${c.relative_humidity_2m}%</span></div>
          <div class="current-meta-item"><span class="current-meta-label">Wind</span><span class="current-meta-value">${Math.round(c.wind_speed_10m)} km/h</span></div>
          <div class="current-meta-item"><span class="current-meta-label">Pressure</span><span class="current-meta-value">${Math.round(c.pressure_msl)} hPa</span></div>
          <div class="current-meta-item"><span class="current-meta-label">Precipitation</span><span class="current-meta-value">${c.precipitation} mm</span></div>
        </div>
      </div>`;

    const hourly = data.hourly;
    const nowIdx = hourly.time.findIndex(t => new Date(t) >= new Date(c.time));
    const startIdx = Math.max(0, nowIdx);
    const hourlySlice = [];
    for (let i = startIdx; i < Math.min(startIdx + 24, hourly.time.length); i += 3) hourlySlice.push(i);
    el.hourlyStrip.innerHTML = hourlySlice.map(i => {
      const d = new Date(hourly.time[i]);
      const pct = hourly.precipitation_probability[i];
      const barColor = pct >= 60 ? "var(--blue)" : pct >= 30 ? "rgba(95,168,211,0.6)" : "rgba(95,168,211,0.25)";
      return `
        <div class="forecast-item">
          <div class="fi-label">${d.getHours()}:00</div>
          <div class="fi-icon">${weatherIcon(hourly.weather_code[i])}</div>
          <div class="fi-temp">${Math.round(hourly.temperature_2m[i])}\u00b0</div>
          <div class="fi-rain-bar-track"><div class="fi-rain-bar-fill" style="height:${Math.max(4, pct)}%; background:${barColor};"></div></div>
          <div class="fi-precip">${pct}%</div>
        </div>`;
    }).join("");

    const daily = data.daily;
    el.dailyStrip.innerHTML = daily.time.map((t, i) => {
      const d = new Date(t + "T00:00:00");
      const label = i === 0 ? "Today" : d.toLocaleDateString(undefined, { weekday: "short" });
      return `
        <div class="forecast-item" style="width:88px;">
          <div class="fi-label">${label}</div>
          <div class="fi-icon">${weatherIcon(daily.weather_code[i])}</div>
          <div class="fi-temp">${Math.round(daily.temperature_2m_max[i])}\u00b0 / ${Math.round(daily.temperature_2m_min[i])}\u00b0</div>
          <div class="fi-precip">${daily.precipitation_probability_max[i]}%</div>
        </div>`;
    }).join("");
  }

  // ============================================================
  // Conversational weather alerts — "bring an umbrella, rain expected
  // at 2pm" style. Generated entirely from the hourly forecast data
  // already fetched above; no separate data source. Looks ahead a
  // fixed window from "now" and reports the FIRST hour each condition
  // is forecast to begin, rather than repeating an alert every hour
  // the condition remains true.
  // ============================================================
  const WEATHER_ALERT_THRESHOLDS = {
    lookaheadHours: 12,
    rainProbability: 60,     // % chance, to call it "rain expected" rather than "slight chance"
    snowWeatherCodes: [71, 73, 75, 85, 86],
    freezingRainCodes: [66, 67],
    strongWindKmh: 40,
    strongGustKmh: 55,
    hotC: 32,
    coldC: 0
  };

  function formatHourLabel(date) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function generateWeatherAlerts(data) {
    const hourly = data.hourly;
    const now = new Date(data.current.time);
    const nowIdx = Math.max(0, hourly.time.findIndex(t => new Date(t) >= now));
    const endIdx = Math.min(hourly.time.length, nowIdx + WEATHER_ALERT_THRESHOLDS.lookaheadHours);

    const alerts = [];
    const today = now.toISOString().slice(0, 10);

    function addOnceForToday(kind, idx, build) {
      const id = "wx-" + kind + "-" + today;
      if (alerts.some(a => a.id === id)) return; // only the first qualifying hour per condition per day
      alerts.push(Object.assign({ id, time: new Date(hourly.time[idx]) }, build()));
    }

    for (let i = nowIdx; i < endIdx; i++) {
      const code = hourly.weather_code[i];
      const timeLabel = formatHourLabel(new Date(hourly.time[i]));

      if (hourly.precipitation_probability[i] >= WEATHER_ALERT_THRESHOLDS.rainProbability
          && !WEATHER_ALERT_THRESHOLDS.snowWeatherCodes.includes(code)
          && !WEATHER_ALERT_THRESHOLDS.freezingRainCodes.includes(code)) {
        addOnceForToday("rain", i, () => ({
          icon: "\u2614", title: "Rain expected",
          message: "Bring an umbrella \u2014 rain is expected around " + timeLabel + " (" + hourly.precipitation_probability[i] + "% chance)."
        }));
      }
      if (WEATHER_ALERT_THRESHOLDS.snowWeatherCodes.includes(code)) {
        addOnceForToday("snow", i, () => ({
          icon: "\u2744\ufe0f", title: "Snow expected",
          message: "Snow is expected around " + timeLabel + " \u2014 allow extra time if you're driving."
        }));
      }
      if (WEATHER_ALERT_THRESHOLDS.freezingRainCodes.includes(code)) {
        addOnceForToday("ice", i, () => ({
          icon: "\ud83e\udea7", title: "Freezing rain expected",
          message: "Freezing rain is expected around " + timeLabel + " \u2014 watch for ice on roads and walkways."
        }));
      }
      if (hourly.wind_gusts_10m && hourly.wind_gusts_10m[i] >= WEATHER_ALERT_THRESHOLDS.strongGustKmh) {
        addOnceForToday("wind", i, () => ({
          icon: "\ud83d\udca8", title: "Strong wind gusts expected",
          message: "Wind gusts up to " + Math.round(hourly.wind_gusts_10m[i]) + " km/h expected around " + timeLabel + " \u2014 secure anything loose outside."
        }));
      } else if (hourly.wind_speed_10m[i] >= WEATHER_ALERT_THRESHOLDS.strongWindKmh) {
        addOnceForToday("wind", i, () => ({
          icon: "\ud83d\udca8", title: "Strong wind expected",
          message: "Sustained winds around " + Math.round(hourly.wind_speed_10m[i]) + " km/h expected around " + timeLabel + "."
        }));
      }
      if (hourly.temperature_2m[i] >= WEATHER_ALERT_THRESHOLDS.hotC) {
        addOnceForToday("heat", i, () => ({
          icon: "\u2600\ufe0f", title: "High heat expected",
          message: "It'll reach " + Math.round(hourly.temperature_2m[i]) + "\u00b0C around " + timeLabel + " \u2014 stay hydrated."
        }));
      }
      if (hourly.temperature_2m[i] <= WEATHER_ALERT_THRESHOLDS.coldC) {
        addOnceForToday("cold", i, () => ({
          icon: "\ud83e\udd76", title: "Freezing temperatures expected",
          message: "Temperatures drop to " + Math.round(hourly.temperature_2m[i]) + "\u00b0C around " + timeLabel + " \u2014 dress warmly."
        }));
      }
    }

    return alerts;
  }

  // ============================================================
  // Hazard source 1: USGS Earthquakes — direct fetch, keyless,
  // documented-permissive CORS.
  // ============================================================
  async function fetchUsgsEarthquakes(lat, lon, radiusKm) {
    const url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
      + "?format=geojson&latitude=" + lat + "&longitude=" + lon
      + "&maxradiuskm=" + radiusKm
      + "&minmagnitude=3.5"
      + "&starttime=" + new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
      + "&orderby=time&limit=50";
    const res = await fetch(url);
    if (!res.ok) throw new Error("USGS returned HTTP " + res.status);
    const data = await res.json();
    return (data.features || []).map(f => {
      const p = f.properties;
      const [eqLon, eqLat] = f.geometry.coordinates;
      const distanceKm = haversineKm(lat, lon, eqLat, eqLon);
      let severity = "minor";
      if (p.mag >= 7.0) severity = "extreme";
      else if (p.mag >= 6.0) severity = "severe";
      else if (p.mag >= 4.5) severity = "moderate";
      if (p.tsunami === 1 && severity !== "extreme") severity = "severe";
      return {
        id: "usgs-" + f.id,
        source: "USGS",
        kind: p.tsunami === 1 ? "Earthquake (tsunami risk flagged)" : "Earthquake",
        icon: p.tsunami === 1 ? "\ud83c\udf0a" : "\ud83c\udf0d",
        severity,
        title: "M" + p.mag.toFixed(1) + " \u2014 " + p.place,
        description: p.tsunami === 1
          ? "USGS flags this event as meeting regional tsunami-warning notification criteria. Check official tsunami center bulletins for your area."
          : null,
        time: new Date(p.time),
        distanceKm,
        link: p.url
      };
    });
  }

  // ============================================================
  // Hazard source 2: GDACS — cyclones, floods, volcanoes, wildfires.
  // Routed through the CORS proxy (GDACS doesn't document CORS
  // support, unlike USGS/Open-Meteo, so this is the safer default).
  //
  // NOTE ON FIELD NAMES: GDACS's public documentation confirms the
  // endpoint and general shape (GeoJSON FeatureCollection, properties
  // including eventtype/alertlevel/country/name/description/dates) but
  // does not give a byte-for-byte schema in the material available
  // when this was built. Parsing below is defensive — it tries a few
  // reasonable property-name variants and falls back gracefully rather
  // than throwing if a field is named slightly differently than
  // expected. If GDACS changes their schema, this degrades to skipping
  // fields it doesn't recognize rather than crashing the whole feed.
  // ============================================================
  async function fetchGdacsEvents(lat, lon, radiusKm) {
    const target = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=EQ;TC;FL;VO;WF&alertlevel=orange;red";
    const res = await fetch(RSS_PROXY + encodeURIComponent(target));
    if (!res.ok) throw new Error("GDACS returned HTTP " + res.status);
    const data = await res.json();
    const features = data.features || [];
    const out = [];
    features.forEach(f => {
      const p = f.properties || {};
      let eventLat = null, eventLon = null;
      if (f.geometry && f.geometry.type === "Point") {
        [eventLon, eventLat] = f.geometry.coordinates;
      } else if (p.latitude != null && p.longitude != null) {
        eventLat = p.latitude; eventLon = p.longitude;
      }
      if (eventLat == null || eventLon == null) return; // can't distance-filter, skip rather than guess

      const distanceKm = haversineKm(lat, lon, eventLat, eventLon);
      if (distanceKm > radiusKm) return;

      const alertLevel = (p.alertlevel || p.alertLevel || "").toLowerCase();
      const severity = alertLevel === "red" ? "extreme" : alertLevel === "orange" ? "severe" : "moderate";
      const eventType = p.eventtype || p.eventType || "??";
      const typeLabels = { EQ: "Earthquake", TC: "Tropical cyclone", FL: "Flood", VO: "Volcanic activity", WF: "Wildfire", DR: "Drought" };
      const typeIcons = { EQ: "\ud83c\udf0d", TC: "\ud83c\udf00", FL: "\ud83c\udf0a", VO: "\ud83c\udf0b", WF: "\ud83d\udd25", DR: "\u2600\ufe0f" };

      out.push({
        id: "gdacs-" + (p.eventid || p.eventId || f.id || Math.random()),
        source: "GDACS",
        kind: typeLabels[eventType] || eventType,
        icon: typeIcons[eventType] || "\u26a0\ufe0f",
        severity,
        title: p.name || p.title || (typeLabels[eventType] || eventType) + " \u2014 " + (p.country || "location unspecified"),
        description: p.description || null,
        time: p.fromdate ? new Date(p.fromdate) : (p.todate ? new Date(p.todate) : null),
        distanceKm,
        link: "https://www.gdacs.org"
      });
    });
    return out;
  }

  // ============================================================
  // Hazard source 3: NWS/NOAA active alerts — US locations only.
  // Routed through the CORS proxy (confirmed: api.weather.gov does not
  // reliably send Access-Control-Allow-Origin, multiple real-world
  // reports of this exact failure).
  // ============================================================
  async function fetchNwsAlerts(lat, lon) {
    const target = "https://api.weather.gov/alerts/active?point=" + lat + "," + lon;
    const res = await fetch(RSS_PROXY + encodeURIComponent(target));
    if (!res.ok) throw new Error("NWS returned HTTP " + res.status);
    const data = await res.json();
    return (data.features || []).map(f => {
      const p = f.properties;
      const sev = (p.severity || "unknown").toLowerCase();
      const severity = ["extreme", "severe", "moderate", "minor"].includes(sev) ? sev : "moderate";
      return {
        id: "nws-" + (p.id || f.id),
        source: "NWS",
        kind: p.event || "Weather alert",
        icon: "\ud83d\udea8",
        severity,
        title: p.headline || p.event,
        description: p.description ? p.description.slice(0, 280) : null,
        time: p.onset ? new Date(p.onset) : null,
        distanceKm: null, // NWS already filters by point, no independent distance to compute
        link: p.url || null
      };
    });
  }

  // ============================================================
  // Load everything
  // ============================================================
  async function loadAll() {
    if (!state.location) return;
    await Promise.all([loadWeather(), loadHazards()]);
  }

  async function loadWeather() {
    setLed(el.weatherStatusLed, el.weatherStatusText, "pending", "loading\u2026");
    try {
      const data = await fetchWeather(state.location.lat, state.location.lon);
      state.weather = data;
      renderWeather(data);
      setLed(el.weatherStatusLed, el.weatherStatusText, "live", "live");

      const alerts = generateWeatherAlerts(data);
      state.weatherAlerts = alerts;
      renderWeatherAlertPanel(alerts);
      checkForNewWeatherAlertsAndNotify(alerts);
    } catch (e) {
      setLed(el.weatherStatusLed, el.weatherStatusText, "error", "error");
      el.currentWeatherBody.innerHTML = `<div class="empty-state">Couldn't load weather: ${escapeHtml(e.message)}</div>`;
    }
  }

  async function loadHazards() {
    setLed(el.hazardStatusLed, el.hazardStatusText, "pending", "checking\u2026");
    el.hazardRadiusLabel.textContent = "within " + state.settings.radiusKm + " km";

    const isUS = state.location.lat >= 18 && state.location.lat <= 72 && state.location.lon >= -180 && state.location.lon <= -66;

    const tasks = [
      { key: "usgs", fn: fetchUsgsEarthquakes(state.location.lat, state.location.lon, state.settings.radiusKm) },
      { key: "gdacs", fn: fetchGdacsEvents(state.location.lat, state.location.lon, state.settings.radiusKm) }
    ];
    if (isUS) tasks.push({ key: "nws", fn: fetchNwsAlerts(state.location.lat, state.location.lon) });
    else state.hazardStatus.nws = "n/a";

    const results = await Promise.allSettled(tasks.map(t => t.fn));
    let allHazards = [];
    results.forEach((r, i) => {
      const key = tasks[i].key;
      if (r.status === "fulfilled") {
        state.hazardStatus[key] = "ok";
        allHazards = allHazards.concat(r.value);
      } else {
        state.hazardStatus[key] = "error:" + r.reason.message;
      }
    });

    allHazards.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));

    const okCount = Object.values(state.hazardStatus).filter(s => s === "ok").length;
    const errorCount = Object.values(state.hazardStatus).filter(s => s.startsWith && s.startsWith("error")).length;
    if (errorCount > 0 && okCount === 0) {
      setLed(el.hazardStatusLed, el.hazardStatusText, "error", "all sources failed");
    } else if (errorCount > 0) {
      setLed(el.hazardStatusLed, el.hazardStatusText, "warn", okCount + " of " + (okCount + errorCount) + " sources live");
    } else {
      setLed(el.hazardStatusLed, el.hazardStatusText, "live", "live");
    }

    checkForNewHazardsAndAlert(allHazards);
    state.hazards = allHazards;
    renderHazards(allHazards);
  }

  function severityRank(s) { return { extreme: 3, severe: 2, moderate: 1, minor: 0 }[s] || 0; }

  function setLed(ledEl, textEl, cls, text) {
    ledEl.classList.remove("live", "error", "warn");
    if (cls !== "pending") ledEl.classList.add(cls);
    textEl.textContent = text;
  }

  // ============================================================
  // Rendering
  // ============================================================
  function renderHazards(hazards) {
    if (!hazards.length) {
      el.hazardList.innerHTML = `<div class="empty-state">No active hazard warnings within ${state.settings.radiusKm} km right now.</div>`;
      return;
    }
    el.hazardList.innerHTML = hazards.map(h => `
      <div class="hazard-card sev-${h.severity}">
        <div class="hazard-icon">${h.icon}</div>
        <div class="hazard-body">
          <div class="hazard-title-row">
            <div class="hazard-title">${escapeHtml(h.title)}</div>
            <span class="hazard-badge sev-${h.severity}">${h.severity}</span>
          </div>
          <div class="hazard-meta">
            ${escapeHtml(h.source)} &middot; ${escapeHtml(h.kind)}
            ${h.distanceKm != null ? " &middot; " + Math.round(h.distanceKm) + " km away" : ""}
            ${h.time ? " &middot; " + h.time.toLocaleString() : ""}
          </div>
          ${h.description ? `<div class="hazard-desc">${escapeHtml(h.description)}</div>` : ""}
          ${h.link ? `<a class="hazard-source-link" href="${h.link}" target="_blank" rel="noopener">View source &rarr;</a>` : ""}
        </div>
      </div>`).join("");
  }

  // ============================================================
  // Foreground alerting — in-app toast + browser Notification for any
  // hazard we haven't already shown. This only fires while the tab is
  // open (see the notice banner in the UI for what background alerts
  // while closed would require).
  // ============================================================
  function checkForNewHazardsAndAlert(hazards) {
    const newOnes = hazards.filter(h => !state.seenHazardIds.has(h.id) && (h.severity === "extreme" || h.severity === "severe"));
    newOnes.forEach(h => {
      state.seenHazardIds.add(h.id);
      if (isBigWarningWorthy(h)) {
        queueSevereWarning(h);
      } else {
        showAlertToast(h);
      }
      maybeShowBrowserNotification(h);
    });
    if (newOnes.length) saveSeenHazards();
  }

  // ============================================================
  // Big red "SEVERE WEATHER WARNING!" modal — for the specific,
  // high-impact hazard types called out explicitly (typhoon/cyclone,
  // tornado, earthquake, flood, severe thunderstorm), plus anything
  // rated "extreme" regardless of type. Everything else that's merely
  // "severe" keeps using the smaller toast, same as before.
  //
  // Queued rather than stacked: if a second qualifying hazard arrives
  // while one warning is already on screen, it waits and shows
  // automatically once the current one is dismissed — so a burst of
  // several genuine warnings never turns into an unreadable pile of
  // full-screen modals fighting for attention.
  // ============================================================
  const BIG_WARNING_KEYWORDS = /tornado|typhoon|hurricane|cyclone|flood|severe thunderstorm|earthquake|tsunami/i;

  function isBigWarningWorthy(h) {
    if (h.severity === "extreme") return true;
    if (h.severity === "severe" && BIG_WARNING_KEYWORDS.test(h.kind + " " + h.title)) return true;
    return false;
  }

  const severeWarningQueue = [];
  let severeWarningShowing = false;

  function queueSevereWarning(h) {
    severeWarningQueue.push(h);
    if (!severeWarningShowing) showNextSevereWarning();
    else updateSevereQueueNote();
  }

  function updateSevereQueueNote() {
    const note = document.getElementById("severeWarningQueueNote");
    if (severeWarningQueue.length > 0) {
      note.style.display = "block";
      note.textContent = severeWarningQueue.length + " more warning" + (severeWarningQueue.length === 1 ? "" : "s") + " waiting after this one.";
    } else {
      note.style.display = "none";
    }
  }

  function showNextSevereWarning() {
    const h = severeWarningQueue.shift();
    if (!h) { severeWarningShowing = false; return; }
    severeWarningShowing = true;

    document.getElementById("severeWarningKind").textContent = h.source + " \u00b7 " + h.kind;
    document.getElementById("severeWarningTitle").textContent = h.title;
    document.getElementById("severeWarningMeta").textContent =
      (h.distanceKm != null ? Math.round(h.distanceKm) + " km away" : "") +
      (h.time ? (h.distanceKm != null ? " \u00b7 " : "") + h.time.toLocaleString() : "");
    const descEl = document.getElementById("severeWarningDesc");
    descEl.textContent = h.description || "";
    descEl.style.display = h.description ? "block" : "none";
    const linkEl = document.getElementById("severeWarningLink");
    if (h.link) { linkEl.href = h.link; linkEl.style.display = "inline-block"; } else { linkEl.style.display = "none"; }

    updateSevereQueueNote();
    document.getElementById("severeWarningBackdrop").classList.add("show");

    // Vibrate on supporting devices (mobile) — a physical cue in addition
    // to the visual one, same spirit as the modal itself: this is meant
    // to be genuinely hard to miss for a real severe/extreme hazard.
    if (navigator.vibrate) { try { navigator.vibrate([200, 100, 200]); } catch (e) {} }
  }

  document.getElementById("severeWarningDismissBtn").addEventListener("click", () => {
    document.getElementById("severeWarningBackdrop").classList.remove("show");
    if (severeWarningQueue.length > 0) {
      setTimeout(showNextSevereWarning, 250); // brief pause so consecutive modals don't feel like a single flash
    } else {
      severeWarningShowing = false;
    }
  });

  // ============================================================
  // Conversational weather-alert panel + notifications — visually
  // distinct (blue, not red) from hazard warnings, since "bring an
  // umbrella" and "a tsunami-risk earthquake was just detected" are
  // very different kinds of things and shouldn't look the same.
  // ============================================================
  function renderWeatherAlertPanel(alerts) {
    if (!el.weatherAlertList) return;
    if (!alerts.length) {
      el.weatherAlertList.innerHTML = `<div class="empty-state">Nothing notable in the next ${WEATHER_ALERT_THRESHOLDS.lookaheadHours} hours.</div>`;
      return;
    }
    const sorted = alerts.slice().sort((a, b) => a.time - b.time);
    el.weatherAlertList.innerHTML = sorted.map(a => `
      <div class="wx-alert-card">
        <div class="wx-alert-icon">${a.icon}</div>
        <div class="wx-alert-body">
          <div class="wx-alert-title">${escapeHtml(a.title)}</div>
          <div class="wx-alert-message">${escapeHtml(a.message)}</div>
        </div>
      </div>`).join("");
  }

  function checkForNewWeatherAlertsAndNotify(alerts) {
    const newOnes = alerts.filter(a => !state.seenWeatherAlertIds.has(a.id));
    newOnes.forEach(a => {
      state.seenWeatherAlertIds.add(a.id);
      showWeatherAlertToast(a);
      maybeShowBrowserNotification({ kind: a.title, title: a.message, severity: "info" });
    });
    if (newOnes.length) saveSeenWeatherAlerts();
  }

  function showWeatherAlertToast(a) {
    repositionToastWrap();
    const toast = document.createElement("div");
    toast.className = "alert-toast wx-toast";
    toast.innerHTML = `
      <div style="flex:1;">
        <b>${a.icon} ${escapeHtml(a.title)}</b>
        ${escapeHtml(a.message)}
      </div>
      <button class="alert-toast-close" aria-label="Dismiss">&times;</button>`;
    toast.querySelector(".alert-toast-close").addEventListener("click", () => toast.remove());
    el.alertToastWrap.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 20000);
  }

  function showAlertToast(h) {
    repositionToastWrap();
    const toast = document.createElement("div");
    toast.className = "alert-toast";
    toast.innerHTML = `
      <div style="flex:1;">
        <b>${h.icon} ${escapeHtml(h.kind)} \u2014 ${escapeHtml(h.severity)}</b>
        ${escapeHtml(h.title)}
      </div>
      <button class="alert-toast-close" aria-label="Dismiss">&times;</button>`;
    toast.querySelector(".alert-toast-close").addEventListener("click", () => toast.remove());
    el.alertToastWrap.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 20000);
  }

  function maybeShowBrowserNotification(h) {
    if (!state.settings.notifPermission) return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    try {
      new Notification("AIG Business Weather \u2014 " + h.kind, {
        body: h.title,
        icon: undefined
      });
    } catch (e) { /* some contexts (e.g. no service worker) may not support this; toast still shown */ }
  }

  // ============================================================
  // Background push subscription — real client-side flow (Service
  // Worker registration + PushManager subscription), gated entirely
  // behind PUSH_CONFIG.backendUrl being set. With no backend configured
  // (today's default), the button stays disabled with an honest
  // explanation rather than pretending to subscribe to nothing.
  // ============================================================
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }

  async function initPushUI() {
    if (!PUSH_CONFIG.backendUrl || !PUSH_CONFIG.vapidPublicKey) {
      el.pushStatusDesc.textContent = "Not available yet \u2014 no backend is configured. See backend-example/README.md for what running one requires.";
      el.enablePushBtn.disabled = true;
      el.enablePushBtn.textContent = "Subscribe";
      return;
    }
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      el.pushStatusDesc.textContent = "Your browser doesn't support push notifications.";
      el.enablePushBtn.disabled = true;
      return;
    }

    try {
      const reg = await navigator.serviceWorker.register("sw.js");
      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        el.pushStatusDesc.textContent = "Background alerts are on for this browser.";
        el.enablePushBtn.textContent = "Unsubscribe";
      } else {
        el.pushStatusDesc.textContent = "Get an alert even if this tab isn't open (browser must still be running).";
        el.enablePushBtn.textContent = "Subscribe";
      }
      el.enablePushBtn.disabled = false;
    } catch (e) {
      el.pushStatusDesc.textContent = "Couldn't set up background alerts: " + e.message;
      el.enablePushBtn.disabled = true;
    }
  }

  el.enablePushBtn.addEventListener("click", async () => {
    if (!PUSH_CONFIG.backendUrl) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();

      if (existing) {
        await existing.unsubscribe();
        await fetch(PUSH_CONFIG.backendUrl + "/unsubscribe", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: existing.endpoint })
        }).catch(() => {}); // best-effort — unsubscribing locally matters more than the backend confirming it
        await initPushUI();
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        el.pushStatusDesc.textContent = "Notification permission was denied.";
        return;
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUSH_CONFIG.vapidPublicKey)
      });

      await fetch(PUSH_CONFIG.backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          location: state.location,
          radiusKm: state.settings.radiusKm
        })
      });

      await initPushUI();
    } catch (e) {
      el.pushStatusDesc.textContent = "Couldn't subscribe: " + e.message;
    }
  });

  // ============================================================
  // Settings modal
  // ============================================================
  function openSettings() {
    el.radiusSlider.value = state.settings.radiusKm;
    el.radiusValueLabel.textContent = state.settings.radiusKm + " km";
    el.autoRefreshToggle.checked = state.settings.autoRefresh;
    el.notifPermBtn.textContent = state.settings.notifPermission ? "Enabled" : "Enable";
    initPushUI();
    el.settingsModal.classList.add("open");
  }
  function closeSettings() { el.settingsModal.classList.remove("open"); }
  el.settingsBtn.addEventListener("click", openSettings);
  el.closeSettingsBtn.addEventListener("click", closeSettings);
  el.settingsModal.addEventListener("click", e => { if (e.target === el.settingsModal) closeSettings(); });

  el.radiusSlider.addEventListener("input", () => {
    el.radiusValueLabel.textContent = el.radiusSlider.value + " km";
  });

  el.notifPermBtn.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      el.notifPermBtn.textContent = "Not supported";
      return;
    }
    const perm = await Notification.requestPermission();
    state.settings.notifPermission = perm === "granted";
    el.notifPermBtn.textContent = state.settings.notifPermission ? "Enabled" : "Denied";
  });

  el.saveSettingsBtn.addEventListener("click", () => {
    state.settings.radiusKm = parseInt(el.radiusSlider.value, 10);
    state.settings.autoRefresh = el.autoRefreshToggle.checked;
    saveSettings();
    closeSettings();
    setupAutoRefresh();
    if (state.location) loadHazards();
  });

  // ============================================================
  // Auto-refresh
  // ============================================================
  function setupAutoRefresh() {
    if (state.autoRefreshTimer) clearInterval(state.autoRefreshTimer);
    if (state.settings.autoRefresh) {
      state.autoRefreshTimer = setInterval(() => { if (state.location) loadAll(); }, 5 * 60 * 1000);
    }
  }

  el.refreshBtn.addEventListener("click", () => { if (state.location) loadAll(); });

  // ============================================================
  // Init — restore a previously saved location, if any
  // ============================================================
  (function init() {
    try {
      const saved = JSON.parse(localStorage.getItem("aigweather_location_v1") || "null");
      if (saved) setLocation(saved.lat, saved.lon, saved.name);
    } catch (e) { /* ignore */ }
    setupAutoRefresh();
  })();
})();
