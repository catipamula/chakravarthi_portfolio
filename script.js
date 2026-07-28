function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

function downloadAndViewCV() {
  const fileUrl = "./assets/certify/Chakravarthi_python_exp.pdf";
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = "Chakravarthi_Resume.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.open(fileUrl, "_blank");
}

function playVideo(videoSrc) {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("demoVideo");
  if (!modal || !video) return;
  video.src = videoSrc;
  modal.style.display = "flex";
  video.play();
}

function closeVideo() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("demoVideo");
  if (!modal || !video) return;
  video.pause();
  video.currentTime = 0;
  modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", () => {
      const submitBtn = document.getElementById("submitBtn");
      const loadingMessage = document.getElementById("loadingMessage");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }
      if (loadingMessage) loadingMessage.style.display = "block";
    });
  }

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
  }

  const hamburgerIcon = document.querySelector(".hamburger-icon");
  if (hamburgerIcon) {
    hamburgerIcon.setAttribute("role", "button");
    hamburgerIcon.setAttribute("tabindex", "0");
    hamburgerIcon.setAttribute("aria-label", "Toggle navigation menu");
    hamburgerIcon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"], .menu-links a[href^="#"]')];
  const sections = [...new Set(navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean))];

  if (sections.length && 'IntersectionObserver' in window) {
    const setActiveLink = (sectionId) => {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
      });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visibleSection) setActiveLink(visibleSection.target.id);
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0.01, 0.25, 0.5] });

    sections.forEach((section) => sectionObserver.observe(section));
  }
});
