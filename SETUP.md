# Your site — what's new & how to use it

Your landing page now has a navigation bar, four new pages, a chat assistant
on every page, and live visitor/click stats. Here's everything you need.

## New pages
- **index.html** — your home page (now with nav + assistant)
- **about.html** — full bio, education, goals, and highlights
- **projects.html** — your GitHub projects, loaded live
- **contact.html** — contact details + a message form
- **stats.html** — public visitor & project-click counts

## One file to configure everything
Open **`assets/js/config.js`** — this is the only file you normally edit:

```js
window.AK_CONFIG = {
  githubUsername:    "YOUR_GITHUB_USERNAME",  // for Projects + Stats
  analyticsProvider: "goatcounter",           // or "ga4" / "none"
  goatcounterCode:   "YOUR_CODE",             // for analytics + Stats
  ga4Id:             "G-XXXXXXXXXX",           // only if using ga4
  countLocalhost:    true
};
```

## 1. Show your GitHub projects
Set `githubUsername` in config.js to your GitHub handle (e.g. `"adritakhan"`).
Refresh the Projects page and your public repos appear automatically — no API
key needed. Each card has:
- a **Live Demo** button + preview when a project is deployed
  (its GitHub "Website" field or a GitHub Pages site),
- a **Code** button to the repo, and
- a **Run locally** button that reveals the exact `git clone` command.

To give a project a live demo, deploy it (GitHub Pages is free) or set the
repo's "Website" field on GitHub to the live URL.

## 2. Run the whole site on localhost
From inside the site folder:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
# or:  npx serve
```

A local server is recommended (over double-clicking the files) so the GitHub
fetch and previews behave like they will once deployed.

## 3. The chat assistant
The floating button (bottom-right) opens "Adrita's Assistant." It answers
questions about you and helps visitors jump to any page. It runs entirely in
the browser — no key, no server — so it works on localhost and any host.

To keep its answers current, edit the `PROFILE` and `KB` list at the top of
`assets/js/chatbot.js`.

## 4. Analytics — visitors & project clicks
Two numbers get tracked: **page visits** (counted automatically on every page)
and **project clicks** (Code / Live Demo / Run locally on each card). Default
provider is **GoatCounter** (free for personal sites, no cookie banner).

Turn it on:
1. Sign up at https://www.goatcounter.com and pick a "code" — say `adrita`.
   Your private dashboard then lives at `https://adrita.goatcounter.com`.
2. Put that code in `config.js` -> `goatcounterCode`.

Prefer **Google Analytics**? Set `analyticsProvider: "ga4"` and your `G-XXXX`
ID in `ga4Id`; read stats in the Google Analytics dashboard.

## 5. The public Stats page (stats.html)
This page shows the numbers **on your site**, so visitors and you can both see
them — total page views, visits per page, and clicks per project (ranked).

It reads the counts from GoatCounter's free public counter, so two things must
be true:
1. `analyticsProvider` is `"goatcounter"` and `goatcounterCode` is set
   (step 4 above), and
2. In GoatCounter, open **Settings** and tick
   **"Allow adding visitor counts on your website."**
   (It's off by default — this is what makes the numbers publicly readable.)

Notes:
- A brand-new GoatCounter site shows zeros until it records some visits.
- "Clicks by project" counts how many *visitors* opened each project's links.
  GoatCounter de-duplicates repeat clicks from the same visitor in a session,
  so it reflects genuine interest rather than raw button mashing.
- Stats only appear for projects whose repos load from your GitHub username.

## 6. The contact form
The form on `contact.html` opens the visitor's email app with their message
pre-filled to you. Prefer messages to arrive without the visitor needing an
email client? Formspree or Netlify Forms drop in with a few lines — happy to
wire that up.

## Files added
```
about.html, projects.html, contact.html, stats.html
assets/css/custom.css
assets/js/config.js                (edit this one)
assets/js/chatbot.js
assets/js/analytics.js
assets/js/projects.js
assets/js/stats.js
SETUP.md
```
`index.html` was edited to add the nav bar, the assistant, and analytics.
