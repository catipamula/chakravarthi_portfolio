let currentIndex = 0;
let images = [];
let zoomLevel = 1;
let isFitScreen = true;
let activeGalleryId = null;
let touchStartX = 0;
let touchStartY = 0;

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;

const lightbox = () => document.getElementById("lightbox");
const lightboxImg = () => document.getElementById("lightbox-img");
const lightboxCounter = () => document.getElementById("lightbox-counter");
const lightboxFilename = () => document.getElementById("lightbox-filename");

const showGallery = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "block";
    el.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    activeGalleryId = id;
  }
};

const closeGallery = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "none";
    el.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (activeGalleryId === id) activeGalleryId = null;
  }
};

const getFilename = (src) => {
  try {
    const parts = src.split("/");
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    return "image";
  }
};

const updateLightboxUI = () => {
  const img = lightboxImg();
  const counter = lightboxCounter();
  const filename = lightboxFilename();
  if (!img || !images.length) return;

  img.src = images[currentIndex];
  img.alt = getFilename(images[currentIndex]);

  if (counter) counter.textContent = `${currentIndex + 1} / ${images.length}`;
  if (filename) filename.textContent = getFilename(images[currentIndex]);

  applyZoom();
};

const applyZoom = () => {
  const img = lightboxImg();
  if (!img) return;

  if (isFitScreen) {
    img.style.transform = "scale(1)";
    img.style.maxWidth = "90%";
    img.style.maxHeight = "80%";
    img.style.cursor = "zoom-in";
    zoomLevel = 1;
  } else {
    img.style.maxWidth = "none";
    img.style.maxHeight = "none";
    img.style.transform = `scale(${zoomLevel})`;
    img.style.cursor = zoomLevel > 1 ? "grab" : "zoom-in";
  }
};

const openLightbox = (src, galleryId) => {
  const gallery = document.getElementById(galleryId || activeGalleryId);
  if (!gallery) return;

  images = Array.from(gallery.querySelectorAll(".images img")).map((img) => img.src);
  currentIndex = Math.max(0, images.indexOf(src));
  zoomLevel = 1;
  isFitScreen = true;

  const lb = lightbox();
  if (!lb) return;

  lb.style.display = "flex";
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    lb.classList.add("visible");
    updateLightboxUI();
    lb.querySelector(".lightbox-close")?.focus();
  });
};

const closeLightbox = () => {
  const lb = lightbox();
  if (!lb) return;

  lb.classList.remove("visible");
  lb.setAttribute("aria-hidden", "true");

  setTimeout(() => {
    lb.style.display = "none";
    if (!activeGalleryId) document.body.style.overflow = "";
    zoomLevel = 1;
    isFitScreen = true;
  }, 300);
};

const nextImage = () => {
  if (!images.length) return;
  currentIndex = (currentIndex + 1) % images.length;
  zoomLevel = 1;
  isFitScreen = true;
  updateLightboxUI();
};

const prevImage = () => {
  if (!images.length) return;
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  zoomLevel = 1;
  isFitScreen = true;
  updateLightboxUI();
};

const zoomIn = () => {
  isFitScreen = false;
  zoomLevel = Math.min(ZOOM_MAX, zoomLevel + ZOOM_STEP);
  applyZoom();
};

const zoomOut = () => {
  isFitScreen = false;
  zoomLevel = Math.max(ZOOM_MIN, zoomLevel - ZOOM_STEP);
  applyZoom();
};

const fitScreen = () => {
  isFitScreen = true;
  zoomLevel = 1;
  applyZoom();
};

const isLightboxOpen = () => {
  const lb = lightbox();
  return lb && lb.style.display === "flex";
};

document.addEventListener("keydown", (e) => {
  if (!isLightboxOpen()) {
    if (e.key === "Escape" && activeGalleryId) closeGallery(activeGalleryId);
    return;
  }

  switch (e.key) {
    case "ArrowRight": nextImage(); break;
    case "ArrowLeft": prevImage(); break;
    case "Escape": closeLightbox(); break;
    case "+":
    case "=": zoomIn(); break;
    case "-": zoomOut(); break;
    case "0": fitScreen(); break;
    default: break;
  }
});

document.addEventListener("click", (e) => {
  const lb = lightbox();
  if (!isLightboxOpen() || !lb) return;
  if (e.target === lb || e.target.classList.contains("lightbox-backdrop")) closeLightbox();
});

document.addEventListener("DOMContentLoaded", () => {
  const img = lightboxImg();

  if (img) {
    img.addEventListener("dblclick", () => {
      if (isFitScreen) {
        isFitScreen = false;
        zoomLevel = 2;
      } else {
        fitScreen();
      }
      applyZoom();
    });

    img.addEventListener("wheel", (e) => {
      if (!isLightboxOpen()) return;
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    });
  }

  const lb = lightbox();
  if (lb) {
    lb.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lb.addEventListener("touchend", (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      const diffY = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX < 0) nextImage();
        else prevImage();
      }
    }, { passive: true });
  }

  document.querySelectorAll(".gallery .images img").forEach((imgEl) => {
    imgEl.setAttribute("loading", "lazy");
    imgEl.setAttribute("tabindex", "0");
    imgEl.setAttribute("role", "button");
    imgEl.setAttribute("aria-label", "View image in lightbox");
    imgEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const gallery = imgEl.closest(".gallery");
        if (gallery) openLightbox(imgEl.src, gallery.id);
      }
    });
  });

  document.querySelectorAll(".college img").forEach((imgEl) => {
    imgEl.setAttribute("loading", "lazy");
  });

  document.querySelectorAll(".college").forEach((card) => {
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });
});
