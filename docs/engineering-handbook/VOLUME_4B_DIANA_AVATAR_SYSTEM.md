# AIGINVEST Engineering Handbook
## Volume 4B: Diana Avatar System

**Volume:** 4B of 18  
**Section:** 3 (Diana Platform)  
**Pages:** 50 (estimated)  
**Audience:** Design, Frontend, Product  
**Last Updated:** July 7, 2026  
**Status:** 🟢 Complete & Locked  

---

## Table of Contents

1. Avatar Design Philosophy
2. Six Avatar States
3. Asset Specifications
4. Usage Guidelines
5. Implementation

---

## 1. Avatar Design Philosophy

### Diana is More Than One Image

Diana is **not** a static logo.

Diana is a **language** that communicates her state of mind.

Every state has:
- A visual expression
- A personality
- A purpose
- A context

Users should feel Diana's emotional state through her avatar.

---

### The Six States

| State | Purpose | Feeling | Used When |
|-------|---------|---------|-----------|
| **Neutral** | Listening, Present | Calm, Ready | Default, idle, listening |
| **Happy** | Celebrating, Affirming | Joy, Pride | Mission complete, wins |
| **Thinking** | Processing, Reasoning | Focused, Concentrated | Planning, analyzing, working |
| **Explaining** | Teaching, Guiding | Friendly, Patient | Tutorials, help, guidance |
| **Warning** | Alert, Attention | Concerned, Protective | Errors, security, risks |
| **Professional** | Executive, Authoritative | Confident, Commanding | Dashboards, summaries, data |

---

## 2. Six Avatar States

### State 1: Neutral

**Purpose:** Default appearance, presence, listening  
**Contexts:**
- Login page (greeting)
- Chat interface (waiting for input)
- Idle (not doing anything)
- Dashboard (persistent presence)
- Mission overview (passive guidance)

**Visual Characteristics:**
- Calm facial expression
- Forward-facing gaze
- Relaxed posture
- Neutral colors (blues, greens)
- Accessible, approachable

**Personality:**
- "I'm here for you"
- "What can I help with?"
- "I'm listening"

---

### State 2: Happy

**Purpose:** Celebrate, affirm, congratulate  
**Contexts:**
- Mission completed
- Major milestone achieved
- User goal accomplished
- Positive feedback
- Celebration moment

**Visual Characteristics:**
- Bright smile
- Eyes lit up
- Raised energy
- Warm colors (gold, warm orange)
- Celebratory gesture (arms up, thumbs up)
- Sparkles or glow effect

**Personality:**
- "You did it!"
- "I'm so proud!"
- "Let's celebrate this win"

---

### State 3: Thinking

**Purpose:** Focus, concentration, reasoning  
**Contexts:**
- Diana is analyzing
- Processing user request
- Generating roadmap
- Creating plan
- Research in progress
- Long computation

**Visual Characteristics:**
- Focused expression
- Hand on chin (contemplative)
- Eyes with thinking indicators (lightbulb, gears)
- Cool colors (blues, purples)
- Energy/motion lines
- Brain or circuit visualization

**Personality:**
- "Let me think about this"
- "I'm working on your roadmap"
- "Give me a moment"

---

### State 4: Explaining

**Purpose:** Teach, guide, help, simplify  
**Contexts:**
- Tutorial or onboarding
- Help section
- "How to" guide
- Diana explaining a decision
- Guided tour
- Feature explanation

**Visual Characteristics:**
- Warm, approachable expression
- Hand gesturing (pointing, waving)
- Open posture
- Warm colors (oranges, warm yellows)
- Pointer or indicator
- Open, friendly demeanor

**Personality:**
- "Let me explain"
- "Here's how this works"
- "Follow along with me"
- "Ask me anything"

---

### State 5: Warning

**Purpose:** Alert, caution, protect  
**Contexts:**
- Security alert
- Error message
- Data risk warning
- Deprecated feature
- Action requiring confirmation
- Permission denied

**Visual Characteristics:**
- Alert expression
- Raised eyebrows (concern)
- Protective gesture
- Alert colors (amber, orange, red)
- Warning symbols (shield, exclamation)
- Slightly defensive posture

**Personality:**
- "Heads up"
- "Be careful here"
- "I need to protect you"
- "This needs attention"

---

### State 6: Professional

**Purpose:** Executive, authoritative, command  
**Contexts:**
- Executive dashboard
- Business summary
- Enterprise presentation
- Data analytics
- Board-level reporting
- Formal communication

**Visual Characteristics:**
- Polished, executive look
- Formal attire (suggested)
- Confident, commanding presence
- Professional colors (dark blues, grays)
- Refined, elegant
- Power pose (standing tall)
- Charts/data integration

**Personality:**
- "Here are your metrics"
- "The data shows"
- "Executive summary"
- "Let's review results"

---

## 3. Asset Specifications

Every avatar state must be delivered in these formats:

### 3.1 Raster Format (PNG)

