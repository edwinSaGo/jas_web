/**
 * JAS Tampo Screen Impresores | js/main.js
 * Scripts principales del sitio
 */

'use strict';

/* ══════════════════════════════════════
   1. HEADER SCROLL BEHAVIOR
══════════════════════════════════════ */
const header = document.getElementById('site-header');

function handleHeaderScroll() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll(); // run on load


/* ══════════════════════════════════════
   2. MOBILE MENU TOGGLE
══════════════════════════════════════ */
const hamburger  = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click
document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
});


/* ══════════════════════════════════════
   3. SMOOTH SCROLL FOR ANCHOR LINKS
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const headerOffset = 90;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ══════════════════════════════════════
   4. SCROLL REVEAL ANIMATIONS
══════════════════════════════════════ */
const animatedEls = document.querySelectorAll('[data-animate]');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

animatedEls.forEach(el => revealObserver.observe(el));


/* ══════════════════════════════════════
   5. COUNTER ANIMATION (Hero Stats)
══════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('.hero-stat__num[data-count]');
let countersStarted = false;

const counterObserver = new IntersectionObserver(
  (entries) => {
    if (entries.some(e => e.isIntersecting) && !countersStarted) {
      countersStarted = true;
      counterEls.forEach(el => animateCounter(el));
    }
  },
  { threshold: 0.5 }
);

const statsSection = document.querySelector('.hero-stats');
if (statsSection) counterObserver.observe(statsSection);


/* ══════════════════════════════════════
   6. FAQ ACCORDION – Close others when one opens
══════════════════════════════════════ */
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq-item[open]').forEach(other => {
        if (other !== item) other.removeAttribute('open');
      });
    }
  });
});


/* ══════════════════════════════════════
   7. WHATSAPP FLOAT – Hide/show on scroll
══════════════════════════════════════ */
const waFloat = document.getElementById('whatsapp-float');
let lastScrollY = window.scrollY;
let waVisible = true;

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  if (currentY > 300) {
    if (currentY > lastScrollY && waVisible) {
      // Scrolling down: keep visible (always show)
    }
    if (!waVisible) {
      waFloat.style.opacity = '1';
      waFloat.style.transform = '';
      waVisible = true;
    }
  }
  lastScrollY = currentY;
}, { passive: true });


/* ══════════════════════════════════════
   8. ACTIVE NAV LINK ON SCROLL
══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'nav-link--active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(section => sectionObserver.observe(section));


/* ══════════════════════════════════════
   9. FOOTER YEAR
══════════════════════════════════════ */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ══════════════════════════════════════
   10. VIDEO FALLBACK (Hero)
   Si no hay video, muestra un gradient animado
══════════════════════════════════════ */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  heroVideo.addEventListener('error', () => {
    const wrap = document.querySelector('.hero-video-wrap');
    if (wrap) {
      wrap.style.background = `
        linear-gradient(135deg,
          #0d1426 0%,
          #0f2040 30%,
          #081530 60%,
          #080d1a 100%
        )`;
      heroVideo.style.display = 'none';
    }
  });
}


/* ══════════════════════════════════════
   11. GALLERY LIGHTBOX (simple)
══════════════════════════════════════ */
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img || !img.src || img.src.endsWith('undefined')) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:10000;
      background:rgba(0,0,0,0.92);
      display:flex;align-items:center;justify-content:center;
      cursor:zoom-out;backdrop-filter:blur(6px);
      animation:fadeIn .2s ease;
    `;

    const cloneImg = document.createElement('img');
    cloneImg.src = img.src;
    cloneImg.alt = img.alt;
    cloneImg.style.cssText = `
      max-width:90vw;max-height:88vh;
      border-radius:12px;
      box-shadow:0 20px 60px rgba(0,0,0,0.8);
      animation:scaleIn .25s cubic-bezier(0.4,0,0.2,1);
    `;

    const close = document.createElement('button');
    close.textContent = '✕';
    close.setAttribute('aria-label', 'Cerrar');
    close.style.cssText = `
      position:absolute;top:1.5rem;right:1.5rem;
      background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
      color:#fff;width:40px;height:40px;border-radius:50%;
      font-size:1.1rem;cursor:pointer;font-family:sans-serif;
    `;

    overlay.appendChild(cloneImg);
    overlay.appendChild(close);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const closeOverlay = () => {
      overlay.remove();
      document.body.style.overflow = '';
    };

    overlay.addEventListener('click', closeOverlay);
    close.addEventListener('click', (e) => { e.stopPropagation(); closeOverlay(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeOverlay();
    }, { once: true });
  });
});

// Lightbox keyframes via JS (since we can't add to CSS dynamically easily)
const lbStyle = document.createElement('style');
lbStyle.textContent = `
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn { from{transform:scale(.9);opacity:0} to{transform:scale(1);opacity:1} }
  .nav-link--active { color: #00d98b !important; }
`;
document.head.appendChild(lbStyle);


/* ══════════════════════════════════════
   12. PRELOAD OPTIMIZATION
══════════════════════════════════════ */
// Lazy load images with native support + fallback
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy load supported – nothing to do
} else {
  // Fallback: IntersectionObserver for older browsers
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imgObserver.observe(img));
}

console.log('✅ JAS Tampo Screen Impresores | Site loaded successfully');