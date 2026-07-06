# GitHub Organization Setup Guide

**Date:** 2026-07-06  
**Organization:** AIG-Global  
**Target:** 10 repositories  
**Status:** Ready for setup  

---

## Pre-Setup

### Requirements

- [ ] GitHub organization created (AIG-Global)
- [ ] Organization owner access (you)
- [ ] GitHub CLI installed locally (`gh --version`)
- [ ] Git configured (`git config --global user.name` and `git config --global user.email`)

### Create Organization

If you don't have the org yet:

1. Go to https://github.com/account/organizations/new
2. Enter organization name: `AIG-Global`
3. Billing email (your email)
4. Organization contact: (your email)
5. Click "Create organization"

### Authenticate CLI

```bash
gh auth login
# Follow prompts:
# 1. Select "GitHub.com"
# 2. Select "HTTPS"
# 3. Select "Yes" to authenticate with your credentials
# 4. Paste personal access token or complete browser auth
```

---

## Repository Setup

### Step 1: Create All 10 Repositories

Run these commands to create all repositories:

```bash
# Navigate to a working directory
cd ~/projects

# Create each repository
gh repo create AIG-Global/aig-platform --public --description "Core runtime and services" --source=. --remote=origin --push 2>/dev/null || echo "Platform repo (may already exist)"

gh repo create AIG-Global/aig-identity --public --description "Authentication and RBAC service"

gh repo create AIG-Global/aig-memory --public --description "AI memory and context engine"

gh repo create AIG-Global/aig-beam-me-up --public --description "Cross-device synchronization"

gh repo create AIG-Global/aig-marketplace --public --description "Marketplace and SDK for extensions"

gh repo create AIG-Global/aig-aios --public --description "AI Operating System distribution"

gh repo create AIG-Global/aig-design --public --description "UI/UX design system and components"

gh repo create AIG-Global/aig-diana --public --description "Diana character identity and assets"

gh repo create AIG-Global/ai-docs --public --description "Technical documentation"

gh repo create AIG-Global/aig-product --public --description "Product strategy and roadmap"
```

### Step 2: Configure Each Repository

For each repository, configure:

```bash
# Set up repository settings (example for aig-platform)
# Replace REPO_NAME with each repository name

REPO_NAME="aig-platform"

# Clone the repo (if not already cloned)
git clone https://github.com/AIG-Global/$REPO_NAME.git
cd $REPO_NAME

# Create initial files
echo "# $REPO_NAME" > README.md
echo "node_modules/" > .gitignore
echo "dist/" >> .gitignore
echo ".env.local" >> .gitignore
echo ".DS_Store" >> .gitignore

# Create branch protection rules via GitHub CLI (requires additional configuration)
```

### Step 3: Set Up Branch Protection

For each repository, set up branch protection for `main`:

**Via GitHub Web UI:**

1. Go to each repository → Settings → Branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Check these:
   - ✅ Require a pull request before merging
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require approval of the most recent reviewers (2 minimum)
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators
5. Click "Create"

**Or via CLI (scripted):**

```bash
#!/bin/bash

REPOS=(
  "aig-platform"
  "aig-identity"
  "aig-memory"
  "aig-beam-me-up"
  "aig-marketplace"
  "aig-aios"
  "aig-design"
  "aig-diana"
  "ai-docs"
  "aig-product"
)

for REPO in "${REPOS[@]}"; do
  echo "Setting up branch protection for $REPO..."
  
  gh repo rule create \
    --repository "AIG-Global/$REPO" \
    --ruleset-name "main-protection" \
    --pattern "main" \
    --require-pull-request \
    --dismiss-stale-reviews \
    --require-approved-reviews \
    --required-review-count 2 \
    --require-status-checks \
    --require-up-to-date-branches
done
```

---

## Repository-Specific Setup

### 1. aig-platform (Master)

**Purpose:** Core runtime, API, and all services  

**Initial Setup:**

