/* =========================================================
   Projects loader — pulls Adrita's repos live from GitHub
   ---------------------------------------------------------
   1. Set GITHUB_USERNAME below to your GitHub handle.
   2. Repos load automatically (public API, no key needed).
   3. Repos with a deployed site (homepage / GitHub Pages) get a
      live preview + "Live Demo". Every repo gets "Run locally".
   ========================================================= */
(function () {
	"use strict";

	/* Username comes from assets/js/config.js. (Fallback kept for safety.) */
	var GITHUB_USERNAME = (window.AK_CONFIG && window.AK_CONFIG.githubUsername) || "YOUR_GITHUB_USERNAME";

	/* Options */
	var HIDE_FORKS = true;
	var SORT_BY = "updated"; // "updated" | "stars"

	/* Override links or descriptions for specific repos.
	   Fields you can set per repo (all optional):
	     url         - override the "Code" link target
	     hideCode    - true to hide the "Code" button entirely (e.g. private/closed-source demos)
	     codeMessage - keep the "Code" button visible, but clicking it shows this message
	                   instead of opening the repo (e.g. "Needs permission")
	     demoUrl     - force a "Live Demo" link even if GitHub has no homepage set
	     demoMessage - shown when there's no live URL and the demo button is clicked
	     videoUrl    - adds a "Watch Demo" button linking to a YouTube video
	     previewImage - use a static image (path under images/) as the card preview
	                   instead of the live iframe. Use this when a site refuses to be
	                   framed (sends X-Frame-Options/CSP frame-ancestors), which
	                   would otherwise show as a blank/broken box.
	     order       - pins the card to a fixed position (lower = earlier). Projects
	                   without an "order" sort by last-updated among themselves, and
	                   slot in between whatever low/high order values are pinned. */
	var OVERRIDES = {
		"Landing-Page": {
			url: "https://github.com/AdritaKhan1/Landing-Page",
			demoMessage: "You’re already on it!"
		},
		"Picture-Gallery": {
			videoUrl: "https://youtu.be/esnb7jctIlA"
		},
		"SynqSpace": {
			demoUrl: "https://synq-space-dnns.vercel.app/",
			codeMessage: "Needs permission",
			order: 2
		},
		"Hotel-Reservations": {
			/* book-canada.onrender.com sends X-Frame-Options: DENY, so it can
			   never render in the live-preview iframe — use a static screenshot
			   instead. The Live Demo button still opens the real site. */
			previewImage: "images/bookcanada.png"
		},
		"Pantry-App": {
			videoUrl: "https://www.youtube.com/watch?v=G8TIJ-rsNoI",
			order: 1000
		},
		"CheckIn/Out at Kumon": {
			videoUrl: "https://youtu.be/CGRHkmxx6nQ",
			hideCode: true,
			order: 1
		}
		/* Example: demo-only project with code kept private
		"My-Closed-Source-App": {
			demoUrl: "https://myapp.example.com",
			hideCode: true
		}
		*/
	};

	/* Manual project cards — for repos that AREN'T public on GitHub (private
	   repos, or ones you haven't pushed), so the live GitHub fetch can't find
	   them. Each entry here gets a card just like a fetched repo, and the
	   OVERRIDES above (by "name") still apply to it. */
	var MANUAL_PROJECTS = [
		{
			name: "SynqSpace",
			description: "A live classroom for tutoring, live video and a shared whiteboard in one room.",
			language: "JavaScript",
			updated_at: "2026-07-01T00:00:00Z",
			html_url: "https://github.com/AdritaKhan1/SynqSpace",
			homepage: null,
			fork: false,
			stargazers_count: 0
		},
		{
			name: "CheckIn/Out at Kumon",
			description: "Built a full-stack Django attendance system supporting barcode check-in/out, real-time session tracking, automated parent email notifications, and Excel-based bulk student management across multiple centres. (Ongoing project)",
			language: "Python",
			updated_at: "2026-07-31T00:00:00Z",
			html_url: "",
			homepage: null,
			fork: false,
			stargazers_count: 0
		}
	];

	/* Language color dots (GitHub-ish) */
	var LANG_COLORS = {
		JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
		HTML: "#e34c26", CSS: "#563d7c", Java: "#b07219", C: "#555555",
		"C++": "#f34b7d", "C#": "#178600", Go: "#00ADD8", Ruby: "#701516",
		PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF", Rust: "#dea584",
		Shell: "#89e051", Jupyter: "#DA5B0B", "Jupyter Notebook": "#DA5B0B",
		Dart: "#00B4AB", Vue: "#41b883", R: "#198CE7"
	};

	var statusEl, gridEl, bannerEl;

	function setStatus(msg, isError) {
		statusEl.style.display = "block";
		statusEl.className = isError ? "error" : "";
		statusEl.id = "ak-projects-status";
		statusEl.innerHTML = msg;
	}

	function liveUrlFor(repo, override) {
		if (override && override.demoUrl) return override.demoUrl;
		if (repo.homepage && /^https?:\/\//i.test(repo.homepage)) return repo.homepage;
		return null; // only embed when we know a real deployed URL exists
	}

	function pagesGuess(repo) {
		return "https://" + GITHUB_USERNAME + ".github.io/" + repo.name + "/";
	}

	function youtubeThumbUrl(videoUrl) {
		var m = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
		return m ? "https://img.youtube.com/vi/" + m[1] + "/hqdefault.jpg" : null;
	}

	function card(repo) {
		var override = OVERRIDES[repo.name] || {};
		var live = liveUrlFor(repo, override);
		var c = document.createElement("div");
		c.className = "ak-card";

		/* preview */
		var videoThumb = override.videoUrl ? youtubeThumbUrl(override.videoUrl) : null;
		var preview = '<div class="ak-card-preview">';
		if (override.previewImage) {
			preview += '<img class="ak-preview-img" src="' + override.previewImage + '" alt="' + repo.name + ' preview" loading="lazy">';
		} else if (live) {
			preview += '<iframe src="' + live + '" loading="lazy" title="Preview of ' + repo.name + '"></iframe>';
		} else if (videoThumb) {
			preview +=
				'<a href="' + override.videoUrl + '" target="_blank" rel="noopener" class="ak-preview-video" title="Watch demo video">' +
					'<img src="' + videoThumb + '" alt="' + repo.name + ' demo thumbnail" loading="lazy">' +
					'<span class="ak-preview-play">&#9654;</span>' +
				'</a>';
		} else {
			preview += '<div class="ak-preview-fallback"><span class="icon brands fa-github">&#128187;</span></div>';
		}
		preview += '</div>';

		/* meta */
		var meta = '<div class="ak-meta">';
		if (repo.language) {
			var col = LANG_COLORS[repo.language] || "#8893bb";
			meta += '<span><span class="ak-dot" style="background:' + col + '"></span>' + repo.language + '</span>';
		}
		meta += '<span>Updated ' + new Date(repo.updated_at).toLocaleDateString() + '</span>';
		meta += '</div>';

		/* actions */
		var codeUrl  = override.url || repo.html_url;
		var showCode = override.hideCode !== true;

		var demoBtn;
		if (live) {
			demoBtn = '<a class="primary" href="' + live + '" target="_blank" rel="noopener">Live Demo</a>';
		} else if (override.demoMessage) {
			demoBtn = '<button class="primary ak-demo-msg" onclick="this.textContent=\'' + override.demoMessage + '\';setTimeout(function(el){return function(){el.textContent=\'Try it\'}}(this),2000)"  >Try it</button>';
		} else {
			demoBtn = '';
		}

		var videoBtn = override.videoUrl
			? '<a class="ak-video-btn" href="' + override.videoUrl + '" target="_blank" rel="noopener" title="Watch demo video" aria-label="Watch demo video">&#9654;</a>'
			: '';

		var codeBtn;
		if (!showCode) {
			codeBtn = '';
		} else if (override.codeMessage) {
			codeBtn = '<button class="ak-code-msg" onclick="this.textContent=\'' + override.codeMessage + '\';setTimeout(function(el){return function(){el.textContent=\'Code\'}}(this),2000)">Code</button>';
		} else {
			codeBtn = '<a href="' + codeUrl + '" target="_blank" rel="noopener">Code</a>';
		}

		var actions =
			'<div class="ak-actions">' +
				demoBtn +
				videoBtn +
				codeBtn +
				'<button class="ak-like-btn" data-repo="' + repo.name + '"><span class="ak-heart">&#9829;</span> <span class="ak-like-count">0</span></button>' +
			'</div>';

		c.innerHTML =
			preview +
			'<div class="ak-card-body">' +
				'<h3>' + repo.name + '</h3>' +
				'<div class="ak-desc">' + (repo.description || "No description provided.") + '</div>' +
				meta +
				actions +
			'</div>';

		function trackClick(action) {
			if (!window.akCount) return;
			window.akCount("/p/" + repo.name, "Project: " + repo.name);            // aggregate (per-project total)
			window.akCount("/p/" + repo.name + "/" + action, repo.name + " · " + action); // detail
		}

		/* Track clicks on the Demo and Code buttons (they open in a new tab,
		   so the hit has time to send). */
		var demoEl = c.querySelector(".ak-actions a.primary");
		if (demoEl) demoEl.addEventListener("click", function () { trackClick(live ? "demo" : "pages"); });
		var videoEl = c.querySelector(".ak-actions a.ak-video-btn");
		if (videoEl) videoEl.addEventListener("click", function () { trackClick("video"); });
		var videoThumbEl = c.querySelector(".ak-card-preview a.ak-preview-video");
		if (videoThumbEl) videoThumbEl.addEventListener("click", function () { trackClick("video"); });
		if (showCode) {
			var codeEl = override.codeMessage
				? c.querySelector(".ak-actions button.ak-code-msg")
				: c.querySelector('.ak-actions a[href="' + codeUrl + '"]');
			if (codeEl) codeEl.addEventListener("click", function () { trackClick(override.codeMessage ? "code-blocked" : "code"); });
		}

		return c;
	}

	var DEFAULT_ORDER = 500;
	function orderFor(repo) {
		var o = OVERRIDES[repo.name] && OVERRIDES[repo.name].order;
		return (typeof o === "number") ? o : DEFAULT_ORDER;
	}

	function render(repos) {
		if (HIDE_FORKS) repos = repos.filter(function (r) { return !r.fork; });
		if (!repos.length) { setStatus("No public repositories found yet.", false); return; }

		repos.sort(function (a, b) {
			var oa = orderFor(a), ob = orderFor(b);
			if (oa !== ob) return oa - ob;
			if (SORT_BY === "stars") return b.stargazers_count - a.stargazers_count;
			return new Date(b.updated_at) - new Date(a.updated_at);
		});

		statusEl.style.display = "none";
		gridEl.innerHTML = "";
		repos.forEach(function (r) { gridEl.appendChild(card(r)); });
		if (window.akInitLikes) window.akInitLikes();
	}

	function load() {
		setStatus('<span class="ak-typing"><span></span><span></span><span></span></span> Loading projects from GitHub\u2026', false);
		var url = "https://api.github.com/users/" + GITHUB_USERNAME + "/repos?per_page=100&sort=" + (SORT_BY === "stars" ? "updated" : SORT_BY);
		fetch(url)
			.then(function (res) {
				if (res.status === 404) throw new Error("User '" + GITHUB_USERNAME + "' not found on GitHub. Check the spelling in assets/js/projects.js.");
				if (res.status === 403) throw new Error("GitHub's hourly request limit was hit (60/hr for anonymous use). Please try again in a little while.");
				if (!res.ok) throw new Error("GitHub returned status " + res.status + ".");
				return res.json();
			})
			.then(function (repos) { return repos.concat(MANUAL_PROJECTS); })
			.then(render)
			.catch(function (err) { setStatus("Couldn't load projects: " + err.message, true); });
	}

	function init() {
		statusEl = document.getElementById("ak-projects-status");
		gridEl = document.getElementById("ak-projects-grid");
		bannerEl = document.getElementById("ak-config-banner");

		if (GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
			if (bannerEl) bannerEl.style.display = "block";
			setStatus("Set your GitHub username in <code>assets/js/projects.js</code> to load your projects here.", true);
			return;
		}
		load();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", function () { init(); if (window.akInitGuestbook) window.akInitGuestbook(); });
	} else { init(); if (window.akInitGuestbook) window.akInitGuestbook(); }
})();
