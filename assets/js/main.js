/* ARKITEK TAN & TAN — interactions
   Header over hero, hero carousel, mobile nav, scroll reveals, project filter. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Header: transparent over a dark hero, solid once scrolled --- */
  var header = document.querySelector(".site-header");
  var hero = document.querySelector(".hero");
  if (header) {
    if (!hero) {
      header.classList.add("is-stuck");
    } else {
      var onScroll = function () {
        header.classList.toggle("is-stuck", window.scrollY > 60);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

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
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* --- Hero carousel --- */
  var slides = document.querySelectorAll(".hero__slide");
  var dots = document.querySelectorAll(".hero__dot");
  if (slides.length > 1 && dots.length) {
    var current = 0;
    var timer = null;
    var DELAY = 6000;

    var go = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("is-active", n === current); });
      dots.forEach(function (d, n) {
        var on = n === current;
        d.classList.toggle("is-active", on);
        d.setAttribute("aria-selected", String(on));
      });
    };
    var start = function () {
      if (reduce) return;
      stop();
      timer = setInterval(function () { go(current + 1); }, DELAY);
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { go(i); start(); });
    });

    // pause while the user is looking / interacting
    if (hero) {
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      hero.addEventListener("focusin", stop);
      hero.addEventListener("focusout", start);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    go(0);
    start();
  }

  /* --- Scroll reveal --- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }
  document.querySelectorAll("[data-reveal-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--i", i);
    });
  });

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

  /* --- Contact form (front-end only for now) --- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector("[data-form-status]");
      if (note) {
        note.textContent = "This form isn't connected to email yet. For now, please reach us at ttarkitek@gmail.com.";
        note.style.color = "var(--ink)";
      }
    });
  }

  /* --- Footer year --- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
