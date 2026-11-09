(function () {
  var root = document.documentElement;
  var dark = window.matchMedia('(prefers-color-scheme: dark)');

  // Theme toggle
  document.getElementById('theme').addEventListener('click', function () {
    var cur = root.getAttribute('data-theme') || (dark.matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('pk-theme', next); } catch (e) {}
  });

  // Copy buttons
  Array.prototype.forEach.call(document.querySelectorAll('.copy'), function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-target'));
      var text = el.textContent;
      function select() {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = 'Selected';
      }
      function done() { btn.textContent = 'Copied'; }
      try {
        navigator.clipboard.writeText(text).then(done, select);
      } catch (e) { select(); }
      setTimeout(function () { btn.textContent = 'Copy'; }, 1800);
    });
  });

  // Regression sketch
  var cv = document.getElementById('fit');
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var r = rng(20270);
  var N = 64, pts = [];
  for (var i = 0; i < N; i++) {
    var x = 0.05 + 0.9 * r();
    var noise = (r() + r() + r() - 1.5) * 0.16;
    var yf = Math.min(0.96, Math.max(0.04, 0.8 - 0.62 * x + noise));
    pts.push({ x: x, yf: yf, ys: 0.06 + 0.88 * r(), d: r() * 0.35 });
  }
  var progress = reduce ? 1 : 0;
  function v(n) { return getComputedStyle(root).getPropertyValue(n).trim(); }
  function clamp(a) { return Math.max(0, Math.min(1, a)); }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function draw() {
    var dpr = window.devicePixelRatio || 1;
    var W = cv.clientWidth, H = cv.clientHeight;
    if (!W || !H) return;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var line = v('--line'), muted = v('--muted'), accent = v('--accent'), signal = v('--signal');
    var L = 30, R = 12, T = 12, B = 28, pw = W - L - R, ph = H - T - B;
    function X(x) { return L + x * pw; }
    function Y(y) { return T + y * ph; }

    ctx.lineWidth = 1; ctx.strokeStyle = line;
    for (var g = 0; g <= 4; g++) {
      ctx.beginPath(); ctx.moveTo(L, Y(g / 4)); ctx.lineTo(L + pw, Y(g / 4)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(g / 4), T); ctx.lineTo(X(g / 4), T + ph); ctx.stroke();
    }
    ctx.strokeStyle = muted; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, T + ph); ctx.lineTo(L + pw, T + ph); ctx.stroke();
    ctx.fillStyle = muted; ctx.font = '12px ' + v('--f-mono');
    ctx.fillText('y', 10, T + 10);
    ctx.fillText('x', L + pw - 8, T + ph + 20);

    // residuals
    var ra = clamp((progress - 0.85) / 0.15) * 0.45;
    if (ra > 0) {
      ctx.globalAlpha = ra; ctx.strokeStyle = muted; ctx.lineWidth = 1;
      pts.forEach(function (p) {
        var yl = 0.8 - 0.62 * p.x;
        ctx.beginPath(); ctx.moveTo(X(p.x), Y(p.yf)); ctx.lineTo(X(p.x), Y(yl)); ctx.stroke();
      });
      ctx.globalAlpha = 1;
    }

    // fit line
    var lp = ease(clamp((progress - 0.3) / 0.7));
    if (lp > 0) {
      var x0 = 0.02, x1 = 0.02 + 0.96 * lp;
      ctx.strokeStyle = signal; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(X(x0), Y(0.8 - 0.62 * x0)); ctx.lineTo(X(x1), Y(0.8 - 0.62 * x1)); ctx.stroke();
      if (lp >= 1) { ctx.fillStyle = signal; ctx.beginPath(); ctx.arc(X(x1), Y(0.8 - 0.62 * x1), 4.5, 0, 6.2832); ctx.fill(); }
    }

    // points
    ctx.fillStyle = accent;
    pts.forEach(function (p) {
      var lt = ease(clamp((progress - p.d) / 0.65));
      var y = p.ys + (p.yf - p.ys) * lt;
      ctx.globalAlpha = 0.92;
      ctx.beginPath(); ctx.arc(X(p.x), Y(y), 3.8, 0, 6.2832); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function run() {
    var t0 = null, dur = 2600;
    function step(ts) {
      if (t0 === null) t0 = ts;
      progress = clamp((ts - t0) / dur);
      draw();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  draw();
  if (!reduce) run();
  if (window.ResizeObserver) new ResizeObserver(draw).observe(cv); else window.addEventListener('resize', draw);
  new MutationObserver(draw).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  try { dark.addEventListener('change', draw); } catch (e) {}
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();
