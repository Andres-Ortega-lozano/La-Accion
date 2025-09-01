





// mobile toggle burger nav
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

// Toggle menu when clicking burger
menuToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent immediate close
  navLinks.classList.toggle("active");
});

// Close menu when clicking any link
navItems.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (navLinks.classList.contains("active") && 
      !navLinks.contains(e.target) && 
      !menuToggle.contains(e.target)) {
    navLinks.classList.remove("active");
  }
});








 // MODAL HERO SECTION 

 



 document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const modals = {
    info: document.getElementById("customModal"),
    contract: document.getElementById("contractExampleModal"),
  };

  const openers = new Map([
    [document.getElementById("openModalBtn"), modals.info],
    [document.getElementById("openContractExampleBtn"), modals.contract],
  ]);

  let activeModal = null;
  let lastOpener = null;

  const FOCUS_SELECTOR = [
    "a[href]",
    "button",
    "textarea",
    "input",
    "select",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  function lockScroll() { body.classList.add("no-scroll"); }
  function unlockScroll() { body.classList.remove("no-scroll"); }

  function getFocusables(el) {
    return Array.from(el.querySelectorAll(FOCUS_SELECTOR))
      .filter(n => !n.hasAttribute("disabled") && !n.getAttribute("aria-hidden"));
  }

  function openModal(modalEl, openerBtn) {
    if (!modalEl) return;
    lastOpener = openerBtn || null;
    modalEl.style.display = "block";
    modalEl.setAttribute("aria-hidden", "false");
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    lockScroll();
    activeModal = modalEl;

    // Focus first focusable (or the modal content itself)
    const first = getFocusables(modalEl)[0] || modalEl.querySelector(".modal-content") || modalEl;
    first.focus();
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = "none";
    modalEl.setAttribute("aria-hidden", "true");
    unlockScroll();
    activeModal = null;
    if (lastOpener) lastOpener.focus();
  }

  // Wire up open buttons
  openers.forEach((modalEl, btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => openModal(modalEl, btn));
  });

  // Wire up close buttons + click outside for each modal
  Object.values(modals).forEach((modalEl) => {
    if (!modalEl) return;

    // Close buttons inside this modal
    modalEl.querySelectorAll(".close").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(modalEl));
    });

    // Click outside (on overlay)
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) closeModal(modalEl);
    });
  });

  // Keyboard handling: Esc to close, Tab to trap focus
  document.addEventListener("keydown", (e) => {
    if (!activeModal) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeModal(activeModal);
    }

    if (e.key === "Tab") {
      const focusables = getFocusables(activeModal);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
});



  // BOOKING SECTION   
  document.addEventListener("DOMContentLoaded", () => {
    const selectBtn = document.getElementById("selectDateBtn");
    const reserveBtn = document.getElementById("reserveBtn");

    const picker = new Litepicker({
      element: selectBtn,
      singleMode: true,
      showWeekNumbers: false,
      format: 'YYYY-MM-DD',
      autoApply: true,
      minDate: new Date(),
      setup: picker => {
        picker.on('selected', (date1) => {
          const dateStr = date1.format('YYYY-MM-DD');
          selectBtn.textContent = date1.format('MM/DD/YYYY');
          reserveBtn.disabled = false;
        });
      }
    });

    picker.on('hide', () => {
      // picker automatically hides upon selection
    });

    selectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      picker.show();
    });

    reserveBtn.addEventListener("click", () => {
      const selected = selectBtn.textContent;
      if (!selected.includes('-') && selected !== "Seleccionar fecha") {
        const url = `booking.html?date=${encodeURIComponent(selected)}`;
        window.location.href = url;
      } else {
        alert("Por favor selecciona una fecha.");
      }
    });
  });


  // =======================
// MEDIA CAROUSEL WITH SWIPE + AUTOPLAY + YOUTUBE
// =======================

// =======================
// MEDIA CAROUSEL + SWIPE + AUTOPLAY + YOUTUBE
// =======================

