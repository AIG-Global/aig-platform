# AIG Organization Repository Architecture

**Date:** 2026-07-06  
**Status:** Proposed Structure  

---

## 🏗️ Complete AIG Organization Structure

```
AIG-Global Organization
│
├── 🔵 Core Platform
│   ├── aig-platform          ← Main application (Phase 2 stabilized)
│   │   ├── apps/api          ← REST API with North Star ONE
│   │   ├── apps/web          ← Next.js frontend
│   │   ├── packages/identity
│   │   ├── packages/user-management
│   │   ├── packages/organization-management
│   │   ├── packages/registry (Stage 2 apps)
│   │   └── packages/north-star-one
│   │
│   ├── aig-diana             ← [NEW] Character & Brand Hub
│   │   ├── character/        ← Personality & specification
│   │   ├── visuals/          ← Logo, avatar, animations
│   │   ├── brand/            ← Brand guidelines
│   │   ├── prompts/          ← System prompts & templates
│   │   ├── conversations/    ← Example interactions
│   │   ├── memory/           ← Memory philosophy
│   │   └── ui-assets/        ← Component designs
│   │
│   └── aig-marketplace       ← Plugin/extension store
│       ├── packages/
│       ├── frontend/
│       └── docs/
│
├── 🟢 Documentation & Knowledge
│   ├── aig-docs              ← Technical documentation hub
│   │   ├── platform/         ← API docs, guides
│   │   ├── architecture/     ← System design
│   │   ├── tutorials/        ← Step-by-step guides
│   │   └── faq/              ← Common questions
│   │
│   └── aig-product           ← Product & feature specs
│       ├── roadmap/          ← Feature planning
│       ├── specs/            ← Product specifications
│       ├── design/           ← UX/UI specifications
│       └── strategy/         ← Business strategy
│
├── 🎨 Design & Creative
│   └── aig-design            ← Design system & components
│       ├── tokens/           ← Design tokens
│       ├── components/       ← Reusable components
│       ├── patterns/         ← Design patterns
│       ├── figma/            ← Figma exports
│       └── guidelines/       ← Design guidelines
│
└── 🚀 Infrastructure & DevOps
    ├── aig-infrastructure    ← Deployment & infrastructure
    └── aig-github-actions    ← CI/CD workflows
```

---

## 🔗 Repository Relationships

```
aig-platform (main)
├── Depends on: aig-diana (character spec)
├── Depends on: aig-design (visual design)
├── References: aig-docs (documentation)
└── Uses: aig-product (roadmap)

aig-diana (character)
├── Provides: Character personality
├── Provides: Voice & tone guidelines
├── Provides: Visual assets
├── Provides: Prompt templates
└── Used by: aig-platform

aig-design (design system)
├── Provides: Component library
├── Provides: Design tokens
├── Provides: Visual guidelines
└── Used by: aig-platform, aig-diana

aig-docs (documentation)
├── Covers: aig-platform APIs
├── Covers: Integration guides
├── Covers: Architecture docs
└── Used by: Developers, users

aig-product (specs)
├── Defines: Feature roadmap
├── Defines: Product requirements
├── Defines: User stories
└── Drives: aig-platform development
```

---

## 📊 Repository Responsibilities

### aig-platform (CORE)
**Ownership:** Engineering  
**Focus:** Application implementation  
**Contains:** Code, infrastructure, deployment  
**Updates:** Continuous (feature development)  

**What it IMPORTS from aig-diana:**
- Character specification for validation
- System prompts for Ask Diana module
- Brand guidelines for UI consistency
- Visual assets for avatars/UI
- Conversation examples for testing

### aig-diana (BRAND HUB) ⭐ NEW
**Ownership:** Brand/Product  
**Focus:** Character identity & consistency  
**Contains:** Specs, assets, guidelines, examples  
**Updates:** Quarterly character reviews  

**What it EXPORTS to aig-platform:**
- Character specification (read-only)
- System prompts (templated)
- Brand assets (versioned)
- Conversation patterns
- Memory guidelines

**Key Features:**
- ✅ Single source of truth for Diana
- ✅ No code dependencies (markdown + assets)
- ✅ Easy for non-developers to update
- ✅ Version controlled character evolution
- ✅ Supports multiple implementations

### aig-design (DESIGN SYSTEM)
**Ownership:** Design team  
**Focus:** Visual consistency  
**Contains:** Components, tokens, patterns  
**Updates:** Regular (new components)  

