/* moment site.js
   やること：ヘッダーの背景切り替え / スマホメニュー / 現在ページの表示 / 問い合わせフォーム
   やらないこと：ローディング画面、慣性スクロール、登場アニメ */

(function () {
  'use strict';

  /* ヘッダー：スクロールで生成り色に */
  var header = document.querySelector('.site-header');
  if (header) {
    var story = document.querySelector('.story');
    var update = function () {
      var threshold = 4;
      if (document.body.classList.contains('home')) {
        threshold = story ? Math.max(40, story.offsetTop + story.offsetHeight - window.innerHeight - 40) : 40;
      }
      header.classList.toggle('is-stuck', window.scrollY > threshold);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* 導入部：スクロール量に合わせて連番画像をcanvasに描く */
  (function () {
    var story = document.querySelector('.story');
    var canvas = story && story.querySelector('.story-canvas');
    var stage = story && story.querySelector('.story-stage');
    if (!story || !canvas || !stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!document.documentElement.classList.contains('js')) return;

    var N = parseInt(story.dataset.frames, 10) || 96;
    var small = window.innerWidth < 900 || (window.devicePixelRatio > 1 && window.innerWidth < 1200);
    var base = small ? story.dataset.framesS : story.dataset.framesL;
    var frames = new Array(N);
    var loaded = 0;
    var ctx = canvas.getContext('2d', { alpha: false });
    var panels = Array.prototype.slice.call(story.querySelectorAll('.story-panel'));
    var current = -1, drawn = -1;

    function pad(i) { return String(i + 1).padStart(3, '0'); }

    function load(i, cb) {
      if (frames[i]) { cb && cb(); return; }
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () { frames[i] = img; loaded++; if (loaded >= 8) stage.classList.remove('is-loading'); cb && cb(); };
      img.onerror = function () { frames[i] = null; loaded++; cb && cb(); };
      img.src = base + pad(i) + '.webp';
    }

    // 先頭から順に、同時4本で読み込む
    stage.classList.add('is-loading');
    var next = 0;
    function pump() {
      if (next >= N) return;
      var i = next++;
      load(i, function () { if (i === current || drawn < 0) draw(); pump(); });
    }
    for (var k = 0; k < 4; k++) pump();

    function nearest(i) {
      if (frames[i]) return frames[i];
      for (var d = 1; d < N; d++) {
        if (i - d >= 0 && frames[i - d]) return frames[i - d];
        if (i + d < N && frames[i + d]) return frames[i + d];
      }
      return null;
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(stage.clientWidth * dpr);
      canvas.height = Math.round(stage.clientHeight * dpr);
      drawn = -1; draw();
    }

    function draw() {
      var img = nearest(Math.max(0, current));
      if (!img) return;
      var cw = canvas.width, ch = canvas.height;
      var s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      var w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      drawn = current;
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var top = story.offsetTop;
        var range = story.offsetHeight - window.innerHeight;
        var p = range > 0 ? (window.scrollY - top) / range : 0;
        p = Math.min(1, Math.max(0, p));
        var idx = Math.round(p * (N - 1));
        if (idx !== current) { current = idx; draw(); }
        panels.forEach(function (el) {
          var a = parseFloat(el.dataset.in), b = parseFloat(el.dataset.out);
          var on = p >= a && p < b;
          el.classList.toggle('is-on', on);
          // 出入りのときに少しだけ上下に動かす
          var mid = (a + b) / 2, half = (b - a) / 2;
          var t = Math.max(-1, Math.min(1, (p - mid) / half));
          el.style.setProperty('--shift', (-t * 14) + 'px');
        });
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    resize(); onScroll();
  })();

  /* スマホメニュー */
  var btn = document.querySelector('.menu-btn');
  if (btn && header) {
    btn.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) btn.click();
    });
  }

  /* 現在ページのナビに aria-current */
  var file = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    var target = a.getAttribute('href').split('#')[0];
    if (target === file || (file === 'development.html' && target === 'services.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* 問い合わせフォーム
     FORM_ENDPOINT を設定するとそこへ POST（Formspree 等）。
     未設定の間はメールソフトを起動する。 */
  var FORM_ENDPOINT = '';
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var val = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var body = [
      'お問い合わせ種別：' + val('type'),
      '会社名：' + val('company'),
      '氏名：' + val('name'),
      'メール：' + val('email'),
      '電話：' + val('tel'),
      '',
      val('message')
    ].join('\n');

    if (!FORM_ENDPOINT) {
      location.href = 'mailto:hello@moment-tokyo.jp'
        + '?subject=' + encodeURIComponent('【お問い合わせ】' + val('type'))
        + '&body=' + encodeURIComponent(body);
      return;
    }

    status.dataset.state = 'sending';
    status.textContent = '送信しています…';
    var submitBtn = form.querySelector('[type=submit]');
    submitBtn.disabled = true;

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function (r) {
      if (!r.ok) throw new Error('bad status');
      form.reset();
      status.dataset.state = 'done';
      status.textContent = '送信しました。2営業日以内に返信します。';
    }).catch(function () {
      status.dataset.state = 'error';
      status.textContent = '送信できませんでした。hello@moment-tokyo.jp へ直接ご連絡ください。';
    }).finally(function () {
      submitBtn.disabled = false;
    });
  });
})();
