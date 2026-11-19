(() => {
  const menu = document.querySelector('.menu');
  const summary = menu.querySelector('summary');
  document.addEventListener('click', event => {
    if (menu.open && (!menu.contains(event.target) || event.target.closest('nav a'))) {
      menu.open = false;
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      summary.focus();
    }
  });
  matchMedia('(min-width: 961px)').addEventListener('change', event => {
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

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const film = document.querySelector('.cover-film');
  if (film) setupFilm(film);
  if (!document.body.classList.contains('quiet') && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll([
      '.reveal', '.page-heading .wrap', '.ai-links', '.business-note',
      '.connections-grid article', '.foot-inquiry h2', '.offering>div', '.split-section>div',
      '.case-list .fact-list>div', '.fact-list', '.partner-grid article', '.other-intro',
      '.letter-side', '.letter-text>h2', '.chapters h3', '.officers h2', '.cooperation',
      '.legal h2', '.closing-question', '.news-list', '.end-links'
    ].join(','));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        entry.target.classList.add('entered');
      }
    }, {rootMargin:'0px 0px -3% 0px'});
    for (const el of targets) {
      el.classList.add('reveal');
      observer.observe(el);
    }
  }

  function setupFilm(video) {
    const cover = video.closest('.cover');
    const button = cover.querySelector('.film-toggle');
    const label = button.querySelector('span');
    const phone = matchMedia('(max-width: 700px)');
    let wantsPlay = !motion.matches && !navigator.connection?.saveData;
    const bounds = cover.getBoundingClientRect();
    let visible = bounds.top < innerHeight && bounds.bottom > 0;
    let source = '';
    video.muted = true;
    button.hidden = false;

    function controls() {
      const playing = !video.paused && !video.ended;
      button.classList.toggle('is-playing', playing);
      label.textContent = playing ? '一時停止' : '再生';
      button.setAttribute('aria-label', '背景動画を' + label.textContent);
    }
    function sync() {
      if (!wantsPlay || !visible || document.hidden) {
        video.pause();
        controls();
        return;
      }
      const target = phone.matches ? video.dataset.phone : video.dataset.wide;
      if (source !== target) {
        cover.classList.remove('film-ready');
        source = target;
        video.src = target;
      }
      const attempt = video.play();
      if (attempt) attempt.catch(controls);
    }
    button.addEventListener('click', () => {
      wantsPlay = video.paused;
      sync();
    });
    video.addEventListener('playing', () => {
      cover.classList.add('film-ready');
      controls();
    });
    video.addEventListener('pause', controls);
    video.addEventListener('error', () => {
      source = '';
      cover.classList.remove('film-ready');
      controls();
    });
    phone.addEventListener('change', () => {
      if (video.paused) cover.classList.remove('film-ready');
      sync();
    });
    motion.addEventListener('change', () => {
      wantsPlay = !motion.matches && !navigator.connection?.saveData;
      sync();
    });
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.16;
        sync();
      }, {threshold:[0, 0.16]});
      observer.observe(cover);
    }
    sync();
  }
})();
