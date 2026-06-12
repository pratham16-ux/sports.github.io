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

  /* ---- CURSOR GLOW ---- */
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.innerWidth > 1024) {
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  /* ---- COUNTER ANIMATION ---- */
  function animateCounters() {
    document.querySelectorAll('.count-up').forEach(el => {
      const target = +el.dataset.target;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const update = () => {
        current = Math.min(current + step, target);
        el.textContent = el.dataset.suffix
          ? Math.floor(current) + el.dataset.suffix
          : Math.floor(current);
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

  /* ---- PARALLAX ---- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      parallaxEls.forEach(el => {
        const speed = +(el.dataset.parallax) || 0.3;
        const rect = el.closest('section').getBoundingClientRect();
        const offset = rect.top * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }

  /* ---- SMOOTH HOVER TILT ---- */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- HERO SLIDER ---- */
  const slider = document.querySelector('.hero-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let current = 0;
    let interval;

    function goTo(idx) {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
    }

    function startAutoplay() {
      interval = setInterval(() => goTo(current + 1), 5000);
    }
    function stopAutoplay() { clearInterval(interval); }

    nextBtn?.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });
    prevBtn?.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); }));

    if (slides.length) { slides[0].classList.add('active'); dots[0]?.classList.add('active'); startAutoplay(); }
  }

  /* ---- ACCORDION ---- */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const body = item.querySelector('.accordion-body');
    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.accordion-body').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---- PROGRESS BAR ANIMATION ---- */
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.progress-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.progress-section').forEach(s => progressObserver.observe(s));

  /* ---- TABS ---- */
  document.querySelectorAll('.tabs-nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.tabs');
      parent.querySelectorAll('.tabs-nav button').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      parent.querySelector('#' + btn.dataset.tab)?.classList.add('active');
    });
  });

  /* ---- VIDEO PLAY TOGGLE ---- */
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const vid = btn.closest('.video-wrap')?.querySelector('video');
      if (vid) {
        if (vid.paused) { vid.play(); btn.style.opacity = '0'; }
        else { vid.pause(); btn.style.opacity = '1'; }
      }
    });
  });

})();