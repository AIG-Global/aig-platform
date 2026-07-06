#!/bin/bash
# Build all Phase 2 packages and the main API
# Run from workspace root: bash build-all.sh

echo "🔨 Building Phase 2 packages..."

echo "📦 Building @aig/identity..."
cd packages/identity
npm run build
cd ../..

echo "📦 Building @aig/user-management..."
cd packages/user-management
npm run build
cd ../..

echo "📦 Building @aig/organization-management..."
cd packages/organization-management
npm run build
cd ../..

echo "🚀 Building API..."
cd apps/api
npm run build
cd ../..

echo "✅ All packages built successfully!"
echo "Run 'npm start' in apps/api to start the API"
