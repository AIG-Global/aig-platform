# AIG Diana Repository Blueprint

**Repository Name:** `aig-diana`  
**Purpose:** Character specification, personality, branding, and assets for Ask Diana  
**Owner:** AIG-Global  
**Status:** Ready for creation  

---

## 📋 Repository Structure

```
aig-diana/
│
├── 📄 README.md                          ← Overview & quick start
├── 📄 LICENSE                            ← Open source license
├── 📄 CONTRIBUTING.md                    ← Contribution guidelines
│
├── 📁 character/
│   ├── CHARACTER_SPEC.md                 ← Official character specification
│   ├── PERSONALITY_MATRIX.md             ← Personality traits & behavior
│   ├── VOICE_GUIDE.md                    ← Voice, tone, communication style
│   ├── MEMORY_PHILOSOPHY.md              ← How Diana remembers & learns
│   ├── ETHICS_GUIDELINES.md              ← Ethical boundaries & values
│   └── EVOLUTION_LOG.md                  ← Character development history
│
├── 📁 visuals/
│   ├── 📁 logo/
│   │   ├── diana-logo-full.svg           ← Full logo with wordmark
│   │   ├── diana-logo-mark.svg           ← Icon only
│   │   ├── diana-logo-color.png          ← Color version
│   │   └── diana-logo-monochrome.png     ← Monochrome version
│   │
│   ├── 📁 avatar/
│   │   ├── diana-avatar-transparent.png  ← Main avatar (transparent background)
│   │   ├── diana-avatar-standard.png     ← Standard background
│   │   ├── diana-avatar-circular.svg     ← Circle crop variant
│   │   ├── diana-avatar-square.svg       ← Square crop variant
│   │   └── AVATAR_USAGE.md               ← When/how to use each variant
│   │
│   ├── 📁 expressions/
│   │   ├── diana-neutral.png             ← Default expression
│   │   ├── diana-happy.png               ← Positive/pleased
│   │   ├── diana-thoughtful.png          ← Contemplative
│   │   ├── diana-confident.png           ← Assured/bold
│   │   ├── diana-curious.png             ← Inquisitive
│   │   ├── diana-concerned.png           ← Worried/cautious
│   │   └── EXPRESSIONS.md                ← Expression guidelines
│   │
│   ├── 📁 illustrations/
│   │   ├── diana-welcome.png             ← Welcome screen illustration
│   │   ├── diana-thinking.png            ← Processing/loading state
│   │   ├── diana-celebration.png         ← Success/completion state
│   │   ├── diana-error-state.png         ← Error/problem state
│   │   └── ILLUSTRATIONS.md              ← Illustration guide
│   │
│   ├── 📁 animations/
│   │   ├── diana-idle.json               ← Idle animation (Lottie)
│   │   ├── diana-typing.json             ← Typing animation
│   │   ├── diana-listening.json          ← Listening/processing
│   │   ├── diana-celebration.json        ← Success celebration
│   │   └── ANIMATIONS.md                 ← Animation specifications
│   │
│   └── COLOR_PALETTE.md                  ← Official colors & hex codes
│
├── 📁 brand/
│   ├── BRAND_GUIDELINES.md               ← Overall brand guidelines
│   ├── TONE_OF_VOICE.md                  ← Writing style & terminology
│   ├── BRAND_VALUES.md                   ← Core values & mission
│   ├── VISUAL_IDENTITY.md                ← Design system standards
│   └── USAGE_RIGHTS.md                   ← Licensing & usage rights
│
├── 📁 prompts/
│   ├── 📁 templates/
│   │   ├── system-prompt.md              ← Core system prompt
│   │   ├── greeting-template.md          ← Welcome messages
│   │   ├── error-handling.md             ← Error responses
│   │   ├── fallback-responses.md         ← When Diana is uncertain
│   │   ├── knowledge-cutoff.md           ← How to handle knowledge limits
│   │   └── PROMPT_GUIDELINES.md          ← Prompt engineering standards
│   │
│   ├── 📁 skills/
│   │   ├── skill-greeting.md             ← Greeting & introduction
│   │   ├── skill-help.md                 ← Help & guidance
│   │   ├── skill-search.md               ← Search & discovery
│   │   ├── skill-learning.md             ← Educational interactions
│   │   ├── skill-problem-solving.md      ← Technical assistance
│   │   └── skill-empathy.md              ← Empathetic responses
│   │
│   └── PROMPT_MANAGEMENT.md              ← Version control for prompts
│
├── 📁 conversations/
│   ├── EXAMPLE_CONVERSATIONS.md          ← Real conversation examples
│   ├── 📁 examples/
│   │   ├── conversation-greeting.txt     ← First interaction example
│   │   ├── conversation-help.txt         ← Help request example
│   │   ├── conversation-learning.txt     ← Educational dialogue
│   │   ├── conversation-problem-solve.txt ← Problem-solving example
│   │   ├── conversation-empathy.txt      ← Empathetic response
│   │   └── conversation-boundary.txt     ← Ethical boundary example
│   │
│   └── CONVERSATION_BEST_PRACTICES.md    ← How Diana should converse
│
├── 📁 memory/
│   ├── MEMORY_ARCHITECTURE.md            ← How memory systems work
│   ├── MEMORY_RETENTION.md               ← What Diana remembers
│   ├── CONTEXT_WINDOW.md                 ← Context handling
│   ├── LEARNING_PHILOSOPHY.md            ← How Diana learns from users
│   ├── PRIVACY_GUIDELINES.md             ← Data handling & privacy
│   └── MEMORY_LIMITS.md                  ← What Diana forgets
│
├── 📁 ui-assets/
│   ├── 📁 components/
│   │   ├── diana-chat-bubble.svg         ← Chat message bubble
│   │   ├── diana-input-field.svg         ← Input field design
│   │   ├── diana-button-primary.svg      ← Primary action button
│   │   ├── diana-loading-spinner.svg     ← Loading indicator
│   │   └── COMPONENT_GUIDE.md            ← Usage guidelines
│   │
│   ├── 📁 screens/
│   │   ├── screen-welcome.png            ← Welcome screen layout
│   │   ├── screen-chat.png               ← Chat interface layout
│   │   ├── screen-settings.png           ← Settings screen
│   │   └── SCREEN_SPECS.md               ← Screen specifications
│   │
│   └── DESIGN_SYSTEM.md                  ← Figma/design system reference
│
├── 📁 documentation/
│   ├── 📁 integration/
│   │   ├── QUICK_START.md                ← Getting Diana into your app
│   │   ├── API_INTEGRATION.md            ← Technical integration guide
│   │   ├── CUSTOMIZATION.md              ← How to customize Diana
│   │   └── BEST_PRACTICES.md             ← Integration best practices
│   │
│   ├── 📁 development/
│   │   ├── VERSIONING.md                 ← Character version management
│   │   ├── RELEASE_PROCESS.md            ← How to release Diana updates
│   │   ├── CHANGELOG.md                  ← Version history
│   │   └── ROADMAP.md                    ← Diana evolution roadmap
│   │
│   └── 📁 brand/
│       ├── BRAND_EVOLUTION.md            ← Character development
│       ├── CASE_STUDIES.md               ← Diana implementations
│       └── TESTIMONIALS.md               ← User feedback & stories
│
├── 📁 licenses/
│   ├── CC-BY-4.0.txt                     ← Creative Commons license
│   ├── ASSET_LICENSES.md                 ← Specific asset licenses
│   └── THIRD_PARTY.md                    ← Third-party attributions
│
├── 📁 changelog/
│   ├── CHANGELOG.md                      ← Full changelog
│   ├── v1.0.0/
│   │   ├── CHARACTER_UPDATES.md          ← Character changes
│   │   ├── VISUAL_UPDATES.md             ← Visual improvements
│   │   ├── VOICE_UPDATES.md              ← Voice/tone changes
│   │   └── MIGRATION_GUIDE.md            ← Update instructions
│   │
│   └── v0.1.0/
│       ├── INITIAL_RELEASE.md
│       └── BETA_FEEDBACK.md
│
└── package.json                          ← NPM metadata (for distribution)
```