```bash
cd aig-platform

# Create directory structure if not exists
mkdir -p apps/{api,web}
mkdir -p packages/{identity,memory,beam-me-up}
mkdir -p docs/{architecture,api,guides}

# Add initial files
cat > README.md << 'EOF'
# AIG Platform

Core runtime and services for North Star ONE.

## Quick Start

```bash
pnpm install
pnpm dev
```

## Architecture

See [docs/architecture/MASTER_ARCHITECTURE.md](docs/architecture/MASTER_ARCHITECTURE.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
EOF

cat > CONTRIBUTING.md << 'EOF'
# Contributing

## Code Standards

- TypeScript strict mode
- 80%+ test coverage
- ESLint and Prettier
- 2 PR approvals required

## Development

```bash
pnpm install
pnpm dev
pnpm test
```

## Deployment

See [docs/deployment/README.md](docs/deployment/README.md)
EOF

cat > .github/workflows/ci.yml << 'EOF'
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
EOF

git add .
git commit -m "initial: setup aig-platform repository"
git push origin main
```

**Labels to create:**

```bash
gh label create --repo AIG-Global/aig-platform "type: bug" -c "d73a4a" -d "Bug fixes"
gh label create --repo AIG-Global/aig-platform "type: feature" -c "0075ca" -d "New features"
gh label create --repo AIG-Global/aig-platform "type: docs" -c "0366d6" -d "Documentation"
gh label create --repo AIG-Global/aig-platform "priority: high" -c "b60205" -d "High priority"
gh label create --repo AIG-Global/aig-platform "priority: low" -c "cccccc" -d "Low priority"
gh label create --repo AIG-Global/aig-platform "status: in-progress" -c "fbca04" -d "In progress"
gh label create --repo AIG-Global/aig-platform "status: blocked" -c "d73a4a" -d "Blocked"
gh label create --repo AIG-Global/aig-platform "sprint: sprint-1-2" -c "0075ca" -d "Sprint 1-2"
```

### 2. aig-identity

**Purpose:** Authentication and RBAC  

**Initial Setup:**

```bash
cd aig-identity

cat > README.md << 'EOF'
# AIG Identity

Authentication, JWT, and RBAC service for North Star ONE.

## Features

- JWT authentication
- Role-based access control (RBAC)
- OAuth2/SAML support (future)
- MFA support (future)

## API

See [docs/API.md](docs/API.md)

## Development

```bash
npm install
npm run build
npm test
```
EOF

git add .
git commit -m "initial: setup aig-identity repository"
git push origin main
```

### 3. aig-memory

```bash
cd aig-memory

cat > README.md << 'EOF'
# AIG Memory

AI memory and context engine for North Star ONE.

## Features

- Vector embeddings
- Semantic search
- Context management
- Long-term memory

## API

See [docs/API.md](docs/API.md)

## Development

```bash
npm install
npm run build
npm test
```
EOF

git add .
git commit -m "initial: setup aig-memory repository"
git push origin main
```

### 4. aig-beam-me-up

```bash
cd aig-beam-me-up

cat > README.md << 'EOF'
# Beam Me Up

Cross-device synchronization service for North Star ONE.

## Features

- Device sync
- Conflict resolution
- Offline support
- Cloud synchronization

## API

See [docs/API.md](docs/API.md)

## Development

```bash
npm install
npm run build
npm test
```
EOF

git add .
git commit -m "initial: setup aig-beam-me-up repository"
git push origin main
```

### 5. aig-marketplace

```bash
cd aig-marketplace

cat > README.md << 'EOF'
# AIG Marketplace

Marketplace and SDK for third-party extensions.

## For Developers

See [SDK_GUIDE.md](SDK_GUIDE.md)

## Features

- Skill marketplace
- Plugin ecosystem
- App registry
- Developer SDK

## Development

```bash
npm install
npm run dev
npm test
```
EOF

git add .
git commit -m "initial: setup aig-marketplace repository"
git push origin main
```

### 6. aig-aios

```bash
cd aig-aios

cat > README.md << 'EOF'
# AIOS - AI Operating System

Cross-platform distribution of North Star ONE.

## Platforms

- Desktop (Windows, macOS, Linux)
- Mobile (iOS, Android)
- Web
- Voice
- Ambient

## Development

```bash
npm install
npm run dev
npm test
```
EOF

git add .
git commit -m "initial: setup aig-aios repository"
git push origin main
```

