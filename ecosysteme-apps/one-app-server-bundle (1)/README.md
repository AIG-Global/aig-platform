# ONE — AIG Assistant: Server Bundle

This is the complete, self-contained server bundle: the end-user
ONE app (installable as an iPhone home-screen app), the internal
admin/monitoring dashboard, and the API that connects them — all
served by a single Node.js process with zero external runtime
dependencies (no npm install needed; everything runs on Node's
built-in modules).

## What's inside

```
server.js              Entry point - one process serves everything below
lib/                    Router, datastore, rate limiter (all hand-built, no deps)
middleware/             Auth guards, CORS, security headers
services/               Business logic: analytics, users, auth, payments, NOWPayments
routes/                 HTTP route handlers
scripts/seed.js         Generates realistic demo data
scripts/change-admin-password.js   Change the admin login password
data/                   JSON datastore (created on first run / seed)
public/                 Admin & Monitoring dashboard (served at /admin/)
public-app/             The end-user ONE app - installable PWA (served at /)
install.sh              One-command install as a systemd service (Linux)
nginx.conf.example      Reverse-proxy + HTTPS reference config
.env.example            All configuration options, documented
```

## Quick start (local testing, no install needed)

```bash
node scripts/seed.js     # generates demo data into data/
node server.js           # starts the server
```

Then open:
- End-user app:    http://localhost:8090/
- Admin dashboard: http://localhost:8090/admin/  (login: admin / aig-admin-2026)
- Public API:      http://localhost:8090/api/v1/health

## Installing on a real server

You need a Linux server (Ubuntu/Debian assumed below) with Node.js 18+
and a domain pointed at it. Then:

```bash
# Upload this whole folder to the server, e.g.:
scp -r ./server youruser@your-server-ip:/tmp/one-app

# SSH in, then:
cd /tmp/one-app
sudo bash install.sh
```

install.sh will:
1. Check Node.js is installed and new enough
2. Create a dedicated, locked-down system user to run the service (never runs as root)
3. Copy the app to /opt/one-app
4. Seed demo data on first install only (never touches real data on reinstall)
5. Create a .env file from .env.example for you to fill in
6. Install and start a systemd service so it survives reboots and restarts on crash

After that:

```bash
sudo systemctl status one-app      # check it's running
journalctl -u one-app -f           # follow logs
```

### Put HTTPS in front of it (required for production)

The app works over plain HTTP for local testing, but for any real
deployment you need HTTPS, both because:
- iOS only treats an "Add to Home Screen" PWA as a fully standalone
  app over HTTPS
- The admin session cookie's Secure flag (auto-enabled when
  NODE_ENV=production, which install.sh sets) won't be sent over
  plain HTTP at all - admin login will silently fail

Steps:
```bash
sudo apt install nginx certbot python3-certbot-nginx
sudo cp nginx.conf.example /etc/nginx/sites-available/one-app
sudo nano /etc/nginx/sites-available/one-app   # replace your-domain.example.com
sudo ln -s /etc/nginx/sites-available/one-app /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.example.com
```

### Change the default admin password

The seeded admin login (admin / aig-admin-2026) is for local
testing only.

```bash
cd /opt/one-app
sudo -u one node scripts/change-admin-password.js admin "your new long password here"
```

### Configure NOWPayments (optional, for real crypto payments)

Edit /opt/one-app/.env:
```
NOWPAYMENTS_API_KEY=...
NOWPAYMENTS_IPN_SECRET=...
NOWPAYMENTS_SANDBOX=true
PUBLIC_BASE_URL=https://your-domain.example.com
```
Then sudo systemctl restart one-app. Without these, payment
creation runs in a clearly-labelled placeholder mode - the rest of
the system keeps working for testing either way.

## Installing the iPhone app (no Mac, no Apple Developer account needed)

The end-user app is a fully configured installable PWA. On an iPhone:

1. Open Safari (must be Safari - Chrome/Firefox on iOS can't install PWAs)
   and go to your domain, e.g. https://your-domain.example.com/
2. Tap the Share button (square with an arrow, bottom of screen)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

The ONE icon now appears on the home screen like any other app -
opens full-screen with no browser bar, has its own splash screen,
and works offline after the first load (via the bundled service
worker). This is genuinely installable and testable today; getting
onto the actual App Store/TestFlight later is a separate, larger
step (wrapping this in Capacitor + Xcode + an Apple Developer
account) that this bundle doesn't require you to do yet.

## Security notes

This bundle already includes:
- Rate limiting + per-account lockout on admin login
- Session cookies scoped to same-origin, Secure + SameSite=Strict in production
- CSP, X-Frame-Options, and a microphone permission policy scoped per-surface
  (the end-user app needs mic access for voice commands; the admin dashboard doesn't)
- Path-traversal-safe static file serving with symlink resolution
- Admin "upgrade override" actions are fully audit-logged and never generate
  network bonuses, distinct from real NOWPayments-confirmed upgrades which do
- Webhook signature verification (HMAC-SHA512) with amount/state sanity checks

Still your responsibility before going fully live:
- Change the admin password (above)
- Set real NOWPayments credentials or keep the feature in placeholder mode
- Put a firewall in front of the server exposing only 80/443 (nginx) - don't
  expose port 8090 directly to the internet
- Set up regular backups of the data/ directory (it's just JSON files -
  tar czf backup.tar.gz data/ on a cron job is enough at this scale)
