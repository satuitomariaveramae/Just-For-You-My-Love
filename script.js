/* =========================================
   ROMANTIC ANNIVERSARY WEBSITE — script.js
   ========================================= */

/* ===== CONSTANTS ===== */
const CORRECT_CODE     = "061325";
const ANNIVERSARY_DATE = new Date("2025-06-13T00:00:00");

/* ===== DOM REFS ===== */
const lockScreen  = document.getElementById("lockScreen");
const mainSite    = document.getElementById("mainSite");
const codeInput   = document.getElementById("codeInput");
const lockError   = document.getElementById("lockError");
const unlockBtn   = null;
const lockCard    = document.getElementById("lockCard");

/* ============================================================
   FLOATING HEARTS
   Generates random floating emoji hearts for both lock
   screen and main site.
   ============================================================ */
function createFloatingHearts(containerId, count = 18) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const emojis = ["❤️", "💕", "💗", "💖", "🌸", "✨", "💝", "💓"];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "float-heart";

    const x        = Math.random() * 100;
    const size     = 12 + Math.random() * 20;
    const duration = 8  + Math.random() * 12;
    const delay    = Math.random() * 8;
    const opacity  = 0.4 + Math.random() * 0.5;
    const emoji    = emojis[Math.floor(Math.random() * emojis.length)];

    el.textContent = emoji;
    el.style.cssText = `
      left: ${x}%;
      font-size: ${size}px;
      opacity: ${opacity};
      --dur: ${duration}s;
      --delay: ${delay}s;
    `;

    container.appendChild(el);
  }
}

/* ============================================================
   SPARKLES
   Generates twinkling star dots for both screens.
   ============================================================ */
