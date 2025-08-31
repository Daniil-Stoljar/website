const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = $(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const phrases = [
  "Front-End Developer",
  "Tallinn University Student",
  "Lifelong Learner",
];
const typingEl = $("#typing");
let pi = 0,
  ci = 0,
  typingForward = true;

function tick() {
  const current = phrases[pi];
  typingEl.textContent = current.slice(0, ci);

  if (typingForward) {
    ci++;
    if (ci > current.length) {
      typingForward = false;
      setTimeout(tick, 1200);
      return;
    }
  } else {
    ci--;
    if (ci < 0) {
      typingForward = true;
      pi = (pi + 1) % phrases.length;
      ci = 0;
    }
  }
  setTimeout(tick, typingForward ? 90 : 40);
}
tick();

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

$$(".fade-in").forEach((el) => io.observe(el));

const sbIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const pct = Math.max(0, Math.min(100, Number(el.dataset.skill) || 0));
        el.style.setProperty("--width", pct + "%");
        sbIO.unobserve(el);
      }
    });
  },
  { threshold: 0.4 }
);

$$(".skill-bar").forEach((el) => sbIO.observe(el));

const themeBtn = $("#theme-toggle");
const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
const saved = localStorage.getItem("theme");
const initialDark = saved ? saved === "dark" : prefersDark;

function setTheme(dark) {
  document.body.classList.toggle("dark-mode", dark);
  themeBtn.setAttribute("aria-pressed", String(dark));
  $(".theme-icon", themeBtn).textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("theme", dark ? "dark" : "light");
}

setTheme(initialDark);

themeBtn.addEventListener("click", () => {
  const next = !document.body.classList.contains("dark-mode");
  setTheme(next);
});

$("#year").textContent = new Date().getFullYear();
