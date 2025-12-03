// script.js
document.addEventListener("DOMContentLoaded", function () {
  // ------------------------------
  // SLIDER PER CARD
  // ------------------------------
  const sliders = document.querySelectorAll(".card-slider");

  // Global lightbox state, dipakai semua
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const zoomInBtn = document.getElementById("lightbox-zoom-in");
  const zoomOutBtn = document.getElementById("lightbox-zoom-out");
  const zoomResetBtn = document.getElementById("lightbox-zoom-reset");

  let lbImages = [];
  let lbIndex = 0;
  let lbScale = 1;

  function updateLightboxImage() {
    const item = lbImages[lbIndex];
    if (!item) return;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt || "";
    updateLightboxTransform();
  }

  function updateLightboxTransform() {
    lightboxImage.style.transform = "scale(" + lbScale.toFixed(2) + ")";
  }

  function openLightbox(images, startIndex) {
    lbImages = images || [];
    lbIndex = startIndex || 0;
    lbScale = 1;
    updateLightboxImage();
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
  }

  function nextLightbox() {
    if (!lbImages.length) return;
    lbIndex = (lbIndex + 1) % lbImages.length;
    lbScale = 1;
    updateLightboxImage();
  }

  function prevLightbox() {
    if (!lbImages.length) return;
    lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
    lbScale = 1;
    updateLightboxImage();
  }

  // Setup slider per card
  sliders.forEach(function (slider) {
    const slides = slider.querySelectorAll(".card-slide");
    const prevBtn = slider.querySelector(".card-prev");
    const nextBtn = slider.querySelector(".card-next");
    const dotsContainer = slider.querySelector(".card-dots");
    const intervalMs = parseInt(slider.dataset.interval, 10) || 5000;

    if (!slides.length) return;

    let currentIndex = 0;
    let dots = [];

    // Buat dots indikator
    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      slides.forEach(function (_, idx) {
        const dot = document.createElement("span");
        dot.className =
          "card-dot w-2 h-2 rounded-full bg-gray-500 cursor-pointer";
        dot.addEventListener("click", function (e) {
          e.stopPropagation();
          currentIndex = idx;
          showSlide(currentIndex);
          resetInterval();
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    function showSlide(index) {
      slides.forEach(function (img, idx) {
        if (idx === index) {
          img.classList.remove("opacity-0");
          img.classList.add("opacity-100");
          img.classList.remove("pointer-events-none");
          img.classList.add("pointer-events-auto");
        } else {
          img.classList.remove("opacity-100");
          img.classList.add("opacity-0");
          img.classList.remove("pointer-events-auto");
          img.classList.add("pointer-events-none");
        }
      });

      if (dots.length) {
        dots.forEach(function (dot, idx) {
          if (idx === index) {
            dot.classList.remove("bg-gray-500");
            dot.classList.add("bg-blue-400");
          } else {
            dot.classList.remove("bg-blue-400");
            dot.classList.add("bg-gray-500");
          }
        });
      }
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    }

    let autoTimer = setInterval(nextSlide, intervalMs);

    function resetInterval() {
      clearInterval(autoTimer);
      autoTimer = setInterval(nextSlide, intervalMs);
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        nextSlide();
        resetInterval();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        prevSlide();
        resetInterval();
      });
    }

    slider.addEventListener("mouseenter", function () {
      clearInterval(autoTimer);
    });

    slider.addEventListener("mouseleave", function () {
      resetInterval();
    });

    // Lightbox group per card
    const groupImages = Array.from(slides).map(function (img) {
      return { src: img.src, alt: img.alt };
    });

    slides.forEach(function (img, idx) {
      img.style.cursor = "pointer";
      img.addEventListener("click", function (e) {
        e.stopPropagation();
        openLightbox(groupImages, idx);
      });
    });

    // Tampilkan slide pertama
    showSlide(currentIndex);
  });

  // ------------------------------
  // LIGHTBOX GLOBAL: tombol dan keyboard
  // ------------------------------
  if (lightboxClose) {
    lightboxClose.addEventListener("click", function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", function (e) {
      e.stopPropagation();
      nextLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function (e) {
      e.stopPropagation();
      prevLightbox();
    });
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      lbScale = Math.min(lbScale + 0.25, 4);
      updateLightboxTransform();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      lbScale = Math.max(lbScale - 0.25, 1);
      updateLightboxTransform();
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      lbScale = 1;
      updateLightboxTransform();
    });
  }

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox.addEventListener("wheel", function (e) {
    if (lightbox.classList.contains("hidden")) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      lbScale = Math.min(lbScale + 0.1, 4);
    } else {
      lbScale = Math.max(lbScale - 0.1, 1);
    }
    updateLightboxTransform();
  });

  document.addEventListener("keydown", function (e) {
    if (lightbox.classList.contains("hidden")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      nextLightbox();
    } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      prevLightbox();
    }
  });

  // Gallery grid juga bisa buka lightbox
  const galleryImages = document.querySelectorAll(".gallery-image");
  galleryImages.forEach(function (img) {
    img.addEventListener("click", function () {
      openLightbox([{ src: img.src, alt: img.alt }], 0);
    });
  });

  // ------------------------------
  // MINI POPUP CARD (CARD MODAL)
  // ------------------------------
  const cardModal = document.getElementById("card-modal");
  const cardModalInner = document.getElementById("card-modal-inner");
  const cardModalTitle = document.getElementById("card-modal-title");
  const cardModalText = document.getElementById("card-modal-text");
  const cardModalImage = document.getElementById("card-modal-image");
  const cardModalTags = document.getElementById("card-modal-tags");
  const cardModalClose = document.getElementById("card-modal-close");
  const cardModalOpenLightbox = document.getElementById(
    "card-modal-open-lightbox"
  );

  let currentCardImages = [];

  function openCardModal(article) {
    const titleEl = article.querySelector("h3");
    const descEl = article.querySelector("p.mt-2, p.mt-3");
    const firstImg = article.querySelector(".card-slide");

    const title = titleEl ? titleEl.textContent.trim() : "Detail Kegiatan";
    const desc = descEl ? descEl.textContent.trim() : "";

    cardModalTitle.textContent = title;
    cardModalText.textContent = desc;

    if (firstImg) {
      cardModalImage.src = firstImg.src;
      cardModalImage.alt = firstImg.alt || "";
    }

    // KUMPULKAN SEMUA GAMBAR DALAM CARD UNTUK LIGHTBOX
    const cardSlides = article.querySelectorAll(".card-slide");
    currentCardImages = Array.from(cardSlides).map(function (img) {
      return { src: img.src, alt: img.alt };
    });

    // RESET TAGS TERLEBIH DULU
    cardModalTags.innerHTML = "";

    // Ambil span tag dari baris tag di dalam card
    const tagSpans = article.querySelectorAll(
      ".mt-4.flex.flex-wrap span, .mt-4.flex.flex-wrap.gap-2 span"
    );

    tagSpans.forEach(function (tagEl) {
      const label = tagEl.textContent.trim();
      if (!label) return; // lewati tag kosong supaya tidak ada blok kosong

      const span = document.createElement("span");
      span.textContent = label;
      // copy kelas dari tag asli supaya warna dan border sama
      span.className = tagEl.className;
      cardModalTags.appendChild(span);
    });

    // Tampilkan modal dengan animasi
    cardModal.classList.remove("hidden");
    cardModal.classList.add("flex");

    cardModalInner.classList.remove("opacity-100", "scale-100");
    cardModalInner.classList.add("opacity-0", "scale-95");

    requestAnimationFrame(function () {
      cardModalInner.classList.remove("opacity-0", "scale-95");
      cardModalInner.classList.add("opacity-100", "scale-100");
    });
  }

  function closeCardModal() {
    cardModalInner.classList.remove("opacity-100", "scale-100");
    cardModalInner.classList.add("opacity-0", "scale-95");
    setTimeout(function () {
      cardModal.classList.add("hidden");
      cardModal.classList.remove("flex");
    }, 150);
  }

  if (cardModalClose) {
    cardModalClose.addEventListener("click", function (e) {
      e.stopPropagation();
      closeCardModal();
    });
  }

  if (cardModal) {
    cardModal.addEventListener("click", function (e) {
      if (e.target === cardModal) {
        closeCardModal();
      }
    });
  }

  if (cardModalOpenLightbox) {
    cardModalOpenLightbox.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!currentCardImages.length && cardModalImage.src) {
        currentCardImages = [{ src: cardModalImage.src, alt: cardModalImage.alt }];
      }
      if (currentCardImages.length) {
        openLightbox(currentCardImages, 0);
      }
    });
  }

  // Klik card untuk buka modal
  const cards = document.querySelectorAll("#summary article.group");

  cards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      // Kalau yang diklik tombol slider, jangan buka modal
      if (
        e.target.closest(".card-prev") ||
        e.target.closest(".card-next") ||
        e.target.classList.contains("card-dot") ||
        e.target.classList.contains("card-slide")
      ) {
        return;
      }
      openCardModal(card);
    });
  });
});