function createSparkles(containerId, count = 30) {
  // For lock screen we reuse the same .sparkles-container
  // For main site we also have one
  const containers = document.querySelectorAll(".sparkles-container");
  if (!containers.length) return;

  containers.forEach((container) => {
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("div");
      dot.className = "sparkle-dot";

      const x        = Math.random() * 100;
      const y        = Math.random() * 100;
      const size     = 2 + Math.random() * 4;
      const duration = 2 + Math.random() * 3;
      const delay    = Math.random() * 4;

      dot.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, #ffd700, #ffb347, transparent);
        box-shadow: 0 0 ${size * 2}px ${size}px rgba(255,215,0,0.28);
        --dur: ${duration}s;
        --delay: ${delay}s;
      `;

      container.appendChild(dot);
    }
  });
}

/* ============================================================
   LOCK SCREEN LOGIC — Glassmorphism Heart PIN
   ============================================================ */

let keypadValue = "";

/* Update the 6 heart slots based on current input */
function updateDisplay() {
  const slots = document.querySelectorAll(".pin-slot");
  slots.forEach((slot, i) => {
    const heart = slot.querySelector(".pin-heart");
    const digit = slot.querySelector(".pin-digit");
    if (i < keypadValue.length) {
      slot.classList.add("filled");
      digit.textContent = keypadValue[i];
    } else {
      slot.classList.remove("filled", "pop");
      digit.textContent = "";
    }
  });
}

/* Animate the newly filled slot */
function popSlot(idx) {
  const slot = document.querySelector(`.pin-slot[data-idx="${idx}"]`);
  if (!slot) return;
  slot.classList.remove("pop");
  void slot.offsetWidth; // reflow
  slot.classList.add("pop");
}

function handleUnlock() {
  if (keypadValue === CORRECT_CODE) {
    lockError.classList.add("hidden");
    lockScreen.classList.add("fade-out");
    setTimeout(() => {
      lockScreen.classList.add("hidden");
      mainSite.classList.remove("hidden");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { mainSite.classList.add("visible"); });
      });
      initMainSite();
    }, 900);
  } else {
    lockError.classList.remove("hidden");
    lockCard.classList.add("shake");
    keypadValue = "";
    updateDisplay();
    setTimeout(() => lockCard.classList.remove("shake"), 600);
  }
}

// Heart key buttons
document.querySelectorAll(".heart-key:not(.keypad-backspace)").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (keypadValue.length >= 6) return;
    keypadValue += btn.dataset.val;
    popSlot(keypadValue.length - 1);
    updateDisplay();
    lockError.classList.add("hidden");
    if (keypadValue.length === 6) setTimeout(handleUnlock, 320);
  });
});

// Keep stubs so no JS errors
codeInput.addEventListener("keydown", () => {});
codeInput.addEventListener("input", () => {});

/* ============================================================
   LIVE ANNIVERSARY COUNTER
   ============================================================ */
function updateCounter() {
  const now  = new Date();
  const diff = now.getTime() - ANNIVERSARY_DATE.getTime();

  if (diff < 0) {
    // Countdown mode — counting down to anniversary
    const absDiff = Math.abs(diff);
    const d = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const h = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((absDiff % (1000 * 60)) / 1000);

    setCounter(d, h, m, s);
  } else {
    // Count-up mode — how long together
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    setCounter(d, h, m, s);
  }
}

function setCounter(d, h, m, s) {
  document.getElementById("cDays").textContent    = String(d).padStart(2, "0");
  document.getElementById("cHours").textContent   = String(h).padStart(2, "0");
  document.getElementById("cMinutes").textContent = String(m).padStart(2, "0");
  document.getElementById("cSeconds").textContent = String(s).padStart(2, "0");
}

/* ============================================================
   SCROLL REVEAL
   Uses IntersectionObserver to animate elements into view
   as the user scrolls.
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger children inside same parent
          const siblings = entry.target.parentElement.querySelectorAll(".reveal");
          let delay = 0;

          siblings.forEach((sib, i) => {
            if (sib === entry.target) delay = i * 80;
          });

          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ============================================================
   INIT MAIN SITE
   Called once lock screen is dismissed. Shows Hero.
   ============================================================ */
function initMainSite() {
  initScrollReveal();
  createFloatingHearts("floatingHearts", 18);

  // Tap to Begin -> Thank You overlay
  const tapBeginBtn = document.getElementById("tapBeginBtn");
  if (tapBeginBtn) {
    tapBeginBtn.addEventListener("click", () => {
      const overlay = document.getElementById("thankyouOverlay");
      const card    = document.getElementById("thankyouCard");
      if (!overlay || !card) return;

      overlay.classList.remove("hidden");
      requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("active")));
      setTimeout(() => card.classList.add("popped"), 800);

      const continueBtn = document.getElementById("thankyouContinueBtn");
      if (continueBtn) {
        continueBtn.addEventListener("click", () => {
          // Immediately hide the hero content so tap-to-begin never flashes
          const heroContent = document.getElementById("heroContent");
          if (heroContent) heroContent.style.visibility = "hidden";

          overlay.classList.remove("active");
          // Hide mainSite (hero) so it never shows behind countdown/menu
          mainSite.classList.remove("visible");
          setTimeout(() => {
            overlay.classList.add("hidden");
            mainSite.classList.add("hidden");
            if (heroContent) heroContent.style.visibility = "";
            showCountdownScreen();
          }, 600);
        }, { once: true });
      }
    });
  }

}

/* ============================================================
   COUNTDOWN SCREEN
   Full-screen 5s count-up, pause, grain fade → Menu.
   ============================================================ */
function showCountdownScreen() {
  const screen = document.getElementById("countdownScreen");
  if (!screen) return;

  createFloatingHearts("floatingHeartsCountdown", 14);
  screen.classList.remove("hidden");
  requestAnimationFrame(() => requestAnimationFrame(() => screen.classList.add("fullscreen-visible")));

  startCountUp(() => {
    // Show caption
    const caption = document.getElementById("countdownCaption");
    if (caption) {
      caption.style.transition = "opacity 0.8s ease";
      caption.style.opacity = "1";
    }
    // Pause 2.5s, then grain fade to menu
    setTimeout(() => grainFadeToMenu(), 2500);
  });
}

/* Grain/film-burn transition then show menu */
function grainFadeToMenu() {
  const screen  = document.getElementById("countdownScreen");
  const grain   = document.getElementById("grainOverlay");

  // Animate grain in
  grain.classList.add("grain-active");

  setTimeout(() => {
    // At peak grain — swap screens
    showMenuScreen();
    setTimeout(() => {
      grain.classList.remove("grain-active");
    }, 600);
  }, 700);
}

/* ============================================================
   MENU SCREEN
   Full-screen menu.
   ============================================================ */
function showMenuScreen() {
  const countdownScr = document.getElementById("countdownScreen");
  const menuScr      = document.getElementById("menuScreen");
  if (!menuScr) return;

  if (countdownScr) {
    countdownScr.classList.add("hidden");
    countdownScr.classList.remove("fullscreen-visible");
  }

  createFloatingHearts("floatingHeartsMenu", 14);
  menuScr.classList.remove("hidden");
  requestAnimationFrame(() => requestAnimationFrame(() => menuScr.classList.add("fullscreen-visible")));
}

/* ============================================================
   ALBUM ROSE PETALS
   ============================================================ */
function spawnAlbumPetals() {
  const container = document.getElementById("albumPetals");
  if (!container) return;
  const petals = ["🌸","🌺","🌷","🌹","💕","❤️"];
  for (let i = 0; i < 16; i++) {
    const el  = document.createElement("div");
    el.className = "album-petal";
    const px  = Math.random() * 100;
    const ps  = (11 + Math.random() * 13).toFixed(1) + "px";
    const pd  = (7  + Math.random() * 9 ).toFixed(1) + "s";
    const pdl = (Math.random() * 12).toFixed(1) + "s";
    const sway= ((Math.random() - 0.5) * 90).toFixed(1) + "px";
    el.textContent = petals[Math.floor(Math.random() * petals.length)];
    el.style.cssText = `--px:${px}%;--ps:${ps};--pd:${pd};--pdl:${pdl};--sway:${sway};`;
    container.appendChild(el);
  }
}

/* ============================================================
   COLLAGE SURPRISE
   Builds a masonry polaroid collage of all 65 photos,
   revealed after the last photo is swiped.
   ============================================================ */
function buildCollage(cards) {
  const overlay  = document.getElementById("collageOverlay");
  const grid     = document.getElementById("collageGrid");
  const closeBtn = document.getElementById("collageClose");

  if (!overlay || !grid) return;

  // Aspect ratio pool — varied heights make it feel like a real collage
  const arPool = ["3/4","4/5","1/1","4/3","3/5","2/3"];
  // Subtle rotations for polaroid feel
  const rotPool = ["-2.5deg","-1.5deg","0deg","1deg","2deg","2.8deg","-0.8deg","1.8deg"];

  // Build grid items from all album cards
  cards.forEach((card, i) => {
    const srcImg = card.querySelector("img");
    if (!srcImg) return;

    const item = document.createElement("div");
    item.className = "collage-item";
    const ar = arPool[i % arPool.length];
    const cr = rotPool[i % rotPool.length];
    item.style.setProperty("--ar", ar);
    item.style.setProperty("--cr", cr);

    const img = document.createElement("img");
    img.src     = srcImg.src;
    img.alt     = srcImg.alt;
    img.loading = "lazy";
    img.style.aspectRatio = ar;

    item.appendChild(img);
    grid.appendChild(item);
  });

  // Scatter decorative petals behind the collage
  const pEmojis = ["🌸","🌺","🌷","✦","💕","🌹","❤️","✿"];
  for (let p = 0; p < 18; p++) {
    const pe = document.createElement("div");
    pe.className = "collage-petal";
    const cps = (14 + Math.random() * 18).toFixed(0) + "px";
    const cpx = (Math.random() * 100).toFixed(1) + "%";
    const cpy = (Math.random() * 100).toFixed(1) + "%";
    const cpo = (0.12 + Math.random() * 0.22).toFixed(2);
    const cpr = (Math.random() * 360).toFixed(0) + "deg";
    pe.textContent = pEmojis[Math.floor(Math.random() * pEmojis.length)];
    pe.style.cssText = `--cps:${cps};--cpx:${cpx};--cpy:${cpy};--cpo:${cpo};--cpr:${cpr};`;
    overlay.appendChild(pe);
  }

  // Show overlay + blur the main site behind it
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  const mainSiteEl = document.getElementById("panel-album");
  if (mainSiteEl) mainSiteEl.classList.add("collage-blur");

  // Stagger pop-in of each item
  const items = grid.querySelectorAll(".collage-item");
  items.forEach((item, i) => {
    setTimeout(() => item.classList.add("popped"), 60 + i * 28);
  });

  // Close / back button
  closeBtn.addEventListener("click", () => {
    // Fade out collage
    overlay.style.transition = "opacity 0.5s ease";
    overlay.style.opacity = "0";

    // Fade out music smoothly
    const audioEl = document.getElementById("albumAudio");
    if (audioEl && !audioEl.paused) {
      let vol = audioEl.volume;
      const fadeOut = setInterval(() => {
        vol = Math.max(0, vol - 0.04);
        audioEl.volume = vol;
        if (vol <= 0) {
          clearInterval(fadeOut);
          audioEl.pause();
          audioEl.volume = 0;
          // Hide mute btn
          const muteBtn = document.getElementById("albumMuteBtn");
          if (muteBtn) muteBtn.classList.add("hidden");
        }
      }, 60);
    }

    setTimeout(() => {
      overlay.classList.add("hidden");
      overlay.style.opacity = "";
      overlay.style.transition = "";
      document.body.style.overflow = "";
      // Remove blur from album panel
      if (mainSiteEl) mainSiteEl.classList.remove("collage-blur");
      // Go back to menu
      closeAllPanels();
    }, 520);
  }, { once: true });
}

/* ============================================================
   PHOTO ALBUM
   Swipeable polaroid album with music trigger on first swipe.
   ============================================================ */
function initPhotoAlbum() {
  const TOTAL       = 65;
  const track       = document.getElementById("albumTrack");
  if (!track || track.dataset.albumInit) return;
  track.dataset.albumInit = "1";
  const dotsWrap    = document.getElementById("albumDots");
  const counterEl   = document.getElementById("albumCounter");
  const hintEl      = document.getElementById("albumHint");
  const muteBtn     = document.getElementById("albumMuteBtn");
  const muteIcon    = document.getElementById("albumMuteIcon");
  const fallbackBtn = document.getElementById("albumPlayFallback");
  const audio       = document.getElementById("albumAudio");

  if (!track) return;

  let current       = 0;
  let musicStarted  = false;
  let isMuted       = false;
  let isAnimating   = false;
  let collageShown  = false;

  // Spawn rose petals
  spawnAlbumPetals();

  // Build dots
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement("button");
    dot.className = "album-dot" + (i === 0 ? " active-dot" : "");
    dot.setAttribute("aria-label", "Photo " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  }

  // Instagram-style: show 5 dots, slide window as current changes
  const VISIBLE = 5;

  function updateDots() {
    const dots = dotsWrap.querySelectorAll(".album-dot");
    const half  = Math.floor(VISIBLE / 2); // 2

    // Determine window start so active dot stays centered (clamped at edges)
    let winStart = current - half;
    winStart = Math.max(0, Math.min(TOTAL - VISIBLE, winStart));
    const winEnd = winStart + VISIBLE - 1;

    dots.forEach((d, i) => {
      const inWindow = i >= winStart && i <= winEnd;
      d.style.display = inWindow ? "" : "none";

      d.classList.remove("active-dot", "near-dot", "far-dot");
      if (!inWindow) return;

      const dist = Math.abs(i - current);
      if (dist === 0)      d.classList.add("active-dot");
      else if (dist === 1) d.classList.add("near-dot");
      else                 d.classList.add("far-dot");
    });
  }

  function updateCounter() {
    counterEl.textContent = (current + 1) + " / " + TOTAL;
  }

  // Navigate to a specific index
  function goTo(next, direction) {
    if (next === current || isAnimating) return;
    if (next < 0 || next >= TOTAL) return;

    isAnimating = true;

    const cards    = track.querySelectorAll(".album-card");
    const currCard = cards[current];
    const nextCard = cards[next];

    // Determine swipe direction if not specified
    const dir = direction !== undefined ? direction : (next > current ? "left" : "right");

    // Remove float animation from current
    currCard.style.animation = "none";

    // Set starting position for incoming card
    nextCard.classList.remove("active", "exit-left", "exit-right");
    nextCard.style.transition = "none";
    nextCard.style.opacity    = "0";
    nextCard.style.transform  = dir === "left"
      ? "translateX(70px) scale(0.92)"
      : "translateX(-70px) scale(0.92)";

    // Force reflow
    void nextCard.offsetWidth;

    // Exit current card
    currCard.classList.add(dir === "left" ? "exit-left" : "exit-right");
    currCard.classList.remove("active");

    // Enter next card
    nextCard.style.transition = "";
    nextCard.style.opacity    = "";
    nextCard.style.transform  = "";
    nextCard.classList.add("active");

    // Hide first-photo overlay if swiping away from it
    if (current === 0) {
      const overlay = currCard.querySelector(".album-first-overlay");
      if (overlay) overlay.classList.add("hidden-overlay");
      // Fade hint
      hintEl.classList.add("fade-away");
      // Trigger music on first swipe
      triggerMusic();
    }

    current = next;
    updateDots();
    updateCounter();

    // If we just landed on the LAST photo, show collage surprise after a moment
    if (current === TOTAL - 1 && !collageShown) {
      collageShown = true;
      setTimeout(() => {
        const allCards = track.querySelectorAll(".album-card");
        buildCollage(Array.from(allCards));
      }, 900);
    }

    setTimeout(() => {
      currCard.classList.remove("exit-left", "exit-right");
      currCard.style.animation = "";
      isAnimating = false;
    }, 460);
  }

  function goNext() { goTo(current + 1, "left"); }
  function goPrev() { goTo(current - 1, "right"); }

  /* ── Music ── */
  function startAudioFade() {
    audio.volume = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Fade volume up over ~2.5 s
        let vol = 0;
        const step = () => {
          vol = Math.min(vol + 0.02, 0.85);
          audio.volume = vol;
          if (vol < 0.85) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        muteBtn.classList.remove("hidden");
        fallbackBtn.classList.add("hidden");
      }).catch(() => {
        // Autoplay blocked — show fallback
        fallbackBtn.classList.remove("hidden");
      });
    }
  }

  function triggerMusic() {
    if (musicStarted) return;
    musicStarted = true;
    startAudioFade();
  }

  // Mute toggle
  muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    audio.muted = isMuted;
    muteIcon.textContent = isMuted ? "🔇" : "🔊";
  });

  // Fallback play button
  fallbackBtn.addEventListener("click", () => {
    startAudioFade();
    fallbackBtn.classList.add("hidden");
  });

  /* ── Touch / Mouse swipe ── */
  let startX = 0;
  let startY = 0;
  let dragging = false;
  const SWIPE_THRESHOLD = 48;

  track.addEventListener("touchstart", (e) => {
    startX   = e.touches[0].clientX;
    startY   = e.touches[0].clientY;
    dragging = true;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      dx < 0 ? goNext() : goPrev();
    }
  }, { passive: true });

  // Mouse drag for desktop
  track.addEventListener("mousedown", (e) => {
    startX   = e.clientX;
    dragging = true;
    e.preventDefault();
  });

  window.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      dx < 0 ? goNext() : goPrev();
    }
  });

  // Keyboard arrows
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft")  goPrev();
  });

  // Init counter display
  updateCounter();
}


/* ============================================================
   COUNT-UP ANIMATION
   Numbers animate from 0 to real value, then menu appears.
   ============================================================ */
function startCountUp(onComplete) {
  const now  = new Date();
  const diff = Math.abs(now.getTime() - ANNIVERSARY_DATE.getTime());

  const targetD = Math.floor(diff / (1000 * 60 * 60 * 24));
  const targetH = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const targetM = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const targetS = Math.floor((diff % (1000 * 60)) / 1000);

  const duration = 5000; // 5 seconds
  const start    = performance.now();

  function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

  function frame(now2) {
    const elapsed = now2 - start;
    const progress = Math.min(elapsed / duration, 1);
    const e = ease(progress);

    document.getElementById("cDays").textContent    = String(Math.floor(e * targetD)).padStart(2,"0");
    document.getElementById("cHours").textContent   = String(Math.floor(e * targetH)).padStart(2,"0");
    document.getElementById("cMinutes").textContent = String(Math.floor(e * targetM)).padStart(2,"0");
    document.getElementById("cSeconds").textContent = String(Math.floor(e * targetS)).padStart(2,"0");

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      // Settle on real values
      setCounter(targetD, targetH, targetM, targetS);
      // Start live ticking
      setInterval(updateCounter, 1000);
      // Call the completion callback
      if (typeof onComplete === "function") onComplete();
    }
  }

  requestAnimationFrame(frame);
}

/* ============================================================
   PANEL NAVIGATION
   ============================================================ */
const PANELS   = ["panel-timeline","panel-album","panel-reasons","panel-letter","panel-future"];

function openPanel(panelId) {
  // Fade out and hide menu screen
  const menuScr = document.getElementById("menuScreen");
  if (menuScr) {
    menuScr.style.transition = "opacity 0.5s ease";
    menuScr.style.opacity = "0";
    setTimeout(() => { menuScr.classList.add("hidden"); menuScr.style.opacity = ""; menuScr.style.transition = ""; }, 500);
  }

  // Hide all panels first
  PANELS.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.add("hidden"); el.classList.remove("panel-active"); }
  });

  // Show target panel
  setTimeout(() => {
    const panel = document.getElementById(panelId);

    if (panel) {
      panel.classList.remove("hidden");
      requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add("panel-active")));
    }

    // If photo album, init it
    if (panelId === "panel-album") initPhotoAlbum();

    // If reasons, init interactive cards
    if (panelId === "panel-reasons") initReasons();

    // Re-run scroll reveal for newly visible elements
    initScrollReveal();
  }, 520);
}

function closeAllPanels() {
  PANELS.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove("panel-active"); setTimeout(() => el.classList.add("hidden"), 400); }
  });

  // Show menu screen again
  const menuScr = document.getElementById("menuScreen");
  setTimeout(() => {
    if (menuScr) {
      menuScr.style.opacity = "0";
      menuScr.classList.remove("hidden");
      menuScr.classList.add("fullscreen-visible");
      requestAnimationFrame(() => {
        menuScr.style.transition = "opacity 0.6s ease";
        menuScr.style.opacity = "1";
        setTimeout(() => { menuScr.style.transition = ""; }, 700);
      });
    }
  }, 420);
}

/* ============================================================
   REASONS — INTERACTIVE CARD FLIP
   ============================================================ */
const REASONS = [
  "I love the way you laugh because it always makes me smile",
  "You always know how to make me feel better",
  "Your voice makes me feel calm and happy",
  "I love holding your hand because it feels safe",
  "You make every day special, even the simple ones",
  "I love how you cook delicious food for me",
  "The texts you send just to say you're thinking of me",
  "How safe I feel when I'm with you",
  "Your smile that fixes everything",
  "I love you simply because you are yourself, and that's enough for me"
];

let rIndex      = 0;
let rFlipped    = false;
let rRevealed   = new Array(REASONS.length).fill(false);
let rInited     = false;

function rSetCard(idx, direction) {
  const card      = document.getElementById("rcard");
  const cardWrap  = document.getElementById("rcardWrap");
  const numEl     = document.getElementById("rcardNum");
  const textEl    = document.getElementById("rcardText");
  const prevBtn   = document.getElementById("rprev");
  const nextBtn   = document.getElementById("rnext");
  const finishEl  = document.getElementById("reasonsFinish");
  const dots      = document.querySelectorAll(".rdot");

  rFlipped = false;
  card.classList.remove("flipped");
  cardWrap.classList.remove("enter-right", "enter-left");
  void cardWrap.offsetWidth;
  cardWrap.classList.add(direction === "right" ? "enter-right" : "enter-left");

  rIndex = idx;
  numEl.textContent     = idx + 1;
  textEl.textContent    = REASONS[idx];

  prevBtn.disabled = idx === 0;
  nextBtn.disabled = idx === REASONS.length - 1 && !rRevealed[idx];

  dots.forEach((d, i) => {
    d.classList.remove("rdot-active", "rdot-done");
    if (i === idx)          d.classList.add("rdot-active");
    else if (rRevealed[i])  d.classList.add("rdot-done");
  });

  if (rRevealed.every(Boolean)) finishEl.classList.remove("hidden");
}

function rFlipCard() {
  if (rFlipped) return;
  const card     = document.getElementById("rcard");
  const nextBtn  = document.getElementById("rnext");
  const finishEl = document.getElementById("reasonsFinish");
  const dots     = document.querySelectorAll(".rdot");

  rFlipped = true;
  card.classList.add("flipped");
  rRevealed[rIndex] = true;
  dots[rIndex].classList.add("rdot-done");
  nextBtn.disabled = rIndex === REASONS.length - 1;
  if (rRevealed.every(Boolean)) {
    setTimeout(() => finishEl.classList.remove("hidden"), 700);
  }
}

function initReasons() {
  const card     = document.getElementById("rcard");
  const finishEl = document.getElementById("reasonsFinish");
  if (!card) return;

  // Reset state every time panel opens
  rIndex    = 0;
  rFlipped  = false;
  rRevealed = new Array(REASONS.length).fill(false);
  finishEl.classList.add("hidden");

  if (!rInited) {
    rInited = true;

    const cardWrap = document.getElementById("rcardWrap");

    // Click (desktop) + touchend (mobile) — both needed
    cardWrap.addEventListener("click", rFlipCard);
    cardWrap.addEventListener("touchend", (e) => {
      e.preventDefault(); // prevent ghost click on mobile
      rFlipCard();
    }, { passive: false });

    document.getElementById("rprev").addEventListener("click", () => {
      if (rIndex > 0) rSetCard(rIndex - 1, "left");
    });
    document.getElementById("rnext").addEventListener("click", () => {
      if (rIndex < REASONS.length - 1) rSetCard(rIndex + 1, "right");
    });
    document.querySelectorAll(".rdot").forEach((dot, i) => {
      dot.addEventListener("click", () => {
        if (i !== rIndex) rSetCard(i, i > rIndex ? "right" : "left");
      });
    });

    spawnReasonsPetals();
  }

  rSetCard(0, "right");
}

function spawnReasonsPetals() {
  const container = document.getElementById("reasonsPetals");
  if (!container) return;
  const petals = ["🌸","🌺","✿","❀","🌼"];
  for (let i = 0; i < 10; i++) {
    const el = document.createElement("span");
    el.className = "reasons-petal";
    el.textContent = petals[i % petals.length];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      animation-duration: ${12 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 12}s;
      font-size: ${14 + Math.random() * 10}px;
    `;
    container.appendChild(el);
  }
}


/* ============================================================
   SURPRISE VIDEO
   ============================================================ */
(function initSurprise() {
  const btn     = document.getElementById("surpriseBtn");
  const overlay = document.getElementById("videoOverlay");
  const video   = document.getElementById("surpriseVideo");
  const closeBtn = document.getElementById("videoClose");

  if (!btn) return;

  btn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    video.play().catch(() => {});
  });

  closeBtn.addEventListener("click", () => {
    video.pause();
    video.currentTime = 0;
    overlay.classList.add("hidden");
  });
})();

