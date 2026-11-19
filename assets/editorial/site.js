(() => {
  const menu = document.querySelector('.menu');
  const toggle = menu.querySelector('summary');
  document.addEventListener('click', (event) => {
    if (menu.open && (!menu.contains(event.target) || event.target.closest('nav a'))) {
      menu.open = false;
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => {
    if (event.matches) menu.open = false;
  });

  function openLinkedChapter() {
    const target = document.getElementById(location.hash.slice(1));
    const letter = target?.closest('.full-letter');
    if (letter && !letter.open) {
      letter.open = true;
      target.scrollIntoView({ block: 'start' });
    }
  }
  openLinkedChapter();
  window.addEventListener('hashchange', openLinkedChapter);

  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches ||
      !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      entry.target.classList.add('entered');
    }
  }, { rootMargin: '0px 0px -3% 0px' });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
})();
