# AGENTS.md - AI Hub Pro (AI 百宝箱)

Static AI tools navigation site. Pure HTML+CSS+JS, no build step.

## Commands
- **Dev**: Open `index.html` in browser (or `npx serve .`)
- **Deploy**: Push to git; Vercel auto-deploys via `vercel.json` (static build)
- **No** package.json, lint, test, or typecheck

## Project Structure

| Path | Purpose |
|------|---------|
| `index.html` | SPA shell, all UI |
| `css/style.css` | Single stylesheet (735 lines, CSS variables) |
| `js/data.js` | Tool data (TOOLS_DATA), scenes (SCENES), tag relations |
| `js/main.js` | App logic: init, filters, search, ads, submit modal |
| `js/wechat.js` | WeChat integration (disabled by default) |
| `config.json` | Site config (ads, analytics, features — all opt-in) |

## Key Facts

- **Config-driven**: `config.json` is fetched at runtime (`js/main.js:28`). Ads, WeChat, GA4 are **disabled by default** — set `.enabled: true` and fill IDs to activate.
- **Tool data** is hardcoded in `js/data.js` (55+ tools). To add/remove tools, edit `TOOLS_DATA` array.
- **Categories**: writing, video, image, code, agent, audio, productivity — defined in `index.html` `<button class="cat-btn">` elements.
- **Roles**: operator, developer, designer, student — defined in `#roleSelect` dropdown.
- **Cache headers**: Vercel serves images/svg/png with `max-age=31536000, immutable`; JS/CSS with `max-age=86400` (see `vercel.json`).
- **Ad insertion**: Ads are injected after every Nth tool card (`adInterval: 4` in config). Only loads if config has valid publisher ID.
- **Submit tool** modal builds a `mailto:hi@aihub.pro` link — no backend.
- **Relations** system links related tools (defined per-tool `relations` array). Panel auto-hides after 8s.

## Editing Checklist
1. Edit tool data → `js/data.js`
2. Edit site text/metadata → `index.html` (static) or `config.json` (dynamic)
3. Edit styles → `css/style.css`
4. Verify by opening `index.html` locally or re-deploying
