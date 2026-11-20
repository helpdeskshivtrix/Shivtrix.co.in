(function () {
  "use strict";
  var GUIDES = window.SHIVTRIX_GUIDES || [];
  var WA = "918424008055";
  var MAIL = "helpdesk.shivtrix.co.in@gmail.com";
  var KEY = "stx_guides_unlocked";

  var $ = function (id) { return document.getElementById(id); };
  var lockPanel = $("lockPanel"), pinForm = $("pinForm"), pinInput = $("pinInput"), pinMsg = $("pinMsg");
  var toolbar = $("guideToolbar"), grid = $("guideList"), empty = $("guideEmpty"), filter = $("guideFilter");
  var reader = $("reader"), rTitle = $("readerTitle"), rMeta = $("readerMeta"), rBody = $("readerBody");
  if (!grid || !lockPanel) return;

  var unlocked = false, pending = null, fails = 0, blockedUntil = 0, lastFocus = null, current = null;

  try { unlocked = sessionStorage.getItem(KEY) === "1"; } catch (e) {}

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // PIN = current Indian time (IST = UTC+5:30), HHMM, accepting -1 / 0 / +1 minute.
  // Also accepts the 12-hour version of the same time (e.g. 0205 for 14:05).
  function validPins() {
    var out = [];
    for (var o = -1; o <= 1; o++) {
      var d = new Date(Date.now() + o * 60000 + 19800000);
      var h = d.getUTCHours(), m = d.getUTCMinutes();
      out.push(pad(h) + pad(m));
      out.push(pad(h % 12 || 12) + pad(m));
    }
    return out;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var LOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  var OPEN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>';

  function fmtDate(s) {
    var d = new Date(s + "T00:00:00");
    if (isNaN(d)) return s || "";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function renderGrid() {
    grid.textContent = "";
    GUIDES.forEach(function (g, i) {
      var card = el("article", "guide-card");
      card.setAttribute("data-search", (g.title + " " + g.category + " " + g.summary).toLowerCase());
      var top = el("div", "guide-top");
      top.appendChild(el("span", "pill-tag", g.category));
      var badge = el("span", "guide-lock");
      badge.innerHTML = unlocked ? OPEN_SVG : LOCK_SVG;
      badge.title = unlocked ? "Unlocked" : "Locked";
      top.appendChild(badge);
      card.appendChild(top);
      card.appendChild(el("h3", null, g.title));
      card.appendChild(el("p", null, g.summary));
      var meta = el("div", "guide-meta");
      meta.appendChild(el("span", null, g.level || "Basic"));
      meta.appendChild(el("span", null, "Updated " + fmtDate(g.updated)));
      card.appendChild(meta);
      var btn = el("button", "btn-cyan guide-get", unlocked ? "Get this Guide \u2192" : "Unlock & Get Guide");
      btn.type = "button";
      btn.setAttribute("data-i", i);
      card.appendChild(btn);
      grid.appendChild(card);
    });
    applyFilter();
  }

  function applyFilter() {
    var q = filter ? filter.value.trim().toLowerCase() : "";
    var n = 0;
    Array.prototype.forEach.call(grid.children, function (c) {
      var ok = !q || c.getAttribute("data-search").indexOf(q) !== -1;
      c.hidden = !ok;
      if (ok) n++;
    });
    if (empty) empty.hidden = n !== 0;
  }

  function setState() {
    lockPanel.hidden = unlocked;
    toolbar.hidden = !unlocked;
    renderGrid();
  }

  function unlock() {
    unlocked = true;
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    pinMsg.textContent = "";
    pinInput.value = "";
    setState();
    if (pending != null) { var i = pending; pending = null; openGuide(i); }
    else { var f = grid.querySelector(".guide-get"); if (f) grid.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }

  function relock() {
    unlocked = false;
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    closeReader();
    setState();
    lockPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showError(msg) {
    pinMsg.textContent = msg;
    lockPanel.classList.remove("shake"); void lockPanel.offsetWidth; lockPanel.classList.add("shake");
  }

  pinForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var now = Date.now();
    if (now < blockedUntil) {
      showError("Too many attempts. Try again in " + Math.ceil((blockedUntil - now) / 1000) + " seconds.");
      return;
    }
    var v = pinInput.value.replace(/\D/g, "");
    if (v.length === 3) v = "0" + v;
    if (v.length !== 4) { showError("Enter the 4-digit PIN."); return; }
    if (validPins().indexOf(v) !== -1) { fails = 0; unlock(); return; }
    fails++;
    if (fails >= 5) { blockedUntil = now + 30000; fails = 0; showError("Too many wrong attempts. Please wait 30 seconds."); }
    else showError("Wrong PIN. The PIN changes every minute, so check the time and try again.");
    pinInput.select();
  });
  pinInput.addEventListener("input", function () { pinInput.value = pinInput.value.replace(/\D/g, "").slice(0, 4); });

  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".guide-get");
    if (!b) return;
    var i = parseInt(b.getAttribute("data-i"), 10);
    if (unlocked) { lastFocus = b; openGuide(i); return; }
    pending = i;
    lockPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(function () { pinInput.focus({ preventScroll: true }); }, 350);
    showError("This guide is locked. Enter the PIN to get it.");
  });

  if (filter) filter.addEventListener("input", applyFilter);
  var relockBtn = $("relockBtn");
  if (relockBtn) relockBtn.addEventListener("click", relock);

  // ---------- reader ----------
  function guideText(g) {
    var out = [g.title, g.category + " | " + (g.level || "Basic") + " | Updated " + fmtDate(g.updated), ""];
    (g.sections || []).forEach(function (s) {
      if (s.h) out.push(s.h);
      if (s.p) out.push(s.p);
      (s.list || []).forEach(function (t, i) { out.push((i + 1) + ". " + t); });
      out.push("");
    });
    if (g.tip) out.push("Tip: " + g.tip, "");
    out.push("Shivtrix Computer Service Center, New Kenda, Asansol | +91 84240 08055");
    return out.join("\n");
  }

  function openGuide(i) {
    var g = GUIDES[i];
    if (!g) return;
    current = g;
    rTitle.textContent = g.title;
    rMeta.textContent = g.category + "  \u00b7  " + (g.level || "Basic") + "  \u00b7  Updated " + fmtDate(g.updated);
    rBody.textContent = "";
    (g.sections || []).forEach(function (s) {
      var sec = el("section", "reader-sec");
      if (s.h) sec.appendChild(el("h3", null, s.h));
      if (s.p) sec.appendChild(el("p", null, s.p));
      if (s.list && s.list.length) {
        var ol = el("ol");
        s.list.forEach(function (t) { ol.appendChild(el("li", null, t)); });
        sec.appendChild(ol);
      }
      rBody.appendChild(sec);
    });
    if (g.tip) { var tip = el("div", "reader-tip"); tip.appendChild(el("strong", null, "Tip: ")); tip.appendChild(document.createTextNode(g.tip)); rBody.appendChild(tip); }
    var foot = el("p", "reader-foot", "Shivtrix Computer Service Center \u00b7 New Kenda, Asansol \u00b7 +91 84240 08055");
    rBody.appendChild(foot);
    reader.hidden = false;
    document.body.classList.add("reader-open");
    reader.scrollTop = 0;
    $("readerClose").focus();
  }

  function closeReader() {
    if (reader.hidden) return;
    reader.hidden = true;
    document.body.classList.remove("reader-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $("readerClose").addEventListener("click", closeReader);
  reader.addEventListener("click", function (e) { if (e.target === reader) closeReader(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeReader(); });
  $("readerPrint").addEventListener("click", function () { window.print(); });
  $("readerCopy").addEventListener("click", function () {
    if (!current) return;
    var btn = $("readerCopy"), t = guideText(current);
    function done(ok) { btn.textContent = ok ? "Copied \u2713" : "Copy failed"; setTimeout(function () { btn.textContent = "Copy Text"; }, 1600); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });
  $("readerWa").addEventListener("click", function () {
    if (!current) return;
    window.open("https://wa.me/?text=" + encodeURIComponent(guideText(current)), "_blank", "noopener,noreferrer");
  });

  // ---------- custom guide request ----------
  function customBody() {
    var topic = ($("cgTopic").value || "").trim();
    var name = ($("cgName").value || "").trim();
    return "Hello Shivtrix, I would like to request a custom guide.\nTopic: " + (topic || "(please contact me)") + (name ? "\nName: " + name : "");
  }
  function needTopic() {
    var t = ($("cgTopic").value || "").trim();
    $("cgMsg").textContent = t ? "" : "Please type the guide topic first.";
    if (!t) $("cgTopic").focus();
    return !!t;
  }
  $("cgWa").addEventListener("click", function () {
    if (!needTopic()) return;
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(customBody()), "_blank", "noopener,noreferrer");
  });
  $("cgMail").addEventListener("click", function () {
    if (!needTopic()) return;
    window.location.href = "mailto:" + MAIL + "?subject=" + encodeURIComponent("Custom Guide Request") + "&body=" + encodeURIComponent(customBody());
  });

  setState();
})();
