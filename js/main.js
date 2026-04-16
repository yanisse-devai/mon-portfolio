/* ============================================================
   MonPortfolio — main.js
   Vanilla JS only. No framework, no dependencies.
   ============================================================ */

/* ----------------------------------------------------------
   Utilitaire partagé — scroll reveal via IntersectionObserver
   ---------------------------------------------------------- */
function revealElements(elements) {
  if (!('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ----------------------------------------------------------
   Mobile navigation — hamburger menu
   ---------------------------------------------------------- */
(function () {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile__links a');

  if (!hamburger || !mobileMenu) return;

  // Focus trap — maintient le focus dans le menu pendant qu'il est ouvert
  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var focusable = Array.from(mobileMenu.querySelectorAll('a[href], button'));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function openMenu() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var firstLink = mobileMenu.querySelector('a');
    if (firstLink) firstLink.focus();
    document.addEventListener('keydown', trapFocus);
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus);
    hamburger.focus();
  }

  function toggleMenu() {
    if (hamburger.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close when a nav link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hamburger.classList.contains('is-open')) closeMenu();
  });
}());

/* ----------------------------------------------------------
   Dark / Light mode toggle
   ---------------------------------------------------------- */
(function () {
  var STORAGE_KEY = 'portfolio-theme';
  var html = document.documentElement;

  function getCurrentTheme() {
    return html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  var btn = document.querySelector('.nav-theme-toggle');
  if (!btn) return;

  function updateToggleLabel() {
    var isDark = getCurrentTheme() === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Activer le mode clair' : 'Activer le mode sombre');
    btn.setAttribute('aria-pressed', isDark ? 'false' : 'true');
  }

  updateToggleLabel();

  btn.addEventListener('click', function () {
    applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
    updateToggleLabel();
  });
}());

/* ----------------------------------------------------------
   Projects — load from data/projects.json
   ---------------------------------------------------------- */
(function () {
  var grid = document.getElementById('projects-grid');
  if (!grid) return;

  fetch('data/projects.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      grid.innerHTML = data.projects.map(buildCard).join('');
      revealElements(grid.querySelectorAll('.project-card'));
      var status = document.getElementById('projects-status');
      if (status) status.textContent = data.projects.length + ' projets chargés.';
    })
    .catch(function () {
      grid.innerHTML = '<p class="projects-error" role="alert">Impossible de charger les projets.</p>';
      var status = document.getElementById('projects-status');
      if (status) status.textContent = 'Erreur lors du chargement des projets.';
    });

  function buildCard(p) {
    var tags = p.tags.map(function (t) {
      return '<li class="project-card__tag">' + esc(t) + '</li>';
    }).join('');
    var attrs = p.newTab ? ' target="_blank" rel="noopener"' : '';
    var label = 'Voir le projet ' + esc(p.title) + (p.newTab ? ' (ouvre un nouvel onglet)' : '');
    var date = p.lastUpdated
      ? '<p class="project-card__date">Mis à jour le ' + formatDate(p.lastUpdated) + '</p>'
      : '';
    return (
      '<article class="project-card">' +
        '<div class="project-card__banner"></div>' +
        '<div class="project-card__body">' +
          '<h3 class="project-card__title">' + esc(p.title) + '</h3>' +
          '<p class="project-card__desc">' + esc(p.description) + '</p>' +
          date +
          '<ul class="project-card__tags">' + tags + '</ul>' +
          '<a href="' + esc(p.url) + '"' + attrs + ' class="project-card__link" aria-label="' + label + '">Voir le projet</a>' +
        '</div>' +
      '</article>'
    );
  }

  function formatDate(str) {
    var d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

}());

/* ----------------------------------------------------------
   Contact form — validation et feedback accessible
   ---------------------------------------------------------- */
(function () {
  var form = document.querySelector('.contact-form');
  var feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('contact-name');
    var email = document.getElementById('contact-email');
    var message = document.getElementById('contact-message');
    var errors = [];

    // Reset états précédents
    [name, email, message].forEach(function (field) {
      field.removeAttribute('aria-invalid');
    });
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    if (!name.value.trim()) {
      errors.push('Le champ Nom est requis.');
      name.setAttribute('aria-invalid', 'true');
    }

    if (!email.value.trim()) {
      errors.push('Le champ Email est requis.');
      email.setAttribute('aria-invalid', 'true');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      errors.push("L'adresse email n'est pas valide.");
      email.setAttribute('aria-invalid', 'true');
    }

    if (!message.value.trim()) {
      errors.push('Le champ Message est requis.');
      message.setAttribute('aria-invalid', 'true');
    }

    if (errors.length > 0) {
      feedback.textContent = errors.join(' ');
      feedback.className = 'form-feedback form-feedback--error';
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    } else {
      feedback.textContent = 'Message envoyé avec succès. Merci !';
      feedback.className = 'form-feedback form-feedback--success';
      form.reset();
    }
  });
}());

/* ----------------------------------------------------------
   Scroll reveal — sections statiques
   ---------------------------------------------------------- */
(function () {
  var SELECTOR = [
    '.section-about .container',
    '.section-projects .section-title',
    '.section-contact .container'
  ].join(', ');

  revealElements(document.querySelectorAll(SELECTOR));
}());
