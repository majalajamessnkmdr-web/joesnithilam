/* ============================================================
   Joe Nithilam Farm Stay — Main JavaScript
   ============================================================ */

/* ---- Intro splash: logo zooms in from its home-page spot, holds, then zooms back ---- */
document.body.classList.add('intro-active');
const siteIntro    = document.getElementById('siteIntro');
const introLogo    = document.querySelector('.intro-logo');
const introTextGrp = document.querySelector('.intro-text-group');
const navLogo      = document.querySelector('.logo-leaf');

function placeLogoAt(rect) {
  introLogo.style.left   = rect.left + 'px';
  introLogo.style.top    = rect.top + 'px';
  introLogo.style.width  = rect.width + 'px';
  introLogo.style.height = rect.height + 'px';
}

function endIntro() {
  document.body.classList.remove('intro-active');
  if (siteIntro) siteIntro.style.display = 'none';
  setTimeout(showBookingNotice, 500);
}

/* ---- Booking ticker: a gentle scrolling note under the navbar, until the booked-till date passes ---- */
const BOOKED_TILL = new Date(2026, 9, 12, 23, 59, 59); // 12 October 2026

function showBookingNotice() {
  if (new Date() > BOOKED_TILL) return;
  try { if (sessionStorage.getItem('bookingTickerClosed') === '1') return; } catch (e) {}
  const nav = document.getElementById('navbar');
  if (!nav || nav.querySelector('.booking-ticker')) return;

  const message = `
    <span class="booking-ticker-item"><i class="fas fa-leaf" aria-hidden="true"></i>
      Thank you for the warm love! We're fully booked until <b>12th October</b> &mdash; we'd be delighted to welcome you after that. Reach out to plan ahead.
    </span>`;

  const ticker = document.createElement('div');
  ticker.className = 'booking-ticker';
  ticker.setAttribute('role', 'status');
  ticker.innerHTML = `
    <div class="booking-ticker-track">
      <div class="booking-ticker-group">${message.repeat(2)}</div>
      <div class="booking-ticker-group" aria-hidden="true">${message.repeat(2)}</div>
    </div>
    <button type="button" class="booking-ticker-close" aria-label="Close notice"><i class="fas fa-times"></i></button>
  `;
  nav.appendChild(ticker);

  ticker.querySelector('.booking-ticker-close').addEventListener('click', () => {
    ticker.classList.remove('show');
    try { sessionStorage.setItem('bookingTickerClosed', '1'); } catch (e) {}
    setTimeout(() => ticker.remove(), 500);
  });

  requestAnimationFrame(() => requestAnimationFrame(() => ticker.classList.add('show')));
}

function runIntro() {
  let alreadyPlayed = false;
  try { alreadyPlayed = sessionStorage.getItem('introPlayed') === '1'; } catch (e) {}

  if (!introLogo || !navLogo || !siteIntro || alreadyPlayed) { endIntro(); return; }

  try { sessionStorage.setItem('introPlayed', '1'); } catch (e) {}

  const homeRect = navLogo.getBoundingClientRect();
  placeLogoAt(homeRect); // start exactly where the navbar logo sits, matching its look

  requestAnimationFrame(() => {
    introLogo.classList.add('intro-anim');
    siteIntro.classList.add('intro-visible');

    requestAnimationFrame(() => {
      introLogo.classList.add('intro-logo-tinted');
      const bigSize = 190;
      placeLogoAt({
        left:   window.innerWidth  / 2 - bigSize / 2,
        top:    window.innerHeight / 2 - bigSize / 2 - 70,
        width:  bigSize,
        height: bigSize
      });

      setTimeout(() => introTextGrp && introTextGrp.classList.add('intro-text-visible'), 500);

      setTimeout(() => {
        if (introTextGrp) introTextGrp.classList.remove('intro-text-visible');
        introLogo.classList.remove('intro-logo-tinted');
        placeLogoAt(navLogo.getBoundingClientRect()); // zoom back out to the home-page logo spot
        siteIntro.classList.remove('intro-visible');

        setTimeout(endIntro, 900);
      }, 2400);
    });
  });
}

window.addEventListener('load', () => requestAnimationFrame(runIntro));

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

