(function () {
  "use strict";

  var mobileBtn = document.getElementById("mobileBtn");
  var navMenu = document.getElementById("navMenu");
  function setMenu(open) {
    if (!navMenu || !mobileBtn) return;
    navMenu.classList.toggle("open", open);
    mobileBtn.setAttribute("aria-expanded", String(open));
    mobileBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!navMenu.classList.contains("open"));
    });
    document.addEventListener("click", function (e) {
      if (navMenu.classList.contains("open") && !e.target.closest(".navbar")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 960) setMenu(false); }, { passive: true });
  }

  var page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  var revealEls = document.querySelectorAll(
    ".tech-card, .service-split, .sector-row, .process-step, .info-card, .faq-item, .term-card, .cap-card, .why-item, .work-card, .ind-item, .term-win, .tl-step"
  );
  if ("IntersectionObserver" in window && revealEls.length) {
    revealEls.forEach(function (el) { el.classList.add("reveal-init"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -4% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  var searchBox = document.getElementById("serviceFilter");
  var blocks = document.querySelectorAll("[data-service-block]");
  var noResults = document.getElementById("noResults");
  if (searchBox && blocks.length) {
    searchBox.addEventListener("input", function () {
      var q = searchBox.value.trim().toLowerCase();
      var count = 0;
      blocks.forEach(function (b) {
        var ok = !q || b.textContent.toLowerCase().indexOf(q) !== -1;
        b.style.display = ok ? "" : "none";
        if (ok) count += 1;
      });
      if (noResults) noResults.style.display = count === 0 ? "block" : "none";
    });
  }

  var tabs = document.querySelectorAll("[data-sector-tab]");
  var panes = document.querySelectorAll("[data-sector-pane]");
  var activeIndicator = document.getElementById("activeSectorIndex");
  tabs.forEach(function (tab, idx) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-sector-tab");
      tabs.forEach(function (t) { t.classList.remove("active"); });
      panes.forEach(function (p) { p.style.display = "none"; });
      tab.classList.add("active");
      var pane = document.getElementById(target);
      if (pane) pane.style.display = "block";
      if (activeIndicator) {
        activeIndicator.textContent = "active: 0" + (idx + 1) + "/07";
      }
    });
  });

  function setIcon(item, open) {
    var icon = item.querySelector(".faq-icon");
    if (icon) icon.textContent = open ? "\u2212" : "+";
    var q = item.querySelector(".faq-q");
    if (q) q.setAttribute("aria-expanded", String(open));
  }
  document.querySelectorAll(".faq-item").forEach(function (it) {
    setIcon(it, it.classList.contains("open"));
  });
  document.addEventListener("click", function (e) {
    var faqBtn = e.target.closest(".faq-q");
    if (!faqBtn) return;
    var item = faqBtn.closest(".faq-item");
    if (!item) return;
    var willOpen = !item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach(function (o) {
      o.classList.remove("open");
      setIcon(o, false);
    });
    if (willOpen) {
      item.classList.add("open");
      setIcon(item, true);
    }
  });

  // Preselect service from ?service=... (used by "View Full Details" links)
  var svcSelect = document.getElementById("fService");
  if (svcSelect) {
    var wanted = new URLSearchParams(window.location.search).get("service");
    var legacy = { "Computer Repairing": "IT Hardware & Software", "Networking": "Networking & Cabling", "EPBX (Telephone)": "EPBX & Telecom" };
    if (wanted && legacy[wanted]) wanted = legacy[wanted];
    if (wanted) {
      Array.prototype.forEach.call(svcSelect.options, function (o) {
        if (o.value === wanted) svcSelect.value = wanted;
      });
      if (formPanelEarly()) {
        setTimeout(function () {
          var fp = document.getElementById("formPanel");
          fp.classList.add("form-pulse");
          setTimeout(function () { fp.classList.remove("form-pulse"); }, 1400);
        }, 400);
      }
    }
  }
  function formPanelEarly() { return !!document.getElementById("formPanel"); }

  // Sticky navbar shadow on scroll + close mobile menu on link click
  var nav = document.querySelector(".navbar");
  if (navMenu) {
    navMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
  }

  // Count-up animation for stats (about page)
  document.querySelectorAll(".stat-num").forEach(function (el) {
    var m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m || !("IntersectionObserver" in window)) return;
    var target = parseInt(m[1], 10), suffix = m[2];
    var done = false;
    new IntersectionObserver(function (entries, ob) {
      if (done || !entries[0].isIntersecting) return;
      done = true; ob.disconnect();
      var t0 = performance.now(), dur = 1100;
      (function tick(t) {
        var p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, { threshold: 0.4 }).observe(el);
  });

  var form = document.getElementById("ticketForm");
  var formPanel = document.getElementById("formPanel");
  var resultBox = document.getElementById("ticketResult");
  var waBtn = document.getElementById("sendWhatsAppBtn");
  var emailBtn = document.getElementById("sendEmailBtn");

  function getFormData() {
    var NL = "\n";
    var name = ((document.getElementById("fName") || {}).value || "").trim() || "Client";
    var phone = ((document.getElementById("fPhone") || {}).value || "").trim();
    var email = ((document.getElementById("fEmail") || {}).value || "").trim();
    var org = ((document.getElementById("fOrg") || {}).value || "").trim() || "New Kenda, 713342";
    var service = ((document.getElementById("fService") || {}).value || "").trim() || "IT Infrastructure";
    var msg = ((document.getElementById("fMsg") || {}).value || "").trim();
    var ref = "STX-" + Math.floor(100000 + Math.random() * 900000);
    var lines = [
      "Reference: " + ref,
      "Address: Shivtrix Computer Service Center, Old Hotel NeelKamal, Raniganj - Suri Rd, near Shubham Travels, Asansol, New Kenda, West Bengal 713342",
      "Name: " + name
    ];
    if (phone) lines.push("Phone: " + phone);
    if (email) lines.push("Email: " + email);
    lines.push("Location/Org: " + org);
    lines.push("Service/Sector: " + service);
    lines.push("Message: " + (msg || "Service inquiry"));
    return { ref: ref, name: name, org: org, service: service, textBody: lines.join(NL) };
  }

  function notify(data, label) {
    if (formPanel) {
      formPanel.classList.remove("form-pulse");
      void formPanel.offsetWidth;
      formPanel.classList.add("form-pulse");
      setTimeout(function () { formPanel.classList.remove("form-pulse"); }, 900);
    }
    if (resultBox) {
      resultBox.style.display = "block";
      resultBox.innerHTML =
        "<strong>[" + esc(label) + " // " + esc(data.ref) + "]</strong> Prepared for <strong>" +
        esc(data.name) + "</strong> (" + esc(data.service) + ", " + esc(data.org) + ").";
    }
  }

  if (waBtn) {
    waBtn.addEventListener("click", function () {
      if (form && !form.reportValidity()) return;
      var d = getFormData();
      notify(d, "OPENING WHATSAPP");
      window.open("https://wa.me/918424008055?text=" + encodeURIComponent(d.textBody), "_blank", "noopener,noreferrer");
    });
  }

  if (emailBtn) {
    emailBtn.addEventListener("click", function () {
      if (form && !form.reportValidity()) return;
      var d = getFormData();
      notify(d, "OPENING EMAIL APP");
      window.location.href =
        "mailto:helpdesk.shivtrix.co.in@gmail.com?subject=" +
        encodeURIComponent("[" + d.ref + "] " + d.service + " - " + d.name) +
        "&body=" +
        encodeURIComponent(d.textBody);
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = getFormData();
      notify(d, "TICKET CREATED");
    });
  }

  // ===== Extra effects =====
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll progress bar + navbar shadow + back-to-top: one throttled handler
  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  var top = document.createElement("button");
  top.type = "button";
  top.className = "to-top";
  top.setAttribute("aria-label", "Back to top");
  top.innerHTML = "&uarr;";
  document.body.appendChild(top);
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  var ticking = false, docH = 0;
  function measure() { docH = document.documentElement.scrollHeight - window.innerHeight; }
  function paintScroll() {
    ticking = false;
    var y = window.pageYOffset || 0;
    bar.style.transform = "scaleX(" + (docH > 0 ? Math.min(1, y / docH) : 0).toFixed(4) + ")";
    if (nav) nav.classList.toggle("scrolled", y > 8);
    top.classList.toggle("show", y > 400);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(paintScroll); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { measure(); onScroll(); }, { passive: true });
  window.addEventListener("load", function () { measure(); onScroll(); });
  measure(); paintScroll();

  if (!reduce) {
    // Ripple on buttons
    document.addEventListener("click", function (e) {
      var b = e.target.closest(".btn-cyan, .btn-outline, .btn-quote");
      if (!b) return;
      var r = b.getBoundingClientRect();
      var d = Math.max(r.width, r.height);
      var rip = document.createElement("span");
      rip.className = "ripple";
      rip.style.width = rip.style.height = d + "px";
      rip.style.left = (e.clientX - r.left - d / 2) + "px";
      rip.style.top = (e.clientY - r.top - d / 2) + "px";
      b.appendChild(rip);
      setTimeout(function () { rip.remove(); }, 650);
    });
  }

  // ===== Timeline: animate when scrolled into view =====
  var timelines = document.querySelectorAll("[data-timeline]");
  if (timelines.length) {
    if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("tl-in"); tio.unobserve(en.target); }
        });
      }, { threshold: 0.3 });
      timelines.forEach(function (t) { tio.observe(t); });
    } else {
      timelines.forEach(function (t) { t.classList.add("tl-in"); });
    }
  }

  function rnd(lo, hi) { return lo + Math.random() * (hi - lo); }

  // ===== Logo: still image, animated on hover / touch =====
  document.querySelectorAll(".logo").forEach(function (logo) {
    var anim = logo.querySelector(".logo-anim");
    if (!anim) return;
    var src = anim.getAttribute("src"), off = null;
    function play() {
      clearTimeout(off);
      if (!logo.classList.contains("playing")) {
        anim.removeAttribute("src");
        anim.setAttribute("src", src);   // restart animation from first frame (served from cache)
        logo.classList.add("playing");
      }
    }
    function stop() { clearTimeout(off); logo.classList.remove("playing"); }
    logo.addEventListener("mouseenter", play);
    logo.addEventListener("mouseleave", stop);
    logo.addEventListener("focus", play);
    logo.addEventListener("blur", stop);
    logo.addEventListener("touchstart", function () { play(); off = setTimeout(stop, 3200); }, { passive: true });
  });

  // ===== Hero live network background =====
  var cvs = document.querySelector(".hero-net");
  var bigScreen = window.matchMedia("(min-width: 961px) and (hover: hover)").matches;
  if (cvs && !reduce && bigScreen) {
    var ctx = cvs.getContext("2d"), W = 0, H = 0, nodes = [], running = true, mx = -999, my = -999;
    function sizeCvs() {
      var r = cvs.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cvs.width = W * dpr; cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(18, Math.min(42, Math.round(W * H / 26000)));
      nodes = [];
      for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: rnd(-0.25, 0.25), vy: rnd(-0.25, 0.25), r: rnd(1, 2.2) });
    }
    var lastT = 0;
    function frame(t) {
      if (!running) return;
      if (document.hidden || t - lastT < 32) { requestAnimationFrame(frame); return; }
      lastT = t;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < 14400) {
            ctx.strokeStyle = "rgba(34,211,238," + (0.22 * (1 - d / 14400)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        var mdx = a.x - mx, mdy = a.y - my, md = mdx * mdx + mdy * mdy;
        if (md < 19600) {
          ctx.strokeStyle = "rgba(129,140,248," + (0.5 * (1 - md / 19600)).toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke();
        }
        ctx.fillStyle = "rgba(34,211,238,.8)";
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    sizeCvs();
    var rzT; window.addEventListener("resize", function () { clearTimeout(rzT); rzT = setTimeout(sizeCvs, 200); });
    var heroEl = cvs.parentNode;
    heroEl.addEventListener("mousemove", function (e) { var r = cvs.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    heroEl.addEventListener("mouseleave", function () { mx = my = -999; });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !running) { running = true; requestAnimationFrame(frame); }
        running = vis;
      }).observe(cvs);
    }
    requestAnimationFrame(frame);
  }

  // ===== Scroll reveal for headings / blocks =====
  if ("IntersectionObserver" in window) {
    var extra = document.querySelectorAll(
      ".section .container > .eyebrow, .section .container > .section-heading, .section .container > .section-sub, .section-head, .custom-sector-card, .radar, .form-panel, .map-badge, .why-row, .work-card, .stat-card, .tl-step"
    );
    var xio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("reveal-visible"); xio.unobserve(en.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -4% 0px" });
    extra.forEach(function (el) {
      if (el.classList.contains("reveal-visible") || el.classList.contains("reveal-init")) return;
      el.classList.add("reveal-init");
      xio.observe(el);
    });
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
})();
