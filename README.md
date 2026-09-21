# redteamer403.github.io

Personal portfolio — Rustam Fakhrutdinov, Offensive Security Engineer.

Static site served via GitHub Pages. No build step.

## Structure
```
index.html        # entire site (HTML + inline CSS/JS)
assets/cv.pdf     # CV — drop your file here, the Download CV buttons point to it
README.md
```

## Deploy
Push to the default branch. GitHub Pages serves it at https://redteamer403.github.io/ automatically.

## Updating the numbers
All Bugcrowd stats are hardcoded in `index.html`:
- Metric cards: search for `class="metric"`
- Severity bar: search for `class="sevbar"` (widths are percentages of 40)
- Vulnerability classes: search for `class="vrow"`

## CV
The `Download CV` buttons link to `assets/cv.pdf`. Add that file and they start working. Keep the exact filename or update the two `href="assets/cv.pdf"` references.
