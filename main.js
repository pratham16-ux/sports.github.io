/* ==========================================
   STACKLY SPORTS CLUB - SHARED JS
   ========================================== */

(function() {
  'use strict';

  /* ---- HEADER SCROLL ---- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- HAMBURGER / MOBILE NAV ---- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- ACTIVE NAV LINK ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- REVEAL ON SCROLL ---- */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      revealObserver.observe(el);
    });

    /* ---- COUNTER ANIMATION ---- */
    function animateCounters() {
      document.querySelectorAll('.count-up').forEach(el => {
        if (el.dataset.animated) return; // prevent re-running if statsObserver fires again
        el.dataset.animated = '1';
        const target = +el.dataset.target;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const suffix = el.dataset.suffix || '';
        const update = () => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current < target) requestAnimationFrame(update);
        };
        update();
      });
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);

    /* ---- PROGRESS BAR ANIMATION ---- */
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.width = bar.dataset.width || '0%';
          });
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.progress-section').forEach(s => progressObserver.observe(s));
  }

  /* ---- CURSOR GLOW ---- */
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.innerWidth > 1024) {
    let rafGlow;
    let glowX = 0, glowY = 0;
    document.addEventListener('mousemove', (e) => {
      glowX = e.clientX;
      glowY = e.clientY;
      cancelAnimationFrame(rafGlow);
      rafGlow = requestAnimationFrame(() => {
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        glow.style.opacity = '1';
      });
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  /* ---- PARALLAX ---- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && window.innerWidth > 768) {
    let rafParallax;
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(rafParallax);
      rafParallax = requestAnimationFrame(() => {
        parallaxEls.forEach(el => {
          const speed = +(el.dataset.parallax) || 0.3;
          const section = el.closest('section');
          if (!section) return;
          const sRect = section.getBoundingClientRect();
          const offset = sRect.top * speed;
          el.style.transform = `translateY(${offset}px)`;
        });
      });
    }, { passive: true });
  }

  /* ---- SMOOTH HOVER TILT ---- */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      const x = (e.clientX - cardRect.left) / cardRect.width - 0.5;
      const y = (e.clientY - cardRect.top) / cardRect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- HERO SLIDER ---- */
  const slider = document.querySelector('.hero-slider');
  const slides = slider ? slider.querySelectorAll('.slide') : [];
  if (slider && slides.length) {
    const dots = slider.querySelectorAll('.slider-dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let current = 0;
    let sliderInterval;

    function goTo(idx) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function startAutoplay() {
      sliderInterval = setInterval(() => goTo(current + 1), 5000);
    }
    function stopAutoplay() { clearInterval(sliderInterval); }

    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); }));

    slides[0].classList.add('active');
    if (dots[0]) dots[0].classList.add('active');
    startAutoplay();

    // Use visibilitychange instead of beforeunload — beforeunload fires on navigation
    // which doesn't need cleanup; visibilitychange pauses when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  /* ---- ACCORDION ---- */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const body = item.querySelector('.accordion-body');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(o => {
        o.classList.remove('open');
        const oBody = o.querySelector('.accordion-body');
        if (oBody) oBody.style.maxHeight = '0';
        const oIcon = o.querySelector('.acc-icon');
        if (oIcon) oIcon.textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('open');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
        const triggerIcon = trigger.querySelector('.acc-icon');
        if (triggerIcon) triggerIcon.textContent = '\u2212';
      }
    });
  });

  /* ---- TABS ---- */
  document.querySelectorAll('.tabs-nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.tabs');
      const tabId = btn.dataset.tab;
      if (!parent || !tabId) return;
      parent.querySelectorAll('.tabs-nav button').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = parent.querySelector('#' + CSS.escape(tabId));
      if (panel) panel.classList.add('active');
    });
  });

  /* ---- VIDEO PLAY TOGGLE ---- */
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const vid = btn.closest('.video-wrap') && btn.closest('.video-wrap').querySelector('video');
      if (!vid) return;
      if (vid.paused) {
        vid.play().catch((err) => {
          console.warn('Video play failed:', err.message);
        });
        btn.style.opacity = '0';
      } else {
        vid.pause();
        btn.style.opacity = '1';
      }
    });
  });

  /* ---- NEWSLETTER SUBSCRIBE FORM ---- */
  const nlEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.querySelectorAll('.newsletter-form').forEach(form => {
    const input = form.querySelector('.nl-input');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input) return;

      const value = input.value.trim();

      if (!value || !nlEmailRegex.test(value)) {
        input.classList.add('input-error', 'shake');
        input.focus();
        setTimeout(() => input.classList.remove('shake'), 400);
        return;
      }

      input.classList.remove('input-error');
      showSiteToast("You're subscribed! Watch your inbox for Stackly updates.");
      form.reset();
    });

    if (input) {
      input.addEventListener('input', () => input.classList.remove('input-error'));
    }
  });

  /* ---- TOAST ---- */
  function showSiteToast(message) {
    let toast = document.querySelector('.site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'site-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = '<span class="dot"></span><span class="toast-msg"></span>';
      document.body.appendChild(toast);
    }
    const toastMsg = toast.querySelector('.toast-msg');
    if (toastMsg) toastMsg.textContent = message;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* ---- CONTACT FORM VALIDATION ---- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const nameInput = contactForm.querySelector('#cf-name');
    const phoneInput = contactForm.querySelector('#cf-phone');
    const emailInput = contactForm.querySelector('#cf-email');

    const nameRegex = /^[A-Za-z\s]{1,16}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const cfEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const markInvalid = (el) => {
      el.classList.add('input-error', 'shake');
      setTimeout(() => el.classList.remove('shake'), 400);
    };

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        nameInput.value = nameInput.value.replace(/[^A-Za-z\s]/g, '').slice(0, 16);
        nameInput.classList.remove('input-error');
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        phoneInput.classList.remove('input-error');
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => emailInput.classList.remove('input-error'));
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';

      if (nameInput && (!nameVal || !nameRegex.test(nameVal))) {
        markInvalid(nameInput);
        valid = false;
      }
      if (phoneInput && phoneVal && !phoneRegex.test(phoneVal)) {
        markInvalid(phoneInput);
        valid = false;
      }
      if (emailInput && (!emailVal || !cfEmailRegex.test(emailVal))) {
        markInvalid(emailInput);
        valid = false;
      }

      if (!valid) return;

      showSiteToast("Message sent — our team will get back to you within 24 hours.");
      contactForm.reset();
    });
  }

})();