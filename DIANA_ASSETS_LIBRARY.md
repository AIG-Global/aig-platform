# Diana Assets Library

**Date:** 2026-07-06  
**Version:** 1.0  
**Status:** Design specification  

---

## Overview

Diana assets are a **library of transparent SVG illustrations** that represent Diana's expressions and states throughout the platform. These assets are:

- **Reusable** across all platforms (web, desktop, mobile, voice)
- **Scalable** from 32px to 1024px
- **Consistent** in style, line weight, and color
- **Expressive** to communicate Diana's emotional state
- **Accessible** with alt text and semantic meaning

---

## Asset Library Structure

```
diana-assets/
├── illustrations/
│   ├── greeting/
│   │   ├── greeting.svg
│   │   └── greeting@2x.png
│   ├── listening/
│   │   ├── listening.svg
│   │   ├── listening.png
│   │   └── listening-animated.json (Lottie)
│   ├── thinking/
│   ├── processing/
│   ├── explaining/
│   ├── writing/
│   ├── celebrating/
│   ├── warning/
│   ├── presenting/
│   ├── idle/
│   └── voice-conversation/
├── emotions/
│   ├── happy/
│   ├── curious/
│   ├── focused/
│   ├── concerned/
│   └── confused/
├── actions/
│   ├── typing/
│   ├── thinking-bubble/
│   ├── success-checkmark/
│   └── error-alert/
├── backgrounds/
│   ├── gradient-subtle.svg
│   ├── grid-pattern.svg
│   └── wave-pattern.svg
└── README.md
```

---

## 10 Core State Illustrations

### 1. Greeting

**Purpose:** Welcome users, establish warm, friendly tone  
**Usage:** Landing page, first-time user, welcome screen  
**Expression:** Warm smile, open posture, welcoming gesture  

