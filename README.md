# Subash Shakya — Portfolio

Vite + React + TypeScript + Tailwind CSS v4 + anime.js v4.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

**All content lives in `src/data/resume.ts`.** Add a project by appending to `projects`; it automatically
appears in the index, filters, experience links and gets its own `/projects/<slug>` case-study page.
Set `featured: true` to show it in "Selected work", give it a muted `tone` colour for its plate, and add a `flow` to render an architecture diagram.

**Motion** lives in `src/motion.ts`: one set of easings and durations (mirrored as `--ease` / `--dur-*` in `index.css`).
Add `data-reveal="up | fade | words | line | vline | draw | count | children"` to any element to animate it on scroll.

Deploy: Vercel / Netlify work out of the box (`vercel.json` and `public/_redirects` handle SPA routes).
