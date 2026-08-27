# Jaikar Park → jaikar-UI (GitHub Pages)

This folder is the full compiled site: the classic portfolio at `/` **and the 3D
Jaikar Park world at `/world`**.

## Contents

- `index.html` — homepage (same as the live preview)
- `world/index.html` — Jaikar Park 3D world (`https://jaikarpothula.com/world`)
- `404.html` — SPA fallback so deep links (e.g. `/case/the-dark-arrival`) work
- `assets/` — compiled JS/CSS (includes the Three.js park bundle)
- `__l5e/` — brand logo + JP-01 avatar images
- `favicon.png`, `robots.txt`, `.nojekyll`

## Push it

```bash
git clone https://github.com/JaikarDev/jaikar-UI.git
cd jaikar-UI
# keep your domain file
cp CNAME /tmp/CNAME 2>/dev/null || true
git rm -r --cached . >/dev/null && rm -rf ./* .nojekyll 2>/dev/null
cp -r /path/to/this/folder/* /path/to/this/folder/.nojekyll .
cp /tmp/CNAME . 2>/dev/null || echo "jaikarpothula.com" > CNAME
git add -A
git commit -m "Add Jaikar Park 3D world + rebuild site"
git push origin main
```

GitHub Pages: Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
`.nojekyll` must stay so `assets/` is served untouched.

## What works on GitHub Pages

Fully static: park world, navigation, case studies, media, music, themes,
guestbook UI, visitor ping.

Server-backed features (AI assistant JP-01, guestbook writes) are proxied to
`https://jaikar-pothula.lovable.app` by a small bridge script in the pages'
`<head>`. That origin already allows `jaikarpothula.com`, so it works on the
live domain (not from `localhost`).

## Re-exporting later

Any change made in Lovable needs a fresh export of this folder — the compiled
`assets/` hashes change on every build.