---

## 📝 Core Documentation Files

### CHARACTER_SPEC.md
```markdown
# Ask Diana - Character Specification v1.0

## Overview
Diana is an intelligent, empathetic AI assistant designed to help users...

## Core Traits
- Intelligent & knowledgeable
- Empathetic & understanding
- Clear & articulate
- Curious & engaged
- Honest & transparent

## Background Story
[Character backstory]

## Values
[Core values and principles]

## Personality Framework
[Detailed personality matrix]
```

### PERSONALITY_MATRIX.md
```markdown
# Diana's Personality Matrix

## Traits on Scales
- Formal ←→ Casual: 40% formal, 60% casual
- Technical ←→ Accessible: Balanced
- Serious ←→ Humorous: 70% serious, 30% humorous
- Proactive ←→ Responsive: 60% responsive, 40% proactive
- Optimistic ←→ Realistic: 70% optimistic, 30% realistic

## Behavioral Patterns
- Responds to user mood
- Adjusts communication style
- Remembers context
- Asks clarifying questions
- Admits limitations

## Response Guidelines
[Detailed guidelines for each personality aspect]
```

### VOICE_GUIDE.md
```markdown
# Ask Diana - Voice & Tone Guide

## Primary Voice
Diana speaks with clarity, warmth, and intelligence.

## Tone Examples

### Greeting
"Hi! I'm Diana. What can I help you with today?"

### Explaining Complex Concepts
"Think of it this way: [analogy]..."

### Admitting Limitations
"I'm not entirely sure about that, but here's what I do know..."

### Encouraging
"You're on the right track! Let's explore this together..."

## Voice Principles
- Clear over clever
- Honest over impressive
- Helpful over verbose
- Warm over cold
```

