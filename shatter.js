
/* ============================================================
   shatter.js — shared page-transition + page-load animation
   Include in every page's <body> (before </body>).
   ============================================================ */
(function () {

  /* ── Inject CSS ─────────────────────────────────────────── */
  var style = document.createElement("style");
  style.textContent = `
    #code-canvas {
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 9998; background: black;
      opacity: 1;
      transition: opacity 0.6s ease;
      pointer-events: none;
    }
    #code-canvas.hidden { opacity: 0; }

    #shard-container {
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 9999; pointer-events: none; display: none;
    }
    .shard {
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      background-size: cover;
      transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    }
    .shard:nth-child(1) { clip-path: polygon(0 0, 50% 0, 30% 50%, 0 60%); }
    .shard:nth-child(2) { clip-path: polygon(50% 0, 100% 0, 100% 60%, 60% 40%, 30% 50%); }
    .shard:nth-child(3) { clip-path: polygon(0 60%, 30% 50%, 60% 40%, 40% 100%, 0 100%); }
    .shard:nth-child(4) { clip-path: polygon(60% 40%, 100% 60%, 100% 100%, 40% 100%); }
    .shard.exploded:nth-child(1) { transform: translate(-120px, -120px) rotate(-25deg) scale(1.15); }
    .shard.exploded:nth-child(2) { transform: translate(120px, -120px) rotate(25deg) scale(1.15); }
    .shard.exploded:nth-child(3) { transform: translate(-120px, 120px) rotate(25deg) scale(1.15); }
    .shard.exploded:nth-child(4) { transform: translate(120px, 120px) rotate(-25deg) scale(1.15); }

    /* Splash Overlay */
    #splash-overlay {
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      background: black;
      z-index: 10000;
      display: flex; justify-content: center; align-items: center;
      cursor: pointer;
      color: #0f0;
      font-family: 'Courier New', Courier, monospace;
      text-align: center;
      transition: opacity 0.5s ease;
    }
    #splash-overlay h1 {
      font-size: 2.22rem;
      letter-spacing: 4px;
      text-shadow: 0 0 10px #0f0;
      animation: pulse 1.5s infinite;
      margin-top: 15px;
    }
    .splash-img {
      width: 155px;
      height: 155px;
      border-radius: 50%;
      border: 3px solid #0f0;
      box-shadow: 0 0 20px #0f0;
      object-fit: cover;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { opacity: 0.6; transform: scale(0.98); }
      50% { opacity: 1; transform: scale(1.02); }
      100% { opacity: 0.6; transform: scale(0.98); }
    }
    #splash-overlay.hidden { opacity: 0; pointer-events: none; }
  `;
  document.head.appendChild(style);

  /* ── Inject overlay HTML ────────────────────────────────── */
  var shardContainer = document.createElement("div");
  shardContainer.id = "shard-container";
  document.body.appendChild(shardContainer);

  var canvas = document.createElement("canvas");
  canvas.id = "code-canvas";
  document.body.appendChild(canvas);

  var splash = document.createElement("div");
  splash.id = "splash-overlay";
  splash.style.display = "none";
  splash.innerHTML = "<div><img src='splash-image.png' class='splash-img'><br><h1>CLICK TO SEE WEBSITE</h1><p style='color: #050; font-size: 0.8rem; letter-spacing: 2px;'>[ SYSTEM_AUTHENTICATED ]</p></div>";
  document.body.appendChild(splash);

  document.querySelectorAll("#shard-container").forEach(function (el, i) { if (i > 0) el.remove(); });
  document.querySelectorAll("#code-canvas").forEach(function (el, i)     { if (i > 0) el.remove(); });
  document.querySelectorAll("#splash-overlay").forEach(function (el, i)  { if (i > 0) el.remove(); });

  /* ── Inject & preload audio ──────────────────────────────── */
  var snd = document.getElementById("shatter-audio");
  if (!snd) {
    snd = document.createElement("audio");
    snd.id = "shatter-audio";
    snd.src = "hackertype-fx-sound (1).wav";
    document.body.appendChild(snd);
  }
  snd.preload = "auto";
  snd.load();

  /* ── Matrix rain core ─────────────────────────────────── */
  var ctx = canvas.getContext("2d");
  var matrixInterval = null;
  var isAnimating    = false;
  var fontSize       = 16;
  var columns, drops;
  var characters = "\\#$!@&^*%#*#%^%##$$#^ε█N◙+↓╖¡i┤û▐┤▐140τl∞Φ∞xLB7_+";

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (var x = 0; x < columns; x++) drops[x] = 1;
  }

  function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";
    for (var i = 0; i < drops.length; i++) {
      var text = characters.charAt(Math.floor(Math.random() * characters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  /* ── Start the intro animation ──────────────────────────── */
  function startIntro() {
    resizeCanvas();
    drawMatrix();
    matrixInterval = setInterval(drawMatrix, 33);

    var s = document.getElementById("shatter-audio");
    if (s) { s.currentTime = 0; s.play().catch(function () {}); }

    setTimeout(function () {
      clearInterval(matrixInterval);
      matrixInterval = null;
      canvas.style.transition = "";
      canvas.classList.add("hidden");
      setTimeout(function () {
        canvas.style.display = "none";
      }, 650);
    }, 1500);
  }

  /* ── Page-LOAD intro animation ──────────────────────────── */
  function playIntro() {
    if (sessionStorage.getItem("shatter-nav")) {
      sessionStorage.removeItem("shatter-nav");
      canvas.style.transition = "none";
      canvas.style.opacity    = "0";
      canvas.style.display    = "none";
      return;
    }

    /* Show splash screen to unlock audio on refresh */
    splash.style.display = "flex";
    splash.addEventListener("click", function() {
      splash.classList.add("hidden");
      setTimeout(function() {
        splash.style.display = "none";
      }, 500);
      startIntro();
    }, { once: true });
  }

  /* ── Exit shatter & navigate ─────────────────────────────── */
  function triggerShatter(url) {
    clearInterval(matrixInterval);
    matrixInterval = null;

    var dataUrl = canvas.toDataURL();

    var sc = document.getElementById("shard-container");
    sc.style.display = "block";
    sc.innerHTML = "";
    for (var i = 0; i < 4; i++) {
      var shard = document.createElement("div");
      shard.className = "shard";
      shard.style.backgroundImage = "url(" + dataUrl + ")";
      sc.appendChild(shard);
    }

    canvas.style.display = "none";
    void sc.offsetWidth;

    sc.querySelectorAll(".shard").forEach(function (s) {
      s.classList.add("exploded");
    });

    sessionStorage.setItem("shatter-nav", "1");

    setTimeout(function () {
      window.location.href = url;
    }, 900);
  }

  /* ── Wire up nav links ────────────────────────────────────── */
  function wireLinks() {
    document.querySelectorAll("a.shatter-link").forEach(function (btn) {
      if (btn.dataset.shatterBound) return;
      btn.dataset.shatterBound = "1";

      btn.addEventListener("click", function (e) {
        var href = this.getAttribute("href");
        if (!href || href === "#" || href.startsWith("javascript")) return;
        if (isAnimating) return;

        e.preventDefault();
        isAnimating = true;
        var targetUrl = this.href;

        canvas.style.transition = "none";
        canvas.style.opacity    = "1";
        canvas.style.display    = "block";
        canvas.classList.remove("hidden");
        resizeCanvas();
        drawMatrix();
        matrixInterval = setInterval(drawMatrix, 33);

        var s = document.getElementById("shatter-audio");
        if (s) { s.currentTime = 0; s.play().catch(function () {}); }

        setTimeout(function () {
          triggerShatter(targetUrl);
        }, 1800);
      });
    });
  }

  /* ── Kick everything off ─────────────────────────────────── */
  function init() {
    wireLinks();
    playIntro();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
