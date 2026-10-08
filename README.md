# RobOnHood — cinematic SaaS site

Next.js 15 · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · Lucide.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build && npm start
```

## Structure

```
src/
  app/                 layout, home page, /privacy, /terms, globals.css
  content/site.ts      ALL copy + data (swap this to re-skin the site)
  lib/                 motion presets, hooks (motion profile, pointer parallax), canvas loop
  components/
    Navbar, Hero, HeroVisual, LiveChart, ValueStatement,
    FeatureSection, ProductVisualization, NetworkScene,
    Testimonial, Metrics, FinalCTA, Footer,
    AtmosphereCanvas, AmbientLight, ScrollProgress, AccessProvider, SectionHeading
    ui/  MagneticButton, RevealLines, TiltFrame, GlowPanel, AnimatedDivider, Logo
```

## Notes

- **No WebGL / three.js / GSAP.** The hero atmosphere and network are 2D canvas, scroll
  choreography is Framer Motion. It is much lighter than WebGL and covers every effect in the brief.
  If you want a true 3D scene later, lazy-load React Three Fiber inside `NetworkScene`.
- **Performance:** canvases pause offscreen / on hidden tabs, cap DPR, and drop to 30fps with
  fewer particles on phones. `prefers-reduced-motion` renders static frames and disables
  parallax, tilt, magnetism and auto-advancing UI.
- **Buttons:** "Get Started" / "Log in" open an accessible dialog (`AccessProvider`). The submit
  handler is a stub — wire it to your auth or waitlist endpoint. "Talk to Sales" is a `mailto:`.
- **Placeholders to replace:** brand name, copy, customer quote / logos (fictional),
  emails in `content/site.ts`, and the `/privacy` and `/terms` text.
- The "Pricing" nav link currently scrolls to the final CTA; point it at a real pricing page when you have one.
