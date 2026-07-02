# Final Round · Selection Committee

A single-page static site. No build step, no dependencies, no backend — her response is delivered via the "Copy my response" button (she pastes it to you on Feishu) or a screenshot.

## Deploy on Cloudflare Pages (2 minutes)

1. Go to Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Give the project a name (this becomes the URL, e.g. `final-round.pages.dev` — pick something nice like `your-final-round`).
3. Drag the **contents of this folder** (index.html, css/, js/, favicon.svg) into the upload box.
4. Deploy. Done.

## Files

- `index.html` — the page
- `css/style.css` — all styling
- `js/app.js` — form logic, the red chop seal, animations
- `favicon.svg` — knight seal favicon

## Customizing

- Names, venues, dates, times, and all joke options live at the top of `js/app.js` in plain arrays.
- The reference number `FR-2026-0807` is in `js/app.js` (`REF`) and in `index.html` (ticker + fineprint).
- Colors are CSS variables at the top of `css/style.css`.
