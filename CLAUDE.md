# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**MonPortfolio** is a static portfolio website for Yanisse Kemel, Product Manager IA. It showcases the AI automation projects built in the parent directory (`../`).

No framework, no build step, no package manager. The output is a single `index.html` plus a `style.css` and a `main.js`, served as a static site.

## Development

Open `index.html` directly in a browser, or serve it locally:

```bash
npx serve .
# or
python -m http.server 8000
```

## Architecture

```
index.html   — structure and French-language content
style.css    — all styles (dark theme, mobile-first)
main.js      — interactions and behaviour (vanilla JS)
assets/      — images, icons, fonts if self-hosted
```

## Code conventions

- **Code language:** English — all variables, functions, CSS class names, JS identifiers, and HTML attributes must be in English
- **Content language:** French — all text visible to the user (labels, headings, descriptions, alt text) must be in French
- **Vanilla JS only** — no React, Vue, Tailwind, Bootstrap or any npm dependency; use DOM manipulation, `fetch`, `IntersectionObserver`, etc.
- CSS custom properties (variables) for the design tokens — define them on `:root`

## Design system

| Token | Value |
|-------|-------|
| Background | `#0f0f0f` |
| Surface | `#1a1a1a` |
| Text primary | `#e8e8e8` |
| Text muted | `#888888` |
| Border | `#2a2a2a` |
| Font | Inter 300 / 400 via Google Fonts |

- **Mobile-first** — base styles target mobile, `@media (min-width: 768px)` for desktop overrides
- Minimalist — no decorative animations, no heavy visual effects
- Spacing via consistent multiples (8px grid)

## Projects to showcase

Located in `../` — each has a `README_*.md` with impact numbers, tech stack, and PM insights:

| Project | Key impact |
|---------|-----------|
| Chatbot RAG Médéric (`../ChatBOT - RAG/`) | 24h/24 availability, 603 chunks, 0 hallucinations |
| Chatbot Interne Teams × Airtable (`../ChatBot - Airtable x Hypperplaning/`) | 19 tables, 1700+ records, 100% RGPD traceable |
| Agent Airbnb (`../Airbnb/`) | < 30s/message, 80%+ automation target |
| TrendJacking Instagram (`../TrendJacking insta/`) | 0h veille, 4 LLM calls/run, < 5$/month |
| Filliz → Sage 50 (`../Excell modification/`) | -97% processing time, human-in-the-loop |
