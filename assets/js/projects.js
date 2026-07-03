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

	/* Override links or descriptions for specific repos */
	var OVERRIDES = {
		"Landing-Page": {
			url: "https://github.com/AdritaKhan1/Landing-Page",
			demoMessage: "You’re already on it!"
		}
	};

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

	function liveUrlFor(repo) {
		if (repo.homepage && /^https?:\/\//i.test(repo.homepage)) return repo.homepage;
		return null; // only embed when we know a real deployed URL exists
	}

	function pagesGuess(repo) {
		return "https://" + GITHUB_USERNAME + ".github.io/" + repo.name + "/";
	}

	function card(repo) {
		var live = liveUrlFor(repo);
		var c = document.createElement("div");
		c.className = "ak-card";

		/* preview */
		var preview = '<div class="ak-card-preview">';
		if (live) {
			preview += '<iframe src="' + live + '" loading="lazy" title="Preview of ' + repo.name + '"></iframe>';
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
		var override = OVERRIDES[repo.name] || {};
		var codeUrl  = override.url || repo.html_url;

		var demoBtn;
		if (live) {
			demoBtn = '<a class="primary" href="' + live + '" target="_blank" rel="noopener">Live Demo</a>';
		} else if (override.demoMessage) {
			demoBtn = '<button class="primary ak-demo-msg" onclick="this.textContent=\'' + override.demoMessage + '\';setTimeout(function(el){return function(){el.textContent=\'Try it\'}}(this),2000)"  >Try it</button>';
		} else {
			demoBtn = '';
		}

		var actions =
			'<div class="ak-actions">' +
				demoBtn +
				'<a href="' + codeUrl + '" target="_blank" rel="noopener">Code</a>' +
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
		var codeEl = c.querySelector('.ak-actions a[href="' + repo.html_url + '"]');
		if (codeEl) codeEl.addEventListener("click", function () { trackClick("code"); });

		return c;
	}

	function render(repos) {
		if (HIDE_FORKS) repos = repos.filter(function (r) { return !r.fork; });
		if (!repos.length) { setStatus("No public repositories found yet.", false); return; }

		if (SORT_BY === "stars") {
			repos.sort(function (a, b) { return b.stargazers_count - a.stargazers_count; });
		} else {
			repos.sort(function (a, b) { return new Date(b.updated_at) - new Date(a.updated_at); });
		}

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
