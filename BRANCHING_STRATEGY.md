# Git Branching Strategy & Governance

## Overview

This document outlines the Git branching strategy, workflow, and governance for the AIG Platform project. Following this strategy ensures clean history, stable production code, and smooth collaboration.

---

## Branch Structure

### Main Branches (Protected)

#### `main` - Production Release Branch
- **Purpose**: Stable, tested, production-ready code
- **Tags**: Semantic version tags (v0.1.0, v0.2.0, etc.)
- **Protection Rules**:
  - Require pull request reviews before merging
  - Require status checks to pass (tests, linting, build)
  - Require branches to be up to date before merging
  - Automatically delete head branches after merge

#### `develop` - Integration Branch
- **Purpose**: Integration point for feature development
- **Updates**: From feature branches and release branches
- **Protection Rules**:
  - Require pull request reviews
  - Require status checks to pass
  - Automatically delete head branches after merge

### Supporting Branches

#### Feature Branches: `feature/*`
```
feature/identity-service
feature/ai-memory-system
feature/marketplace
feature/mobile-app
```

**Rules**:
- Branched from: `develop`
- Merged back into: `develop` (via Pull Request)
- Naming convention: `feature/<description>` (kebab-case)
- Prefix with Jira/issue number if available: `feature/IAP-123-identity-service`

#### Bugfix Branches: `bugfix/*`
```
bugfix/streaming-disconnect
bugfix/provider-failover
bugfix/memory-leak
```

**Rules**:
- Branched from: `develop` (or `main` for production hotfixes)
- Merged back into: `develop` or `main`
- Naming convention: `bugfix/<description>`

#### Release Branches: `release/*`
```
release/v0.1.0
release/v0.2.0
```

**Rules**:
- Branched from: `develop`
- Merged into: `main` (tagged with version) and back-merged to `develop`
- Naming convention: `release/v<semantic-version>`
- Only version bumps and bug fixes on release branches
- No new features on release branches

#### Hotfix Branches: `hotfix/*`
```
hotfix/v0.1.1-security-patch
hotfix/v0.1.1-critical-bug
```

**Rules**:
- Branched from: `main`
- Merged back into: `main` (new patch version tag) and `develop`
- Naming convention: `hotfix/v<semantic-version>-<description>`
- Only critical production fixes
- Requires immediate review and testing

---

## Workflow

### Feature Development

```
develop
  ↓
  └─→ feature/my-feature (create branch)
       ↓
       (develop feature, commit regularly)
       ↓
       (push to remote)
       ↓
       (create Pull Request)
       ↓
       (code review, CI checks)
       ↓
       (merge to develop via PR)
       ↓
       (delete feature branch)
       ↓
develop (updated)
```

**Commands**:
```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Make changes, commit regularly
git add .
git commit -m "feat: add new capability"

# Push to remote
git push origin feature/my-feature

# Create PR on GitHub
# After review and CI passes:
# Merge PR (GitHub UI handles this)

# Delete local branch
git branch -d feature/my-feature
```

### Release Process

```
develop
  ↓
  └─→ release/v0.2.0 (create branch)
       ↓
       (bump version)
       ↓
       (update CHANGELOG)
       ↓
       (final testing, critical bugfixes only)
       ↓
       (merge to main, tag with version)
       ↓
main (v0.2.0 tagged)
  ↓
develop (back-merge release branch)
```

**Commands**:
```bash
# Create release branch
git checkout develop
git pull origin develop
git checkout -b release/v0.2.0

# Update version in package.json, pyproject.toml, etc.
# Update CHANGELOG.md with new version section
git add .
git commit -m "chore: bump version to v0.2.0"

# Final testing and critical bugfixes
# git commit -m "fix: critical issue"

# Merge to main
git checkout main
git pull origin main
git merge --no-ff release/v0.2.0
git tag -a v0.2.0 -m "Release version 0.2.0"
git push origin main --tags

# Back-merge to develop
git checkout develop
git pull origin develop
git merge --no-ff release/v0.2.0
git push origin develop

# Delete release branch
git branch -d release/v0.2.0
git push origin --delete release/v0.2.0
```

### Hotfix Process

```
main (v0.1.0)
  ↓
  └─→ hotfix/v0.1.1-critical-issue (create branch)
       ↓
       (fix issue)
       ↓
       (merge to main, tag v0.1.1)
       ↓
main (v0.1.1 tagged)
  ↓
develop (back-merge hotfix)
```

**Commands**:
```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/v0.1.1-critical-issue

# Make fix
git add .
git commit -m "fix: critical production issue"

# Merge to main
git checkout main
git pull origin main
git merge --no-ff hotfix/v0.1.1-critical-issue
git tag -a v0.1.1 -m "Hotfix release v0.1.1"
git push origin main --tags

# Back-merge to develop
git checkout develop
git pull origin develop
git merge --no-ff hotfix/v0.1.1-critical-issue
git push origin develop

# Delete hotfix branch
git branch -d hotfix/v0.1.1-critical-issue
git push origin --delete hotfix/v0.1.1-critical-issue
```

