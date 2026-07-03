(function () {
	"use strict";

	var ADMIN_HASH = "95c1e69a0a4a481acc36f6ef2d88629a220b815023797ac8ca45c2ac612879cb";
	var db = firebase.database();

	function escHtml(s) {
		return String(s)
			.replace(/&/g, "&amp;").replace(/</g, "&lt;")
			.replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	}

	function sha256(str) {
		var buf = new TextEncoder().encode(str);
		return crypto.subtle.digest("SHA-256", buf).then(function (hash) {
			return Array.from(new Uint8Array(hash))
				.map(function (b) { return b.toString(16).padStart(2, "0"); })
				.join("");
		});
	}

	function timeAgo(ts) {
		var diff = Math.floor((Date.now() - ts) / 1000);
		if (diff < 60)  return "just now";
		if (diff < 3600) return Math.floor(diff / 60) + "m ago";
		if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
		return Math.floor(diff / 86400) + "d ago";
	}

	function renderComments(comments, listEl, replyFn, showEmails) {
		if (!comments.length) {
			listEl.innerHTML = '<p class="ak-gb-empty">No comments yet — be the first to leave one!</p>';
			return;
		}
		listEl.innerHTML = comments.map(function (c) {
			var emailTag    = showEmails
				? '<span class="ak-gb-email">' + escHtml(c.email || "—") + '</span>'
				: "";
			var linkedinTag = c.linkedin
				? '<a class="ak-gb-linkedin-link" href="' + escHtml(c.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>'
				: "";

			var replies = c.replies
				? Object.values(c.replies).map(function (r) {
					return '<div class="ak-gb-reply">' +
						'<span class="ak-gb-owner-badge">Adrita</span>' +
						'<span class="ak-gb-time">' + timeAgo(r.ts) + '</span>' +
						'<p>' + escHtml(r.text) + '</p>' +
					'</div>';
				}).join("")
				: "";

			return '<div class="ak-gb-comment" data-id="' + c._id + '">' +
				'<div class="ak-gb-comment-head">' +
					'<span class="ak-gb-author">' + escHtml(c.name || "Anonymous") + '</span>' +
					linkedinTag +
					emailTag +
					'<span class="ak-gb-time">' + timeAgo(c.ts) + '</span>' +
					'<button class="ak-gb-reply-btn" data-id="' + c._id + '">Reply</button>' +
				'</div>' +
				'<p class="ak-gb-comment-text">' + escHtml(c.text) + '</p>' +
				replies +
				'<div class="ak-gb-reply-form" id="ak-rf-' + c._id + '" style="display:none;">' +
					'<textarea class="ak-gb-reply-input" placeholder="Your reply…" rows="2" maxlength="500"></textarea>' +
					'<button class="ak-gb-reply-submit">Post reply</button>' +
				'</div>' +
			'</div>';
		}).join("");

		listEl.querySelectorAll(".ak-gb-reply-btn").forEach(function (btn) {
			btn.addEventListener("click", function () { replyFn(btn.getAttribute("data-id")); });
		});

		listEl.querySelectorAll(".ak-gb-reply-submit").forEach(function (btn) {
			btn.addEventListener("click", function () {
				var form = btn.closest(".ak-gb-reply-form");
				var text = form.querySelector(".ak-gb-reply-input").value.trim();
				if (!text) return;
				var id = form.id.replace("ak-rf-", "");
				db.ref("guestbook/" + id + "/replies").push({ text: text, ts: Date.now() });
				form.style.display = "none";
				form.querySelector(".ak-gb-reply-input").value = "";
			});
		});
	}

	window.akInitGuestbook = function () {
		var section = document.getElementById("ak-guestbook");
		if (!section) return;

		var listEl    = section.querySelector(".ak-gb-list");
		var nameEl    = section.querySelector(".ak-gb-name");
		var emailEl   = section.querySelector(".ak-gb-email-input");
		var linkedinEl = section.querySelector(".ak-gb-linkedin");
		var textEl    = section.querySelector(".ak-gb-text");
		var submitEl  = section.querySelector(".ak-gb-submit");
		var adminVerified = false;
		var cachedComments = [];

		db.ref("guestbook").on("value", function (snap) {
			cachedComments = [];
			snap.forEach(function (child) {
				var v = child.val();
				v._id = child.key;
				cachedComments.push(v);
			});
			renderComments(cachedComments, listEl, handleReply, adminVerified);
		});

		function handleReply(id) {
			if (!adminVerified) {
				var pin = window.prompt("Enter your admin PIN to reply:");
				if (!pin) return;
				sha256(pin).then(function (hash) {
					if (hash !== ADMIN_HASH) { alert("Incorrect PIN."); return; }
					adminVerified = true;
					renderComments(cachedComments, listEl, handleReply, true);
					openReplyForm(id);
				});
			} else {
				openReplyForm(id);
			}
		}

		function openReplyForm(id) {
			document.querySelectorAll(".ak-gb-reply-form").forEach(function (f) {
				f.style.display = "none";
			});
			var form = document.getElementById("ak-rf-" + id);
			if (form) {
				form.style.display = "flex";
				form.querySelector(".ak-gb-reply-input").focus();
			}
		}

		submitEl.addEventListener("click", function () {
			var text  = textEl.value.trim();
			var email = emailEl.value.trim();
			if (!text)  return;
			if (!email) { emailEl.focus(); emailEl.setCustomValidity("Email is required."); emailEl.reportValidity(); return; }
			emailEl.setCustomValidity("");
			var name     = nameEl.value.trim() || "Anonymous";
			var linkedin = linkedinEl.value.trim() || null;
			var entry    = { name: name, email: email, text: text, ts: Date.now() };
			if (linkedin) entry.linkedin = linkedin;
			db.ref("guestbook").push(entry);
			textEl.value      = "";
			nameEl.value      = "";
			emailEl.value     = "";
			linkedinEl.value  = "";
		});

		textEl.addEventListener("keydown", function (e) {
			if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submitEl.click();
		});
	};
})();
