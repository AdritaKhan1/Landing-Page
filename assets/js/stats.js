/* =========================================================
   Stats page — public visitor & project-click counts
   ---------------------------------------------------------
   Reads real numbers from GoatCounter's public counter endpoint
   (no login needed). Requires, in your GoatCounter site settings:
     Settings -> "Allow adding visitor counts on your website" = ON
   and the matching code set in assets/js/config.js (goatcounterCode).
   ========================================================= */
(function () {
	"use strict";

	var CFG = window.AK_CONFIG || {};
	var CODE = CFG.goatcounterCode || "YOUR_CODE";
	var USER = CFG.githubUsername || "YOUR_GITHUB_USERNAME";
	var PROVIDER = CFG.analyticsProvider || "goatcounter";

	var notice = document.getElementById("ak-stats-notice");
	var totalEl = document.getElementById("ak-total-visits");
	var pagesEl = document.getElementById("ak-page-list");
	var projEl = document.getElementById("ak-project-list");

	var PAGES = [
		["/", "Home"],
		["/about.html", "About"],
		["/projects.html", "Projects"],
		["/contact.html", "Contact"],
		["/stats.html", "Stats"]
	];

	function showNotice(msg) {
		notice.style.display = "block";
		notice.innerHTML = msg;
	}

	if (PROVIDER !== "goatcounter" || CODE === "YOUR_CODE") {
		showNotice("To show live numbers here, set <code>analyticsProvider: \"goatcounter\"</code> and your <code>goatcounterCode</code> in <code>assets/js/config.js</code>, then enable <em>\u201cAllow adding visitor counts on your website\u201d</em> in your GoatCounter settings.");
		return;
	}

	var BASE = "https://" + CODE + ".goatcounter.com/counter/";

	function fetchCount(path) {
		return fetch(BASE + encodeURIComponent(path) + ".json")
			.then(function (r) { return r.ok ? r.json() : { count: "0" }; })
			.then(function (d) { return parseInt(String(d.count || "0").replace(/[^0-9]/g, ""), 10) || 0; })
			.catch(function () { return 0; });
	}

	function bar(label, value, max, href) {
		var pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
		var name = href
			? '<a href="' + href + '" target="_blank" rel="noopener">' + label + "</a>"
			: label;
		return '<div class="ak-stat-row">' +
				'<div class="ak-stat-label">' + name + "</div>" +
				'<div class="ak-stat-track"><div class="ak-stat-fill" style="width:' + pct + '%"></div></div>' +
				'<div class="ak-stat-num">' + value.toLocaleString() + "</div>" +
			"</div>";
	}

	/* ---- Page visits ---- */
	Promise.all(PAGES.map(function (p) { return fetchCount(p[0]); }))
		.then(function (counts) {
			var total = counts.reduce(function (a, b) { return a + b; }, 0);
			totalEl.textContent = total.toLocaleString();
			var max = Math.max.apply(null, counts.concat([1]));
			var rows = PAGES.map(function (p, i) {
				var href = p[0] === "/" ? "index.html" : p[0].replace(/^\//, "");
				return bar(p[1], counts[i], max, href);
			}).join("");
			pagesEl.innerHTML = rows || '<p class="ak-muted">No visits recorded yet.</p>';
		});

	/* ---- Project clicks ---- */
	if (!USER || USER === "YOUR_GITHUB_USERNAME") {
		projEl.innerHTML = '<p class="ak-muted">Set your GitHub username in config.js to list project clicks.</p>';
		return;
	}

	fetch("https://api.github.com/users/" + USER + "/repos?per_page=100&sort=updated")
		.then(function (r) {
			if (!r.ok) throw new Error("GitHub status " + r.status);
			return r.json();
		})
		.then(function (repos) {
			repos = repos.filter(function (r) { return !r.fork; });
			if (!repos.length) { projEl.innerHTML = '<p class="ak-muted">No repositories found.</p>'; return; }
			return Promise.all(repos.map(function (repo) {
				return fetchCount("/p/" + repo.name).then(function (n) {
					return { name: repo.name, url: repo.html_url, clicks: n };
				});
			})).then(function (rows) {
				rows.sort(function (a, b) { return b.clicks - a.clicks; });
				var max = Math.max.apply(null, rows.map(function (r) { return r.clicks; }).concat([1]));
				projEl.innerHTML = rows.map(function (r) {
					return bar(r.name, r.clicks, max, r.url);
				}).join("");
			});
		})
		.catch(function (err) {
			projEl.innerHTML = '<p class="ak-muted">Couldn\u2019t load project clicks: ' + err.message + "</p>";
		});
})();
