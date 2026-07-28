function setMenuState(isOpen) {
  const menu = document.querySelector(".menu-links");
  const toggle = document.querySelector(".hamburger-icon");
  if (!menu || !toggle) return;

  menu.classList.toggle("open", isOpen);
  toggle.classList.toggle("open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

function downloadAndViewCV() {
  const fileUrl = "./assets/certify/Chakravarthi_python_exp.pdf";
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = "Chakravarthi_Resume.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".hamburger-icon");
  const menuLinks = document.querySelectorAll(".menu-links a");

  menuToggle?.addEventListener("click", () => {
    setMenuState(!menuToggle.classList.contains("open"));
  });

  menuLinks.forEach((link) => link.addEventListener("click", () => setMenuState(false)));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.classList.contains("open")) {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  document.getElementById("resume-download")?.addEventListener("click", downloadAndViewCV);

  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", () => {
    const submitBtn = document.getElementById("submitBtn");
    const formStatus = document.getElementById("formStatus");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }
    if (formStatus) {
      formStatus.hidden = false;
      formStatus.textContent = "Sending your message...";
    }
  });

  const typedEl = document.getElementById("typed-text");
  if (typedEl && typeof Typed !== "undefined") {
    new Typed("#typed-text", {
      strings: [
        "Full Stack Python Developer",
        "Back-End Developer",
        "Data-Science Enthusiast",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      loop: true,
    });
  } else if (typedEl) {
    typedEl.textContent = "Full Stack Python Developer";
  }

  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"], .menu-links a[href^="#"]')];
  const sections = [...new Set(navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean))];

  if (sections.length && "IntersectionObserver" in window) {
    const setActiveLink = (sectionId) => {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
      });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visibleSection) setActiveLink(visibleSection.target.id);
    }, { rootMargin: "-35% 0px -55% 0px", threshold: [0.01, 0.25, 0.5] });

    sections.forEach((section) => sectionObserver.observe(section));
  }
});