const MediaCarousel = (() => {
  // Elements
  const track = document.querySelector(".video-track");
  const slides = Array.from(document.querySelectorAll(".video-slide"));
  const dotsContainer = document.querySelector(".carousel-dots");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;
  let autoplayInterval;
  const slideCount = slides.length;

  // ------------------------
  // Create dots
  // ------------------------
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });

  // ------------------------
  // Helper functions
  // ------------------------
  const getSlideWidth = () => slides[0].offsetWidth;

  const updateDots = () => {
    document.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  };

  const showSlide = (index) => {
    if (index < 0) index = slideCount - 1;
    if (index >= slideCount) index = 0;
    currentIndex = index;
    track.style.transition = "transform 0.3s ease";
    track.style.transform = `translateX(${-currentIndex * getSlideWidth()}px)`;
    updateDots();
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 7000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) clearInterval(autoplayInterval);
  };

  // Make globally accessible for YouTube API
  window.startAutoplay = startAutoplay;
  window.stopAutoplay = stopAutoplay;

  // ------------------------
  // Arrows
  // ------------------------
  prevBtn?.addEventListener("click", () => showSlide(currentIndex - 1));
  nextBtn?.addEventListener("click", () => showSlide(currentIndex + 1));

  // ------------------------
  // Swipe for mobile
  // ------------------------
  slides.forEach((slide) => {
    slide.addEventListener("touchstart", (e) => {
      stopAutoplay();
      startX = e.touches[0].clientX;
      isDragging = true;
      track.style.transition = "none";
    });

    slide.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const diff = e.touches[0].clientX - startX;
      track.style.transform = `translateX(${-currentIndex * getSlideWidth() + diff}px)`;
    });

    slide.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > getSlideWidth() / 4) {
        if (diff < 0) showSlide(currentIndex + 1);
        else showSlide(currentIndex - 1);
      } else {
        showSlide(currentIndex);
      }
      startAutoplay();
    });
  });

  // ------------------------
  // Click on video stops autoplay
  // ------------------------
  document.querySelectorAll(".video-wrapper iframe").forEach((iframe) => {
    iframe.addEventListener("click", () => {
      stopAutoplay();
    });
  });

  // ------------------------
  // Resize handler
  // ------------------------
  window.addEventListener("resize", () => showSlide(currentIndex));

  // ------------------------
  // Init carousel
  // ------------------------
  showSlide(0);
  startAutoplay();

  // Expose methods for YouTube API
  return {
    startAutoplay,
    stopAutoplay
  };
})();

// =======================
// YOUTUBE API
// =======================
let players = [];

function onYouTubeIframeAPIReady() {
  document.querySelectorAll(".video-wrapper iframe").forEach((iframe) => {
    const player = new YT.Player(iframe, {
      events: {
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            MediaCarousel.stopAutoplay();
          } else if (
            event.data === YT.PlayerState.PAUSED ||
            event.data === YT.PlayerState.ENDED
          ) {
            MediaCarousel.startAutoplay();
          }
        }
      }
    });
    players.push(player);
  });
}


// INSTAGRAM AECTION

  
const track = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('carouselDots');
let currentIndex = 0;

function getSlidesPerView() {
  return window.innerWidth <= 768 ? 1 : 3;
}

function updateCarousel() {
  const slidesPerView = getSlidesPerView();
  const totalSlides = track.children.length;
  const maxIndex = Math.ceil(totalSlides / slidesPerView) - 1;

  currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
  const translateX = (currentIndex * 100) / slidesPerView;
  track.style.transition = "transform 0.5s ease"; // smooth slide
  track.style.transform = `translateX(-${translateX}%)`;

  // Update dots
  const dots = dotsContainer.querySelectorAll("span");
  dots.forEach((dot, index) => dot.classList.toggle("active", index === currentIndex));
}

function moveCarousel(direction) {
  const slidesPerView = getSlidesPerView();
  const totalSlides = track.children.length;
  const maxIndex = Math.ceil(totalSlides / slidesPerView) - 1;

  currentIndex += direction;
  currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
  updateCarousel();
}

function setupDots() {
  dotsContainer.innerHTML = '';
  const slidesPerView = getSlidesPerView();
  const totalSlides = track.children.length;
  const dotCount = Math.ceil(totalSlides / slidesPerView);

  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => { currentIndex = i; updateCarousel(); });
    dotsContainer.appendChild(dot);
  }
}

// -------------------- Swipe with drag --------------------
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let isDragging = false;
let animationID = 0;

track.addEventListener("touchstart", startDrag);
track.addEventListener("touchmove", drag);
track.addEventListener("touchend", endDrag);

function startDrag(e) {
  startX = e.touches[0].clientX;
  isDragging = true;
  animationID = requestAnimationFrame(animation);
  track.style.transition = "none"; // disable transition while dragging
}

