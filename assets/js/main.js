/* ARKITEK TAN & TAN — interactions
   Header, mobile nav, momentum scroll, parallax, cursor warmth,
   curtain image reveals, project filter, working forms. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Header: transparent over a dark hero, solid once scrolled --- */
  var header = document.querySelector(".site-header");
  var hero = document.querySelector(".hero");
  var heroLayer = document.querySelector(".hero__slides");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (header) header.classList.toggle("is-stuck", y > (hero ? 60 : 8));
    if (heroLayer && !reduce) heroLayer.style.transform = "translate3d(0," + (y * 0.28) + "px,0)";
  }
  if (header && !hero) header.classList.add("is-stuck");
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Scrolling is intentionally native — 1:1 with the wheel, no easing lag.
     (Momentum/smooth-scroll was trialled and removed: it always lags on the
     first turn of the wheel, then accelerates, which made content easy to skip.) */

  /* --- Mobile nav --- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* --- Cursor-reactive warmth on dark areas (injected, no markup needed) --- */
  if (!reduce) {
    document.querySelectorAll(".hero, .site-footer, .values").forEach(function (zone) {
      var g = document.createElement("span");
      g.className = "glow";
      zone.insertBefore(g, zone.firstChild);
      zone.addEventListener("pointermove", function (e) {
        var r = zone.getBoundingClientRect();
        g.style.left = (e.clientX - r.left) + "px";
        g.style.top = (e.clientY - r.top) + "px";
        g.style.opacity = 1;
      });
      zone.addEventListener("pointerleave", function () { g.style.opacity = 0; });
    });
  }

  /* --- Curtain image reveals + text reveals --- */
  var media = document.querySelectorAll(".project__media, .feature-strip");
  media.forEach(function (el) { el.classList.add("rv"); });
  // stagger within each grid
  document.querySelectorAll(".projects").forEach(function (grid) {
    Array.prototype.forEach.call(grid.children, function (child, i) {
      var m = child.querySelector(".project__media");
      if (m) m.style.setProperty("--i", i % 4);
    });
  });
  document.querySelectorAll("[data-reveal-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) { child.style.setProperty("--i", i); });
  });

  var revealEls = document.querySelectorAll(".rv, .reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* --- Project filter --- */
  var filters = document.querySelectorAll(".filter");
  var projects = document.querySelectorAll(".project");
  if (filters.length && projects.length) {
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");
        filters.forEach(function (f) {
          var active = f === btn;
          f.classList.toggle("is-active", active);
          f.setAttribute("aria-pressed", String(active));
        });
        projects.forEach(function (p) {
          var show = cat === "all" || p.getAttribute("data-cat") === cat;
          p.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* --- Forms: send via Web3Forms without leaving the page --- */
  document.querySelectorAll("[data-form]").forEach(function (form) {
    var note = form.querySelector("[data-form-status]");
    var btn = form.querySelector("button[type=submit]");
    var btnText = btn ? btn.innerHTML : "";

    function say(msg, kind) {
      if (!note) return;
      note.textContent = msg;
      note.style.color = kind === "error" ? "var(--error)" : (kind === "ok" ? "var(--success)" : "var(--muted)");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // required-field check (we use novalidate for styling control)
      var missing = [];
      form.querySelectorAll("[required]").forEach(function (f) {
        if (!f.value.trim()) missing.push(f);
      });
      var email = form.querySelector("input[type=email]");
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) missing.push(email);
      if (missing.length) {
        missing[0].focus();
        say("Please fill in the highlighted fields with a valid email, then send again.", "error");
        return;
      }

      if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
      say("Sending…");

      var data = Object.fromEntries(new FormData(form).entries());
      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            form.reset();
            say("Thank you — your message has reached us. We'll be in touch shortly.", "ok");
          } else {
            say("Something went wrong sending that. Please email us directly at ttarkitek@gmail.com.", "error");
          }
        })
        .catch(function () {
          say("Couldn't send — please check your connection, or email ttarkitek@gmail.com.", "error");
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = btnText; }
        });
    });
  });

  /* --- Footer year --- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
