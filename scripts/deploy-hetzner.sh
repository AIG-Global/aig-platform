#!/bin/bash
# Deploy to Hetzner Cloud Server

set -e

# Configuration
HETZNER_SERVER_IP=${1:-""}
SSH_USER="root"
DEPLOY_PATH="/home/aig-platform"
APP_NAME="aig-platform"

if [ -z "$HETZNER_SERVER_IP" ]; then
  echo "Usage: ./deploy-hetzner.sh <SERVER_IP>"
  echo "Example: ./deploy-hetzner.sh 95.216.123.45"
  exit 1
fi

echo "🚀 Starting deployment to Hetzner ($HETZNER_SERVER_IP)..."

# 1. Copy files to server
echo "📦 Uploading application files..."
ssh -o StrictHostKeyChecking=no $SSH_USER@$HETZNER_SERVER_IP "mkdir -p $DEPLOY_PATH"
rsync -avz --delete \
  --exclude='.next' \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='*.log' \
  . $SSH_USER@$HETZNER_SERVER_IP:$DEPLOY_PATH/

# 2. Install dependencies and build
echo "🔨 Building application..."
ssh $SSH_USER@$HETZNER_SERVER_IP "cd $DEPLOY_PATH && \
  pnpm install && \
  pnpm build"

# 3. Start Docker containers
echo "🐳 Starting Docker containers..."
ssh $SSH_USER@$HETZNER_SERVER_IP "cd $DEPLOY_PATH && \
  docker-compose -f docker-compose.prod.yml up -d"

# 4. Verify deployment
echo "✅ Verifying deployment..."
sleep 5
curl -f http://$HETZNER_SERVER_IP:3003/auth || echo "⚠️  Health check pending..."

echo ""
echo "✨ Deployment complete!"
echo "📍 Access your app at: http://$HETZNER_SERVER_IP:3003"
echo "🔧 SSH into server: ssh root@$HETZNER_SERVER_IP"
