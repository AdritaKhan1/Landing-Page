/* =========================================================
   OPTIONAL: Upgrade Adrita's Assistant to a real Claude LLM
   ---------------------------------------------------------
   The default chatbot.js needs no server and works anywhere.
   If you'd rather have open-ended, conversational answers powered
   by Claude, you need a tiny backend to hold your API key safely
   (never put an API key in front-end code — anyone can read it).

   STEP 1 — Run a small proxy that holds your key. Minimal Node example:

   ----------------------------------------------------------------
   // server.js   (run: npm i express node-fetch@2 && node server.js)
   const express = require("express");
   const fetch = require("node-fetch");
   const app = express();
   app.use(express.json());
   app.use(express.static(".")); // serves your website

   const SYSTEM = `You are the friendly assistant on Adrita Khan's
   portfolio website. Adrita is a Computer Science student at Toronto
   Metropolitan University (BSc Hons, 2026), a Software Engineer Fellow
   at Headstarter AI, and a UofT Life Sciences grad (2021, Biology +
   French). She runs Afsara's Elegant Jewellery. Answer questions about
   her warmly and concisely, and help visitors navigate the site
   (Home / About / Projects / Contact). If you don't know something,
   suggest the Contact page. Keep replies to 2-4 sentences.`;

   app.post("/api/chat", async (req, res) => {
     try {
       const r = await fetch("https://api.anthropic.com/v1/messages", {
         method: "POST",
         headers: {
           "content-type": "application/json",
           "x-api-key": process.env.ANTHROPIC_API_KEY,   // set this in your shell
           "anthropic-version": "2023-06-01"
         },
         body: JSON.stringify({
           model: "claude-haiku-4-5-20251001",
           max_tokens: 400,
           system: SYSTEM,
           messages: req.body.messages
         })
       });
       const data = await r.json();
       const text = (data.content || []).map(b => b.text || "").join("\n");
       res.json({ reply: text || "Sorry, I didn't catch that." });
     } catch (e) { res.status(500).json({ reply: "Server error." }); }
   });

   app.listen(3000, () => console.log("http://localhost:3000"));
   ----------------------------------------------------------------

   STEP 2 — Point the widget at your proxy. In chatbot.js, replace the
   body of botRespond() with a fetch to /api/chat, keeping a running
   `messages` array of {role:"user"|"assistant", content:"..."}:

   ----------------------------------------------------------------
   var history = [];
   function botRespond(userText) {
     var typing = showTyping();
     history.push({ role: "user", content: userText });
     fetch("/api/chat", {
       method: "POST",
       headers: { "content-type": "application/json" },
       body: JSON.stringify({ messages: history })
     })
     .then(function (r) { return r.json(); })
     .then(function (d) {
       typing.remove();
       history.push({ role: "assistant", content: d.reply });
       addMessage(d.reply, "bot");
     })
     .catch(function () {
       typing.remove();
       addMessage("I'm having trouble reaching the server right now.", "bot");
     });
   }
   ----------------------------------------------------------------

   Now `node server.js` serves the site AND the AI assistant on
   http://localhost:3000. Keep your key in an environment variable,
   never in a committed file.
   ========================================================= */
