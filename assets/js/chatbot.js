(function () {
	"use strict";

	var PROFILE = {
		name: "Adrita Khan",
		location: "Mississauga, Ontario",
		email: "adrita.khan@torontomu.ca",
		linkedin: "https://www.linkedin.com/in/adrita-afsara-khan/",
		tagline: "A biologist turned software engineer."
	};

	/* ---- Built-in knowledge base ---- */
	var KB = [
		{
			id: "greeting",
			keys: ["hi", "hello", "hey", "yo", "greetings", "howdy", "good morning", "good evening"],
			reply: "Hi there! I'm Adrita's assistant. I can tell you about her background, education, work, and projects — or point you to the right page. What would you like to know?",
			chips: ["Who is Adrita?", "Her projects", "How to contact her"]
		},
		{
			id: "about",
			weak: true,
			keys: ["who is", "who's", "about adrita", "about her", "yourself", "adrita", "bio", "introduce", "background", "story"],
			reply: "Adrita Khan is a passionate developer who loves to learn, explore, and gain new experiences. She started in the life sciences and pivoted to software engineering — bridging biology and tech. She graduated with a BSc (Hons) in Computer Science from Toronto Metropolitan University in June 2026 and completed a Software Engineering Fellowship at Headstarter AI.",
			chips: ["Her education", "Her work experience", "Read the About page →about"]
		},
		{
			id: "education",
			keys: ["education", "school", "study", "studied", "degree", "university", "college", "tmu", "toronto metropolitan", "uoft", "u of t", "computer science", "major", "graduate", "biology", "french"],
			reply: "Education:\n• Toronto Metropolitan University — BSc (Hons), Computer Science, June 2026\n• University of Toronto — HBSc, Life Sciences, 2021, with double majors in Biology for Health Sciences and French Studies.\nAt UofT she was also a research student, a Facilitated Study Group leader, and a clubs leader.",
			chips: ["Her research", "Her work experience", "About page →about"]
		},
		{
			id: "work",
			keys: ["work", "job", "experience", "fellow", "fellowship", "headstarter", "career", "employed", "engineer", "professional", "internship"],
			reply: "Work & experience:\n• Software Engineer Fellow at Headstarter AI (Jul – Aug 2024) — built full-stack web apps with React, Next.js, and HTML/CSS.\n• Founder of Afsara's Elegant Jewellery (2020 – present), a small business she started during the pandemic.\n• Tutor.\nShe also has a strong record of research and leadership from her UofT years.",
			chips: ["Her business", "Her projects →projects", "Her resume →resume"]
		},
		{
			id: "business",
			keys: ["business", "jewellery", "jewelry", "afsara", "shop", "entrepreneur", "store", "small business"],
			reply: "Adrita founded Afsara's Elegant Jewellery in 2020 during the pandemic. You can find it on Facebook (facebook.com/afsarasejewellery) and Instagram (@afsarasejewellery).",
			chips: ["Her work experience", "Her projects →projects"]
		},
		{
			id: "research",
			keys: ["research", "paper", "papers", "literature", "review", "publication", "study group", "fsg", "transformative", "education south asia", "bio399", "eds310"],
			reply: "Research & academic work:\n• A literature review on Transformative Learning (course BIO399).\n• A research report on girls' education in South Asia (course EDS310).\n• Facilitated Study Group leader for FRE272Y, co-leading sessions.\nThese are linked from the home page and the About page.",
			chips: ["Her education", "About page →about"]
		},
		{
			id: "leadership",
			keys: ["leadership", "club", "clubs", "boss women", "vice president", "president", "volunteer", "lead", "empowerment", "women"],
			reply: "Leadership: Adrita was Vice President of Boss Women UTM (2020–2021), a club focused on women's empowerment. She also led Facilitated Study Group sessions and was active in several clubs during her time at UofT.",
			chips: ["Her research", "About page →about"]
		},
		{
			id: "projects",
			keys: ["project", "projects", "github", "code", "repo", "repository", "portfolio", "build", "built", "app", "apps", "demo", "software"],
			reply: "Adrita's projects are pulled live from her GitHub on the Projects page — each one links to the source, a live demo when available, and instructions to run it locally.",
			chips: ["Go to Projects →projects", "Her work experience"]
		},
		{
			id: "skills",
			keys: ["skill", "skills", "language", "languages", "tech", "stack", "tools", "programming", "ai", "technologies", "good at"],
			reply: "Adrita works across software engineering and AI, with a foundation in computer science from TMU and her Headstarter AI fellowship. Her science background (biology, research) gives her a strong analytical and problem-solving toolkit. For a full breakdown, the Projects page shows the languages behind each repo and her resume lists more.",
			chips: ["Her projects →projects", "Her resume →resume"]
		},
		{
			id: "goals",
			keys: ["goal", "goals", "future", "aspire", "aspiration", "dream", "want to", "vision", "hope"],
			reply: "Adrita aspires to become a software engineer who uses the power of AI engineering to build tools for hospitals, learning environments, and the tech industry — combining her biology roots with software.",
			chips: ["Her education", "Her projects →projects"]
		},
		{
			id: "contact",
			keys: ["contact", "email", "reach", "message", "get in touch", "linkedin", "connect", "hire", "talk", "phone", "location", "where"],
			reply: "You can reach Adrita at " + PROFILE.email + ". She's based in " + PROFILE.location + ", and you can connect with her on LinkedIn.",
			chips: ["Contact page →contact", "LinkedIn →linkedin"]
		},
		{
			id: "resume",
			keys: ["resume", "cv", "curriculum", "download resume"],
			reply: "You can download Adrita's resume directly — it covers her education, experience, and skills in detail.",
			chips: ["Download resume →resume", "Her education"]
		},
		{
			id: "navigate",
			keys: ["navigate", "menu", "where do i", "how do i find", "sections", "pages", "help me find", "site map"],
			reply: "Here's the map of the site: Home (overview), About (full bio, education, highlights), Projects (live GitHub work), Experience, and Contact. Use the chips below to jump anywhere.",
			chips: ["Home →home", "About →about", "Projects →projects", "Contact →contact"]
		},
		{
			id: "thanks",
			keys: ["thanks", "thank you", "thank", "appreciate", "cheers", "ty"],
			reply: "You're welcome! Anything else you'd like to know about Adrita?",
			chips: ["Her projects →projects", "How to contact her →contact"]
		}
	];

	var FALLBACK = {
		reply: "I'm not sure I caught that — I can help with Adrita's background, education, work, research, projects, or how to contact her. Try one of these:",
		chips: ["Who is Adrita?", "Her projects →projects", "Her education", "Contact her →contact"]
	};

	var NAV = {
		home: "index.html",
		about: "about.html",
		projects: "projects.html",
		experience: "experience.html",
		contact: "contact.html",
		resume: "documents/Adrita Khan Resume 2026.pdf",
		linkedin: PROFILE.linkedin
	};

	/* ---------------- Local keyword matcher ---------------- */
	function normalize(s) { return (" " + s.toLowerCase() + " ").replace(/[^a-z0-9\s]/g, " "); }

	function scoreIntent(text, intent) {
		var t = normalize(text), score = 0;
		intent.keys.forEach(function (k) {
			if (t.indexOf(" " + k + " ") !== -1) score += k.split(" ").length * 2;
			else if (t.indexOf(k) !== -1) score += 1;
		});
		return score;
	}

	function findReply(text) {
		var best = null, bestScore = 0;
		var bestWeak = null, bestWeakScore = 0;
		KB.forEach(function (intent) {
			var s = scoreIntent(text, intent);
			if (s <= 0) return;
			if (intent.weak) {
				if (s > bestWeakScore) { bestWeakScore = s; bestWeak = intent; }
			} else if (s > bestScore) { bestScore = s; best = intent; }
		});
		if (best) return best;
		if (bestWeak) return bestWeak;
		return FALLBACK;
	}

	/* ---------------- UI helpers ---------------- */
	var panel, log, input, launcher;

	function el(tag, cls, html) {
		var e = document.createElement(tag);
		if (cls) e.className = cls;
		if (html != null) e.innerHTML = html;
		return e;
	}

	function scrollDown() { log.scrollTop = log.scrollHeight; }

	function addMessage(text, who) {
		var m = el("div", "ak-msg " + who);
		m.innerHTML = text.replace(/\n/g, "<br>");
		log.appendChild(m);
		scrollDown();
		return m;
	}

	function renderChips(chips) {
		if (!chips || !chips.length) return;
		var wrap = el("div", "ak-chips");
		chips.forEach(function (c) {
			var parts = c.split("→");
			var label = parts[0].trim();
			var target = parts[1] ? parts[1].trim() : null;
			var chip = el("button", "ak-chip", label);
			chip.addEventListener("click", function () {
				if (target && NAV[target]) {
					var ext = (target === "linkedin");
					if (ext) window.open(NAV[target], "_blank");
					else window.location.href = NAV[target];
				} else {
					handleUser(label);
				}
			});
			wrap.appendChild(chip);
		});
		log.appendChild(wrap);
		scrollDown();
	}

	function showTyping() {
		var m = el("div", "ak-msg bot", '<span class="ak-typing"><span></span><span></span><span></span></span>');
		log.appendChild(m);
		scrollDown();
		return m;
	}

	function setInputEnabled(on) {
		input.disabled = !on;
		panel.querySelector("#ak-chat-send").disabled = !on;
	}

	/* ---------------- Bot response ---------------- */
	function botRespond(userText, typing) {
		setTimeout(function () {
			typing.remove();
			setInputEnabled(true);
			var result = findReply(userText);
			addMessage(result.reply, "bot");
			renderChips(result.chips);
		}, 450 + Math.random() * 350);
	}

	/* ---------------- Entry point for each user message ---------------- */
	function handleUser(text) {
		text = (text || "").trim();
		if (!text) return;
		addMessage(text, "user");
		setInputEnabled(false);
		var typing = showTyping();
		botRespond(text, typing);
	}

	function togglePanel(open) {
		var show = open != null ? open : !panel.classList.contains("open");
		panel.classList.toggle("open", show);
		launcher.classList.toggle("open", show);
		launcher.innerHTML = show ? "&times;" : '<span class="icon solid fa-comment-dots">&#9993;</span>';
		if (show) { setTimeout(function () { input.focus(); }, 50); }
	}

	function build() {
		launcher = el("button", null, "&#128172;");
		launcher.id = "ak-chat-launcher";
		launcher.setAttribute("aria-label", "Open chat assistant");
		launcher.addEventListener("click", function () { togglePanel(); });

		panel = el("div");
		panel.id = "ak-chat-panel";
		panel.innerHTML =
			'<div id="ak-chat-header">' +
				'<div class="ak-avatar">AK</div>' +
				'<div><div class="ak-title">Adrita\'s Assistant</div>' +
				'<div class="ak-sub">Ask me anything about Adrita</div></div>' +
				'<button class="ak-close" aria-label="Close chat">&times;</button>' +
			'</div>' +
			'<div id="ak-chat-log"></div>' +
			'<div id="ak-chat-inputbar">' +
				'<input id="ak-chat-input" type="text" placeholder="Ask me anything…" autocomplete="off" />' +
				'<button id="ak-chat-send" aria-label="Send">&#10148;</button>' +
			'</div>';

		document.body.appendChild(launcher);
		document.body.appendChild(panel);

		log    = panel.querySelector("#ak-chat-log");
		input  = panel.querySelector("#ak-chat-input");

		panel.querySelector(".ak-close").addEventListener("click", function () { togglePanel(false); });
		panel.querySelector("#ak-chat-send").addEventListener("click", function () {
			handleUser(input.value); input.value = "";
		});
		input.addEventListener("keydown", function (e) {
			if (e.key === "Enter") { handleUser(input.value); input.value = ""; }
		});

		addMessage("Hi! I'm Adrita's assistant. Ask me anything about her background, work, or projects.", "bot");
		renderChips(["Who is Adrita?", "Her projects →projects", "Her education", "Contact her →contact"]);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", build);
	} else { build(); }
})();
