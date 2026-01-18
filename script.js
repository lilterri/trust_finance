// Basic frontend script for the site
document.addEventListener('DOMContentLoaded', function () {
  console.log('Trust Finance site loaded');

  // Year filler (if present)
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Contact form submission handling (guarded)
  const form = document.getElementById('contact-form');
  const successBox = document.getElementById('success-box');

  if (form && successBox) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('hidden');
      successBox.classList.remove('hidden');
    });

    // expose resetForm to global if other code calls it
    window.resetForm = function () {
      form.reset();
      successBox.classList.add('hidden');
      form.classList.remove('hidden');
    };
  }

  // Mobile menu toggle (guarded so pages without the nav won't error)
  const btn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (btn) {
    btn.addEventListener('click', () => {
      // Toggle a platform-agnostic 'open' class which our CSS uses to drop the menu from the top
      if (menu) {
        menu.classList.toggle('open');
        const isOpen = menu.classList.contains('open');
        // reflect visibility to assistive tech and manage interactions
        menu.setAttribute('aria-hidden', (!isOpen).toString());
        if (isOpen) {
          document.body.classList.add('overflow-hidden');
        } else {
          document.body.classList.remove('overflow-hidden');
        }
      }

      if (menuIcon) menuIcon.classList.toggle('hidden');
      if (closeIcon) closeIcon.classList.toggle('hidden');

      // Update aria-expanded for accessibility
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', (!expanded).toString());
    });
  }

  // Apply Visa card dim + wave effect to any image named visa-card.png
  function applyVisaEffect() {
    try {
      const imgs = document.querySelectorAll('img[src*="visa-card.png"]');
      imgs.forEach(img => {
        // avoid double-wrapping
        if (img.closest('.visa-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'visa-wrapper';

        // preserve image sizing classes by moving the img into wrapper
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        // add classes to image for wave animation
        img.classList.add('visa-img', 'visa-wave');

        // if image had inline width/height classes, remove conflicting ones
        // (we keep object-fit via CSS)
        img.style.width = '100%';
        img.style.height = '100%';
      });
    } catch (err) {
      console.error('applyVisaEffect error', err);
    }
  }

  // run after DOM ready
  applyVisaEffect();

  // Stats counter: when the stats section scrolls into view, animate numbers that contain a '+'
  function initStatsCounter() {
    try {
      // find the stats section by looking for the "Years of Service" label (robust across markup tweaks)
      const allSections = Array.from(document.querySelectorAll('section'));
      const statsSection = allSections.find(s => /Years of Service/i.test(s.innerText));
      if (!statsSection) return;

      const candidates = Array.from(statsSection.querySelectorAll('*')).filter(el => {
        const t = el.textContent && el.textContent.trim();
        return t && /\d+[\d,\.]*\s*[A-Za-z\$\%]*\s*\+/.test(t);
      });

      if (!candidates.length) return;

      // animate a single element
      function animateEl(el) {
        if (el.dataset.animated === 'true') return;
        const text = el.textContent.trim();
        // capture prefix (non-digit), number, suffix (letters) and keep the +
        const m = text.match(/^(\D*)\s*([\d,\.]+)\s*([A-Za-z]*)\s*\+?$/);
        if (!m) return;
        const prefix = m[1] || '';
        const num = parseFloat(m[2].replace(/,/g, '')) || 0;
        const suffix = m[3] || '';

        const start = 1;
        const end = Math.max(num, 1);
        const duration = 1200 + Math.min(end, 200) * 10; // slightly scale duration for larger targets

        let startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          // easeOutQuad
          const eased = 1 - (1 - progress) * (1 - progress);
          const current = Math.floor(start + (end - start) * eased);
          // show the numeric portion and re-add prefix/suffix/plus
          el.textContent = `${prefix}${current}${suffix}+`;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.dataset.animated = 'true';
          }
        }

        requestAnimationFrame(step);
      }

      // When the stats section enters the viewport, animate all candidates once
      const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            candidates.forEach(animateEl);
            observer.disconnect();
          }
        });
      }, { threshold: 0.4 });

      obs.observe(statsSection);
    } catch (err) {
      console.error('initStatsCounter error', err);
    }
  }

  initStatsCounter();
});
