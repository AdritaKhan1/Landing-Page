(function () {
	"use strict";

	var firebaseConfig = {
		apiKey: "AIzaSyAOr6Cz1EJDTiwYHNJbUUYuthiC26fnC9s",
		authDomain: "landing-page-757e2.firebaseapp.com",
		databaseURL: "https://landing-page-757e2-default-rtdb.firebaseio.com",
		projectId: "landing-page-757e2",
		storageBucket: "landing-page-757e2.firebasestorage.app",
		messagingSenderId: "542413531318",
		appId: "1:542413531318:web:c0090a1b02bb69cbfade17"
	};

	firebase.initializeApp(firebaseConfig);
	var db = firebase.database();

	function getLiked() {
		try { return JSON.parse(localStorage.getItem("ak_liked") || "[]"); }
		catch (e) { return []; }
	}

	function markLiked(repo) {
		var liked = getLiked();
		if (liked.indexOf(repo) === -1) {
			liked.push(repo);
			localStorage.setItem("ak_liked", JSON.stringify(liked));
		}
	}

	function hasLiked(repo) {
		return getLiked().indexOf(repo) !== -1;
	}

	window.akInitLikes = function () {
		document.querySelectorAll(".ak-like-btn").forEach(function (btn) {
			var repo = btn.getAttribute("data-repo");
			var countEl = btn.querySelector(".ak-like-count");

			db.ref("likes/" + repo).on("value", function (snap) {
				countEl.textContent = snap.val() || 0;
			});

			if (hasLiked(repo)) btn.classList.add("liked");

			btn.addEventListener("click", function () {
				if (hasLiked(repo)) return;
				db.ref("likes/" + repo).transaction(function (n) { return (n || 0) + 1; });
				markLiked(repo);
				btn.classList.add("liked");
			});
		});
	};
})();
