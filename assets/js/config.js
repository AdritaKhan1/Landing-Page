/* =========================================================
   ONE place to configure Adrita's site.
   Edit the values below — every page reads from here.
   ========================================================= */
window.AK_CONFIG = {
	/* Your GitHub username (for the Projects + Stats pages). */
	githubUsername: "AdritaKhan1",

	/* Analytics provider: "goatcounter" | "ga4" | "none" */
	analyticsProvider: "goatcounter",

	/* GoatCounter "code" -> dashboard at https://<code>.goatcounter.com
	   Needed for both tracking AND the public Stats page. */
	goatcounterCode: "YOUR_CODE",

	/* Only used if analyticsProvider is "ga4" */
	ga4Id: "G-XXXXXXXXXX",

	/* Count visits while testing on localhost (set false to ignore your own). */
	countLocalhost: true,

	/* AI chat endpoint. Set this to the full URL of chat.php on your server
	   e.g. "https://yourdomain.com/chat.php"
	   Leave empty ("") to use the built-in keyword-based assistant instead. */
	chatEndpoint: ""
};
