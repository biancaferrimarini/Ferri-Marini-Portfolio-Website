# Bianca Ferri Marini Portfolio

Start with **INIZIA-QUI.md** for the Italian step-by-step GitHub Pages and Pages CMS instructions.

Portable HTML/CSS/JavaScript portfolio with local fonts, model-viewer and Draco decoders. No paid backend or ChatGPT runtime is required. Pages CMS is an external editing service; authorize its GitHub App for the selected repository after the initial upload.

## Editing

`.pages.yml` defines forms for `content/collections/*.json` and `content/projects/*.json`. Projects reference a stable collection UUID. Both types have draft/published states and numeric order. Projects include title/year, category/concept/description, software/techniques, up to five renders, six construction notes, physical reference and GLB/GLTF.

Image uploads go to assets/images with random names to avoid collisions. Models and GLTF dependencies go to assets/models with unchanged names; give each model a unique filename. model.externalURL (HTTPS) takes precedence when supplied. There are no passwords, PATs or secrets in the public site.

The existing placeholders remain published for layout review. Remove them or set them to draft for the finished public portfolio. Their demonstration T-shirt is not claimed as Bianca's design. New entries default to draft.

## Build and preview

Node.js 24, no npm dependencies:

```sh
node scripts/build-portfolio.mjs
python -m http.server 8000 --directory _site
```

Open http://localhost:8000/. The build copies the public site into _site and generates data/portfolio.json. It excludes content/, scripts, CMS config and draft records from the deployment artifact. Public assets still include draft uploads, and the repository/history is public in the free GitHub setup. Draft does not mean confidential.

For a source-folder preview, first run `node scripts/build-portfolio.mjs --data-only`, then serve that folder over HTTP. The checked-in data/portfolio.json is only a preview snapshot. Author content/ files or use the CMS; GitHub Actions regenerates the live data after every main-branch push.

CMS /assets paths are normalized to relative assets paths to support GitHub repository subfolders. External Cloudinary image links are supported; original optimized image backups are also included. GLB/GLTF loads on visitor request only. The loaded viewer keeps background #303030 and exposure 1.35. Gallery counts follow the configured render entries.

## Publishing

Upload the contents of this folder, including .pages.yml and .github/workflows/pages.yml, to the repository root. Select Settings > Pages > Source: GitHub Actions and run Publish portfolio once. Further CMS saves trigger builds automatically. The workflow uses GitHub's temporary permissions; no personal token is needed.

The footer links to admin.html and the real Pages CMS sign-in. This page does not simulate login or store edits locally. Installation, uploads in the hosted CMS, and real GitHub deployment must be tested after the user creates the repository and authorizes access. A CMS save becomes live only after the Pages workflow succeeds.

New collections generate tabs automatically. Projects retain their gallery positions and loaded models when switching. Ordering, reassignment, drafting, deletion and new entries do not require HTML edits. About/Contact remain in data/site.json and logos in assets/logo.

## Licenses

Cormorant Garamond and Montserrat: SIL Open Font License. model-viewer 4.1.0: Apache 2.0, includes three.js (MIT). Draco and KTX2 decoder licenses are bundled under assets/vendor. Retain third-party notices.

Official documentation:
- https://pagescms.org/docs/quick-start/
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