**Visual Description:**
- Diana facing forward with bright, genuine smile
- One arm extended in welcoming gesture
- Relaxed, approachable posture
- Sparkle effects around her head
- Color: Diana Blue (#0066FF) with accent yellow (#FFD600)
- Line weight: 2px
- Dimensions: 256x256px (scalable)

**SVG Characteristics:**
- Path count: 12-15
- Complexity: Medium
- Animation: Optional subtle bounce (100ms cycle)
- Accessibility: alt="Diana greeting you warmly"

**Export Formats:**
- SVG (primary)
- PNG 256x256
- PNG 512x512
- Lottie JSON (with bounce animation)
- WebP (optimized)

---

### 2. Listening

**Purpose:** Acknowledge user input, show engagement  
**Usage:** During message input, chat interface, focus state  
**Expression:** Focused eyes, engaged posture, leaning slightly forward  

**Visual Description:**
- Diana eyes wide and focused on user
- Head tilted slightly, showing interest
- One hand near chin in thoughtful pose
- Subtle ear-listening glyph
- Color: Diana Blue with accent accent cyan (#00D9FF)
- Animated: Eyes tracking slightly, subtle head tilt
- Dimensions: 256x256px

**Animation Details:**
```
Listening animation (continuous loop):
- Eye focus: Soft zoom in/out (0.5s cycle)
- Head tilt: Left ↔ Right (1s cycle)
- Ear glyph: Pulse (0.3s)
- Total: 2-second loop
```

**Accessibility:** alt="Diana listening to you"

---

### 3. Thinking

**Purpose:** Show internal processing, indicate loading state  
**Usage:** While generating response, AI thinking, processing delay  
**Expression:** Hand on chin, eyes looking upward/away, concentrated  

**Visual Description:**
- Diana hand on chin in classic "thinking" pose
- Eyes slightly upward, contemplative
- Subtle thought cloud with question mark (optional)
- Animated shimmer effect suggesting brain activity
- Color: Diana Blue with accent (#00D9FF)
- Line weight: 2px
- Dimensions: 256x256px

**Animation Details:**
```
Thinking animation (continuous):
- Shimmer: Horizontal sweep (0.8s cycle)
- Head tilt: Gentle nod (1.5s cycle)
- Eye glow: Subtle pulse (1s cycle)
```

**Accessibility:** alt="Diana thinking"

---

### 4. Processing

**Purpose:** Indicate AI processing, streaming response  
**Usage:** During response generation, AI model inference, streaming  
**Expression:** Focused, active, working hard  

**Visual Description:**
- Diana with forward-facing focused expression
- Animated shimmer/glow effect across entire body
- Brain icon with animated activity
- Subtle dots indicating processing
- Color: Diana Blue with accent cyan
- Animation: Active shimmer, pulsing glow
- Dimensions: 256x256px

**Animation Details:**
```
Processing animation (continuous):
- Full body shimmer: Left to right (0.5s)
- Brain glow: Pulse (0.4s)
- Dots: Sequential fade (0.3s offset)
- Total loop: 1.5s (fast, energetic)
```

**Accessibility:** alt="Diana processing your request"

---

### 5. Explaining

**Purpose:** Diana is sharing knowledge, teaching, presenting information  
**Usage:** Response completion, tutorial mode, documentation  
**Expression:** Gesturing, engaging, presenting information  

**Visual Description:**
- Diana facing forward with welcoming expression
- One or both arms gesturing (pointing, explaining)
- Open hand gestures showing information flow
- Slight forward lean indicating engagement
- Optional: Speech bubbles with animated text lines
- Color: Diana Blue with accent yellow
- Line weight: 2px
- Dimensions: 256x256px

**Gestures:**
- Right hand pointing: "Here's the information"
- Both hands open: "Multiple options"
- Hands together: "Summary/key point"

**Animation:** Subtle arm movements synchronized with speech/text

**Accessibility:** alt="Diana explaining"

---

### 6. Writing

**Purpose:** Diana is generating or writing content, creating documents  
**Usage:** Document generation, writing mode, composition  
**Expression:** Focused, creative, productive  

**Visual Description:**
- Diana hunched slightly over desk/surface
- Hand/arm in typing/writing motion
- Animated cursor or pen movement
- Papers/documents appear beneath
- Subtle glow indicating creative flow
- Color: Diana Blue
- Animation: Typing motion, pen strokes
- Dimensions: 256x256px

**Animation Details:**
```
Writing animation (continuous):
- Arm motion: Up/down typing (0.3s cycle)
- Cursor blink: Standard text cursor (0.5s)
- Page appear: New document effect (1s)
- Total loop: 2s
```

**Accessibility:** alt="Diana writing"

---

### 7. Celebrating

**Purpose:** Success state, goal achievement, positive outcome  
**Usage:** Document saved, task completed, goal reached, success message  
**Expression:** Joyful, arms raised, celebration pose  

**Visual Description:**
- Diana with big smile, arms raised up
- Celebratory pose, jumping or standing tall
- Confetti or sparkle effects around
- Optional: Party hat or celebratory elements
- Color: Diana Blue with accent green (#00CC44)
- Animation: Jump motion, spinning, sparkle effects
- Dimensions: 256x256px

**Animation Details:**
```
Celebrating animation (plays once on success):
- Jump: 0.6s (up and down)
- Spin: 360° (0.8s)
- Sparkles: Burst outward (0.5s)
- Total: 1.5s (celebratory, energetic)
```

**Accessibility:** alt="Diana celebrating your success"

---

### 8. Warning

**Purpose:** Alert state, error notification, caution message  
**Usage:** Error occurred, permission denied, rate limited, security warning  
**Expression:** Concerned, cautious, raised hand in stop gesture  

**Visual Description:**
- Diana with concerned expression
- One hand raised in stop/caution gesture
- Warning triangle icon nearby
- Red/orange accent color
- Possibly slight backward lean (defensive posture)
- Color: Diana Blue with accent orange (#FF9900)
- Line weight: 2px
- Dimensions: 256x256px

**Animation:** Subtle shake (to emphasize warning)

```
Warning animation (continuous while alert active):
- Shake: Horizontal (0.2s cycle)
- Hand pulse: Emphasized (0.5s)
- Icon glow: Pulsing red (0.8s)
```

**Accessibility:** alt="Diana warning"

---

### 9. Presenting

**Purpose:** Professional/formal mode, business presentation  
**Usage:** Business context, formal documents, professional settings  
**Expression:** Professional, confident, authoritative  

**Visual Description:**
- Diana in professional pose (standing at podium)
- Gesturing toward screen/presentation
- Pointer or presentation clicker in hand
- More formal/business attire
- Color: Diana Blue with accent grey (business tone)
- Line weight: 2px
- Dimensions: 256x256px

**Animation:** Subtle hand gestures pointing/indicating

**Accessibility:** alt="Diana presenting"

---

### 10. Idle

**Purpose:** Waiting state, ready for input, standby mode  
**Usage:** Waiting for user message, default dashboard state  
**Expression:** Calm, patient, ready  

**Visual Description:**
- Diana in neutral, calm pose
- Relaxed posture
- Soft smile
- Eyes slightly open, looking at user
- No animation or very subtle breathing animation
- Color: Diana Blue with neutral accents
- Line weight: 2px
- Dimensions: 256x256px

**Animation:** Minimal (optional gentle breathing pulse 2-3s cycle)

**Accessibility:** alt="Diana waiting"

---

## Additional Asset States

### Voice Conversation State

**Purpose:** During voice calls or voice interactions  
**Visual:** Diana with sound waves, possibly ear focused  
**Animation:** Animated sound waves pulsing  
**Usage:** Voice mode active, listening to voice input  

### Loading States

**Small spinner (32px):** For inline loading  
**Large spinner (64px):** For page loading  
**Circular progress:** For multi-step processes  

### Success/Error Icons

**Success checkmark:** Document saved, action completed  
**Error X:** Action failed, retry available  
**Info circle:** Helpful information, tooltip  
**Exclamation:** Important notice, needs attention  

---

## Design System Details

### Base Specifications

**Canvas Size:** 256x256px (primary)  
**Line Weight:** 2px (consistent across all assets)  
**Corner Radius:** 4px for soft appearance  
**Grid:** 4px grid alignment  
**Safe Area:** 16px margin from edge  

### Color Usage

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Diana Blue | #0066FF |
| Accent | Thinking/Processing | #00D9FF |
| Success | Celebration | #00CC44 |
| Warning | Alert | #FF9900 |
| Error | Warning/Alert | #FF0044 |
| Neutral | Background | #CCCCCC |
| Dark | Shadows | #333333 |

### Scalability

All assets designed to scale from **32px to 1024px** without loss of fidelity:

- 32px: Small avatars, chat indicators
- 64px: Standard avatar in messages
- 128px: Profile pictures, dashboard
- 256px: Large display (primary size)
- 512px: Fullscreen presentations
- 1024px: Poster/banner size

### Typography in Assets

When text is included in assets:
- Font: Inter (same as platform)
- Weight: Bold (600+)
- Size: Scale with illustration
- Color: Diana Blue or white for contrast

---

## Animation Specifications

### Animation Framework

Use **Lottie JSON** format for complex animations:
- **Lightweight:** Smaller than video
- **Scalable:** Works at any size
- **Responsive:** Smooth on all devices
- **Accessible:** Can be paused/stopped

### Animation Performance

- **Frame rate:** 60fps minimum
- **File size:** <100KB per animation
- **Load time:** <500ms
- **Loop:** Smooth, no jank

### Animation Types

| Type | Duration | Loop | Usage |
|------|----------|------|-------|
| Breathing | 3s | Infinite | Idle state |
| Typing | 0.3s | Infinite | Writing |
| Pulse | 1s | Infinite | Processing |
| Bounce | 0.6s | Once | Greeting |
| Shake | 0.2s | While error | Warning |

---

## Export & Distribution

### File Formats

**Primary (SVG):**
- Scalable Vector Graphics
- Smallest file size
- Browser native
- Editor editable

**PNG Formats:**
- 256x256px (1x standard)
- 512x512px (2x retina)
- 1024x1024px (4x ultra)

**WebP (Optimized):**
- 30% smaller than PNG
- Modern browser support
- Fallback to PNG

**Lottie JSON:**
- Animated illustrations
- Complex state changes
- Interactive elements

### Distribution Package

```
diana-assets-v1.0.0/
├── SVG/
│   ├── greeting.svg
│   ├── listening.svg
│   ├── thinking.svg
│   ├── processing.svg
│   ├── explaining.svg
│   ├── writing.svg
│   ├── celebrating.svg
│   ├── warning.svg
│   ├── presenting.svg
│   └── idle.svg
├── PNG/
│   ├── 1x/
│   │   ├── greeting.png
│   │   └── ... (all assets)
│   ├── 2x/
│   │   └── ... (all assets)
│   └── 4x/
│       └── ... (all assets)
├── WebP/
│   └── ... (all assets)
├── Lottie/
│   ├── listening.json
│   ├── thinking.json
│   ├── processing.json
│   ├── writing.json
│   ├── celebrating.json
│   └── warning.json
├── CSS/
│   ├── diana-icons.css
│   └── diana-animations.css
├── React/
│   ├── components/
│   │   ├── DianaGreeting.jsx
│   │   ├── DianaListening.jsx
│   │   └── ... (all states)
│   └── hooks/
│       └── useDianaState.js
├── README.md
└── CHANGELOG.md
```

---

## Usage Guidelines

### Web Implementation

**HTML + CSS:**
```html
<div class="diana diana-greeting"></div>

<style>
.diana {
  width: 256px;
  height: 256px;
  background-image: url('/diana-assets/svg/greeting.svg');
  background-size: contain;
}

.diana-listening {
  background-image: url('/diana-assets/lottie/listening.json');
  animation: diana-listening 2s infinite;
}
</style>
```

**React Component:**
```jsx
<Diana state="listening" size="256px" animated />
```

### Mobile Implementation

**iOS (SwiftUI):**
```swift
Image("diana-greeting")
  .resizable()
  .scaledToFit()
  .animation(.easeInOut)
```

**Android (Jetpack Compose):**
```kotlin
Image(
  painter = painterResource(id = R.drawable.diana_greeting),
  contentDescription = "Diana greeting"
)
```

### Animation Implementation

**Lottie Library:**
```javascript
const animation = bodymovin.loadAnimation({
  container: document.getElementById('lottie'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'diana-assets/lottie/thinking.json'
});
```

---

## Accessibility Requirements

### Alt Text

Every asset must have descriptive alt text:

```html
<img src="greeting.svg" alt="Diana greeting you warmly">
<img src="warning.svg" alt="Diana warning about an error">
```

### Semantic Meaning

State expressed visually should also be in code:

```html
<div role="status" aria-live="polite">
  <img src="thinking.svg" alt="Diana thinking">
  <p>Diana is thinking about your request...</p>
</div>
```

### Keyboard Navigation

If interactive:
- Tab focus visible
- Enter/Space to activate
- Esc to cancel

### Color Contrast

All text on colored backgrounds must meet WCAG AA:
- Minimum 4.5:1 ratio (normal text)
- Minimum 3:1 ratio (large text)

---

## Maintenance & Evolution

### Version Control

Assets versioned as:
```
diana-assets-v1.0.0 (initial)
diana-assets-v1.1.0 (refinements)
diana-assets-v2.0.0 (major redesign)
```

### Update Process

1. Designer creates new version
2. Design review with team
3. Export to all formats
4. Update distribution package
5. Version bump
6. Update documentation
7. Release notes

### Adding New States

As Diana evolves, new states can be added:
- Feedback/Review state
- Celebrating specific wins
- Sad/Apologetic state
- Focused/Deep work state

All follow same specs and design system.

---

## Asset Rights & Licensing

**Internal Use:** All rights reserved for AIG-Global  
**External Use:** Marketplace skills can use Diana assets via API  
**Attribution:** Assets credited as "Diana by AIG-Global"  
**Derivative Works:** Developer-created Diana variants must follow style guide  

---

## Next Steps

1. **Finalize Design:** Complete SVG designs for all 10 core states
2. **Export Assets:** Generate all formats (PNG, WebP, Lottie)
3. **Implement Components:** Create React, iOS, Android components
4. **Test Animations:** Verify smooth performance across devices
5. **Documentation:** Create developer guide and implementation examples
6. **Distribution:** Package and release to team/marketplace

---

**Diana assets are the visual foundation of the entire platform.**

*Diana Assets Library*  
*Version 1.0 | 2026-07-06*  
*Status: Design specification ready for implementation*
