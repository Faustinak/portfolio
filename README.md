# Faustina Koduah — Portfolio Website

A real, deployable multi-page portfolio site built with React, React Router, and Vite.
This replaces the old "separate preview files" setup — everything here is wired
together with working navigation, ready to build and publish.

---

## What's in this project

```
site/
├── src/
│   ├── pages/          ← Your 6 pages (Home, About, Playground, and 3 case studies)
│   ├── App.jsx          ← Routing — maps URLs to pages
│   ├── main.jsx         ← Entry point
│   └── index.css        ← Global styles (Tailwind)
├── public/
│   ├── CNAME             ← Your custom domain (faustinakoduah.com)
│   └── 404.html          ← Makes direct links like /about work on GitHub Pages
├── .github/workflows/
│   └── deploy.yml        ← Auto-builds and publishes the site every time you push
└── package.json
```

Your site's real pages, once live:
- `faustinakoduah.com` — Home
- `faustinakoduah.com/about` — About
- `faustinakoduah.com/playground` — Playground
- `faustinakoduah.com/work/rams-heal` — Rams Heal case study
- `faustinakoduah.com/work/costar-internship` — CoStar Internship case study
- `faustinakoduah.com/work/tunefuse` — TuneFuse case study

---

## Part 1 — Get your computer set up (one-time)

You said you're still building comfort with a coding environment, so here's the
full path from scratch.

1. **Install Node.js.** Go to nodejs.org and download the "LTS" version. Run
   the installer, click through with defaults. This gives you `node` and `npm`
   (the tool that installs and runs JavaScript projects).
2. **Install a code editor.** VS Code (code.visualstudio.com) is the standard
   choice — free, and what most guides assume you're using.
3. **Install Git.** Go to git-scm.com and download it. This is what lets you
   push your code to GitHub.
4. **Create a GitHub account** at github.com if you don't have one already.

Verify everything installed correctly — open a terminal (on Mac: Terminal app;
on Windows: Command Prompt or PowerShell) and run:

```bash
node -v
npm -v
git --version
```

Each should print a version number. If any say "command not found," restart your
computer and try again (sometimes needed for the installer to update your PATH).

---

## Part 2 — Run the site on your own computer

1. Unzip this project folder somewhere easy to find, like your Desktop.
2. Open a terminal and navigate into the folder:
   ```bash
   cd path/to/site
   ```
   (Tip: you can type `cd ` then drag the folder into the terminal window to
   auto-fill the path.)
3. Install the project's dependencies (only needed once, or whenever you pull
   new changes):
   ```bash
   npm install
   ```
4. Start the local dev server:
   ```bash
   npm run dev
   ```
5. Open the URL it prints (usually `http://localhost:5173`) in your browser.
   Your site is now running locally — click around, everything should navigate
   between real pages.
6. To stop the server, go back to the terminal and press Ctrl+C.

Any time you want to preview changes, repeat steps 4–5.

---

## Part 3 — Put it on GitHub

1. On github.com, click the **+** in the top right → **New repository**.
2. Name it anything (e.g. `portfolio`). Leave it **Public**. Don't check any of
   the "initialize with..." boxes. Click **Create repository**.
3. GitHub will show you a page with commands. Back in your terminal (inside the
   `site` folder), run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```
   Replace YOUR-USERNAME and YOUR-REPO-NAME with your actual GitHub username
   and the repo name you picked.

---

## Part 4 — Turn on GitHub Pages

1. On your repository's GitHub page, click **Settings** (top menu).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment** → **Source**, choose **GitHub Actions**
   (not "Deploy from a branch").
4. That's it — the workflow file already included in this project
   (.github/workflows/deploy.yml) will automatically build and publish your
   site every time you push to main. Check the **Actions** tab on GitHub to
   watch it build (takes about a minute).

---

## Part 5 — Connect faustinakoduah.com

You mentioned you still need to buy this domain. Here's the full path:

### Buy the domain
Use any registrar — Namecheap or Squarespace Domains are both solid,
beginner-friendly choices, usually $12–20/year for a .com.

### Point the domain at GitHub Pages
Once purchased, go to your registrar's DNS settings for the domain and add
these records:

| Type | Host/Name | Value |
|------|-----------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR-USERNAME.github.io |

(These four IP addresses are GitHub's official Pages servers — they don't
change based on your username.)

### Tell GitHub about your domain
1. Back in your repo → **Settings** → **Pages**.
2. Under **Custom domain**, type faustinakoduah.com and click **Save**.
   (This project already includes a CNAME file with this domain, so GitHub
   should actually detect it automatically — but confirm it shows correctly
   here.)
3. Wait for the DNS check to pass (can take anywhere from a few minutes to a
   few hours after you add the DNS records).
4. Once it passes, check **Enforce HTTPS** for a secure https:// site.

DNS changes can take up to 24–48 hours to fully propagate worldwide, though
it's often much faster. If faustinakoduah.com doesn't load right away,
give it some time.

---

## Making changes later

Whenever you want to update something:
1. Make your edits in the src/pages/ files.
2. Test locally with npm run dev.
3. When you're happy, push it live:
   ```bash
   git add .
   git commit -m "Describe what you changed"
   git push
   ```
4. GitHub Actions automatically rebuilds and redeploys — check the **Actions**
   tab to watch it happen. Give it a minute, then refresh your live site.

---

## Known placeholders still needing real content

- **Résumé link** — every page's footer has a "Resume" link that isn't wired
  to a real file yet. Once you have a PDF, the simplest approach: drop it in
  the public/ folder (e.g. public/resume.pdf), then update each page's
  Resume link to href="/resume.pdf" and add download to the tag so it
  downloads directly.
