(() => {
  'use strict';

  const root = document.documentElement;
  const isArabic = root.lang === 'ar';
  const labels = isArabic
    ? { light: '\u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0641\u0627\u062a\u062d', dark: '\u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062f\u0627\u0643\u0646', open: '\u0641\u062a\u062d \u0627\u0644\u0642\u0627\u0626\u0645\u0629', close: '\u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0642\u0627\u0626\u0645\u0629' }
    : { light: 'Switch to light mode', dark: 'Switch to dark mode', open: 'Open menu', close: 'Close menu' };
  const themeButton = document.querySelector('[data-theme-toggle]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('.nav');

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) {}
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = savedTheme || (prefersDark ? 'dark' : 'light');

  const updateThemeButton = () => {
    if (!themeButton) return;
    const dark = root.dataset.theme === 'dark';
    themeButton.querySelector('span').textContent = dark ? '☀' : '◐';
    themeButton.setAttribute('aria-label', dark ? labels.light : labels.dark);
  };
  updateThemeButton();

  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (_) {}
    updateThemeButton();
  });

  menuButton?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open') || false;
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? labels.close : labels.open);
  });

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav?.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', labels.open);
    });
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const updateActiveNav = () => {
    const marker = window.scrollY + 130;
    let current = sections[0]?.id;
    for (const section of sections) if (section.offsetTop <= marker) current = section.id;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  const dialog = document.querySelector('#project-dialog');
  const dialogImage = dialog?.querySelector('[data-dialog-image]');
  const dialogTitle = dialog?.querySelector('[data-dialog-title]');
  const dialogText = dialog?.querySelector('[data-dialog-text]');
  const dialogFile = dialog?.querySelector('[data-dialog-file]');

  const openProject = card => {
    if (!dialog) return;
    const { image = '', title = '', text = '', file = '' } = card.dataset;
    if (typeof dialog.showModal !== 'function') {
      window.open(file || image, '_blank', 'noopener');
      return;
    }
    if (dialogImage) { dialogImage.src = image; dialogImage.alt = title; }
    if (dialogTitle) dialogTitle.textContent = title;
    if (dialogText) dialogText.textContent = text;
    if (dialogFile) {
      dialogFile.hidden = !file;
      if (file) dialogFile.href = file;
    }
    dialog.showModal();
  };

  document.querySelectorAll('[data-project]').forEach(card => {
    card.setAttribute('role', 'button');
    card.addEventListener('click', event => {
      if (!event.target.closest('a')) openProject(card);
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProject(card);
      }
    });
  });

  dialog?.querySelectorAll('[data-dialog-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