```
Diana_Neutral.png
├─ Sizes: 64px, 128px, 256px, 512px, 1024px
├─ Theme: Light (white background)
├─ Transparent: No
├─ Color Space: sRGB
├─ Filename: Diana_[State]_[Size]_Light.png

Diana_Neutral_Transparent.png
├─ Sizes: 64px, 128px, 256px, 512px, 1024px
├─ Theme: Transparent background
├─ Color Space: sRGB
├─ Filename: Diana_[State]_[Size]_Transparent.png

Diana_Neutral_Dark.png
├─ Sizes: 64px, 128px, 256px, 512px, 1024px
├─ Theme: Dark background
├─ Color Space: sRGB
├─ Filename: Diana_[State]_[Size]_Dark.png
```

---

### 3.2 Vector Format (SVG)

```
Diana_Neutral.svg
├─ Viewbox: 256x256
├─ Scalable to any size
├─ Light theme
├─ Filename: Diana_[State]_Light.svg

Diana_Neutral_Dark.svg
├─ Viewbox: 256x256
├─ Dark theme
├─ Filename: Diana_[State]_Dark.svg

Diana_Neutral_Transparent.svg
├─ Viewbox: 256x256
├─ Transparent background
├─ Filename: Diana_[State]_Transparent.svg
```

---

### 3.3 Animated Format (Lottie/WebM)

```
Diana_Neutral_Animated.json (Lottie)
├─ Duration: 3 seconds
├─ Loop: true
├─ Light theme
├─ Filename: Diana_[State]_Animated.json

Diana_Neutral_Animated_Dark.json
├─ Duration: 3 seconds
├─ Loop: true
├─ Dark theme
├─ Filename: Diana_[State]_Animated_Dark.json

Diana_Neutral_Loop.webm (WebM video)
├─ Duration: 3 seconds
├─ Loop: true
├─ Light theme
├─ Filename: Diana_[State]_Loop.webm
```

---

### 3.4 Specifications Summary

| Format | Light | Dark | Transparent | Sizes | Animated | Filename Pattern |
|--------|-------|------|-------------|-------|----------|------------------|
| PNG | ✅ | ✅ | ✅ | 5 | ✅ | Diana_[State]_[Size]_[Theme].png |
| SVG | ✅ | ✅ | ✅ | 1 | ✅ | Diana_[State]_[Theme].svg |
| Lottie | ✅ | ✅ | ✅ | N/A | ✅ | Diana_[State]_Animated_[Theme].json |
| WebM | ✅ | ✅ | N/A | N/A | ✅ | Diana_[State]_Loop_[Theme].webm |

**Total assets per state: 20+**  
**Total assets (6 states): 120+**  

---

## 4. Usage Guidelines

### 4.1 When to Use Each State

**Neutral:**
- Default state in most UIs
- Chat interface waiting for input
- Persistent dashboard widget
- Login page greeting

**Happy:**
- Mission completion screen
- Milestone achievement
- Goal accomplished
- Celebration/congratulations

**Thinking:**
- "Diana is processing" screen
- Long-running operations
- Roadmap generation
- Analysis in progress

**Explaining:**
- Tutorial flows
- Help sections
- First-time user guide
- Feature walkthroughs
- Tips and tricks

**Warning:**
- Error messages
- Security alerts
- Deprecated features
- Actions requiring approval
- Data/permission warnings

**Professional:**
- Executive dashboard
- Analytics summaries
- Business reports
- Board-level presentations

---

### 4.2 State Transitions

Transitions should be smooth and meaningful:

```
Neutral ↔ Happy (mission complete)
Neutral → Thinking (user asks for help)
Thinking → Explaining (Diana explains findings)
Thinking → Warning (if risk detected)
Explaining → Happy (successful learning)
Explaining → Professional (enterprise context)
Warning → Explaining (explain the issue)
Professional → Happy (positive metrics)
```

Never jump directly between states.  
Always transition through Neutral as a hub.

---

### 4.3 Size Recommendations

| Context | Size | Use Case |
|---------|------|----------|
| Avatar in chat | 64px | Message sidebar |
| Dashboard widget | 128px | Corner widget |
| Full-screen modal | 256px | Attention-grabbing |
| Celebration screen | 512px | Major celebration |
| Poster/print | 1024px | High-resolution |
| SVG (responsive) | Any | Preferred for web |

---

### 4.4 Color Accessibility

All avatar states must meet:
- ✅ WCAG AA contrast ratio (4.5:1 minimum)
- ✅ Distinguishable in grayscale
- ✅ Works on light and dark backgrounds
- ✅ Color-blind safe palette

---

### 4.5 Platform Consistency

Same avatar, same state, across:
- ✅ Web (responsive)
- ✅ Mobile (iOS, Android)
- ✅ AIOS (native)
- ✅ North Star ONE (hardware)
- ✅ Emails (embedded)
- ✅ Notifications (badges)

Users should recognize Diana everywhere.

---

## 5. Implementation

### 5.1 Asset Storage

