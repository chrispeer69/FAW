# Blue Collar AI × Fields Auto Works

Engagement hub and deliverables for the Blue Collar AI proposal to Fields Auto Works.

## Live site

- **`index.html`** — the engagement hub. Lists every deliverable and grows as new ones are added.
- **`proposal.html`** — the 9-page AI Implementation & Growth proposal (renders in-browser, prints to letter-size PDF).

Open `index.html` to start. To preview locally:

```bash
python -m http.server 8777
# then visit http://127.0.0.1:8777
```

## Structure

```
.
├── index.html          Engagement hub (landing page)
├── proposal.html       9-page proposal — built from the Claude Design export
├── assets/
│   ├── fonts.css       Shared @font-face (Archivo, Newsreader, Space Mono)
│   └── fonts/          Self-hosted .woff2 files
├── artifacts/          Handoff deliverables
│   ├── FAW_AI_Growth_Blueprint.pptx
│   └── AI_Roadmap_for_Fields_Auto_Works.m4a
├── build.cjs           Regenerates proposal.html + assets/fonts.css
└── source/             Original Claude Design export + extraction tooling
    ├── Blue Collar AI Proposal.html   (bundled dc export)
    ├── extract.cjs                    (unpacks the bundle → _template_raw.html + fonts)
    └── _template_raw.html
```

## Rebuilding the proposal

`proposal.html` is generated from the Claude Design export, not hand-edited. To regenerate:

```bash
node source/extract.cjs   # only needed if re-importing the bundle
node build.cjs            # rewrites proposal.html and assets/fonts.css
```

## Brand

| Token  | Value     | Use                         |
|--------|-----------|-----------------------------|
| Ink    | `#14181E` | Backgrounds                 |
| Orange | `#E8590C` | Primary accent              |
| Blue   | `#1C3F6E` | Secondary accent            |
| Paper  | `#FBFAF6` | Document page background    |

Fonts: **Archivo** (display/sans), **Newsreader** (serif body), **Space Mono** (labels).