**Works with aig-diana:**
- Diana avatar in design system
- Diana interaction patterns
- Diana color palette
- Diana typography

### aig-docs (DOCUMENTATION)
**Ownership:** Technical writers  
**Focus:** User education  
**Contains:** Guides, APIs, tutorials  
**Updates:** Continuous (as features change)  

**References aig-diana:**
- Linking to character spec
- Examples using Diana's voice
- Guidelines for Diana integration

### aig-product (SPECIFICATIONS)
**Ownership:** Product management  
**Focus:** Feature planning  
**Contains:** Roadmap, specs, requirements  
**Updates:** Monthly planning cycles  

**Drives aig-diana evolution:**
- New features for Diana
- User feedback incorporation
- Personality refinements
- New skill capabilities

---

## 🔄 Data Flow

### Creating a New Feature
```
1. aig-product
   ↓ Feature requirement
2. aig-platform (engineering)
   ↓ Implementation
3. aig-diana (if Diana involved)
   ↓ Update character/prompts
4. aig-design (if visual changes)
   ↓ Update components
5. aig-docs (documentation)
   ↓ User guides
```

### Updating Diana's Personality
```
1. aig-diana (character update)
   ↓ New CHARACTER_SPEC.md
2. aig-platform
   ↓ Pull latest prompts
3. aig-design
   ↓ Update visual expressions
4. aig-docs
   ↓ Update integration guides
```

### Releasing a New Version
```
1. aig-product (version planning)
2. aig-diana (mark as vX.Y.Z)
3. aig-design (component versions)
4. aig-platform (tag release)
5. aig-docs (publish release notes)
```

---

## 📦 Distribution & Consumption

### As NPM Packages

```bash
# In aig-platform
npm install @aig-global/diana
npm install @aig-global/design
npm install @aig-global/docs
```

### Usage Examples

```typescript
// Import Diana character specification
import { CHARACTER_SPEC, SYSTEM_PROMPT } from '@aig-global/diana'

// Use Diana assets
import { DianaAvatar, DianaExpressions } from '@aig-global/diana/visuals'

// Get design tokens
import { colors, typography } from '@aig-global/design'

// Reference documentation
// → https://aig-docs.dev/diana-integration
```

### Versioning Strategy
```
aig-diana v1.0.0
aig-platform v0.2.0 → uses @aig-global/diana@^1.0.0
aig-design v2.0.0   → uses @aig-global/diana@^1.0.0
```

---

## 🎯 Benefits of Separate aig-diana Repository

### For Brand Consistency
✅ Single source of truth for Diana  
✅ All teams reference same character spec  
✅ Easy to enforce brand guidelines  
✅ Prevents character drift across implementations  

### For Non-Developers
✅ Markdown-based character specs  
✅ No code changes needed for personality updates  
✅ Easy to contribute examples and assets  
✅ Clear organization structure  

### For Multiple Implementations
✅ Web, mobile, API can all reference same Diana  
✅ Easier to maintain consistency  
✅ New platforms can adopt Diana quickly  
✅ Character evolution is centralized  

### For AI/ML Teams
✅ Central repository for prompt management  
✅ Conversation examples for training  
✅ Memory philosophy documentation  
✅ Version control for fine-tuning models  

### For Creative Teams
✅ Visual assets version controlled  
✅ Animation specifications documented  
✅ Expression guidelines clear  
✅ Easy asset updates and releases  

---

## 🚀 Implementation Timeline

### Phase 1: Repository Setup (Week 1)
- [ ] Create aig-diana repository
- [ ] Set up directory structure
- [ ] Write initial CHARACTER_SPEC.md
- [ ] Add visual assets
- [ ] Create documentation

### Phase 2: Integration (Week 2-3)
- [ ] Add @aig-global/diana to aig-platform
- [ ] Update system prompts
- [ ] Integrate visual assets
- [ ] Add Diana module to North Star ONE
- [ ] Update documentation

### Phase 3: Testing & Validation (Week 3-4)
- [ ] Character consistency tests
- [ ] Prompt validation
- [ ] Visual asset verification
- [ ] Cross-platform testing
- [ ] User feedback collection

### Phase 4: Release & Adoption (Week 4)
- [ ] Release aig-diana v1.0.0
- [ ] Update aig-platform to use
- [ ] Train team on new workflow
- [ ] Document contribution process
- [ ] Celebrate! 🎉

