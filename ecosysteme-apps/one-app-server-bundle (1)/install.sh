#!/usr/bin/env bash
# ============================================================
# install.sh — Deploys the ONE server (end-user app + admin
# dashboard + API) to a Linux server as a systemd service.
#
# What this does:
#   1. Verifies Node.js is installed (>=18)
#   2. Copies this bundle to /opt/one-app (or $INSTALL_DIR)
#   3. Seeds the datastore if it doesn't already have data
#   4. Installs a systemd service so it starts on boot and
#      restarts automatically if it crashes
#   5. Prints next steps (env vars, nginx, certbot)
#
# Run as root or with sudo:  sudo bash install.sh
# ============================================================
set -euo pipefail

INSTALL_DIR="${INSTALL_DIR:-/opt/one-app}"
SERVICE_NAME="one-app"
SERVICE_USER="${SERVICE_USER:-one}"
PORT="${PORT:-8090}"

echo "== ONE server install =="
echo "Install dir: $INSTALL_DIR"
echo "Service user: $SERVICE_USER"
echo "Port: $PORT"
echo

if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo or as root." >&2
  exit 1
fi

# ---- 1. Check Node.js ----
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install Node 18+ first, e.g.:"
  echo "  curl -fsSL https://deb.nodejs.org/setup_20.x | sudo bash -"
  echo "  sudo apt-get install -y nodejs"
  exit 1
fi
NODE_MAJOR=$(node -e "console.log(process.versions.node.split('.')[0])")
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Node.js 18+ is required (found $(node -v)). Please upgrade." >&2
  exit 1
fi
echo "Node.js $(node -v) found — OK"

# ---- 2. Create service user (no login shell, no home dir needed) ----
if ! id "$SERVICE_USER" >/dev/null 2>&1; then
  useradd --system --no-create-home --shell /usr/sbin/nologin "$SERVICE_USER"
  echo "Created system user: $SERVICE_USER"
fi

# ---- 3. Copy files ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$INSTALL_DIR"
rsync -a --exclude 'node_modules' --exclude '.git' "$SCRIPT_DIR"/ "$INSTALL_DIR"/
chown -R "$SERVICE_USER":"$SERVICE_USER" "$INSTALL_DIR"
echo "Copied app to $INSTALL_DIR"

# ---- 4. Seed data on first install only (never overwrite real data) ----
if [ ! -f "$INSTALL_DIR/data/users.json" ]; then
  echo "No existing data found — seeding demo data..."
  (cd "$INSTALL_DIR" && sudo -u "$SERVICE_USER" node scripts/seed.js)
else
  echo "Existing data found in $INSTALL_DIR/data — leaving it untouched."
fi

# ---- 5. .env setup ----
if [ ! -f "$INSTALL_DIR/.env" ]; then
  cp "$INSTALL_DIR/.env.example" "$INSTALL_DIR/.env"
  chown "$SERVICE_USER":"$SERVICE_USER" "$INSTALL_DIR/.env"
  echo "Created $INSTALL_DIR/.env from .env.example — EDIT THIS before going live:"
  echo "  - PUBLIC_BASE_URL (your real https domain)"
  echo "  - NOWPAYMENTS_API_KEY / NOWPAYMENTS_IPN_SECRET (if accepting crypto payments)"
  echo "  - ADMIN_ORIGIN (only if the admin dashboard will be called cross-origin)"
fi

# ---- 6. systemd service ----
cat > /etc/systemd/system/"$SERVICE_NAME".service <<EOF
[Unit]
Description=ONE — AIG Assistant backend (app + admin dashboard + API)
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
Environment=NODE_ENV=production
Environment=PORT=$PORT
ExecStart=$(command -v node) $INSTALL_DIR/server.js
Restart=on-failure
RestartSec=3
# Hardening: the service only needs to read/write its own data dir.
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=$INSTALL_DIR/data

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

echo
echo "== Install complete =="
sleep 1
systemctl --no-pager status "$SERVICE_NAME" || true
echo
echo "ONE app (end users):  http://localhost:$PORT/"
echo "Admin dashboard:      http://localhost:$PORT/admin/"
echo "Default admin login:  admin / aig-admin-2026   <-- CHANGE THIS (see scripts/change-admin-password.js)"
echo
echo "Next steps for production:"
echo "  1. Edit $INSTALL_DIR/.env with your real domain and payment keys."
echo "  2. Put nginx (see nginx.conf.example) in front of this with a real TLS cert (certbot)."
echo "     The PWA install prompt and secure cookies both require HTTPS."
echo "  3. Change the default admin password."
echo "  4. journalctl -u $SERVICE_NAME -f     # to follow logs"
