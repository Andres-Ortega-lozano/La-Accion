
// mobil toggle burger nav
const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
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


  // media SECTION

  document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".video-track");
    const slides = Array.from(document.querySelectorAll(".video-slide"));
    const nextButton = document.querySelector(".carousel-arrow.next");
    const prevButton = document.querySelector(".carousel-arrow.prev");
    const dotsContainer = document.querySelector(".carousel-dots");

    let currentSlide = 0;

    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const updateCarousel = () => {
      const slideWidth = slides[0].offsetWidth;
      track.style.transform = `translateX(-${slideWidth * currentSlide}px)`;

      // Update active dot
      document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
      });
    };

    const goToSlide = (index) => {
      if (index >= 0 && index < slides.length) {
        currentSlide = index;
        updateCarousel();
      }
    };

    nextButton.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateCarousel();
    });

    prevButton.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    // Responsive adjustment (optional)
    window.addEventListener("resize", updateCarousel);
  });



  // PHONE FUNCTION SWIPE, AND ANIMATION

  document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".video-carousel");
    const slides = document.querySelector(".video-slides");
    const totalSlides = document.querySelectorAll(".video-slide").length;
  
    let currentIndex = 0;
    let startX = 0;
    let currentTranslate = 0;
    let isDragging = false;
    let autoplayInterval;
  
    function showSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      slides.style.transition = "transform 0.3s ease";
      slides.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;
      updateDots();
    }
  
    function updateDots() {
      document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }
  
    // Start autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 4000); // 4s per slide
    }
  
    // Stop autoplay (when user interacts)
    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }
  
    // Touch events
    carousel.addEventListener("touchstart", (e) => {
      stopAutoplay();
      startX = e.touches[0].clientX;
      isDragging = true;
      slides.style.transition = "none"; // disable smooth animation during drag
    });
  
    carousel.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      currentTranslate = -currentIndex * carousel.offsetWidth + diff;
      slides.style.transform = `translateX(${currentTranslate}px)`;
    });
  
    carousel.addEventListener("touchend", (e) => {
      isDragging = false;
      const diff = e.changedTouches[0].clientX - startX;
  
      if (Math.abs(diff) > carousel.offsetWidth * 0.25) {
        if (diff < 0) {
          showSlide(currentIndex + 1); // swipe left → next
        } else {
          showSlide(currentIndex - 1); // swipe right → prev
        }
      } else {
        showSlide(currentIndex);
      }
  
      // resume autoplay after 2s
      setTimeout(startAutoplay, 2000);
    });
  
    // Init
    showSlide(0);
    startAutoplay();
  });
  

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

    // Clamp currentIndex
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

    
    const slideWidth = 100 / slidesPerView;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;


    // Update dots
    const dots = dotsContainer.querySelectorAll("span");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
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
    dotsContainer.innerHTML = ''; // Clear existing dots
    const slidesPerView = getSlidesPerView();
    const totalSlides = track.children.length;
    const dotCount = Math.ceil(totalSlides / slidesPerView);

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("span");
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function initializeCarousel() {
    setupDots();
    updateCarousel();
    if (window.instgrm) window.instgrm.Embeds.process();
  }

  window.addEventListener("load", initializeCarousel);
  window.addEventListener("resize", () => {
    setupDots();
    updateCarousel();
  });



// Phone slide version instagram

  function getSlidesPerView() {
    return window.innerWidth <= 768 ? 1 : 3; // 1 on phone, 3 on desktop
  }
  
  function updateCarousel() {
    const slidesPerView = getSlidesPerView();
    const totalSlides = track.children.length;
    const maxIndex = Math.ceil(totalSlides / slidesPerView) - 1;
  
    // Clamp currentIndex
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
  
    if (slidesPerView === 1) {
      // 📱 On phone: move by exact slide width
      const slideWidth = track.children[0].offsetWidth;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    } else {
      // 💻 On desktop: keep your original %
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  
    // Update dots
    const dots = dotsContainer.querySelectorAll("span");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }
  







  // INSTAGRAM AECTION pone touch verson

  let startX = 0;
let isSwiping = false;

track.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isSwiping = true;
});

track.addEventListener("touchmove", (e) => {
  if (!isSwiping) return;
  const deltaX = e.touches[0].clientX - startX;
  // Prevent scrolling while swiping carousel
  if (Math.abs(deltaX) > 10) {
    e.preventDefault();
  }
});

track.addEventListener("touchend", (e) => {
  if (!isSwiping) return;
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      moveCarousel(1); // Swipe left = next
    } else {
      moveCarousel(-1); // Swipe right = prev
    }
  }

  isSwiping = false;
});















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

   
   
   

   

  
 
   
   



   
     
  