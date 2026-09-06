(() => {
  'use strict';

  const root = document.documentElement;
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
    themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
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
  });

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav?.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
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
