/* =========================================================
   刘舒怡 · 心理咨询
   原生 JavaScript，无依赖
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. 导航吸顶阴影 ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 2. 滚动渐显 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 3. 照片挂载（没有 photo.jpg 时降级，不出现破图） ---------- */
  var photoEls = document.querySelectorAll('[data-photo]');
  if (photoEls.length) {
    var markMissing = function () {
      document.body.classList.add('no-photo');
    };
    photoEls.forEach(function (img) {
      if (img.complete && img.naturalWidth === 0) {
        markMissing();
      }
      img.addEventListener('error', markMissing);
    });
  }

  /* ---------- 4. 复制邮箱（手机端 mailto 可能唤不起邮件 App，这是兜底） ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('execCommand failed'));
    });
  }

  [
    { btn: 'copy-mail', hint: 'copy-hint' },
    { btn: 'copy-mail-2', hint: 'copy-hint-2' }
  ].forEach(function (pair) {
    var btn = document.getElementById(pair.btn);
    var hint = document.getElementById(pair.hint);
    if (!btn || !hint) return;

    btn.addEventListener('click', function () {
      var mail = btn.getAttribute('data-mail');
      copyText(mail)
        .then(function () {
          hint.textContent = '已复制：' + mail;
          window.setTimeout(function () { hint.textContent = ''; }, 4000);
        })
        .catch(function () {
          hint.textContent = '复制没成功，请长按选择：' + mail;
        });
    });
  });

  /* ---------- 5. 页脚年份 ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
