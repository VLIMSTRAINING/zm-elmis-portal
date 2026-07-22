# eLMIS Zambia — Prototype Portal

A static prototype landing site for Zambia's **electronic Logistics Management Information System (eLMIS)**, modelled on the [SmartCare Pro resource site](https://smartcarezambia.io/) and the *Zambia Supply Chain Portal* mockup (USAID eSCMIS Project).

No build step, no backend — plain HTML/CSS/JS, so it deploys instantly on GitHub Pages and is easy for anyone to fork and edit.

## What's included

| Page | Purpose |
|---|---|
| `index.html` | Landing page — live stats, Production/Test environment login links, CHW app callout, previews of About/Analytics/News/Tools/ZeLISA |
| `about.html` | Background & global history, the two editions, facility workflow, R&R data flow, governance, the Six Rights, key impact figures |
| `analytics.html` | Data Analytics & Reports dashboard (Financing, Inventory, Distribution, Quantification, Performance Monitoring, AMC Alerts) built with Chart.js |
| `news.html` | News & release announcements, filterable by category — includes the real September 2025 Transition Ceremony results |
| `tools-guides.html` | Release notes archive, full report catalogue, downloadable user guides, CHW mobile app download + install instructions, support tools, related systems |
| `zelisa.html` | **ZeLISA** — Zambia eLMIS Logistics Intelligence and Supply Chain Agent chat prototype (rule-based canned responses grounded in real eLMIS facts, no real backend yet) |

## Content sources

Real facts, figures and history (the Six Rights, the two editions, R&R approval flow, governance model, KPI framework, and the September 2025 Transition Ceremony evaluation results) were sourced from documents in the project's Control Tower folder: `eLMIS_Zambia_Presentation.pptx`, `About eLMIS.pptx`, `Zambia Supply Chain digitization Efforts_V2.pptx`, `2026.03.03_eLMIS_Overview.docx`, and the `eLMIS Transition Ceremony Presentation_09302025.pptx`. Everything in `/data/analytics.json` remains illustrative sample data (see disclaimer banners on the Analytics page) since it requires a live connection to the eLMIS Reporting Service.

Content is data-driven from JSON files in `/data` so you can update stats, news, releases, guides and dashboard figures without touching HTML:

```
data/stats.json       — landing page KPI stat cards
data/news.json        — news & release announcements
data/guides.json      — release notes, user guides, tools
data/analytics.json   — dashboard sample figures for every tab
```

## Known placeholders to replace before go-live

- **Test/UAT environment URL** — `index.html` currently links to `https://test.zm-elmis.org/public/pages/login.html`, a guessed placeholder. Update to the real Test environment URL.
- **CHW app APK / user guide PDFs** — `assets/downloads/` and `assets/docs/` contain stub placeholder files. Replace with the real signed APK and PDF guides (or point the `file` fields in `data/guides.json` to a CDN/release URL instead).
- **ZeLISA** — `assets/js/zelisa.js` is a keyword-matched mock. To make it a real assistant, replace `respondTo()` with a call to your chosen backend/LLM API (keep the API key server-side, never in client JS).
- **Stats & analytics figures** — everything in `/data` is illustrative sample data mirroring the Zambia Supply Chain Portal mockup; swap in real figures from eLMIS reporting (SRS/OLAP) once available.
- Contact details in the footer (`assets/js/partials.js`) are placeholders.

## Running locally

Because pages `fetch()` the JSON files in `/data`, opening `index.html` directly via `file://` will fail in most browsers (CORS). Serve the folder instead:

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Then visit `http://localhost:8080`.

## Deploying with GitHub Pages

This repo includes a ready-made GitHub Actions workflow (`.github/workflows/pages.yml`) that deploys the site automatically on every push to `main`.

1. Push this repo to GitHub (see commands below).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` (or re-run the workflow from the **Actions** tab) — your site will be live at `https://<username>.github.io/<repo-name>/`.

If you'd rather not use Actions, you can instead set **Source: Deploy from a branch → main → / (root)** in the same Pages settings screen — no workflow needed, since this is a plain static site.

## Pushing this prototype to GitHub

```bash
cd zm-elmis-portal
git init
git add .
git commit -m "Initial prototype: eLMIS Zambia portal"
git branch -M main
git remote add origin https://github.com/<your-username>/zm-elmis-portal.git
git push -u origin main
```

Then enable Pages as described above.

## Credits / sources referenced

- Design pattern inspiration: [smartcarezambia.io](https://smartcarezambia.io/)
- Production environment: [zm-elmis.org](https://zm-elmis.org/public/pages/login.html)
- Dashboard/analytics layout: *Zambia Supply Chain Portal* conceptual mockup, USAID eSCMIS Project (Wendy Bomett, Chris Opit, Friday Simfukwe — March 2022)
