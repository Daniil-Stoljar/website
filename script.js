(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const typingEl = $("#typing");
  const phrases = [
    "Front-End Developer",
    "Tallinn University Student",
    "Lifelong Learner",
  ];
  let p = 0,
    i = 0,
    forward = true;

  function typeTick() {
    const word = phrases[p];
    typingEl.textContent = word.slice(0, i);
    if (forward) {
      i++;
      if (i > word.length) {
        forward = false;
        setTimeout(typeTick, 1100);
        return;
      }
    } else {
      i--;
      if (i < 0) {
        forward = true;
        p = (p + 1) % phrases.length;
        i = 0;
      }
    }
    setTimeout(typeTick, forward ? 90 : 40);
  }
  typeTick();

  const revealIO = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("appear");
          obs.unobserve(e.target);
        }
      }
    },
    { threshold: 0.2 }
  );
  $$(".fade-in").forEach((el) => revealIO.observe(el));

  const skillIO = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        const pct = Math.max(0, Math.min(100, Number(el.dataset.skill) || 0));
        el.style.setProperty("--width", pct + "%");
        obs.unobserve(el);
      }
    },
    { threshold: 0.45 }
  );
  $$(".skill-bar").forEach((el) => skillIO.observe(el));

  const maxTilt = 10;
  $$(".tilt").forEach((card) => {
    let rect;
    const reset = () => (card.style.transform = "");
    card.addEventListener(
      "mouseenter",
      () => (rect = card.getBoundingClientRect())
    );
    card.addEventListener("mousemove", (e) => {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${-y * maxTilt}deg) rotateY(${
        x * maxTilt
      }deg) translateZ(0)`;
    });
    card.addEventListener("mouseleave", reset);
  });

  const btn = $("#theme-toggle");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const saved = localStorage.getItem("theme");
  const initialDark = saved ? saved === "dark" : prefersDark;

  function setTheme(dark) {
    document.body.classList.toggle("dark-mode", dark);
    if (btn) {
      btn.setAttribute("aria-pressed", String(dark));
    }
    const icon = $(".theme-icon");
    if (icon) {
      icon.textContent = dark ? "☀️" : "🌙";
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  setTheme(initialDark);

  if (btn) {
    btn.addEventListener("click", () => {
      const next = !document.body.classList.contains("dark-mode");
      setTheme(next);
    });
  }

  $("#year").textContent = new Date().getFullYear().toString();

  const dot = $(".cursor-dot");
  const outline = $(".cursor-outline");
  let x = 0,
    y = 0,
    tx = 0,
    ty = 0;
  const hasFinePointer = matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (hasFinePointer && dot && outline) {
    document.body.classList.add("cursor-show");
    const follow = () => {
      tx += (x - tx) * 0.2;
      ty += (y - ty) * 0.2;
      dot.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      outline.style.transform = `translate(${tx - 13}px, ${ty - 13}px)`;
      requestAnimationFrame(follow);
    };
    follow();
    window.addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
    });
  }

  document.addEventListener("click", (e) => {
    const target = e.target.closest(".ripple");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const circle = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    circle.style.position = "absolute";
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.borderRadius = "50%";
    circle.style.background = "rgba(255,255,255,.35)";
    circle.style.transform = "scale(0)";
    circle.style.opacity = "0.6";
    circle.style.pointerEvents = "none";
    circle.style.transition = "transform .5s ease, opacity .6s ease";
    target.appendChild(circle);
    requestAnimationFrame(() => (circle.style.transform = "scale(1.2)"));
    setTimeout(() => {
      circle.style.opacity = "0";
    }, 350);
    setTimeout(() => circle.remove(), 650);
  });
})();
