const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* 1. Fade elements in as they scroll into view */
const revealTargets = document.querySelectorAll(
  ".about__text, .about__photo, .skills, .project, .quote, .contact__title, .contact__text"
);

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          entry.target.classList.add("is-visible");
        } else if (entry.intersectionRatio === 0) {
          entry.target.classList.remove("is-visible"); // fully off screen: reset
        }
      });
    },
    { threshold: [0, 0.15] }
  );

  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}

/* 2. Highlight the nav link of the section you're viewing */
const navLinks = document.querySelectorAll(".nav-list a");
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
          if (isCurrent) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" } // only counts a section when it crosses mid-screen
  );

  sections.forEach((section) => navObserver.observe(section));
}

/* 3. Cursor / finger spotlight on the hero */
const hero = document.querySelector(".hero");
const heroWords = document.querySelectorAll(".hero__word");

if (hero && !prefersReducedMotion) {
  let frame = null;

  const moveLight = (e) => {
    if (frame) return; // one update per screen refresh is plenty

    frame = requestAnimationFrame(() => {
      frame = null;

      const heroRect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${e.clientX - heroRect.left}px`);
      hero.style.setProperty("--my", `${e.clientY - heroRect.top}px`);

      heroWords.forEach((word) => {
        const r = word.getBoundingClientRect();
        word.style.setProperty("--x", `${e.clientX - r.left}px`);
        word.style.setProperty("--y", `${e.clientY - r.top}px`);
      });

      hero.classList.add("is-lit");
    });
  };

  hero.addEventListener("pointermove", moveLight);
  hero.addEventListener("pointerdown", moveLight);
  hero.addEventListener("pointerleave", () => {
    hero.classList.remove("is-lit");
  });
}