### 7. aig-design

```bash
cd aig-design

cat > README.md << 'EOF'
# AIG Design System

UI/UX design system and component library.

## Features

- Diana component library
- Design tokens
- Design guidelines
- Storybook

## Development

```bash
npm install
npm run storybook
npm test
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
EOF

git add .
git commit -m "initial: setup aig-design repository"
git push origin main
```

### 8. aig-diana

```bash
cd aig-diana

cat > README.md << 'EOF'
# Diana

Diana character identity, assets, and interaction guidelines.

## Contents

- Character definition
- Brand guidelines
- Voice and tone
- Assets and illustrations
- Prompts and examples

## Brand Guidelines

See [BRAND_GUIDE.md](BRAND_GUIDE.md)

## Character Guide

See [CHARACTER_GUIDE.md](CHARACTER_GUIDE.md)
EOF

git add .
git commit -m "initial: setup aig-diana repository"
git push origin main
```

### 9. ai-docs

```bash
cd ai-docs

cat > README.md << 'EOF'
# Technical Documentation

Complete technical documentation for North Star ONE.

## Table of Contents

- [Architecture](architecture/README.md)
- [API Reference](api/README.md)
- [Guides](guides/README.md)
- [Deployment](deployment/README.md)

## Quick Links

- [Getting Started](guides/GETTING_STARTED.md)
- [Development Setup](guides/DEVELOPMENT_SETUP.md)
- [API Reference](api/API.md)
EOF

mkdir -p {architecture,api,guides,deployment}

git add .
git commit -m "initial: setup ai-docs repository"
git push origin main
```

### 10. aig-product

```bash
cd aig-product

cat > README.md << 'EOF'
# Product

Product strategy, roadmap, and specifications.

## Contents

- [Strategy](strategy/README.md)
- [Roadmap](roadmap/README.md)
- [Specifications](specs/README.md)

## Key Documents

- [North Star Statement](strategy/NORTH_STAR_STATEMENT.md)
- [Master Roadmap](roadmap/MASTER_ROADMAP.md)
- [Requirements](specs/PRODUCT_REQUIREMENTS.md)
EOF

mkdir -p {strategy,roadmap,specs,requirements}

git add .
git commit -m "initial: setup aig-product repository"
git push origin main
```

---

## Team & Permissions

### Create Teams

```bash
# Create teams
gh api --method POST /orgs/AIG-Global/teams \
  -f name="engineering" \
  -f description="Engineering team"

gh api --method POST /orgs/AIG-Global/teams \
  -f name="product" \
  -f description="Product team"

gh api --method POST /orgs/AIG-Global/teams \
  -f name="design" \
  -f description="Design team"

gh api --method POST /orgs/AIG-Global/teams \
  -f name="leadership" \
  -f description="Leadership team"
```

### Assign Members

```bash
# Add user to team
gh api --method PUT /orgs/AIG-Global/teams/engineering/memberships/{username} \
  -f role="member"

# Add admin (leadership only)
gh api --method PUT /orgs/AIG-Global/teams/leadership/memberships/{username} \
  -f role="maintainer"
```

---

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/` files in each repository:

#### Shared Workflow Template

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
```

---

## Secrets Management

### Set Up Secrets

```bash
# For each repository, set secrets:

gh secret set DATABASE_URL \
  --repo AIG-Global/aig-platform \
  --body "postgresql://user:pass@localhost:5432/aig_dev"

gh secret set JWT_SECRET \
  --repo AIG-Global/aig-identity \
  --body "your-jwt-secret-key-here"

gh secret set OPENAI_API_KEY \
  --repo AIG-Global/aig-platform \
  --body "sk-..."

gh secret set AWS_ACCESS_KEY_ID \
  --repo AIG-Global/aig-platform \
  --body "..."

gh secret set AWS_SECRET_ACCESS_KEY \
  --repo AIG-Global/aig-platform \
  --body "..."
```

### Never Commit Secrets

```bash
# Add to .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
echo "secrets/" >> .gitignore