/* ============================================================
   EMAILJS — REPLY SECTION
   Replace the three placeholder values below with your actual
   EmailJS Service ID, Template ID, and Public Key.
   ============================================================ */
(function initReplySection() {
  const EMAILJS_PUBLIC_KEY  = "Hyv5BeH0TmRT7QXOK";
  const EMAILJS_SERVICE_ID  = "service_qax436r";
  const EMAILJS_TEMPLATE_ID = "template_zemcvpr";

  // Init EmailJS
  if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  // Wait for DOM
  document.addEventListener("DOMContentLoaded", wireReply);
  // Also wire immediately in case DOM is already ready
  wireReply();

  function wireReply() {
    const textarea  = document.getElementById("replyMessage");
    const sendBtn   = document.getElementById("replySendBtn");
    const charCount = document.getElementById("replyCharCount");
    const successEl = document.getElementById("replySuccess");
    const sendLabel = document.getElementById("replySendLabel");

    if (!textarea || !sendBtn) return;
    if (sendBtn._wired) return; // prevent double-wiring
    sendBtn._wired = true;

    // Character counter
    textarea.addEventListener("input", () => {
      charCount.textContent = `${textarea.value.length} / 2000`;
    });

    // Send button
    sendBtn.addEventListener("click", async () => {
      const msg = textarea.value.trim();
      if (!msg) {
        textarea.focus();
        textarea.style.borderColor = "#c0576a";
        setTimeout(() => textarea.style.borderColor = "", 1000);
        return;
      }

      sendBtn.disabled = true;
      sendLabel.textContent = "Sending... 💌";

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: "Aaron Ermino",
          to_email:  "satuitomariaveramae@gmail.com",
          message:   msg,
        });

        // Show success, hide form
        document.querySelector(".reply-card").classList.add("hidden");
        successEl.classList.remove("hidden");
      } catch (err) {
        console.error("EmailJS error:", err);
        sendBtn.disabled = false;
        sendLabel.textContent = "Send 💌";
        alert("Hindi ma-send ang mensahe. Subukan ulit. 😔");
      }
    });
  }
})();

(function init() {
  // Lock screen hearts + sparkles
  createFloatingHearts("floatingHeartsLock", 18);
  createSparkles();

  // Wire menu screen buttons (event delegation)
  document.getElementById("menuScreen").addEventListener("click", (e) => {
    const btn = e.target.closest(".menu-card");
    if (btn && btn.dataset.target) openPanel(btn.dataset.target);
  });

  // Wire all back buttons (panels are now outside mainSite)
  document.querySelectorAll(".panel-back-btn").forEach(btn => {
    btn.addEventListener("click", closeAllPanels);
  });
})();
