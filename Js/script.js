(() => {
  const root = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const nav = document.querySelector('.nav');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (systemDark ? 'dark' : 'light');

  root.dataset.theme = initialTheme;
  const updateThemeIcon = () => {
    if (!themeBtn) return;
    const dark = root.dataset.theme === 'dark';
    themeBtn.textContent = dark ? '☀' : '◐';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  };
  updateThemeIcon();

  themeBtn?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', root.dataset.theme);
    updateThemeIcon();
  });

  menuBtn?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(Boolean(open)));
  });

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav?.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const setActive = () => {
    const y = window.scrollY + 150;
    let current = sections[0]?.id;
    sections.forEach(section => { if (section.offsetTop <= y) current = section.id; });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      }), { threshold: .08 })
    : null;
  document.querySelectorAll('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('visible'));

  const dialog = document.querySelector('#project-dialog');
  const dialogImage = dialog?.querySelector('[data-dialog-image]');
  const dialogTitle = dialog?.querySelector('[data-dialog-title]');
  const dialogText = dialog?.querySelector('[data-dialog-text]');
  const dialogFile = dialog?.querySelector('[data-dialog-file]');

  const openProject = card => {
    if (!dialog) return;
    const { image, title, text, file } = card.dataset;
    if (dialogImage) { dialogImage.src = image || ''; dialogImage.alt = title || ''; }
    if (dialogTitle) dialogTitle.textContent = title || '';
    if (dialogText) dialogText.textContent = text || '';
    if (dialogFile) {
      if (file) {
        dialogFile.href = file;
        dialogFile.hidden = false;
      } else {
        dialogFile.hidden = true;
      }
    }
    dialog.showModal();
  };

  document.querySelectorAll('[data-project]').forEach(card => {
    card.setAttribute('role', 'button');
    card.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      openProject(card);
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProject(card);
      }
    });
  });

  dialog?.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', e => {
    if (e.target === dialog) dialog.close();
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
