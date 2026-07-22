// Shared behaviour across all pages: mobile nav, footer year, active link, stat counters.

document.addEventListener("DOMContentLoaded", () => {
  // Render polished SVG icons into any static [data-icon] placeholders
  if (typeof ICONS !== "undefined") {
    document.querySelectorAll("[data-icon]").forEach((el) => {
      const name = el.getAttribute("data-icon");
      if (ICONS[name]) el.innerHTML = ICONS[name];
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Highlight current nav link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.style.display === "flex";
      links.style.display = open ? "none" : "flex";
      links.style.flexDirection = "column";
      links.style.position = "absolute";
      links.style.top = "64px";
      links.style.left = "0";
      links.style.right = "0";
      links.style.background = "#fff";
      links.style.padding = "16px 24px";
      links.style.borderBottom = "1px solid #e2e8ea";
      links.style.gap = "14px";
    });
  }

  // Animated stat counters
  const counters = document.querySelectorAll("[data-count-to]");
  if (counters.length) {
    const animate = (el) => {
      const target = parseFloat(el.getAttribute("data-count-to")) || 0;
      const isDecimal = !Number.isInteger(target);
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = eased * target;
        el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value).toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => observer.observe(c));
  }
});

// Small helper used by page scripts to fetch local JSON data files.
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Failed to load " + path);
  return res.json();
}