/* ---- Toggle / dropdown panels (expand-in-place cards) ---- */
function toggleDropdownPanel(panelId, cardId) {
  const panel = document.getElementById(panelId);
  const card  = document.getElementById(cardId);
  if (!panel || !card) return;
  const wasOpen = panel.classList.contains('open');

  document.querySelectorAll('.wellness-panel.open').forEach(openPanel => {
    if (openPanel !== panel) {
      openPanel.style.maxHeight = '0';
      openPanel.classList.remove('open');
    }
  });
  document.querySelectorAll('.wellness-toggle-card.active').forEach(openCard => {
    if (openCard !== card) openCard.classList.remove('active');
  });

  if (wasOpen) {
    panel.style.maxHeight = '0';
    panel.classList.remove('open');
    card.classList.remove('active');
  } else {
    panel.classList.add('open');
    panel.style.maxHeight = panel.scrollHeight + 40 + 'px';
    card.classList.add('active');
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
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

/* ---- Booking enquiry form: collects details and sends them as one WhatsApp message.
        Rendered inline (Contact section) and as a popup opened by Book Now / WhatsApp buttons. ---- */
const WA_NUMBER = '919884835661';

function enquiryFormHTML(p) {
  return `
    <div class="enquiry-head">
      <h3 id="${p}Title">Send a Booking Enquiry</h3>
      <p>Fill in a few details and we'll receive it on WhatsApp in one message.</p>
    </div>
    <form class="enquiry-form" novalidate>
      <div class="enquiry-field enquiry-full">
        <span class="enquiry-label">Type of visit</span>
        <div class="enquiry-choice">
          <label><input type="radio" name="visitType" value="Day trip" checked /> <span><i class="fas fa-sun"></i> Day trip</span></label>
          <label><input type="radio" name="visitType" value="Stay" /> <span><i class="fas fa-moon"></i> Stay</span></label>
        </div>
      </div>
      <div class="enquiry-field">
        <label for="${p}Name">Your name</label>
        <input type="text" id="${p}Name" data-f="name" autocomplete="name" required />
      </div>
      <div class="enquiry-field">
        <label for="${p}People">Number of people</label>
        <input type="number" id="${p}People" data-f="people" min="1" inputmode="numeric" required />
      </div>
      <div class="enquiry-field" data-f="daysField" hidden>
        <label for="${p}Days">Number of days</label>
        <input type="number" id="${p}Days" data-f="days" min="1" inputmode="numeric" />
      </div>
      <div class="enquiry-field">
        <label for="${p}Date" data-f="dateLabel">Preferred date</label>
        <input type="date" id="${p}Date" data-f="date" />
      </div>
      <div class="enquiry-field enquiry-full">
        <label for="${p}Expect">What are you looking forward to?</label>
        <textarea id="${p}Expect" data-f="expect" rows="3" placeholder="e.g. a quiet family break, kids' activities, a birthday, time in the fields..."></textarea>
      </div>
      <p class="enquiry-error enquiry-full" data-f="error" role="alert" hidden></p>
      <div class="enquiry-full">
        <button type="submit" class="btn btn-primary enquiry-submit"><i class="fab fa-whatsapp"></i> Send Enquiry on WhatsApp</button>
      </div>
    </form>`;
}

function initEnquiryForm(root) {
  const form = root.querySelector('.enquiry-form');
  const el = name => form.querySelector(`[data-f="${name}"]`);
  const radios = form.querySelectorAll('input[name="visitType"]');

  const today = new Date();
  el('date').min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  const visitType = () => form.querySelector('input[name="visitType"]:checked').value;
  function syncType() {
    const isStay = visitType() === 'Stay';
    el('daysField').hidden = !isStay;
    el('dateLabel').textContent = isStay ? 'Check-in date' : 'Preferred date';
  }
  radios.forEach(r => r.addEventListener('change', syncType));
  syncType();

  function formatDate(value) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = el('name').value.trim();
    const people = el('people').value.trim();
    const days = el('days').value.trim();
    const isStay = visitType() === 'Stay';

    const missing = [];
    form.querySelectorAll('input').forEach(i => i.classList.remove('invalid'));
    if (!name)                          { missing.push('your name');        el('name').classList.add('invalid'); }
    if (!(Number(people) >= 1))         { missing.push('number of people'); el('people').classList.add('invalid'); }
    if (isStay && !(Number(days) >= 1)) { missing.push('number of days');   el('days').classList.add('invalid'); }
    if (missing.length) {
      el('error').textContent = 'Please add ' + missing.join(', ') + '.';
      el('error').hidden = false;
      return;
    }
    el('error').hidden = true;

    const lines = [
      "Hi Joe's Nithilam! I'd like to enquire about a visit.",
      '',
      'Name: ' + name,
      'Type of visit: ' + visitType(),
      'Number of people: ' + people
    ];
    if (isStay) lines.push('Number of days: ' + days);
    if (el('date').value) lines.push((isStay ? 'Check-in date: ' : 'Preferred date: ') + formatDate(el('date').value));
    const expectation = el('expect').value.trim();
    if (expectation) lines.push('Looking forward to: ' + expectation);

    const url = `https://wa.me/${WA_NUMBER}?text=` + encodeURIComponent(lines.join('\n'));
    const win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
  });

  return {
    setType(type) {
      radios.forEach(r => { r.checked = r.value === type; });
      syncType();
    },
    // Pre-fill the interest line from the link that opened the form, without overwriting what the visitor typed
    setInterest(topic) {
      const box = el('expect');
      if (box.value && box.dataset.auto !== box.value) return;
      box.value = topic ? 'Interested in: ' + topic : '';
      box.dataset.auto = box.value;
    },
    focusFirst() { el('name').focus(); }
  };
}