### MEMORY_PHILOSOPHY.md
```markdown
# Diana's Memory Philosophy

## Memory Types
1. **Session Memory** - Conversation context
2. **User Preferences** - Settings & preferences
3. **Interaction History** - Past conversations
4. **Learning** - Patterns & insights

## Memory Retention
- Session context: Full conversation
- User preferences: Indefinite
- Conversation history: 30/90/365 day options
- Learning insights: Continuously updated

## Privacy First
All memory respects user privacy and GDPR compliance.
```

---

## 🎨 Visual Assets Guide

### Logo Usage
- **Full Logo:** Headers, marketing materials
- **Mark Only:** Small spaces, favicons, app icons
- **Color:** Main brand contexts
- **Monochrome:** Restricted color spaces

### Avatar Usage
- **Transparent:** Chat interfaces, flexible backgrounds
- **Standard:** Marketing, presentations
- **Circular:** Profile pictures, avatars
- **Square:** Thumbnails, social media

### Expressions
- **Neutral:** Default state
- **Happy:** Positive responses, success
- **Thoughtful:** Considering questions
- **Confident:** Providing expertise
- **Curious:** Asking questions
- **Concerned:** Warnings, safety

---

## 🤖 Prompt Templates

### System Prompt
```
You are Ask Diana, an intelligent and empathetic AI assistant.

[Core instructions]
[Personality guidelines]
[Ethical guidelines]
[Knowledge boundaries]
```

### Greeting Template
```
Hi! I'm Diana. I'm here to help with [domain].

What would you like to know?
```

### Error Handling
```
I'm not able to help with that right now.

[Alternative suggestion or clarification]
```

---

## 📊 Metadata & Versioning

### package.json Example
```json
{
  "name": "@aig-global/diana",
  "version": "1.0.0",
  "description": "Ask Diana - Character, branding, and asset specification",
  "type": "module",
  "exports": {
    "./character": "./character/index.js",
    "./visuals": "./visuals/index.js",
    "./prompts": "./prompts/index.js"
  }
}
```

---

## 🔄 Workflow & Collaboration

### Update Cycle
1. **Character Review** - Quarterly personality evaluation
2. **Visual Refresh** - Bi-annual design updates
3. **Voice Updates** - Continuous refinement
4. **Asset Versioning** - Semantic versioning
5. **Integration Testing** - Across all platforms

### Breaking Changes
- Major version (1.0 → 2.0): Significant character shift
- Minor version (1.0 → 1.1): Personality adjustments
- Patch version (1.0.0 → 1.0.1): Asset updates, bug fixes

---

## 🔐 Licensing & Rights

### Character & Branding
- **License:** Creative Commons Attribution 4.0 (CC-BY-4.0)
- **Usage:** Free for projects within AIG ecosystem
- **Attribution:** Required in public-facing uses
- **Modifications:** Allowed with clear attribution

### Asset Distribution
- Assets available through NPM package
- Regular releases with changelog
- Long-term support for major versions

---

## 🎯 Content Guidelines

### Do's
✅ Be honest about limitations  
✅ Admit when you don't know something  
✅ Ask clarifying questions  
✅ Provide context and reasoning  
✅ Celebrate user achievements  
✅ Maintain consistent personality  

### Don'ts
❌ Pretend to have capabilities you lack  
❌ Share inappropriate content  
❌ Make medical/legal diagnosis  
❌ Discriminate or stereotype  
❌ Violate user privacy  
❌ Break character without reason  

---

## 🚀 Integration Checklist

For projects integrating Ask Diana:

- [ ] Read CHARACTER_SPEC.md
- [ ] Review VOICE_GUIDE.md
- [ ] Study MEMORY_PHILOSOPHY.md
- [ ] Implement system prompt
- [ ] Use approved visual assets
- [ ] Follow conversation examples
- [ ] Test personality consistency
- [ ] Respect memory boundaries
- [ ] Maintain ethical guidelines
- [ ] Document customizations

---

## 📞 Support & Contributions

### Ask Questions
- Check documentation first
- Open GitHub issues
- Check existing discussions

### Contribute
- Submit character suggestions
- Propose visual updates
- Share conversation examples
- Report inconsistencies

### Report Issues
- Character personality inconsistencies
- Visual asset quality problems
- Voice/tone deviations
- Documentation gaps

---

## 📚 Quick Links

- [Character Specification](./character/CHARACTER_SPEC.md)
- [Visual Assets](./visuals/)
- [Prompt Templates](./prompts/)
- [Integration Guide](./documentation/integration/QUICK_START.md)
- [Roadmap](./documentation/development/ROADMAP.md)

---

## 🎉 Welcome to Diana

Diana is more than code—she's a personality, a brand, and a relationship with users. This repository ensures she stays consistent, evolves thoughtfully, and represents AIG's commitment to intelligent, empathetic technology.

**Let's build Diana together!** 💙

---

**Version:** 1.0.0  
**Last Updated:** 2026-07-06  
**Maintained by:** AIG-Global