---

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build, CI/CD, dependencies, etc.
- `ci`: CI/CD configuration changes

### Scopes
- `ask-diana`: Ask Diana AI assistant module
- `identity`: Identity and authentication service
- `memory`: AI Memory system
- `api`: Backend API
- `web`: Frontend web application
- `infra`: Infrastructure and DevOps
- `docs`: Documentation
- `release`: Release-related commits

### Examples

```
feat(ask-diana): add safety engine for threat detection

- Implement prompt injection detection
- Add PII protection for email, phone, SSN
- Implement jailbreak detection

Closes #123
```

```
fix(ask-diana): fix streaming response disconnect

The streaming handler was not properly detecting client disconnects,
causing the server to attempt writing to closed connections.

- Add proper client disconnect detection
- Implement graceful cleanup
- Add retry logic

Fixes #456
```

```
docs: update README with new architecture details
```

---

## Pull Request Process

### Before Creating PR

1. **Branch is up to date**
   ```bash
   git fetch origin
   git merge origin/develop  # or origin/main
   ```

2. **Tests pass locally**
   ```bash
   pnpm test
   pnpm lint
   pnpm build
   ```

3. **Code follows project conventions**
   - TypeScript with strict mode
   - Conventional commits
   - No console.log statements
   - Proper error handling

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Related Issues
Closes #123

## Testing
Describe how you tested this change.

## Checklist
- [ ] My code follows the project style guidelines
- [ ] I have commented complex code sections
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally

## Screenshots (if applicable)
```

### Review Process

1. **Minimum 1 approval required** (maintainers have authority)
2. **All CI checks must pass** (tests, linting, build)
3. **Branch must be up to date** with base branch
4. **Squash commits** before merging (optional, depends on project preference)
5. **Delete branch** after merge

---

## Versioning Scheme

### Semantic Versioning Format
```
v<MAJOR>.<MINOR>.<PATCH>[-<PRERELEASE>][+<BUILD>]

Examples:
v0.1.0              # Initial release
v0.2.0              # New features
v0.2.1              # Bug fix
v1.0.0-rc.1         # Release candidate
v1.0.0+20260706     # Build metadata
```

### Version Bumping Rules

**MAJOR (v0→v1)**: Breaking changes
- Major API changes
- Significant architectural changes
- Database schema incompatibility

**MINOR (v0.1→v0.2)**: New features, backwards compatible
- New services (Identity, Memory, etc.)
- New major components
- New API endpoints

**PATCH (v0.1.0→v0.1.1)**: Bug fixes
- Bug fixes
- Performance improvements
- Documentation updates

---

## Release Checklist

- [ ] All features for release are merged to `develop`
- [ ] `develop` builds and passes all tests
- [ ] Create release branch from `develop`
- [ ] Update version numbers in all files
- [ ] Update CHANGELOG.md with new version
- [ ] Run full test suite
- [ ] Final code review on release branch
- [ ] Merge to `main` with `--no-ff`
- [ ] Tag with version and push tags
- [ ] Back-merge to `develop`
- [ ] Create GitHub Release with CHANGELOG
- [ ] Announce release in appropriate channels

---

## Repository Protection Rules

### For `main` Branch
```yaml
Require pull request reviews before merging:
  - Dismissal of stale pull request approvals: Enabled
  - Require code owner reviews: Enabled (if CODEOWNERS exists)
  - Require approval from reviewers with write access: 1

Require status checks to pass before merging:
  - Tests passing
  - Linting passing
  - Build successful

Require branches to be up to date before merging: Enabled
Include administrators: Enabled
Restrict who can push to matching branches: Disabled (for now)
```

### For `develop` Branch
```yaml
Require pull request reviews before merging:
  - Dismissal of stale pull request approvals: Enabled
  - Require code owner reviews: Enabled (if CODEOWNERS exists)

Require status checks to pass before merging:
  - Tests passing
  - Linting passing

Include administrators: Enabled
```

---

## FAQs

**Q: Can I commit directly to `develop`?**  
A: No, all changes should go through feature branches and PRs.

**Q: What if I need to revert a commit on `main`?**  
A: Create a hotfix branch from `main`, fix the issue, and follow the hotfix process.

**Q: How do I keep my feature branch up to date?**  
A: Use `git fetch origin && git merge origin/develop` periodically.

**Q: Should I rebase or merge?**  
A: Use merge with `--no-ff` to maintain branch history. PRs handle this automatically.

**Q: Can I delete `develop`?**  
A: No, `develop` is a protected main branch. Never delete it.

---

## Resources

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Branching Model (nvie/git-flow)](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