```
apps/web/public/avatars/
├─ diana/
│  ├─ neutral/
│  │  ├─ 64px/
│  │  │  ├─ light.png
│  │  │  ├─ dark.png
│  │  │  └─ transparent.png
│  │  ├─ 128px/
│  │  ├─ 256px/
│  │  ├─ 512px/
│  │  ├─ 1024px/
│  │  ├─ light.svg
│  │  ├─ dark.svg
│  │  ├─ animated_light.json
│  │  ├─ animated_dark.json
│  │  ├─ loop_light.webm
│  │  └─ loop_dark.webm
│  ├─ happy/
│  ├─ thinking/
│  ├─ explaining/
│  ├─ warning/
│  └─ professional/
└─ index.json
```

---

### 5.2 React Component

```tsx
import React from 'react';

interface DianaAvatarProps {
  state: 'neutral' | 'happy' | 'thinking' | 'explaining' | 'warning' | 'professional';
  size?: 64 | 128 | 256 | 512 | 1024;
  theme?: 'light' | 'dark';
  animated?: boolean;
  tooltip?: string;
}

export const DianaAvatar: React.FC<DianaAvatarProps> = ({
  state,
  size = 128,
  theme = 'light',
  animated = false,
  tooltip
}) => {
  const getAssetUrl = (): string => {
    if (animated) {
      return `/avatars/diana/${state}/animated_${theme}.json`;
    }
    if (size >= 256) {
      return `/avatars/diana/${state}/${size}px/${theme}.png`;
    }
    return `/avatars/diana/${state}/${size}px/${theme}.png`;
  };

  return (
    <img
      src={getAssetUrl()}
      alt={`Diana ${state}`}
      width={size}
      height={size}
      title={tooltip}
      className="diana-avatar"
    />
  );
};
```

---

### 5.3 Transition Component

```tsx
interface DianaAvatarTransitionProps {
  fromState: DianaState;
  toState: DianaState;
  duration?: number;
  onComplete?: () => void;
}

export const DianaAvatarTransition: React.FC<DianaAvatarTransitionProps> = ({
  fromState,
  toState,
  duration = 400,
  onComplete
}) => {
  // Fade out current state, fade in new state
  // Always transition through visual feedback
};
```

---

### 5.4 Usage in UI

```tsx
// Login page (Neutral)
<DianaAvatar state="neutral" size={256} theme="light" />

// Mission completion (Happy)
<DianaAvatar state="happy" size={512} theme="light" animated={true} />

// Diana processing (Thinking)
<DianaAvatar state="thinking" size={128} theme={isDarkMode ? 'dark' : 'light'} animated={true} />

// Help section (Explaining)
<DianaAvatar state="explaining" size={128} theme={isDarkMode ? 'dark' : 'light'} />

// Error alert (Warning)
<DianaAvatar state="warning" size={128} theme={isDarkMode ? 'dark' : 'light'} />

// Executive dashboard (Professional)
<DianaAvatar state="professional" size={256} theme="dark" />
```

---

## Quality Standards

Every avatar must meet:

✅ **Visual Quality**
- Professional design
- Consistent style across states
- Recognizable as Diana
- Appropriate for all ages

✅ **Technical Quality**
- All formats provided
- All sizes accurate
- Optimized file sizes
- Proper color profiles

✅ **Accessibility**
- WCAG AA contrast
- Grayscale distinguishable
- Color-blind safe
- Accompanied by alt text

✅ **Consistency**
- Same character across platforms
- Same expression language
- Consistent visual language
- Recognizable everywhere

---

## Asset Delivery Timeline

**Week 1 (This Week):**
- ✅ Design 6 avatar states
- ✅ Create wireframes

**Week 2:**
- ✅ Finalize designs
- ✅ Create PNG assets (all sizes, themes)
- ✅ Create SVG assets
- ✅ Get design review approval

**Week 3:**
- ✅ Create Lottie animations
- ✅ Create WebM videos
- ✅ Implement React components
- ✅ Ship in production

**Week 4:**
- ✅ Mobile implementation
- ✅ Dark mode refinement
- ✅ Platform rollout (web, mobile, AIOS)

---

## Future Enhancements

### Microexpressions
Add subtle variations within states:
- Blink
- Slight head tilt
- Breathing animation
- Contextual gestures

### Personalization
Users can customize Diana:
- Color palette (company branding)
- Personality dial (formal to casual)
- Voice characteristics (with audio)
- Animation speed

### Story Progression
Diana evolves over time:
- Unlockable avatar variants
- Seasonal outfits
- Achievement badges
- Leveling system

---

## Success Metrics

By Week 6:
- ✅ All 6 states implemented
- ✅ Shipped on web, mobile, AIOS
- ✅ >90% brand recognition
- ✅ Consistent across platforms

By Week 12:
- ✅ All animations refined
- ✅ Customization available
- ✅ User satisfaction >4.0/5.0
- ✅ Personality benchmark established

---

**Published:** July 7, 2026  
**Status:** 🟢 Complete & Locked  
**Next:** Design implementation (Week 2)  

Diana is not just an avatar.  
She is a language.
