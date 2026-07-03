# Adrita Afsara Khan — Portfolio Site

My personal portfolio, built from scratch on top of an HTML5 UP template that I heavily customized and extended with real features.

## What I built

I didn't just drop a template online, I used it as a starting point and built a fully functional site around it. Here's what I added:

### AI Chat Assistant
Integrated the Claude API (Anthropic) into a custom chat widget. Visitors can ask questions about my background, skills, and projects and get real, conversational answers. I wrote a PHP proxy (`chat.php`) to keep the API key server-side, pass conversation history for multi-turn context, and fall back gracefully to a keyword-based assistant if the API is unavailable.

### Live GitHub Projects Feed
The Projects page pulls my public repositories directly from the GitHub REST API — no manual updates needed. Each card shows the repo description, language, and links to the source and live demo if one is deployed.

### Contact Form with PHP Backend
Built a PHP mail handler (`contact.php`) that receives form submissions, sanitizes inputs, and emails me directly. Includes a honeypot field for basic bot filtering.

### Firebase Project Likes
Visitors can like individual projects. Likes are stored in Firebase Realtime Database and persist across sessions using localStorage to prevent duplicate likes.

---

## Tech stack

| Layer | Tools |
|-------|-------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | PHP (contact form, AI proxy) |
| AI | Claude API — claude-haiku-4-5 (Anthropic) |
| Database | Firebase Realtime Database |
| Data | GitHub REST API |
| Analytics | GoatCounter |

---

## Running locally

```bash
git clone https://github.com/AdritaKhan1/Landing-Page.git
cd Landing-Page
python3 -m http.server 8000
# open http://localhost:8000
```

The contact form and AI chat require a PHP server with cURL and valid API keys. Everything else works on a plain static server.

---

## Credits

- Base template: [Solid State](https://html5up.net/solid-state) by [HTML5 UP](https://html5up.net) — CCA 3.0 license
- Icons: [Font Awesome](https://fontawesome.io)
- jQuery & Scrollex: [ajlkn](https://github.com/ajlkn)
