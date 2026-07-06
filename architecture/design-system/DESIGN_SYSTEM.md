# Design System Specification
## Complete Visual & Interaction Language

**Location:** `/architecture/design-system/DESIGN_SYSTEM.md`  
**Status:** 🔒 Locked  

---

## Diana Avatar System

See `/architecture/diana/AVATAR_SYSTEM.md` for complete details.

Quick reference:
- **6 emotional states:** Neutral, Happy, Thinking, Explaining, Warning, Professional
- **4 formats:** PNG (5 sizes), SVG, Lottie, WebM
- **3 themes:** Light, dark, transparent
- **Total assets:** 216 files
- **Location:** `apps/web/public/avatars/diana/`

---

## Color Palette

### Primary Colors
```
Brand Blue:     #0066CC
Brand Green:    #00B366
Brand Orange:   #FF6B35
```

### Semantic Colors
```
Success:        #00B366  (green)
Warning:        #FFB800  (amber)
Danger:         #E63946  (red)
Info:           #0066CC  (blue)
Neutral:        #666666  (gray)
```

### Neutral Scale
```
White:          #FFFFFF
Light Gray:     #F5F5F5
Medium Gray:    #CCCCCC
Dark Gray:      #666666
Black:          #1A1A1A
```

### Accessible Contrast
- All colors meet WCAG AA (4.5:1 ratio)
- Distinct in grayscale mode
- Color-blind safe combinations

---

## Typography

### Font Stack
- **Primary:** Inter (sans-serif)
- **Fallback:** -apple-system, BlinkMacSystemFont, Segoe UI
- **Mono:** IBM Plex Mono

### Type Scale
```
H1: 32px  (bold, heading)
H2: 24px  (semi-bold, section)
H3: 18px  (semi-bold, subsection)
Body: 14px (regular, content)
Small: 12px (regular, helper)
Caption: 11px (regular, metadata)
```

### Line Heights
```
Headings: 1.2
Body:     1.5
Code:     1.6
```

---

## Spacing

### Scale (multiples of 4px)
```
4px:   xs
8px:   sm
12px:  md
16px:  lg
24px:  xl
32px:  2xl
48px:  3xl
64px:  4xl
```

### Application
- Padding: Consistent internal spacing
- Margin: Consistent external spacing
- Gaps: Between items in lists

---

## Components

### Buttons
```
Primary:    Brand blue, white text, 12px padding
Secondary:  Light gray bg, brand blue text
Tertiary:   No background, brand blue text
Disabled:   Gray, no hover
```

### Cards
```
Background:     White (light) / #222 (dark)
Border:         1px light gray
Shadow:         0 2px 4px rgba(0,0,0,0.1)
Padding:        16px
Border radius:  8px
```

### Inputs
```
Border:         1px medium gray
Padding:        8px 12px
Focus:          Blue border, no shadow (WCAG)
Error:          Red border
Disabled:       Gray background
```

### Modals
```
Background:     Semi-transparent black (0.5 opacity)
Card:           White/dark with shadow
Width:          Max 600px
Max height:     80vh
Padding:        24px
```

---

## Icons

### Icon Set
- **Library:** Lucide or Heroicons
- **Size:** 16px (small), 24px (medium), 32px (large)
- **Color:** Inherit from text color
- **Stroke:** 2px

### Examples
- Mission: Target
- Task: Check Square
- Document: File
- Calendar: Calendar
- Chat: MessageSquare
- Settings: Settings
- Arrow: ChevronRight

---

## Empty States

### Visual Pattern
```
Icon (Large, 64px)
↓
Heading ("No tasks yet")
↓
Subtext ("Get started by creating one")
↓
CTA Button ("Create Task")
```

### Messaging
- Friendly, encouraging tone
- Suggest action
- Use Diana if helpful
- Show example if unclear

---

## Onboarding Flows

### Login Page
```
Diana avatar (neutral, 256px)
↓
Welcome heading
↓
Email input
↓
Password input
↓
Sign in button
↓
Sign up link
```

### First Mission
```
Welcome dialog
↓
Goal input ("What do you want to achieve?")
↓
Diana suggests phases
↓
User confirms roadmap
↓
Mission created, Diana celebrates
```

### First Task
```
Quick task input
↓
Diana suggests next phase
↓
Task added
↓
Celebrate with animation
```

---

## Animations

### Timing
- Quick action: 200ms
- Normal transition: 300ms
- Celebration: 1000ms

### Easing
- Fast in/out: cubic-bezier(0.4, 0, 0.2, 1)
- Gentle: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Anticipation: cubic-bezier(0.175, 0.885, 0.32, 1.275)

### Examples
- Fade in/out: 200ms, ease-in-out
- Slide in: 300ms, ease-out
- Grow/shrink: 200ms, ease-in-out
- Bounce: 300ms, anticipation

---

## Accessibility

### WCAG 2.1 AA Compliance
- ✅ All interactive elements keyboard accessible
- ✅ Focus visible (outline or highlight)
- ✅ Color not only differentiator
- ✅ Contrast ratio >4.5:1
- ✅ Text resizable to 200%
- ✅ No auto-playing audio/video
- ✅ Proper heading hierarchy

### Screen Reader Support
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Form labels associated
- ✅ Icon descriptions
- ✅ Skip navigation link

---

## Dark Mode

### Implementation
- Detect system preference
- Allow user override
- Persist preference
- Smooth transition

### Color Adjustments
```
Light Mode → Dark Mode
White       → #1A1A1A
Light Gray  → #333333
Dark Gray   → #CCCCCC
Black       → #F5F5F5
```

---

## Responsive Design

### Breakpoints
```
Mobile:   <640px   (single column)
Tablet:   640-1024px (two columns)
Desktop:  >1024px  (three columns)
```

### Touch Targets
- Minimum 44×44px for buttons
- Padding between interactive elements
- Larger on mobile than desktop

---

## File Organization

```
design-system/
├─ colors.scss       (color variables)
├─ typography.scss   (fonts and sizes)
├─ spacing.scss      (spacing scale)
├─ components.scss   (component styles)
├─ animations.scss   (transition definitions)
├─ dark-mode.scss    (dark theme)
├─ accessibility.scss (a11y utilities)
└─ responsive.scss   (breakpoint mixins)
```

---

**Status:** 🔒 Locked  
**Implementation:** CSS-in-JS (Tailwind or styled-components)  
**Accessibility Audit:** Before public launch
