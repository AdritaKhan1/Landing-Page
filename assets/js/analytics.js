/* =========================================================
   Analytics for Adrita's site
   ---------------------------------------------------------
   • Counts page visits automatically (every page).
   • Counts project clicks as paths under /p/<repo>.
   • Reads all settings from assets/js/config.js (AK_CONFIG).

   GoatCounter setup:
     1. Sign up at https://www.goatcounter.com, pick a "code".
     2. Put it in config.js -> goatcounterCode.
   ========================================================= */
(function () {
	"use strict";

	var CFG = window.AK_CONFIG || {};
	var PROVIDER = CFG.analyticsProvider || "goatcounter";
	var GC_CODE = CFG.goatcounterCode || "YOUR_CODE";
	var GA4_ID = CFG.ga4Id || "G-XXXXXXXXXX";
	var COUNT_LOCALHOST = CFG.countLocalhost !== false;

	/* Normalize the page path so counts are the same no matter what
	   folder/host the site lives in: "/", "/about.html", etc. */
	function normPath() {
		var seg = location.pathname.split("/").pop();
		if (!seg || seg === "index.html") return "/";
		return "/" + seg;
	}

	function loadGoatCounter() {
		if (GC_CODE === "YOUR_CODE") {
			console.info("[analytics] Set goatcounterCode in assets/js/config.js to start counting.");
			return;
		}
		window.goatcounter = { allow_local: COUNT_LOCALHOST, path: normPath };
		var s = document.createElement("script");
		s.async = true;
		s.src = "//gc.zgo.at/count.js";
		s.setAttribute("data-goatcounter", "https://" + GC_CODE + ".goatcounter.com/count");
		document.head.appendChild(s);
	}

	function loadGA4() {
		if (GA4_ID === "G-XXXXXXXXXX") {
			console.info("[analytics] Set ga4Id in assets/js/config.js to start counting.");
			return;
		}
		var s = document.createElement("script");
		s.async = true;
		s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
		document.head.appendChild(s);
		window.dataLayer = window.dataLayer || [];
		window.gtag = function () { window.dataLayer.push(arguments); };
		window.gtag("js", new Date());
		window.gtag("config", GA4_ID);
	}

	/* Record a hit to a specific path (used for project clicks).
	   On GoatCounter this is a normal pageview of a synthetic path
	   so the public counter endpoint can read it back. */
	window.akCount = function (path, title) {
		try {
			if (PROVIDER === "goatcounter" && window.goatcounter && window.goatcounter.count) {
				window.goatcounter.count({ path: path, title: title || path });
			} else if (PROVIDER === "ga4" && window.gtag) {
				window.gtag("event", "click", { event_label: title || path });
			}
		} catch (e) { /* never let analytics break the page */ }
	};
	/* Back-compat alias */
	window.akTrack = function (label) { window.akCount("/e/" + label, label); };

	if (PROVIDER === "goatcounter") loadGoatCounter();
	else if (PROVIDER === "ga4") loadGA4();
})();
