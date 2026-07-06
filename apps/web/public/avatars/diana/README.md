# Diana Avatar Assets

Directory structure for Diana avatar system across all states and formats.

## Directory Structure

```
diana/
├── neutral/          (Default, idle, listening state)
│   ├── 64px/        (PNG: light.png, dark.png, transparent.png)
│   ├── 128px/
│   ├── 256px/
│   ├── 512px/
│   ├── 1024px/
│   ├── light.svg
│   ├── dark.svg
│   ├── animated_light.json    (Lottie format)
│   ├── animated_dark.json
│   ├── loop_light.webm        (WebM video)
│   └── loop_dark.webm
├── happy/            (Celebration, win state)
│   └── (same structure)
├── thinking/         (Processing, analyzing state)
│   └── (same structure)
├── explaining/       (Teaching, guiding state)
│   └── (same structure)
├── warning/          (Alert, attention state)
│   └── (same structure)
└── professional/     (Executive, authoritative state)
    └── (same structure)
```

## Asset Guidelines

### PNG Files
- Dimensions: Exact size (64×64, 128×128, 256×256, 512×512, 1024×1024)
- Format: PNG-24 with transparency support
- Optimization: Run through ImageOptim or similar before commit
- Naming: `{light|dark|transparent}.png`

### SVG Files
- Viewbox: 256×256
- Scalable to any size
- Naming: `{light|dark}.svg`

### Lottie (JSON)
- Duration: 3 seconds
- Loop: true
- Format: Lottie JSON (for After Effects or Bodymovin)
- Naming: `animated_{light|dark}.json`

### WebM (Video)
- Duration: 3 seconds
- Loop: true
- Codec: VP8 or VP9
- Naming: `loop_{light|dark}.webm`

## Accessibility Requirements

- ✅ WCAG AA contrast ratio (4.5:1 minimum)
- ✅ Distinguishable in grayscale
- ✅ Color-blind safe
- ✅ Works on both light and dark backgrounds

## Total Assets per State
- 5 PNG sizes × 3 themes = 15 files
- 2 SVG variants = 2 files
- 2 Lottie animations = 2 files
- 2 WebM videos = 2 files
- **Total per state: 21 files**
- **Total (6 states): 126 files**

## Usage in React

```tsx
import { DianaAvatar } from '@/components/diana';

// Static PNG (64px light)
<DianaAvatar state="neutral" size={64} theme="light" />

// Animated Lottie (128px dark)
<DianaAvatar state="happy" size={128} theme="dark" animated={true} />

// SVG (responsive)
<DianaAvatar state="thinking" theme={isDarkMode ? 'dark' : 'light'} />
```

## Next Steps

1. Design 6 avatar states
2. Create PNG assets (all sizes, themes)
3. Create SVG versions
4. Create Lottie animations
5. Create WebM videos
6. Commit to git
7. Test in application

## Reference

See [Volume 4B: Diana Avatar System](../../docs/engineering-handbook/VOLUME_4B_DIANA_AVATAR_SYSTEM.md) for complete specifications.
