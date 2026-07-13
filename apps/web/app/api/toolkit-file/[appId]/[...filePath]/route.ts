import fs from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { canAccessByPackage, readAuthSessionToken, AUTH_SESSION_COOKIE } from '../../../../../lib/auth-session'
import { TOOLKIT_APPS } from '../../../../../lib/toolkit-apps'

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
}

const resolveAppsRoot = async () => {
  const candidateRoots = [
    path.resolve(process.cwd(), 'ecosysteme-apps'),
    path.resolve(process.cwd(), '..', '..', 'ecosysteme-apps'),
  ]

  for (const root of candidateRoots) {
    try {
      const stat = await fs.stat(root)
      if (stat.isDirectory()) return root
    } catch {
      // try next candidate
    }
  }

  return null
}

export async function GET(
  req: NextRequest,
  { params }: { params: { appId: string; filePath?: string[] } }
) {
  const session = readAuthSessionToken(req.cookies.get(AUTH_SESSION_COOKIE)?.value)
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const app = TOOLKIT_APPS.find((entry) => entry.id === params.appId)
  if (!app) {
    return new NextResponse('Unknown app id', { status: 404 })
  }

  if (!canAccessByPackage(session.packageId, app.minPackage)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const appsRoot = await resolveAppsRoot()
  if (!appsRoot) {
    return new NextResponse('Apps root not found', { status: 404 })
  }

  const appDirRelative = path.dirname(app.relativeHtmlPath)
  const requestedRelativePath = params.filePath && params.filePath.length > 0
    ? params.filePath.join('/')
    : 'index.html'

  const appDirAbsolute = path.resolve(appsRoot, appDirRelative)
  const targetAbsolute = path.resolve(appDirAbsolute, requestedRelativePath)

  if (!targetAbsolute.startsWith(appDirAbsolute)) {
    return new NextResponse('Invalid file path', { status: 400 })
  }

  try {
    const fileBuffer = await fs.readFile(targetAbsolute)
    const ext = path.extname(targetAbsolute).toLowerCase()
    const contentType = MIME_TYPES[ext] ?? 'application/octet-stream'

    if (ext === '.html') {
      const html = fileBuffer.toString('utf8')
      const publicSession = {
        email: session.email,
        packageId: session.packageId,
        userName: session.userName ?? '',
        userPassword: session.userPassword ?? '',
        appId: app.id,
      }
      const serializedSession = JSON.stringify(publicSession).replace(/</g, '\\u003c')

      // Provide a consistent in-browser auth context so toolkit apps can auto-login without extra prompts.
      const bootstrapScript = `<script>(async function(){
var s=${serializedSession};
window.AIG_USER_CONTEXT=s;

var normalizeEmail = function(v){ return String(v || '').trim().toLowerCase(); };
var safeJson = function(value, fallback){ try { return JSON.parse(value || fallback); } catch(e) { return JSON.parse(fallback); } };
var nowIso = function(){ return new Date().toISOString(); };
var monthKey = function(d){ d = d || new Date(); return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2,'0'); };

try {
  localStorage.setItem('aigUserContext', JSON.stringify(s));
  localStorage.setItem('userEmail', s.email || '');
  localStorage.setItem('userPackage', s.packageId || 'packagea');
  if (s.userName) {
    localStorage.setItem('userName', s.userName);
    localStorage.setItem('username', s.userName);
    localStorage.setItem('nickname', s.userName);
  }
  if (s.userPassword) {
    localStorage.setItem('userPassword', s.userPassword);
    localStorage.setItem('password', s.userPassword);
  }
} catch (e) {}

var passwordHash = '';
try {
  if (s.userPassword && window.crypto && window.crypto.subtle) {
    var enc = new TextEncoder().encode(s.userPassword);
    var buf = await window.crypto.subtle.digest('SHA-256', enc);
    var arr = Array.from(new Uint8Array(buf));
    passwordHash = arr.map(function(b){ return b.toString(16).padStart(2, '0'); }).join('');
  }
} catch (e) {}

try {
  var email = normalizeEmail(s.email);
  if (email && passwordHash) {
    if (s.appId === 'aig-moneygames') {
      var mgUsers = safeJson(localStorage.getItem('aigmg_users_v1'), '{}');
      if (!mgUsers[email]) {
        mgUsers[email] = {
          email: email,
          passwordHash: passwordHash,
          nickname: (s.userName || email.split('@')[0] || 'member').slice(0, 20),
          createdAt: nowIso(),
          currentMonthKey: monthKey(),
          balance: 10000,
          monthlyHistory: [],
          yearlyTotals: {}
        };
        localStorage.setItem('aigmg_users_v1', JSON.stringify(mgUsers));
      }
      localStorage.setItem('aigmg_session_v1', JSON.stringify({ email: email }));
    }

    if (s.appId === 'aig-investor-alerts') {
      var iaUsers = safeJson(localStorage.getItem('aig_auth_users_v1'), '{}');
      if (!iaUsers[email]) {
        iaUsers[email] = {
          email: email,
          passwordHash: passwordHash,
          createdAt: nowIso(),
          riskAcknowledged: true,
          riskAcknowledgedAt: nowIso(),
          riskDisclosureVersion: '2026-06-30'
        };
        localStorage.setItem('aig_auth_users_v1', JSON.stringify(iaUsers));
      }
      localStorage.setItem('aig_auth_session_v1', JSON.stringify({ email: email, since: nowIso() }));
    }

    if (s.appId === 'aig-me') {
      var meUsers = safeJson(localStorage.getItem('aigme_auth_users_v1'), '{}');
      if (!meUsers[email]) {
        meUsers[email] = {
          email: email,
          passwordHash: passwordHash,
          createdAt: nowIso(),
          termsAccepted: true,
          termsAcceptedAt: nowIso(),
          disclosureVersion: '2026-06-30'
        };
        localStorage.setItem('aigme_auth_users_v1', JSON.stringify(meUsers));
      }
      localStorage.setItem('aigme_auth_session_v1', JSON.stringify({ email: email, since: nowIso() }));
    }
  }
} catch (e) {}

var fillInputs = function() {
  try {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('input'));
    var normalize = function(v) { return (v || '').toLowerCase(); };
    var looksLike = function(el, tokens) {
      var haystack = [
        normalize(el.name),
        normalize(el.id),
        normalize(el.placeholder),
        normalize(el.getAttribute('aria-label')),
        normalize(el.getAttribute('autocomplete')),
      ].join(' ');
      for (var i = 0; i < tokens.length; i++) {
        if (haystack.indexOf(tokens[i]) !== -1) return true;
      }
      return false;
    };

    var dispatch = function(el) {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };

    var emailValue = s.email || '';
    var usernameValue = s.userName || s.email || '';
    var passwordValue = s.userPassword || '';

    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      var type = normalize(el.type);

      if (type === 'hidden' || el.disabled || el.readOnly) continue;

      if (!el.value) {
        if (type === 'email' || looksLike(el, ['email', 'mail', 'loginemail', 'registeremail'])) {
          if (emailValue) {
            el.value = emailValue;
            dispatch(el);
          }
          continue;
        }

        if (type === 'password' || looksLike(el, ['password', 'pass', 'loginpassword', 'registerpassword'])) {
          if (passwordValue) {
            el.value = passwordValue;
            dispatch(el);
          }
          continue;
        }

        if (type === 'text' || looksLike(el, ['username', 'user', 'login', 'nickname', 'nick'])) {
          if (usernameValue) {
            el.value = usernameValue;
            dispatch(el);
          }
        }
      }
    }
  } catch (e) {}
};

fillInputs();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fillInputs, { once: true });
}

var attempts = 0;
var timer = setInterval(function() {
  attempts += 1;
  fillInputs();
  if (attempts >= 12) clearInterval(timer);
}, 250);
})();</script>`
      const injectedHtml = html.includes('</head>')
        ? html.replace('</head>', `${bootstrapScript}</head>`)
        : `${bootstrapScript}${html}`

      return new NextResponse(injectedHtml, {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-cache',
        },
      })
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'content-type': contentType,
        'cache-control': 'no-cache',
      },
    })
  } catch {
    return new NextResponse('File not found', { status: 404 })
  }
}
