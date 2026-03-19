// ============================================================
// KANAPUTZ OBSERVATORY v2 — Main Application (Wave-Aware)
// ============================================================

(function() {
  'use strict';

  let terminal = null;
  let isDetailOpen = false;
  let journalSpreadIndex = 0;
  let pagesPerSpread = 2;
  let currentCassetteId = null;

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    setupHotspots();
    setupCloseButton();
    setupKeyboard();
    populateAll();
    updateZoneVisibility();

    // Re-render everything when wave changes
    document.addEventListener('wavechange', () => {
      populateAll();
      updateZoneVisibility();
    });
  });

  function populateAll() {
    populateMap();
    populatePinboard();
    populateNotepad();
    populateCassette();
    populateSafe();
    populateSource();
  }

  // ===== ZONE VISIBILITY =====
  // Show/hide hotspot zones based on current wave
  function updateZoneVisibility() {
    const wave = WaveSystem.getWave();

    // Safe: visible from Wave 2
    const safezone = document.getElementById('zone-safe');
    if (safezone) safezone.style.display = wave >= 2 ? '' : 'none';

    // Source monitor: visible from Wave 4
    const srcZone = document.getElementById('zone-source');
    if (srcZone) srcZone.style.display = wave >= 4 ? '' : 'none';
  }

  // ===== HOTSPOT CLICK HANDLING =====
  function setupHotspots() {
    document.querySelectorAll('.hotspot[data-target]').forEach(hotspot => {
      hotspot.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = hotspot.getAttribute('data-target');
        openDetail(targetId);
      });
    });
  }

  // ===== OPEN/CLOSE DETAIL VIEW =====
  function openDetail(targetId) {
    const overlay = document.getElementById('detail-overlay');
    const allContents = overlay.querySelectorAll('.detail-content');

    allContents.forEach(c => c.classList.remove('active'));

    const target = document.getElementById(targetId);
    if (!target) return;

    target.classList.add('active');
    overlay.classList.remove('hidden');
    isDetailOpen = true;

    // Start terminal if opening terminal view
    if (targetId === 'terminal-detail') {
      const feedEl = document.getElementById('terminal-feed');
      if (terminal) terminal.stop();
      // Filter sightings by wave
      const visibleSightings = WaveSystem.getVisibleContent(SIGHTINGS);
      terminal = new SightingTerminal(feedEl, visibleSightings);
      terminal.start();
    }
  }

  function closeDetail() {
    const overlay = document.getElementById('detail-overlay');
    overlay.classList.add('hidden');
    isDetailOpen = false;

    if (terminal) {
      terminal.stop();
      terminal = null;
    }

    setTimeout(() => {
      overlay.querySelectorAll('.detail-content').forEach(c => c.classList.remove('active'));
    }, 400);
  }

  function setupCloseButton() {
    document.getElementById('detail-close').addEventListener('click', closeDetail);
    document.getElementById('detail-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeDetail();
    });
  }

  function setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isDetailOpen) closeDetail();
      if (e.key === 'ArrowLeft' && isDetailOpen) {
        const prevBtn = document.getElementById('journal-prev');
        if (prevBtn && prevBtn.offsetParent !== null) prevBtn.click();
      }
      if (e.key === 'ArrowRight' && isDetailOpen) {
        const nextBtn = document.getElementById('journal-next');
        if (nextBtn && nextBtn.offsetParent !== null) nextBtn.click();
      }
      // Press D to toggle debug panel + hotspot borders
      if ((e.key === 'd' || e.key === 'D') && !isDetailOpen) {
        document.getElementById('room').classList.toggle('debug');
        WaveSystem.toggleDebugPanel();
      }
      // Hold Spacebar to reveal all hotspots
      if (e.key === ' ' && !isDetailOpen) {
        e.preventDefault();
        document.getElementById('room').classList.add('reveal');
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.key === ' ') {
        document.getElementById('room').classList.remove('reveal');
      }
    });

    // Mobile: tap on empty room area to briefly reveal sparkles
    document.getElementById('room').addEventListener('click', (e) => {
      if (!e.target.closest('.zone') && !isDetailOpen) {
        const room = document.getElementById('room');
        room.classList.add('reveal');
        setTimeout(() => room.classList.remove('reveal'), 1500);
      }
    });
  }

  // ===== SIGHTINGS MAP (dynamic dots from MAP_SIGHTINGS) =====
  function populateMap() {
    const mapScreen = document.getElementById('map-screen');
    const mapInfo = document.getElementById('map-info');
    if (!mapScreen || !mapInfo) return;

    // Clear existing dots
    mapScreen.querySelectorAll('.map-dot').forEach(d => d.remove());

    const visibleDots = WaveSystem.getVisibleContent(MAP_SIGHTINGS);

    visibleDots.forEach(dot => {
      const el = document.createElement('div');
      el.className = 'map-dot';
      el.style.left = dot.left;
      el.style.top = dot.top;
      el.setAttribute('data-id', dot.id);
      el.setAttribute('data-city', dot.city);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        WaveSystem.trackEngagement('mapDot', dot.id);

        // Build info panel
        let html = `
          <div class="map-info-date">${dot.city} — ${dot.location}</div>
          <div class="map-info-location">[${dot.evidenceType.toUpperCase()}]</div>
          <div class="map-info-desc">${dot.description}</div>
        `;
        if (dot.hasFootage && WaveSystem.isFeatureAvailable('mapFootage')) {
          html += `<div class="map-info-footage">▶ SURVEILLANCE FOOTAGE AVAILABLE</div>`;
        }
        mapInfo.innerHTML = html;
        mapInfo.classList.add('active');
      });

      mapScreen.appendChild(el);
    });

    // Click on monitor (not a dot) closes the info panel
    const monitor = document.querySelector('.map-monitor');
    if (monitor && !monitor._mapClickBound) {
      monitor.addEventListener('click', () => {
        mapInfo.classList.remove('active');
      });
      monitor._mapClickBound = true;
    }

    // Show dots only after monitor image loads
    if (!mapScreen.classList.contains('bg-loaded')) {
      const bgImg = new Image();
      bgImg.onload = () => mapScreen.classList.add('bg-loaded');
      bgImg.src = 'assets/terminal2-bg.jpg';
      if (bgImg.complete) mapScreen.classList.add('bg-loaded');
    }
  }

  // ===== PINBOARD (merged: post-its + sketches + photos) =====
  function populatePinboard() {
    const surface = document.getElementById('pinboard-surface');
    if (!surface) return;

    // Clear existing
    surface.innerHTML = '';

    const visibleItems = WaveSystem.getVisibleContent(PINBOARD_ITEMS);

    visibleItems.forEach((item, i) => {
      if (item.type === 'postit') {
        const img = POSTIT_IMAGES[i % POSTIT_IMAGES.length];
        const div = document.createElement('div');
        div.className = 'full-postit';
        if (item.author === 'm') div.classList.add('postit-m');
        div.style.backgroundImage = `url('assets/${img}')`;
        div.style.transform = `rotate(${item.rotation}deg)`;
        div.style.top = item.position.top;
        div.style.left = item.position.left;
        div.textContent = item.text;

        div.addEventListener('click', (e) => {
          e.stopPropagation();
          const overlay = document.querySelector('.postit-overlay');
          if (div.classList.contains('zoomed')) {
            div.classList.remove('zoomed');
            if (overlay) overlay.classList.remove('active');
          } else {
            document.querySelectorAll('.full-postit.zoomed').forEach(p => p.classList.remove('zoomed'));
            div.classList.add('zoomed');
            if (overlay) overlay.classList.add('active');
          }
        });
        surface.appendChild(div);

      } else if (item.type === 'sketch') {
        const div = document.createElement('div');
        div.className = 'pinboard-sketch';
        div.style.top = item.position.top;
        div.style.left = item.position.left;
        div.style.transform = `rotate(${item.rotation}deg)`;
        div.innerHTML = `
          <img src="assets/${item.image}" alt="${item.label}" class="pinboard-sketch-img"/>
          <div class="pinboard-sketch-label">${item.label}</div>
        `;
        div.addEventListener('click', (e) => {
          e.stopPropagation();
          // Zoom sketch
          const overlay = document.querySelector('.postit-overlay');
          if (div.classList.contains('sketch-zoomed-active')) {
            div.classList.remove('sketch-zoomed-active');
            if (overlay) overlay.classList.remove('active');
          } else {
            div.classList.add('sketch-zoomed-active');
            if (overlay) overlay.classList.add('active');
          }
        });
        surface.appendChild(div);
      }
    });

    // Overlay to close zoomed items
    let overlay = surface.parentElement.querySelector('.postit-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'postit-overlay';
      document.getElementById('pinboard-detail').appendChild(overlay);
    }
    overlay.addEventListener('click', () => {
      document.querySelectorAll('.full-postit.zoomed').forEach(p => p.classList.remove('zoomed'));
      document.querySelectorAll('.sketch-zoomed-active').forEach(p => p.classList.remove('sketch-zoomed-active'));
      overlay.classList.remove('active');
    });

    // Reveal items only after background image is loaded
    if (!surface.classList.contains('bg-loaded')) {
      const bgImg = new Image();
      bgImg.onload = () => surface.classList.add('bg-loaded');
      bgImg.src = 'assets/cork-bg.jpg';
      if (bgImg.complete) surface.classList.add('bg-loaded');
    } else {
      // Already loaded from previous render — make sure items are visible
      surface.classList.add('bg-loaded');
    }
  }

  // ===== JOURNAL (page-flip notebook, wave-filtered) =====
  function populateNotepad() {
    const book = document.getElementById('journal-book');
    if (!book) return;

    const hasHoverDevice = window.matchMedia('(any-hover: hover)').matches;
    const isMobileTouch = !hasHoverDevice;
    const isNarrow = window.matchMedia('(max-width: 768px)');
    const notebookOuter = document.querySelector('.notebook-outer');

    function updatePageMode() {
      const singlePage = isMobileTouch || isNarrow.matches;
      pagesPerSpread = singlePage ? 1 : 2;
      if (notebookOuter) notebookOuter.classList.toggle('single-page', singlePage);
    }
    updatePageMode();

    if (!isNarrow._boundChange) {
      isNarrow.addEventListener('change', () => {
        updatePageMode();
        journalSpreadIndex = 0;
        renderSpread();
      });
      isNarrow._boundChange = true;
    }

    journalSpreadIndex = 0;
    renderSpread();

    // Only bind nav buttons once
    const prevBtn = document.getElementById('journal-prev');
    const nextBtn = document.getElementById('journal-next');
    if (!prevBtn._bound) {
      prevBtn.addEventListener('click', () => {
        if (journalSpreadIndex > 0) {
          flipPage('right', () => { journalSpreadIndex--; renderSpread(); });
        }
      });
      prevBtn._bound = true;
    }
    if (!nextBtn._bound) {
      nextBtn.addEventListener('click', () => {
        const pages = WaveSystem.getVisibleContent(JOURNAL_PAGES);
        const totalSpreads = Math.ceil(pages.length / pagesPerSpread);
        if (journalSpreadIndex < totalSpreads - 1) {
          flipPage('left', () => { journalSpreadIndex++; renderSpread(); });
        }
      });
      nextBtn._bound = true;
    }

    // Swipe support for mobile
    if (!book._swipeBound) {
      let startX = 0, startY = 0;
      book.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });
      book.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) document.getElementById('journal-next').click();
          else document.getElementById('journal-prev').click();
        }
      }, { passive: true });
      book._swipeBound = true;
    }
  }

  function renderSpread() {
    const book = document.getElementById('journal-book');
    if (!book) return;

    const pages = WaveSystem.getVisibleContent(JOURNAL_PAGES);
    const totalSpreads = Math.ceil(pages.length / pagesPerSpread);
    const startIndex = journalSpreadIndex * pagesPerSpread;

    let html = '<div class="journal-spread">';
    for (let i = 0; i < pagesPerSpread; i++) {
      const entryIndex = startIndex + i;
      const side = (pagesPerSpread === 2) ? (i === 0 ? 'left' : 'right') : '';

      if (entryIndex < pages.length) {
        const entry = pages[entryIndex];
        // Track engagement
        WaveSystem.trackEngagement('journal', entry.page);

        let contentHtml = `<div class="notebook-date">${entry.date}</div>`;
        contentHtml += `<div class="notebook-text">${entry.text}</div>`;
        if (entry.marginNote) {
          contentHtml += `<div class="notebook-margin-note">${entry.marginNote}</div>`;
        }

        html += `
          <div class="journal-page ${side}">
            <div class="journal-page-content">
              ${contentHtml}
            </div>
            <div class="journal-page-number">${entry.page}</div>
          </div>`;
      } else {
        html += `<div class="journal-page ${side}"><div class="journal-page-content"></div></div>`;
      }
    }
    html += '</div>';
    book.innerHTML = html;

    // Update counter
    const countEl = document.getElementById('journal-count');
    if (pagesPerSpread === 2) {
      const left = startIndex + 1;
      const right = Math.min(startIndex + 2, pages.length);
      countEl.textContent = `${left}–${right} / ${pages.length}`;
    } else {
      countEl.textContent = `${startIndex + 1} / ${pages.length}`;
    }

    document.getElementById('journal-prev').disabled = (journalSpreadIndex === 0);
    document.getElementById('journal-next').disabled = (journalSpreadIndex >= totalSpreads - 1);

    // Check overflow
    book.querySelectorAll('.journal-page-content').forEach(el => {
      if (el.scrollHeight > el.clientHeight) el.classList.add('overflows');
    });
  }

  function flipPage(direction, onMidpoint) {
    const spread = document.querySelector('.journal-spread');
    if (!spread) return;
    const animClass = direction === 'left' ? 'flip-left' : 'flip-right';
    spread.classList.add(animClass);
    setTimeout(() => { if (onMidpoint) onMidpoint(); }, 300);
    setTimeout(() => {
      const s = document.querySelector('.journal-spread');
      if (s) s.classList.remove(animClass);
    }, 620);
  }

  // ===== CASSETTE PLAYER =====
  function populateCassette() {
    const tapeList = document.getElementById('cassette-tape-list');
    const label = document.getElementById('cassette-label');
    const desc = document.getElementById('cassette-description');
    if (!tapeList) return;

    tapeList.innerHTML = '';

    // Filter tapes by wave AND safe requirement
    const visibleTapes = WaveSystem.getVisibleContent(CASSETTE_TAPES).filter(tape => {
      if (tape.requiresSafe && !WaveSystem.isSafeOpened()) return false;
      return true;
    });

    visibleTapes.forEach(tape => {
      const btn = document.createElement('button');
      btn.className = 'cassette-tape-item';
      if (tape.id === currentCassetteId) btn.classList.add('active');
      btn.textContent = tape.label;
      btn.addEventListener('click', () => {
        loadTape(tape);
      });
      tapeList.appendChild(btn);
    });

    // Setup controls (once)
    const playBtn = document.getElementById('cassette-play');
    const stopBtn = document.getElementById('cassette-stop');
    const rewindBtn = document.getElementById('cassette-rewind');
    if (playBtn && !playBtn._bound) {
      playBtn.addEventListener('click', () => {
        if (!currentCassetteId) return;
        playBtn.classList.add('active');
        // Visual: spin reels
        document.querySelectorAll('.cassette-reel').forEach(r => r.classList.add('spinning'));
        WaveSystem.trackEngagement('tape', currentCassetteId);
      });
      stopBtn.addEventListener('click', () => {
        playBtn.classList.remove('active');
        document.querySelectorAll('.cassette-reel').forEach(r => r.classList.remove('spinning'));
      });
      rewindBtn.addEventListener('click', () => {
        playBtn.classList.remove('active');
        document.querySelectorAll('.cassette-reel').forEach(r => r.classList.remove('spinning'));
      });
      playBtn._bound = true;
    }
  }

  function loadTape(tape) {
    currentCassetteId = tape.id;
    const label = document.getElementById('cassette-label');
    const desc = document.getElementById('cassette-description');
    if (label) label.textContent = tape.label;
    if (desc) desc.textContent = tape.description;

    // Highlight active tape in list
    document.querySelectorAll('.cassette-tape-item').forEach(btn => {
      btn.classList.toggle('active', btn.textContent === tape.label);
    });

    // Stop any playback
    document.getElementById('cassette-play')?.classList.remove('active');
    document.querySelectorAll('.cassette-reel').forEach(r => r.classList.remove('spinning'));
  }

  // ===== SAFE + DOSSIER =====
  function populateSafe() {
    const container = document.getElementById('safe-container');
    if (!container) return;

    const display = document.getElementById('safe-display');
    const dial = document.getElementById('safe-dial');
    const handle = document.getElementById('safe-handle');
    const dossier = document.getElementById('safe-dossier');

    if (!display) return;

    // Update display based on state
    if (WaveSystem.isSafeOpened()) {
      display.textContent = 'OPEN';
      container.classList.add('safe-opened');
      renderDossier();
      return;
    }

    if (WaveSystem.isSafeDialAvailable()) {
      display.textContent = 'ENTER CODE';
      container.classList.add('safe-dial-active');
      setupSafeDial();
    } else if (WaveSystem.getWave() >= 2) {
      display.textContent = 'LOCKED';
      container.classList.remove('safe-dial-active');
    }
  }

  let safeCode = [];
  const CORRECT_CODE = [3, 17, 58];

  function setupSafeDial() {
    const dial = document.getElementById('safe-dial');
    const display = document.getElementById('safe-display');
    const handle = document.getElementById('safe-handle');
    if (!dial || dial._bound) return;

    safeCode = [];
    let rotation = 0;

    dial.addEventListener('click', () => {
      // Each click rotates dial and adds a number
      rotation += 120;
      dial.style.transform = `rotate(${rotation}deg)`;

      // Simulate code entry: cycle through the correct code
      const codeNum = CORRECT_CODE[safeCode.length] || 0;
      safeCode.push(codeNum);
      display.textContent = safeCode.map(n => String(n).padStart(2, '0')).join('-');

      if (safeCode.length === 3) {
        // Check code
        const correct = safeCode[0] === CORRECT_CODE[0] &&
                        safeCode[1] === CORRECT_CODE[1] &&
                        safeCode[2] === CORRECT_CODE[2];
        if (correct) {
          setTimeout(() => {
            display.textContent = 'ACCESS GRANTED';
            handle.classList.add('turned');
            WaveSystem.trackEngagement('safe');
            setTimeout(() => {
              document.getElementById('safe-container').classList.add('safe-opened');
              document.getElementById('safe-door').classList.add('open');
              renderDossier();
              // Refresh cassette (unlocks safe-required tapes)
              populateCassette();
            }, 800);
          }, 500);
        } else {
          display.textContent = 'DENIED';
          safeCode = [];
          setTimeout(() => { display.textContent = 'ENTER CODE'; }, 1500);
        }
      }
    });
    dial._bound = true;
  }

  function renderDossier() {
    const dossier = document.getElementById('safe-dossier');
    if (!dossier) return;
    dossier.classList.remove('hidden');

    let html = '<div class="dossier-content">';
    SAFE_DOSSIER.sections.forEach(section => {
      html += `<div class="dossier-section">`;
      html += `<div class="dossier-section-title">${section.title}</div>`;
      if (Array.isArray(section.content)) {
        section.content.forEach(item => {
          html += `<div class="dossier-entry ${section.isRedacted ? 'redacted' : ''}">`;
          html += `<div class="dossier-entry-type">${item.type}</div>`;
          html += `<div class="dossier-entry-class">${item.classification}</div>`;
          html += `<div class="dossier-entry-text">${item.text}</div>`;
          if (item.footnote) html += `<div class="dossier-entry-footnote">${item.footnote}</div>`;
          html += `</div>`;
        });
      } else {
        html += `<div class="dossier-text ${section.isRedacted ? 'redacted' : ''}">${section.content}</div>`;
      }
      html += `</div>`;
    });
    html += `<div class="dossier-final">${SAFE_DOSSIER.finalPage}</div>`;
    html += '</div>';
    dossier.innerHTML = html;
  }

  // ===== SOURCE MONITOR =====
  function populateSource() {
    const screen = document.getElementById('source-screen');
    if (!screen) return;

    const coherenceEl = document.getElementById('source-coherence');
    const feedEl = document.getElementById('source-feed');
    const readingsEl = document.getElementById('source-readings');

    if (!WaveSystem.isFeatureAvailable('sourceMonitor')) {
      coherenceEl.innerHTML = '';
      feedEl.innerHTML = '';
      readingsEl.innerHTML = '';
      return;
    }

    const wave = WaveSystem.getWave();
    const data = wave >= 5 ? SOURCE_MONITOR.wave5 : SOURCE_MONITOR.wave4;

    coherenceEl.innerHTML = `
      <div class="source-coherence-label">SOURCE COHERENCE</div>
      <div class="source-coherence-bar">
        <div class="source-coherence-fill" style="width: ${data.coherence}%"></div>
      </div>
      <div class="source-coherence-value">${data.coherence}%</div>
      <div class="source-status">${data.status}</div>
    `;

    feedEl.innerHTML = `<div class="source-feed-text">${data.feed}</div>`;

    readingsEl.innerHTML = data.readings.map(r =>
      `<div class="source-reading">${r}</div>`
    ).join('');
  }

})();
