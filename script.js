/* ================================
   CARD IMAGE SLIDER
=================================*/
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".card-slider").forEach((slider) => {
    const slides = slider.querySelectorAll(".card-slide");
    const prevBtn = slider.querySelector(".card-prev");
    const nextBtn = slider.querySelector(".card-next");
    const dotsContainer = slider.querySelector(".card-dots");
    let current = 0;
    let autoPlay;

    // DOTS Create
    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "w-2 h-2 rounded-full bg-gray-500 opacity-50 cursor-pointer";
      dotsContainer.appendChild(dot);

      dot.addEventListener("click", () => changeSlide(i));
    });

    const dots = dotsContainer.children;
    dots[0].classList.add("opacity-100", "bg-blue-300");

    function changeSlide(i) {
      slides[current].style.opacity = 0;
      dots[current].classList.remove("opacity-100", "bg-blue-300");

      current = i;

      slides[current].style.opacity = 1;
      dots[current].classList.add("opacity-100", "bg-blue-300");
    }

    function next() {
      changeSlide((current + 1) % slides.length);
    }

    function prev() {
      changeSlide((current - 1 + slides.length) % slides.length);
    }

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    autoPlay = setInterval(next, slider.dataset.interval || 5000);
    slider.addEventListener("mouseenter", () => clearInterval(autoPlay));
    slider.addEventListener("mouseleave", () => (autoPlay = setInterval(next, 5000)));
  });

/* ================================
   LIGHTBOX FULLSCREEN PREVIEW
   (default zoom 0.85, NOT full screen)
=================================*/

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-image");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  let lbImages = [];
  let lbIndex = 0;
  let lbScale = 0.85; // jangan full layar

  function updateLightboxImage() {
    if (!lbImages.length || lbIndex < 0) return;
    const src = lbImages[lbIndex].src;
    lightboxImg.src = src;
    updateLightboxTransform();
  }

  function updateLightboxTransform() {
    lightboxImg.style.transform = `scale(${lbScale})`;
  }

  function openLightbox(images, index) {
    lbImages = images;
    lbIndex = index;
    lbScale = 0.85; // default tidak memenuhi layar

    updateLightboxImage();
    lightbox.classList.remove("hidden");
    lightbox.style.display = "flex";
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.style.display = "none";
  }

  function nextImage() {
    lbIndex = (lbIndex + 1) % lbImages.length;
    updateLightboxImage();
  }

  function prevImage() {
    lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
    updateLightboxImage();
  }

  // Klik gambar card / gallery buka lightbox
  document.querySelectorAll(".card-slide, .gallery-image").forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      const group = [...img.closest(".card-slider-images")?.querySelectorAll("img") || [img]];
      const index = group.indexOf(img);
      openLightbox(group, index);
    });
  });

  // Close
  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Prev/Next
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    nextImage();
  });
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    prevImage();
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "ArrowRight" || e.key === "d") nextImage();
    if (e.key === "ArrowLeft" || e.key === "a") prevImage();
    if (e.key === "Escape") closeLightbox();
  });

/* ================================
   ZOOM CONTROL (+) (-) Reset
=================================*/
  document.getElementById("lightbox-zoom-in")?.addEventListener("click", (e) => {
    e.stopPropagation();
    lbScale = Math.min(lbScale + 0.15, 3);
    updateLightboxTransform();
  });

  document.getElementById("lightbox-zoom-out")?.addEventListener("click", (e) => {
    e.stopPropagation();
    lbScale = Math.max(lbScale - 0.15, 0.4);
    updateLightboxTransform();
  });

  document.getElementById("lightbox-zoom-reset")?.addEventListener("click", (e) => {
    e.stopPropagation();
    lbScale = 0.85; // reset supaya tidak full layar
    updateLightboxTransform();
  });

  // Scroll for zoom
  lightbox.addEventListener("wheel", (e) => {
    if (lightbox.classList.contains("hidden")) return;
    e.preventDefault();
    lbScale += e.deltaY > 0 ? -0.1 : 0.1;
    lbScale = Math.max(0.4, Math.min(lbScale, 3));
    updateLightboxTransform();
  });

});
