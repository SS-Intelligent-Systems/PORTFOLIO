# VS CODE AGENT PROMPT — ProjectsGallery (Active Theory Helix)
# Paste this entire file into Cursor / Copilot Chat / Claude for VS Code

---

## WHAT THIS IS
A React Three Fiber component that replicates the Active Theory /work scroll effect:
- Cards live at positions on a 3D HELIX in WebGL (Three.js)
- Scrolling rotates the helix on Y-axis + raises it on Y-axis simultaneously
- This dual motion creates the diagonal cylindrical conveyor feel
- The front-facing card is always the "active" one
- Click a card → zoom in + Framer Motion detail modal

---

## STEP 1 — Install

```bash
npm install three @react-three/fiber @react-three/drei framer-motion
```

---

## STEP 2 — Fonts (paste into public/index.html <head>)

```html
<link
  href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

---

## STEP 3 — Place file

Copy `ProjectsGallery.jsx` → `src/components/ProjectsGallery.jsx`

If using Next.js App Router, keep the `"use client"` line at the top.
If using Vite/CRA, remove it.

---

## STEP 4 — Route it

### React Router (App.jsx):
```jsx
import ProjectsGallery from './components/ProjectsGallery';
<Route path="/projects" element={<ProjectsGallery />} />
```

### Next.js App Router (app/projects/page.jsx):
```jsx
import ProjectsGallery from '@/components/ProjectsGallery';
export default function Page() { return <ProjectsGallery />; }
```

### Next.js Pages Router (pages/projects.jsx):
```jsx
export { default } from '../components/ProjectsGallery';
```

---

## STEP 5 — Global CSS (src/index.css or globals.css)

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #030308;
  overflow: hidden;   /* canvas handles all scroll internally */
  color: #fff;
}
```

---

## STEP 6 — Replace mock data

Find the `PROJECTS` array near the top of `ProjectsGallery.jsx`.
Each entry schema:

```js
{
  id: 1,
  title: "PROJECTNAME",       // ALL CAPS, shown in Bebas Neue
  subtitle: "Category / Tech", // e.g. "AI / NLP"
  year: "2024",
  role: "Your role",
  status: "LIVE",              // LIVE | OPEN SOURCE | AWARD WINNER | PROTOTYPE
  tagline: "One punchy line.",
  description: "2-3 sentences for the modal.",
  tech: ["React", "Node", "etc"],
  colorHex: "#c9a84c",         // accent color (hex)
  accentRGB: "201,168,76",     // same color as "R,G,B" string (no parens, no #)
  bgColor: "#0f0a00",          // dark background matching the accent hue
  link: "https://github.com/you/project",
}
```

Accent color guide:
| Category        | colorHex  | accentRGB       | bgColor   |
|-----------------|-----------|-----------------|-----------|
| AI / ML         | #c9a84c   | 201,168,76      | #0f0a00   |
| DevTools        | #4fc3f7   | 79,195,247      | #001525   |
| Computer Vision | #a78bfa   | 167,139,250     | #0c0018   |
| FinTech / Web3  | #34d399   | 52,211,153      | #001a0f   |
| Health Tech     | #f87171   | 248,113,113     | #120000   |
| Sustainability  | #86efac   | 134,239,172     | #002000   |

---

## HOW THE HELIX ANIMATION WORKS (for tweaking)

```
Constants (top of file):
  R          = 3.6   → helix radius (wider = more spread)
  Y_STEP     = 1.7   → vertical gap between cards (taller = more rise)
  ANGLE_STEP = 2π/4.5 → angular gap (smaller divisor = tighter rotation)

In Scene's useFrame():
  helixRef.rotation.y → -progress * ANGLE_STEP  (rotates cylinder)
  helixRef.position.y → +progress * Y_STEP      (raises it)
  Both use lerp(current, target, 0.055)          (controls easing speed)
```

To make it faster/snappier: increase the `0.055` lerp factor (toward 0.15)
To make it dreamier/slower: decrease it (toward 0.025)
To change card spacing: adjust `ANGLE_STEP` and `Y_STEP`
To change helix width: adjust `R`

---

## NAVIGATION

| Input          | Action                    |
|----------------|---------------------------|
| Mouse wheel    | Scroll through cards      |
| Touch swipe    | Scroll through cards      |
| Arrow keys ↑↓  | Jump one card at a time   |
| Click card     | Open detail modal         |
| Escape         | Close modal               |

---

## KNOWN GOTCHAS

**"Text is not defined" error**
→ Make sure `@react-three/drei` is installed: `npm install @react-three/drei`

**Fonts in Three.js Text not loading**
→ The Text component fetches .woff2 from Google Fonts CDN at runtime.
  Ensure you're online during dev. For production, host the fonts locally.

**Canvas takes no pointer events**
→ Do NOT put `pointer-events: none` on the canvas wrapper div

**"use client" error**
→ Remove that line if you're not in Next.js App Router

**Cards not visible**
→ Check camera: `position={[0, 0, 6.5]}` — must be at z+ facing origin
→ Check fog: `<fog args={["#030308", 9, 24]}` — far plane at 24 units

---

## CONNECTING TO REST OF PORTFOLIO

This page shares the `#030308` dark background with `HackathonGallery.jsx`.
Add a back button:

```jsx
// At the top of the HUD or header:
import { Link } from 'react-router-dom'; // or Next.js Link
<Link to="/hackathons" style={{ color: '#00ff88', fontFamily: 'JetBrains Mono' }}>
  ← Hackathons
</Link>
```