function drag(e) {
  if (!isDragging) return;
  const currentX = e.touches[0].clientX;
  const movedX = currentX - startX;
  const slideWidth = track.offsetWidth / track.children.length;
  currentTranslate = prevTranslate + (movedX / slideWidth) * (100 / getSlidesPerView());
}

function endDrag(e) {
  cancelAnimationFrame(animationID);
  isDragging = false;

  const movedX = e.changedTouches[0].clientX - startX;
  if (movedX < -50) moveCarousel(1); // swipe left
  else if (movedX > 50) moveCarousel(-1); // swipe right
  else updateCarousel(); // small drag, snap back

  prevTranslate = (currentIndex * 100) / getSlidesPerView();
}

function animation() {
  track.style.transform = `translateX(-${currentTranslate}%)`;
  if (isDragging) requestAnimationFrame(animation);
}

// -------------------- Initialize --------------------
function initializeCarousel() {
  setupDots();
  updateCarousel();
  if (window.instgrm) window.instgrm.Embeds.process();
}

window.addEventListener("load", initializeCarousel);
window.addEventListener("resize", () => { setupDots(); updateCarousel(); });





  // REVIEW SECTION

  
  const reviews = [
    {
      name: "Carlos M.",
      message: "Increíble grupo, prendieron toda la fiesta. 100% recomendados.",
      rating: 5
    },
    {
      name: "Laura G.",
      message: "Muy puntuales y súper profesionales. Tocan con el alma.",
      rating: 5
    },
    {
      name: "Fernando P.",
      message: "¡La Acción es la acción! Hicieron que mi cumpleaños fuera inolvidable.",
      rating: 4
    },
    {
      name: "María R.",
      message: "Mis invitados no pararon de bailar. ¡Gracias La Acción!",
      rating: 5
    },
    {
      name: "José L.",
      message: "Gran talento y actitud. Ya los quiero de nuevo para mi próxima fiesta.",
      rating: 4
    },
    {
      name: "Ana S.",
      message: "Sonaron espectacular, se adaptaron perfecto a nuestro evento familiar.",
      rating: 5
    }
  ];

  let currentSlide = 0;
  const reviewsPerSlide = 3;

  function renderReviews() {
    const slider = document.getElementById("reviewSlider");
    const dotsContainer = document.getElementById("reviewDots");
    slider.innerHTML = "";
    dotsContainer.innerHTML = "";

    reviews.forEach((review) => {
      const card = document.createElement("div");
      card.classList.add("review-card");

      const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

      card.innerHTML = `
        <div class="stars">${stars}</div>
        <h4>${review.name}</h4>
        <p>"${review.message}"</p>
      `;
      slider.appendChild(card);
    });

    const totalSlides = Math.ceil(reviews.length / reviewsPerSlide);
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("span");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    updateSlider();
  }

  function updateSlider() {
    const slider = document.getElementById("reviewSlider");
    const dots = document.getElementById("reviewDots").children;
    const slideWidth = 100 / (reviews.length / reviewsPerSlide);
    slider.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

    Array.from(dots).forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  }

  function moveSlide(direction) {
    const maxSlide = Math.ceil(reviews.length / reviewsPerSlide) - 1;
    currentSlide = Math.max(0, Math.min(currentSlide + direction, maxSlide));
    updateSlider();
  }

  function goToSlide(index) {
    currentSlide = index;
    updateSlider();
  }

  // Form submission handler
  document.addEventListener("DOMContentLoaded", () => {
    renderReviews();

    const form = document.getElementById("reviewForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("reviewerName").value.trim();
      const message = document.getElementById("reviewMessage").value.trim();
      const rating = parseInt(document.querySelector('input[name="rating"]:checked')?.value || "0");

      if (name && message && rating) {
        reviews.push({ name, message, rating });
        currentSlide = Math.ceil(reviews.length / reviewsPerSlide) - 1;
        renderReviews();
        form.reset();
        alert("¡Gracias por tu reseña!");
      } else {
        alert("Por favor completa todos los campos y selecciona una puntuación.");
      }
    });
  });


  
  


   // CONTACT SECTION 

   function sendMessage(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();
  
    const subject = encodeURIComponent("Nuevo mensaje de cliente");
    const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone}\nMensaje:\n${message}`);
    const mailtoLink = `mailto:La.Accion@gmail.com?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
  }

   
   
   

   

  
 
   
   



   
     
  