---

## 📋 Repository Creation Checklist

### Setup
- [ ] Create repository: `AIG-Global/aig-diana`
- [ ] Set to public (MIT or CC-BY-4.0 license)
- [ ] Add branch protection rules
- [ ] Set up GitHub Pages for documentation

### Initial Content
- [ ] README.md with overview
- [ ] CHARACTER_SPEC.md (core document)
- [ ] PERSONALITY_MATRIX.md
- [ ] VOICE_GUIDE.md
- [ ] MEMORY_PHILOSOPHY.md
- [ ] Visual assets (logo, avatar, expressions)
- [ ] System prompts
- [ ] Conversation examples
- [ ] CONTRIBUTING.md
- [ ] LICENSE (CC-BY-4.0)

### GitHub Configuration
- [ ] Add topics: `ai-character`, `diana`, `brand`, `aig-platform`
- [ ] Set description
- [ ] Add social preview image
- [ ] Create release tags
- [ ] Set up GitHub Discussions
- [ ] Add GitHub Wiki (optional)

### Team Access
- [ ] Add codeowners file
- [ ] Invite brand team
- [ ] Invite engineering team
- [ ] Set review requirements

---

## 🔄 Workflow Integration

### How aig-platform Uses aig-diana

**In package.json:**
```json
{
  "dependencies": {
    "@aig-global/diana": "^1.0.0"
  }
}
```

**In Ask Diana module:**
```typescript
import { CHARACTER_SPEC, SYSTEM_PROMPT } from '@aig-global/diana'

@Injectable()
export class AskDianaService {
  private systemPrompt = SYSTEM_PROMPT
  private spec = CHARACTER_SPEC

  async chat(message: string): Promise<string> {
    // Validate against CHARACTER_SPEC
    // Use SYSTEM_PROMPT for context
    // Return response in Diana's voice
  }
}
```

**In UI:**
```tsx
import { DianaAvatar, DianaExpressions } from '@aig-global/diana/visuals'

export function ChatInterface() {
  const [expression, setExpression] = useState('neutral')

  return (
    <div>
      <DianaAvatar expression={DianaExpressions[expression]} />
      <ChatMessage />
    </div>
  )
}
```

---

## 📊 Example Directory Comparison

### Before (Diana in aig-platform)
```
aig-platform/packages/ask-diana-core/
├── src/
│   ├── prompts.ts            ← Hard to find
│   ├── personality.ts        ← Mixed with code
│   ├── avatar.png            ← With other code assets
│   ├── system.ts
│   └── chat.service.ts
```

**Problems:**
- Character spec buried in code
- Hard for non-developers to update
- Visual assets mixed with code
- Difficult to share across projects

### After (Diana in aig-diana)
```
aig-diana/
├── character/
│   ├── CHARACTER_SPEC.md     ← Easy to find
│   ├── PERSONALITY_MATRIX.md ← Clear structure
│   └── VOICE_GUIDE.md
├── visuals/
│   ├── avatar/
│   │   ├── diana-avatar-transparent.png
│   │   └── diana-expressions/
├── prompts/
│   ├── templates/
│   │   ├── system-prompt.md
│   │   └── PROMPT_GUIDELINES.md
└── conversations/
    └── EXAMPLE_CONVERSATIONS.md

aig-platform/
└── imports: @aig-global/diana
```

**Benefits:**
- Character is main focus
- Easy for anyone to update
- Professional asset management
- Shareable and reusable
- Version controlled separately

---

## 🎓 Summary

The **aig-diana** repository represents:

✅ **Single Source of Truth** for character identity  
✅ **Brand Consistency** across all implementations  
✅ **Accessibility** for non-technical stakeholders  
✅ **Scalability** to support multiple platforms  
✅ **Evolution** - character can grow independently  

By separating Diana from the platform implementation, we create:
- A living, breathing character brand
- A reference for all development teams
- A foundation for consistent user experience
- An asset library for marketing/creative
- A platform for Diana to evolve

**This is more than a repository—it's Diana's home.** 🌟

---

**Next Steps:**
1. Create AIG-Global/aig-diana repository
2. Populate with blueprint structure
3. Integrate into aig-platform
4. Train teams on workflow
5. Begin quarterly character reviews

**Timeline:** Ready to implement immediately!