# Use .env.example for documentation
cat > .env.example << 'EOF'
DATABASE_URL=postgresql://user:pass@localhost:5432/aig
JWT_SECRET=your-secret-here
OPENAI_API_KEY=sk-...
EOF
```

---

## Monitoring & Analytics

### Set Up Insights

For each repository:

1. Go to repository → Insights
2. Check:
   - Network (track commits)
   - Traffic (track clones/views)
   - Pulse (track activity)
   - Community (check for issues/PRs)

### Set Up Actions Alerts

1. Go to repository → Settings → Actions → General
2. Enable notifications for:
   - Workflow run failures
   - Pull request reviews

---

## Documentation

### Copy Documentation to Repositories

```bash
# Copy strategic docs to aig-product
cp PROJECT_CHARTER.md AIG-Global/aig-product/
cp MASTER_ROADMAP.md AIG-Global/aig-product/

# Copy architecture docs to ai-docs
cp NORTH_STAR_ONE_MASTER_ARCHITECTURE.md AIG-Global/ai-docs/
cp PHASE_1_IMPLEMENTATION_GUIDE.md AIG-Global/ai-docs/

# Copy design docs to aig-design
cp DIANA_DESIGN_BIBLE.md AIG-Global/aig-design/

# Copy identity docs to aig-identity
mkdir -p AIG-Global/aig-identity/docs
echo "# AIG Identity Service" > AIG-Global/aig-identity/docs/README.md

# Copy memory docs to aig-memory
mkdir -p AIG-Global/aig-memory/docs
echo "# AI Memory Engine" > AIG-Global/aig-memory/docs/README.md

# Copy Beam Me Up docs
mkdir -p AIG-Global/aig-beam-me-up/docs
echo "# Beam Me Up - Cross-Device Sync" > AIG-Global/aig-beam-me-up/docs/README.md

# Copy marketplace docs
mkdir -p AIG-Global/aig-marketplace/docs
cp MARKETPLACE_SDK_GUIDE.md AIG-Global/aig-marketplace/docs/

# Copy AIOS docs
mkdir -p AIG-Global/aig-aios/docs
cp AIOS_TECHNICAL_SPECIFICATION.md AIG-Global/aig-aios/docs/
```

---

## Automation Scripts

### Mass Update Script

```bash
#!/bin/bash

# Update all repositories with common files

REPOS=(
  "aig-platform"
  "aig-identity"
  "aig-memory"
  "aig-beam-me-up"
  "aig-marketplace"
  "aig-aios"
  "aig-design"
  "aig-diana"
  "ai-docs"
  "aig-product"
)

for REPO in "${REPOS[@]}"; do
  echo "Updating $REPO..."
  
  cd "/path/to/$REPO"
  
  # Add common files
  cp ../LICENSE ./LICENSE
  cp ../CONTRIBUTING.md ./CONTRIBUTING.md
  cp ../CODE_OF_CONDUCT.md ./CODE_OF_CONDUCT.md
  
  # Commit if changes
  if [[ $(git status --porcelain) ]]; then
    git add .
    git commit -m "chore: update common files"
    git push origin main
  fi
done
```

---

## Verification Checklist

- [ ] All 10 repositories created
- [ ] Branch protection enabled on all repos
- [ ] Teams created and members assigned
- [ ] Secrets configured
- [ ] CI/CD workflows running
- [ ] Documentation copied to repos
- [ ] Labels created
- [ ] First commits pushed
- [ ] README.md updated in each repo
- [ ] .gitignore configured
- [ ] GitHub Actions workflows enabled
- [ ] Webhooks configured (if needed)
- [ ] Project boards created (optional)
- [ ] Issue templates configured (optional)
- [ ] Pull request templates configured (optional)

---

## Maintenance

### Regular Tasks

**Weekly:**
- Review GitHub Actions logs
- Check for failing CI/CD
- Monitor for secrets exposure

**Monthly:**
- Update dependencies
- Review security advisories
- Archive old branches
- Clean up old pull requests

**Quarterly:**
- Audit repository permissions
- Review team structure
- Update documentation

---

**Your GitHub organization is now ready for Phase 1 execution.**

---

*GitHub Organization Setup Guide*  
*Date: 2026-07-06*  
*Version: 1.0*  
*Status: Ready for implementation*