(function () {
  // Inline form(s) in the Contact section
  document.querySelectorAll('[data-enquiry-inline]').forEach((box, i) => {
    box.innerHTML = enquiryFormHTML('enqInline' + i);
    initEnquiryForm(box);
  });

  // Popup form, opened by Book Now and the floating WhatsApp button
  const modal = document.createElement('div');
  modal.className = 'enquiry-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="enquiry-modal-backdrop" data-close></div>
    <div class="enquiry-box enquiry-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="enqModalTitle">
      <button type="button" class="enquiry-modal-close" aria-label="Close" data-close><i class="fas fa-times"></i></button>
      ${enquiryFormHTML('enqModal')}
    </div>`;
  document.body.appendChild(modal);
  const modalForm = initEnquiryForm(modal);
  let lastTrigger = null;

  function openModal(type, topic, trigger) {
    lastTrigger = trigger;
    if (type) modalForm.setType(type);
    modalForm.setInterest(topic);
    modal.hidden = false;
    document.body.classList.add('enquiry-open');
    requestAnimationFrame(() => modal.classList.add('show'));
    setTimeout(() => modalForm.focusFirst(), 50);
  }
  function closeModal() {
    modal.classList.remove('show');
    document.body.classList.remove('enquiry-open');
    setTimeout(() => { modal.hidden = true; }, 250);
    if (lastTrigger) lastTrigger.focus();
  }
  modal.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  // Work out the visit type and topic from the message a WhatsApp link used to carry
  function linkContext(text) {
    if (/Weekday stay/.test(text)) return { type: 'Stay', topic: 'Weekday stay' };
    if (/Weekend stay/.test(text)) return { type: 'Stay', topic: 'Weekend stay' };
    const m = text.match(/(?:plan an? |know (?:more )?about (?:the |a )?|interested in the )(.+?) at Joe/i);
    const topic = m && !/^Joe/i.test(m[1]) ? m[1] : null;
    let type = null;
    if (topic && /School|Day Trip|Kids|Family Farm Outing/i.test(topic)) type = 'Day trip';
    if (topic && /Couple|Workcation|farm stay/i.test(topic)) type = 'Stay';
    return { type, topic };
  }

  // Every WhatsApp link on the site opens the enquiry form instead
  document.addEventListener('click', (e) => {
    const link = e.target.closest(`a[href*="wa.me/${WA_NUMBER}"]`);
    if (!link) return;
    e.preventDefault();
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    const text = decodeURIComponent((link.getAttribute('href').split('text=')[1] || '').replace(/\+/g, ' '));
    const ctx = linkContext(text);
    openModal(ctx.type, ctx.topic, link);
  });
})();
