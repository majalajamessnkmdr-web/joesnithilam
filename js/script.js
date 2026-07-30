/* ============================================================
   Joe Nithilam Farm Stay — Main JavaScript
   ============================================================ */

/* ---- Intro splash: big logo animation on first load ---- */
document.body.classList.add('intro-active');
const siteIntro = document.getElementById('siteIntro');
window.addEventListener('load', () => {
  setTimeout(() => {
    siteIntro.classList.add('intro-hide');
    document.body.classList.remove('intro-active');
  }, 4000);
});

/* ---- Navbar: scroll effect + active link ---- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Sticky nav style
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back-to-top visibility
  if (scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active nav link based on scroll position
  let current = '';
  document.querySelectorAll('section[id], div[id]').forEach(section => {
    const top = section.offsetTop - 120;
    if (scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

/* ---- Mobile menu toggle ---- */
hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  navbar.classList.toggle('menu-open', isOpen);
  // Keep dropdown flush under navbar regardless of navbar height
  navMenu.style.top = navbar.offsetHeight + 'px';
});

// Close menu on nav link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navbar.classList.remove('menu-open');
  });
});

// Close menu on mobile CTA click
const navMobileCta = document.querySelector('.nav-mobile-cta');
if (navMobileCta) {
  navMobileCta.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navbar.classList.remove('menu-open');
  });
}

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Back to top ---- */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- FAQ Accordion ---- */
function toggleFaq(btn) {
  const item    = btn.closest('.faq-item');
  const answer  = item.querySelector('.faq-a');
  const isOpen  = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item').forEach(fi => {
    fi.classList.remove('open');
    fi.querySelector('.faq-a').style.maxHeight = null;
  });

  // Open clicked (if it was closed)
  if (!isOpen) {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

/* ---- Gallery Lightbox ---- */
function openLightbox(el) {
  const src = el.getAttribute('data-src') || el.querySelector('img').src;
  const alt = el.querySelector('img').alt;
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  img.alt = alt;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.getElementById('lightboxImg').src = '';
  document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ---- Scroll-reveal animation ---- */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.amenity-card, .pricing-card, .special-card, .gallery-item, .testimonial-card, .faq-item, .contact-card, .stat-box'
  ).forEach((el, i) => {
    el.style.opacity  = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.08}s, transform 0.5s ease ${(i % 4) * 0.08}s`;
    observer.observe(el);
  });

  document.addEventListener('animationend', () => {}, false);
})();

document.addEventListener('DOMContentLoaded', () => {
  // Trigger re-check for elements already in viewport on load
  window.dispatchEvent(new Event('scroll'));
});

// Add revealed class styling via JS
const style = document.createElement('style');
style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
