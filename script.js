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
      // Slide the mobile menu from the right by toggling the translate-x-full class
      if (menu) {
        menu.classList.toggle('translate-x-full');
      }

      // Lock body scroll when menu is open
      if (menu) {
        const isHidden = menu.classList.contains('translate-x-full');
        // if menu is hidden (has translate-x-full) -> not open; when removed -> open
        if (!isHidden) {
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
});
