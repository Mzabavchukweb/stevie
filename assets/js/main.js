/**
 * Stevie Athletics — Main JavaScript
 * Optimized for performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initMobileCTA();
  initCalendlyLinks();
  initWhatsAppLinks();
  initInstagramLinks();
  initScrollAnimations();
  initSmoothScroll();
  initLazyLoading();
});

/**
 * Header scroll behavior (throttled)
 */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  const handleScroll = () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  handleScroll(); // Initial check
}

/**
 * Mobile navigation
 */
function initMobileNav() {
  const toggle = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('menuClose'); // New close button
  const nav = document.getElementById('mobileNav');
  const backdrop = document.getElementById('mobileBackdrop');

  if (!nav) return;

  const openMenu = () => {
    toggle?.classList.add('active');
    toggle?.setAttribute('aria-expanded', 'true');
    nav.classList.add('open');
    backdrop?.classList.add('open');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    toggle?.classList.remove('active');
    toggle?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  toggle?.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Listener for new close button
  closeBtn?.addEventListener('click', closeMenu);

  backdrop?.addEventListener('click', closeMenu);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on nav link click
  nav.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * Mobile sticky CTA behavior (throttled)
 */
function initMobileCTA() {
  const mobileCta = document.getElementById('mobileCta');
  if (!mobileCta) return;

  let lastScroll = 0;
  let ticking = false;

  const handleScroll = () => {
    const currentScroll = window.pageYOffset;

    // Hide when scrolling down, show when scrolling up
    if (currentScroll > lastScroll && currentScroll > 200) {
      mobileCta.classList.add('hidden');
    } else {
      mobileCta.classList.remove('hidden');
    }

    lastScroll = currentScroll;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // Hide when input is focused (to not cover forms)
  document.addEventListener('focusin', (e) => {
    if (e.target.matches('input, textarea, select')) {
      mobileCta.classList.add('hidden');
    }
  });

  document.addEventListener('focusout', (e) => {
    if (e.target.matches('input, textarea, select')) {
      setTimeout(() => {
        mobileCta.classList.remove('hidden');
      }, 100);
    }
  });
}

/**
 * Calendly integration - Popup Widget
 */
function initCalendlyLinks() {
  const calendlyLinks = document.querySelectorAll('[data-calendly]');

  calendlyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const type = link.dataset.calendly;
      let url;

      switch (type) {
        case 'online':
          url = CONFIG.CALENDLY_ONLINE;
          break;
        case 'offline':
          url = CONFIG.CALENDLY_OFFLINE;
          break;
        case 'general':
        default:
          url = CONFIG.CALENDLY_GENERAL;
      }

      // Open Calendly popup widget (no redirect!)
      if (typeof Calendly !== 'undefined') {
        Calendly.initPopupWidget({
          url: url,
          prefill: {},
          utm: {
            utmSource: link.dataset.source || 'website',
            utmMedium: 'popup',
            utmCampaign: type
          }
        });
      } else {
        // Fallback if widget not loaded
        window.open(url, '_blank', 'noopener,noreferrer');
      }

      // Track event
      trackEvent('cta_calendly_click', {
        source: link.dataset.source || 'unknown',
        type: type
      });
    });
  });
}

/**
 * WhatsApp integration
 */
function initWhatsAppLinks() {
  const whatsappLinks = document.querySelectorAll('[data-whatsapp]');

  whatsappLinks.forEach(link => {
    const customMessage = link.dataset.whatsappMessage;
    link.href = getWhatsAppLink(customMessage);

    link.addEventListener('click', () => {
      trackEvent('whatsapp_click', {
        source: link.dataset.source || 'unknown'
      });
    });
  });
}

/**
 * Instagram links
 */
function initInstagramLinks() {
  const instagramLinks = document.querySelectorAll('[data-instagram]');

  instagramLinks.forEach(link => {
    link.href = CONFIG.INSTAGRAM_URL;
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

/**
 * Scroll-triggered animations (optimized with IntersectionObserver)
 */
function initScrollAnimations() {
  // Skip hero section - it should be visible immediately
  const animatedElements = document.querySelectorAll('[data-animate]:not(.hero [data-animate])');

  if (!animatedElements.length) return;

  // Use IntersectionObserver for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Use requestAnimationFrame for smooth trigger
        requestAnimationFrame(() => {
          entry.target.classList.add('in-view');
        });
        // Unobserve after animation to save resources
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '50px 0px -50px 0px' // Trigger earlier for smoother feel
  });

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#" or empty
      if (href === '#' || href === '') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Lazy loading for images and videos (optimized)
 */
function initLazyLoading() {
  // Use native lazy loading if available
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.loading = 'lazy';
      img.removeAttribute('data-src');
    });
  } else {
    // Fallback for older browsers
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' }); // Load earlier for smoother experience

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Lazy load videos (only when in viewport)
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        if (video.dataset.src) {
          video.src = video.dataset.src;
          video.removeAttribute('data-src');
        }
        video.load();
        videoObserver.unobserve(video);
      }
    });
  }, { rootMargin: '200px' }); // Load videos earlier

  document.querySelectorAll('video[data-src]').forEach(video => {
    videoObserver.observe(video);
  });
}

/**
 * Utility: Track events (for analytics)
 */
function trackEvent(eventName, params = {}) {
  // Log to console for debugging (only in dev)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Analytics Event:', eventName, params);
  }

  // Store in window for analytics.js to pick up
  window.analyticsQueue = window.analyticsQueue || [];
  window.analyticsQueue.push({ event: eventName, params, timestamp: Date.now() });

  // If Google Analytics is available
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, params);
  }

  // If custom analytics handler exists
  if (typeof window.handleAnalyticsEvent === 'function') {
    window.handleAnalyticsEvent(eventName, params);
  }
}

// Expose trackEvent globally
window.trackEvent = trackEvent;
