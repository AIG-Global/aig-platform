// ============================================================
// ONE — Onboarding Flow
// Biometric unlock → Voice greeting → Assistant identity →
// Registration (AIG free enrollment) → hands off to app.js
// ============================================================

(function(){
  const root = document.getElementById('app');

  const ob = {
    step: 'lock', // lock -> voice -> identity -> register -> done
    scanning: false,
    scanProgress: 0,
    gender: 'female',
    voiceId: 'aria',
    assistantName: 'ONE',
    form: {
      fullName: '', email: '', phone: '', country: '',
      sponsorCode: '', memberId: '', username: '',
    },
  };

  function el(html){
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function icon(name, color, size=18){
    return `<span style="display:inline-flex;width:${size}px;height:${size}px;color:${color||'currentColor'}">${window.ICON[name] ? window.ICON[name](color||'currentColor') : ''}</span>`;
  }

  const COUNTRIES = [
    'Finland','Sweden','Norway','Denmark','Germany','United Kingdom','Ireland','France','Spain',
    'Italy','Netherlands','Belgium','Switzerland','Estonia','Latvia','Lithuania','Poland',
    'United States','Canada','United Arab Emirates','Singapore','Other'
  ];

  function shell(innerHtml){
    return `
      <div style="height:100vh;width:100vw;display:flex;align-items:center;justify-content:center;
        font-family: var(--font-body); color: var(--text-hi); padding:20px; position:relative; overflow:hidden;">
        <div style="width:100%;max-width:480px;position:relative;z-index:1;">
          ${innerHtml}
        </div>
      </div>
    `;
  }

  function brandMark(){
    return `
      <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:28px;">
        <img src="./assets/logo-icon.svg" alt="ONE" style="width:64px;height:64px;margin-bottom:12px;" />
        <div style="font-family:var(--font-head);font-size:22px;font-weight:700;">ONE</div>
        <div style="font-size:11px;letter-spacing:1px;color:var(--text-low);margin-top:2px;">AIG ASSISTANT</div>
      </div>
    `;
  }

  function progressDots(activeIdx, total){
    let dots = '';
    for(let i=0;i<total;i++){
      dots += `<div style="width:${i===activeIdx?22:7}px;height:7px;border-radius:4px;background:${i===activeIdx?'var(--amber)':'var(--hairline-2)'};transition:all .2s;"></div>`;
    }
    return `<div style="display:flex;gap:6px;justify-content:center;margin-top:26px;">${dots}</div>`;
  }

  // Premium abstract hero art for the lock screen: concentric gold
  // scan-rings over a faint constellation field, echoing the
  // biometric/identity theme without literally illustrating a finger.
  function lockHeroArt(){
    let constellation = '';
    const pts = [
      [70,60],[140,30],[210,75],[310,40],[380,90],[60,160],[150,140],
      [260,150],[340,170],[420,120],[90,230],[200,220],[300,230],[400,210],
      [50,280],[160,300],[260,290],[360,300],[430,270],[120,40],[290,110],
    ];
    pts.forEach(([x,y]) => {
      const r = 1.2 + Math.random()*1.6;
      const o = 0.25 + Math.random()*0.45;
      constellation += `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="#FFD24D" opacity="${o.toFixed(2)}"/>`;
    });
    let lines = '';
    for(let i=0;i<pts.length-1;i+=3){
      const [x1,y1] = pts[i]; const [x2,y2] = pts[i+1] || pts[0];
      lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#FFBD00" stroke-width="0.4" opacity="0.18"/>`;
    }
    return `
      <div style="display:flex;justify-content:center;margin-bottom:8px;position:relative;height:220px;">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse 260px 180px at 50% 45%, rgba(255,189,0,0.16), transparent 70%);"></div>
        <svg width="320" height="220" viewBox="0 0 480 320" style="overflow:visible;position:relative;z-index:1;">
          ${lines}
          ${constellation}
          <g transform="translate(240,150)">
            <circle r="98" fill="none" stroke="#FFBD00" stroke-width="0.6" opacity="0.20"/>
            <circle r="76" fill="none" stroke="#FFBD00" stroke-width="0.7" opacity="0.32"/>
            <circle r="54" fill="none" stroke="#FFD24D" stroke-width="0.9" opacity="0.5"/>
            <circle r="32" fill="none" stroke="#FFD24D" stroke-width="1.2" opacity="0.75"/>
            <circle r="32" fill="#FFBD00" opacity="0.10"/>
          </g>
        </svg>
      </div>
    `;
  }

  // ---------------- STEP 1: Biometric lock ----------------
  function renderLock(){
    root.innerHTML = shell(`
      ${lockHeroArt()}
      ${brandMark()}
      <div style="background:var(--panel);border:1px solid var(--hairline);border-radius:20px;padding:36px 28px;text-align:center;">
        <div id="fp-ring" style="width:104px;height:104px;border-radius:50%;margin:0 auto 22px auto;
          display:flex;align-items:center;justify-content:center;
          border:2px solid var(--hairline-2); position:relative; transition: border-color .3s;">
          <div id="fp-progress" style="position:absolute;inset:-2px;border-radius:50%;
            background:conic-gradient(var(--amber) 0deg, transparent 0deg); opacity:0.9;"></div>
          <div style="width:88px;height:88px;border-radius:50%;background:var(--panel);display:flex;align-items:center;justify-content:center;z-index:1;">
            ${icon('fingerprint', 'var(--amber)', 46)}
          </div>
        </div>
        <div style="font-family:var(--font-head);font-size:18px;font-weight:700;margin-bottom:6px;" id="fp-title">Unlock with your fingerprint</div>
        <div style="font-size:12.5px;color:var(--text-low);margin-bottom:22px;" id="fp-sub">Touch and hold the sensor to verify it's you.</div>
        <button class="btn primary" id="fp-scan-btn" style="width:100%;padding:12px;font-size:13.5px;">Simulate fingerprint scan</button>
        <button class="btn ghost" id="fp-voice-fallback" style="width:100%;padding:12px;font-size:13;margin-top:10px;">Use voice instead</button>
      </div>
      <div style="text-align:center;font-size:11px;color:var(--text-low);margin-top:18px;">
        ONE is built for exactly one person. This device will only respond to you.
      </div>
      ${progressDots(0,5)}
    `);

    const scanBtn = document.getElementById('fp-scan-btn');
    const ring = document.getElementById('fp-progress');
    const title = document.getElementById('fp-title');
    const sub = document.getElementById('fp-sub');

    scanBtn.addEventListener('click', () => {
      if(ob.scanning) return;
      ob.scanning = true;
      scanBtn.disabled = true;
      scanBtn.style.opacity = '0.6';
      title.textContent = 'Scanning…';
      sub.textContent = 'Hold steady.';
      let progress = 0;
      const interval = setInterval(() => {
        progress += 6;
        ring.style.background = `conic-gradient(var(--amber) ${progress*3.6}deg, transparent ${progress*3.6}deg)`;
        if(progress >= 100){
          clearInterval(interval);
          title.textContent = 'Identity verified';
          sub.textContent = 'Welcome back.';
          document.getElementById('fp-ring').style.borderColor = 'var(--good)';
          setTimeout(() => { ob.step = 'voice'; renderVoiceGreeting(); }, 700);
        }
      }, 60);
    });

    document.getElementById('fp-voice-fallback').addEventListener('click', () => {
      ob.step = 'voice';
      renderVoiceGreeting();
    });
  }

  // ---------------- STEP 2: Voice greeting / mic check ----------------
  function renderVoiceGreeting(){
    const hasSpeech = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    root.innerHTML = shell(`
      ${brandMark()}
      <div style="background:var(--panel);border:1px solid var(--hairline);border-radius:20px;padding:36px 28px;text-align:center;">
        <div style="width:104px;height:104px;border-radius:50%;margin:0 auto 22px auto;background:var(--amber-tint);
          display:flex;align-items:center;justify-content:center;">
          ${icon('micWave','var(--amber)',46)}
        </div>
        <div style="font-family:var(--font-head);font-size:18px;font-weight:700;margin-bottom:6px;">Say hello to test your microphone</div>
        <div style="font-size:12.5px;color:var(--text-low);margin-bottom:18px;line-height:1.5;">
          ONE listens for voice commands as well as typed ones, hands-free, any time.
          ${hasSpeech ? 'Your browser supports live voice recognition.' : 'Live voice recognition isn\'t available in this browser — typed commands will work everywhere, and voice will activate automatically on a supported device.'}
        </div>
        <button class="btn primary" id="mic-test-btn" style="width:100%;padding:12px;font-size:13.5px;">
          ${hasSpeech ? 'Tap and say “Hello, ONE”' : 'Continue'}
        </button>
        <div id="mic-result" style="margin-top:14px;font-size:12.5px;color:var(--good);min-height:18px;"></div>
        ${hasSpeech ? `<button class="btn ghost" id="mic-skip-btn" style="width:100%;padding:10px;font-size:12px;margin-top:6px;">Skip for now</button>` : ''}
      </div>
      ${progressDots(1,5)}
    `);

    const btn = document.getElementById('mic-test-btn');
    const result = document.getElementById('mic-result');
    const skipBtn = document.getElementById('mic-skip-btn');
    if(skipBtn){
      skipBtn.addEventListener('click', () => { ob.step='identity'; renderIdentity(); });
    }

    btn.addEventListener('click', () => {
      if(!hasSpeech){ ob.step='identity'; renderIdentity(); return; }
      btn.disabled = true;
      btn.textContent = 'Listening…';
      btn.style.opacity = '0.7';
      let advanced = false;
      const safetyTimeout = setTimeout(() => {
        if(advanced) return;
        advanced = true;
        result.style.color = 'var(--warn)';
        result.textContent = `No microphone response — continuing anyway. You can speak to ${ob.assistantName} any time from the main console.`;
        setTimeout(() => { if(ob.step==='voice'){ ob.step='identity'; renderIdentity(); } }, 1300);
      }, 5000);
      try{
        const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new Rec();
        rec.lang = 'en-US';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        let finished = false;
        rec.onresult = (e) => {
          finished = true; advanced = true; clearTimeout(safetyTimeout);
          const transcript = e.results[0][0].transcript;
          result.textContent = `Heard: “${transcript}” — microphone working.`;
          setTimeout(() => { ob.step='identity'; renderIdentity(); }, 900);
        };
        rec.onerror = () => {
          if(finished || advanced) return;
          advanced = true; clearTimeout(safetyTimeout);
          result.style.color = 'var(--warn)';
          result.textContent = `Couldn't access the microphone (this is normal in a sandboxed preview) — continuing anyway.`;
          setTimeout(() => { ob.step='identity'; renderIdentity(); }, 1400);
        };
        rec.onend = () => {
          if(!finished && !advanced){
            advanced = true; clearTimeout(safetyTimeout);
            result.style.color = 'var(--warn)';
            result.textContent = `No speech detected — continuing anyway.`;
            setTimeout(() => { ob.step='identity'; renderIdentity(); }, 1200);
          }
        };
        rec.start();
      }catch(err){
        advanced = true; clearTimeout(safetyTimeout);
        result.style.color = 'var(--warn)';
        result.textContent = `Voice recognition unavailable here — continuing.`;
        setTimeout(() => { ob.step='identity'; renderIdentity(); }, 1200);
      }
    });
  }

  // ---------------- STEP 3: Assistant identity ----------------
  function renderIdentity(){
    const genders = [
      { id:'female', label:'Female', icon:'female' },
      { id:'male', label:'Male', icon:'male' },
      { id:'neutral', label:'Neutral', icon:'neutral' },
    ];
    const voices = DATA.assistantVoices[ob.gender];
    if(!voices.find(v=>v.id===ob.voiceId)) ob.voiceId = voices[0].id;

    root.innerHTML = shell(`
      ${brandMark()}
      <div style="background:var(--panel);border:1px solid var(--hairline);border-radius:20px;padding:30px 28px;">
        <div style="font-family:var(--font-head);font-size:18px;font-weight:700;margin-bottom:4px;text-align:center;">Choose your assistant</div>
        <div style="font-size:12.5px;color:var(--text-low);margin-bottom:20px;text-align:center;">
          Give it a name and a voice. This is who you'll talk to from now on — like saying a wake word, but personal to you.
        </div>

        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;">Assistant name</label>
        <input id="ob-name" type="text" value="${ob.assistantName}" maxlength="20"
          style="width:100%;margin-top:6px;margin-bottom:18px;padding:11px 14px;background:var(--panel-2);
          border:1px solid var(--hairline-2);border-radius:10px;color:var(--text-hi);font-size:14px;" />

        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;">Voice gender</label>
        <div style="display:flex;gap:8px;margin-top:8px;margin-bottom:18px;">
          ${genders.map(g => `
            <button class="ob-gender-btn" data-gender="${g.id}" style="flex:1;padding:12px 8px;border-radius:10px;
              border:1px solid ${ob.gender===g.id?'var(--amber)':'var(--hairline-2)'};
              background:${ob.gender===g.id?'var(--amber-tint)':'var(--panel-2)'};
              color:${ob.gender===g.id?'var(--amber)':'var(--text-mid)'};display:flex;flex-direction:column;align-items:center;gap:6px;">
              ${icon(g.icon, ob.gender===g.id?'var(--amber)':'var(--text-mid)', 20)}
              <span style="font-size:12px;font-weight:600;">${g.label}</span>
            </button>
          `).join('')}
        </div>

        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;">Voice</label>
        <div id="ob-voices" style="display:flex;flex-direction:column;gap:8px;margin-top:8px;margin-bottom:22px;"></div>

        <button class="btn primary" id="ob-identity-next" style="width:100%;padding:12px;font-size:13.5px;">Continue</button>
      </div>
      ${progressDots(2,5)}
    `);

    function renderVoiceOptions(){
      const wrap = document.getElementById('ob-voices');
      const list = DATA.assistantVoices[ob.gender];
      wrap.innerHTML = list.map(v => `
        <button class="ob-voice-btn" data-voice="${v.id}" style="display:flex;align-items:center;justify-content:space-between;
          padding:11px 14px;border-radius:10px;border:1px solid ${ob.voiceId===v.id?'var(--amber)':'var(--hairline-2)'};
          background:${ob.voiceId===v.id?'var(--amber-tint)':'var(--panel-2)'};text-align:left;">
          <span>
            <span style="font-weight:700;font-size:13px;color:var(--text-hi);">${v.label}</span>
            <span style="font-size:11.5px;color:var(--text-low);display:block;margin-top:1px;">${v.desc}</span>
          </span>
          ${ob.voiceId===v.id ? icon('check','var(--amber)',16) : ''}
        </button>
      `).join('');
      wrap.querySelectorAll('.ob-voice-btn').forEach(btn => {
        btn.addEventListener('click', () => { ob.voiceId = btn.dataset.voice; renderVoiceOptions(); });
      });
    }
    renderVoiceOptions();

    document.querySelectorAll('.ob-gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ob.assistantName = document.getElementById('ob-name').value.trim() || ob.assistantName;
        ob.gender = btn.dataset.gender;
        renderIdentity();
      });
    });

    document.getElementById('ob-identity-next').addEventListener('click', () => {
      const nameVal = document.getElementById('ob-name').value.trim();
      ob.assistantName = nameVal || 'ONE';
      ob.step = 'register';
      renderRegister();
    });
  }

  // ---------------- STEP 4: Registration ----------------
  function renderRegister(){
    root.innerHTML = shell(`
      ${brandMark()}
      <div style="background:var(--panel);border:1px solid var(--hairline);border-radius:20px;padding:30px 28px;max-height:80vh;overflow-y:auto;">
        <div style="font-family:var(--font-head);font-size:18px;font-weight:700;margin-bottom:4px;text-align:center;">Set up ${ob.assistantName}</div>
        <div style="font-size:12.5px;color:var(--text-low);margin-bottom:20px;text-align:center;line-height:1.5;">
          These details let ${ob.assistantName} draft legal documents under your country's law, recognize your voice
          calls, and enroll you in the AIG network.
        </div>

        ${formField('ob-fullname','Full name','text','Jane Doe', ob.form.fullName)}
        ${formField('ob-email','Email','email','you@company.com', ob.form.email)}
        ${formField('ob-phone','Phone number','tel','+358 40 123 4567', ob.form.phone)}

        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;">Country</label>
        <select id="ob-country" style="width:100%;margin-top:6px;margin-bottom:16px;padding:11px 14px;background:var(--panel-2);
          border:1px solid var(--hairline-2);border-radius:10px;color:var(--text-hi);font-size:14px;">
          <option value="">Select your country</option>
          ${COUNTRIES.map(c => `<option value="${c}" ${ob.form.country===c?'selected':''}>${c}</option>`).join('')}
        </select>

        <div style="height:1px;background:var(--hairline);margin:18px 0;"></div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--gold);font-weight:700;margin-bottom:10px;">
          AIG Network — optional
        </div>

        ${formField('ob-sponsor','Sponsor invite code (optional)','text','e.g. ME8841', ob.form.sponsorCode)}
        ${formField('ob-memberid','Existing AIG member ID (optional)','text','if you already have one', ob.form.memberId)}

        <div style="font-size:11.5px;color:var(--text-low);line-height:1.5;margin-bottom:20px;">
          No sponsor code? You'll be enrolled as a <strong style="color:var(--text-hi);">free AIG member</strong> automatically —
          free members can use the assistant fully; paid membership unlocks the business and network dashboards.
        </div>

        <button class="btn primary" id="ob-register-next" style="width:100%;padding:12px;font-size:13.5px;">Create my assistant</button>
      </div>
      ${progressDots(3,5)}
    `);

    function formField(id,label,type,placeholder,value){
      return `
        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;">${label}</label>
        <input id="${id}" type="${type}" placeholder="${placeholder}" value="${value||''}"
          style="width:100%;margin-top:6px;margin-bottom:16px;padding:11px 14px;background:var(--panel-2);
          border:1px solid var(--hairline-2);border-radius:10px;color:var(--text-hi);font-size:14px;" />
      `;
    }

    document.getElementById('ob-register-next').addEventListener('click', () => {
      ob.form.fullName = document.getElementById('ob-fullname').value.trim();
      ob.form.email = document.getElementById('ob-email').value.trim();
      ob.form.phone = document.getElementById('ob-phone').value.trim();
      ob.form.country = document.getElementById('ob-country').value;
      ob.form.sponsorCode = document.getElementById('ob-sponsor').value.trim();
      ob.form.memberId = document.getElementById('ob-memberid').value.trim();

      if(!ob.form.fullName || !ob.form.email || !ob.form.country){
        alert('Please fill in at least your name, email, and country — ' + ob.assistantName + ' needs these to set up your legal jurisdiction.');
        return;
      }
      ob.step = 'username';
      renderUsername();
    });
  }

  // ---------------- STEP 5: Username selection ----------------
  // Real name (collected above) stays attached to legal/KYC/document
  // contexts only. From here on, the username is what's actually
  // shown across the network: leaderboards, referral attribution,
  // commission records, and anything else other members or admins
  // see. This keeps recognition and awarding consistent without
  // exposing real names network-wide.
  function slugifySuggestion(name){
    const base = (name || '').toLowerCase().trim().split(' ')[0] || 'member';
    const cleaned = base.replace(/[^a-z0-9]/g, '');
    const suffix = Math.floor(100 + Math.random() * 900);
    return (cleaned || 'member') + suffix;
  }

  function isValidUsername(u){
    return /^[a-z0-9_]{3,20}$/i.test(u);
  }

  function renderUsername(){
    if(!ob.form.username){
      ob.form.username = slugifySuggestion(ob.form.fullName);
    }
    const suggestions = [
      slugifySuggestion(ob.form.fullName),
      slugifySuggestion(ob.form.fullName),
      slugifySuggestion(ob.form.fullName),
    ];

    root.innerHTML = shell(`
      ${brandMark()}
      <div style="background:var(--panel);border:1px solid var(--hairline);border-radius:20px;padding:30px 28px;">
        <div style="font-family:var(--font-head);font-size:18px;font-weight:700;margin-bottom:4px;text-align:center;">Choose your username</div>
        <div style="font-size:12.5px;color:var(--text-low);margin-bottom:20px;text-align:center;line-height:1.5;">
          This is what shows on leaderboards, referrals, and commission records across the network —
          not your real name. You can change it later in Settings.
        </div>

        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;">Username</label>
        <input id="ob-username" type="text" value="${ob.form.username}" maxlength="20" placeholder="e.g. nightfox42"
          style="width:100%;margin-top:6px;margin-bottom:8px;padding:11px 14px;background:var(--panel-2);
          border:1px solid var(--hairline-2);border-radius:10px;color:var(--text-hi);font-size:14px;" />
        <div id="ob-username-hint" style="font-size:11px;color:var(--text-low);margin-bottom:16px;min-height:14px;">
          3–20 characters: letters, numbers, underscores only.
        </div>

        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:var(--text-low);font-weight:700;margin-bottom:8px;">Or pick a suggestion</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px;">
          ${suggestions.map(s => `<button class="ob-username-suggestion" data-name="${s}" style="padding:8px 14px;border-radius:999px;
            border:1px solid var(--hairline-2);background:var(--panel-2);color:var(--amber);font-size:12.5px;">${s}</button>`).join('')}
        </div>

        <button class="btn primary" id="ob-username-next" style="width:100%;padding:12px;font-size:13.5px;">Continue</button>
      </div>
      ${progressDots(3,5)}
    `);

    const input = document.getElementById('ob-username');
    const hint = document.getElementById('ob-username-hint');

    function validateLive(){
      const v = input.value.trim();
      if(!v){ hint.textContent = '3–20 characters: letters, numbers, underscores only.'; hint.style.color = 'var(--text-low)'; return; }
      if(isValidUsername(v)){ hint.textContent = 'Looks good.'; hint.style.color = 'var(--good)'; }
      else { hint.textContent = 'Only letters, numbers, and underscores — 3 to 20 characters.'; hint.style.color = 'var(--bad)'; }
    }
    input.addEventListener('input', validateLive);

    document.querySelectorAll('.ob-username-suggestion').forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.dataset.name;
        validateLive();
      });
    });

    document.getElementById('ob-username-next').addEventListener('click', () => {
      const v = input.value.trim();
      if(!isValidUsername(v)){
        hint.textContent = 'Enter a valid username before continuing — only letters, numbers, and underscores, 3 to 20 characters.';
        hint.style.color = 'var(--bad)';
        input.focus();
        return;
      }
      ob.form.username = v;
      finishOnboarding();
    });
  }

  function finishOnboarding(){
    // Wire onboarding results into the shared DATA model.
    // IMPORTANT: DATA.user.name (real, legal name) is kept ONLY for
    // legal-document drafting and jurisdiction logic. Everywhere else
    // — sidebar, greetings, leaderboards, referral/commission records
    // — uses DATA.user.username instead, so recognition and awarding
    // never depend on exposing a real name across the network.
    DATA.user.name = ob.form.fullName || DATA.user.name;
    DATA.user.username = ob.form.username;
    DATA.user.assistantName = ob.assistantName;
    DATA.user.assistantGender = ob.gender;
    DATA.user.assistantVoiceId = ob.voiceId;
    DATA.user.email = ob.form.email;
    DATA.user.phone = ob.form.phone;
    DATA.user.country = ob.form.country;
    DATA.legal.jurisdiction = ob.form.country || DATA.legal.jurisdiction;
    DATA.network.sponsor = ob.form.sponsorCode || null;
    DATA.membership.tier = ob.form.sponsorCode ? 'free' : 'free'; // always starts free regardless of sponsor
    DATA.user.initials = (ob.form.username || 'You').slice(0, 2).toUpperCase();

    showWelcomeThenLaunch();
  }

  function showWelcomeThenLaunch(){
    root.innerHTML = shell(`
      ${brandMark()}
      <div style="background:var(--panel);border:1px solid var(--hairline);border-radius:20px;padding:40px 28px;text-align:center;">
        <div style="width:64px;height:64px;border-radius:50%;background:var(--good-tint);margin:0 auto 18px auto;
          display:flex;align-items:center;justify-content:center;">${icon('check','var(--good)',30)}</div>
        <div style="font-family:var(--font-head);font-size:19px;font-weight:700;margin-bottom:8px;">
          ${ob.assistantName} is ready, @${DATA.user.username}.
        </div>
        <div style="font-size:12.5px;color:var(--text-low);line-height:1.6;margin-bottom:4px;">
          You're enrolled as a free AIG member${DATA.network.sponsor ? ' under sponsor ' + DATA.network.sponsor : ''}.
          ${ob.assistantName} will keep learning your habits, your business, and your voice from here on.
        </div>
      </div>
      ${progressDots(4,5)}
    `);
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('one:onboarding-complete'));
    }, 1900);
  }

  // expose a manual restart hook for Settings ("redo setup")
  window.ONE_ONBOARDING = {
    restart(){ ob.step='lock'; ob.scanning=false; renderLock(); },
  };

  renderLock();
})();
