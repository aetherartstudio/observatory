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
  let pendingRepopulate = false;

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    setupHotspots();
    setupCloseButton();
    setupKeyboard();
    populateAll();
    updateZoneVisibility();
    setupUVLamp();

    // Re-render everything when wave changes
    document.addEventListener('wavechange', () => {
      if (isDetailOpen) {
        // Don't repopulate mid-interaction — queue it for when detail closes
        pendingRepopulate = true;
      } else {
        populateAll();
      }
      updateZoneVisibility();
      updateUVToggleVisibility();
    });

    // Subtle notification when a new wave is earned
    document.addEventListener('waveunlock', (e) => {
      subtleWaveNotification(e.detail.wave);
    });
  });

  // ===== WAVE UNLOCK NOTIFICATION =====
  function subtleWaveNotification(wave) {
    // Room light flicker
    const roomLight = document.querySelector('.room-light');
    if (roomLight) {
      roomLight.classList.add('wave-shift');
      setTimeout(() => roomLight.classList.remove('wave-shift'), 1800);
    }

    // Pulsing LED on terminal hotspot — "new data available"
    const terminalZone = document.getElementById('zone-terminal');
    if (terminalZone) {
      const led = document.createElement('div');
      led.className = 'new-data-led';
      terminalZone.appendChild(led);
      setTimeout(() => led.remove(), 6000);
    }
  }

  function updateRoomBackground() {
    const bg = document.querySelector('.room-bg');
    if (!bg) return;
    bg.src = WaveSystem.isSafeOpened()
      ? 'assets/room-bg-opened safe.png'
      : 'assets/room-bg.png';
  }

  function populateAll() {
    populateMap();
    populatePinboard();
    populateNotepad();
    populateCassette();
    populateSafe();
    populateSource();
    updateRoomBackground();
  }

  // ===== ZONE VISIBILITY =====
  // Show/hide hotspot zones based on current wave
  function updateZoneVisibility() {
    const wave = WaveSystem.getWave();

    // Safe: visible from Wave 5 (anomalies hint at code)
    const safezone = document.getElementById('zone-safe');
    if (safezone) safezone.style.display = wave >= 5 ? '' : 'none';

    // Source monitor: visible from Wave 5
    const srcZone = document.getElementById('zone-source');
    if (srcZone) srcZone.style.display = wave >= 5 ? '' : 'none';

    // UV lamp hidden clickable: always present but only visible as subtle cursor hint
    updateUVLampClickable();
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

    // Track journal pages when journal is opened
    if (targetId === 'notepad-detail') {
      trackCurrentSpread();
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

    updateRoomBackground();

    // Flush any wave-triggered repopulate that was deferred
    if (pendingRepopulate) {
      pendingRepopulate = false;
      populateAll();
    }
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
        document.getElementById('detail-overlay').classList.toggle('debug');
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
          <div class="map-info-desc">${dot.description}</div>
        `;
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
      bgImg.src = 'assets/right monitor levelled with global map-bg.jpg';
      if (bgImg.complete) mapScreen.classList.add('bg-loaded');
    }

    // Shilin zoom controls
    setupMapZoom();
  }

  let mapZoomActive = false;

  function setupMapZoom() {
    const zoomBtn = document.getElementById('map-zoom-btn');
    const zoomOutBtn = document.getElementById('map-zoom-out');
    if (!zoomBtn || !zoomOutBtn) return;

    // Show zoom button from Wave 4+ (Shilin zoom introduced in W4)
    if (WaveSystem.getWave() >= 4) {
      if (!mapZoomActive) zoomBtn.classList.add('visible');
    } else {
      zoomBtn.classList.remove('visible');
      zoomOutBtn.classList.remove('visible');
      if (mapZoomActive) zoomToGlobal();
    }

    if (!zoomBtn._bound) {
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        zoomToShilin();
      });
      zoomBtn._bound = true;
    }
    if (!zoomOutBtn._bound) {
      zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        zoomToGlobal();
      });
      zoomOutBtn._bound = true;
    }
  }

  function zoomToShilin() {
    mapZoomActive = true;
    WaveSystem.trackEngagement('shilinZoom');
    const mapScreen = document.getElementById('map-screen');
    const shilinScreen = document.getElementById('map-shilin');
    const mapInfo = document.getElementById('map-info');
    const zoomBtn = document.getElementById('map-zoom-btn');
    const zoomOutBtn = document.getElementById('map-zoom-out');

    mapScreen.style.display = 'none';
    mapInfo.classList.remove('active');
    zoomBtn.classList.remove('visible');
    zoomOutBtn.classList.add('visible');

    // Swap monitor background to Shilin map
    const monitor = document.querySelector('.map-monitor');
    if (monitor) monitor.style.backgroundImage = "url('assets/right monitor levelled without map-bg.jpg')";

    // Populate Shilin dots
    shilinScreen.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'shilin-grid';
    shilinScreen.appendChild(grid);

    const title = document.createElement('div');
    title.className = 'shilin-title';
    title.textContent = '◉ SHILIN DISTRICT — DETAIL VIEW';
    shilinScreen.appendChild(title);

    // Add street labels
    const streets = [
      { text: 'Wenlin Rd', top: '52%', left: '15%' },
      { text: 'Danan Rd', top: '70%', left: '10%' },
      { text: 'MRT Jiantan', top: '18%', left: '10%' },
      { text: 'Zhishan', top: '25%', left: '65%' },
    ];
    streets.forEach(s => {
      const label = document.createElement('div');
      label.className = 'shilin-label';
      label.style.top = s.top;
      label.style.left = s.left;
      label.textContent = s.text;
      shilinScreen.appendChild(label);
    });

    // Add Shilin dots
    const visibleDots = WaveSystem.getVisibleContent(SHILIN_DOTS);
    visibleDots.forEach(dot => {
      const el = document.createElement('div');
      el.className = 'map-dot' + (dot.isSource ? ' source-dot' : '');
      el.style.left = dot.left;
      el.style.top = dot.top;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        WaveSystem.trackEngagement('shilinDot', dot.id);
        let html = `
          <div class="map-info-date">${dot.location}</div>
          <div class="map-info-desc">${dot.description}</div>
        `;
        mapInfo.innerHTML = html;
        mapInfo.classList.add('active');
      });

      shilinScreen.appendChild(el);
    });

    shilinScreen.classList.add('active');
  }

  function zoomToGlobal() {
    mapZoomActive = false;
    const mapScreen = document.getElementById('map-screen');
    const shilinScreen = document.getElementById('map-shilin');
    const mapInfo = document.getElementById('map-info');
    const zoomBtn = document.getElementById('map-zoom-btn');
    const zoomOutBtn = document.getElementById('map-zoom-out');

    shilinScreen.classList.remove('active');
    mapScreen.style.display = '';
    mapInfo.classList.remove('active');
    zoomOutBtn.classList.remove('visible');
    if (WaveSystem.getWave() >= 4) zoomBtn.classList.add('visible');

    // Restore monitor background to global map
    const monitor = document.querySelector('.map-monitor');
    if (monitor) monitor.style.backgroundImage = "url('assets/right monitor levelled with global map-bg.jpg')";
  }

  // ===== PINBOARD ZOOM HELPER =====
  function zoomPinboardItem(el, zoomClass) {
    const overlay = document.querySelector('.postit-overlay');
    if (el.classList.contains(zoomClass)) {
      // Restore original inline styles
      el.style.transform = el.dataset.originalTransform || '';
      el.style.top = el.dataset.originalTop || '';
      el.style.left = el.dataset.originalLeft || '';
      el.classList.remove(zoomClass);
      if (overlay) overlay.classList.remove('active');
    } else {
      // Unzoom any other zoomed items
      document.querySelectorAll('.full-postit.zoomed, .sketch-zoomed-active, .photo-zoomed-active, .receipt-zoomed-active, .diagram-zoomed-active').forEach(p => {
        if (p.dataset.originalTransform !== undefined) {
          p.style.transform = p.dataset.originalTransform;
          p.style.top = p.dataset.originalTop || '';
          p.style.left = p.dataset.originalLeft || '';
        }
        p.classList.remove('zoomed', 'sketch-zoomed-active', 'photo-zoomed-active', 'receipt-zoomed-active', 'diagram-zoomed-active');
      });
      // Save and clear inline styles so CSS class takes effect
      el.dataset.originalTransform = el.style.transform;
      el.dataset.originalTop = el.style.top;
      el.dataset.originalLeft = el.style.left;
      el.style.transform = '';
      el.style.top = '';
      el.style.left = '';
      el.classList.add(zoomClass);
      if (overlay) overlay.classList.add('active');
    }
  }

  // ===== PINBOARD (merged: post-its + sketches + photos) =====
  function populatePinboard() {
    const surface = document.getElementById('pinboard-surface');
    if (!surface) return;

    // Clear existing
    surface.innerHTML = '';

    const visibleItems = WaveSystem.getVisibleContent(PINBOARD_ITEMS);

    let postitIndex = 0;
    visibleItems.forEach((item, i) => {
      if (item.type === 'postit') {
        const imgFile = POSTIT_IMAGES[postitIndex % POSTIT_IMAGES.length];
        postitIndex++;
        const div = document.createElement('div');
        div.className = 'full-postit';
        if (item.author === 'm') div.classList.add('postit-m');
        div.style.transform = `rotate(${item.rotation}deg)`;
        div.style.top = item.position.top;
        div.style.left = item.position.left;

        // Post-it background as <img> to preserve aspect ratio
        const bgImg = document.createElement('img');
        bgImg.className = 'postit-bg';
        bgImg.src = `assets/${imgFile}`;
        bgImg.alt = '';
        bgImg.draggable = false;
        // Scale up square/wide images so they match the visual width of portrait ones
        bgImg.onload = function() {
          const ratio = this.naturalWidth / this.naturalHeight;
          if (ratio > 0.9) {
            // Square or wide image — scale up width to match visual mass of portrait post-its
            div.style.width = (ratio > 0.95) ? '11cqw' : '10.5cqw';
          }
        };
        div.appendChild(bgImg);

        // Inner content wrapper
        const inner = document.createElement('div');
        inner.className = 'postit-inner';

        // Push-pin
        const pin = document.createElement('div');
        pin.className = 'pin-thumb';
        inner.appendChild(pin);

        const textSpan = document.createElement('span');
        textSpan.textContent = item.text;
        inner.appendChild(textSpan);

        if (item.author === 'm') {
          const sig = document.createElement('div');
          sig.className = 'postit-sig';
          sig.textContent = '— M.';
          inner.appendChild(sig);
        }

        div.appendChild(inner);

        div.addEventListener('click', (e) => {
          e.stopPropagation();
          zoomPinboardItem(div, 'zoomed');
          // Track M.'s note interaction for wave progression
          if (item.author === 'm') {
            WaveSystem.trackEngagement('mNote');
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
          <div class="pin-thumb"></div>
          <img src="assets/${item.image}" alt="${item.label}" class="pinboard-sketch-img"/>
          <div class="pinboard-sketch-label">${item.label}</div>
        `;
        div.addEventListener('click', (e) => {
          e.stopPropagation();
          zoomPinboardItem(div, 'sketch-zoomed-active');
        });
        surface.appendChild(div);

      } else if (item.type === 'photo') {
        const div = document.createElement('div');
        div.style.top = item.position.top;
        div.style.left = item.position.left;
        div.style.transform = `rotate(${item.rotation}deg)`;
        if (item.image) {
          // Photo with asset: render like a sketch — just the image
          div.className = 'pinboard-sketch';
          div.innerHTML = `
            <div class="pin-thumb"></div>
            <img src="assets/${item.image}" alt="${item.label || ''}" class="pinboard-sketch-img"/>
          `;
          div.addEventListener('click', (e) => {
            e.stopPropagation();
            zoomPinboardItem(div, 'sketch-zoomed-active');
          });
        } else {
          // No asset: placeholder polaroid
          div.className = 'pinboard-photo';
          div.innerHTML = `
            <div class="pin-thumb"></div>
            <div class="pinboard-photo-frame">
              <div class="pinboard-photo-placeholder"><span class="photo-icon">📷</span><span class="photo-static"></span></div>
            </div>
            <div class="pinboard-photo-label">${item.label}</div>
            ${item.caption ? `<div class="pinboard-photo-caption">${item.caption}</div>` : ''}
          `;
          div.addEventListener('click', (e) => {
            e.stopPropagation();
            zoomPinboardItem(div, 'photo-zoomed-active');
          });
        }
        surface.appendChild(div);

      } else if (item.type === 'receipt') {
        const div = document.createElement('div');
        div.className = 'pinboard-receipt';
        div.style.top = item.position.top;
        div.style.left = item.position.left;
        div.style.transform = `rotate(${item.rotation}deg)`;
        const itemsHtml = item.items.map(line =>
          line === '---' ? '<div class="receipt-divider"></div>' : `<div class="receipt-line">${line}</div>`
        ).join('');
        div.innerHTML = `
          <div class="pin-thumb"></div>
          <div class="receipt-header">${item.vendor}</div>
          <div class="receipt-date">${item.date}</div>
          ${itemsHtml}
          <div class="receipt-divider"></div>
          <div class="receipt-total">${item.total}</div>
        `;
        div.addEventListener('click', (e) => {
          e.stopPropagation();
          zoomPinboardItem(div, 'receipt-zoomed-active');
        });
        surface.appendChild(div);

      } else if (item.type === 'diagram') {
        const div = document.createElement('div');
        div.className = 'pinboard-diagram';
        div.style.top = item.position.top;
        div.style.left = item.position.left;
        div.style.transform = `rotate(${item.rotation}deg)`;
        div.innerHTML = `
          <div class="pin-thumb"></div>
          <div class="diagram-title">${item.title}</div>
          <div class="diagram-visual">
            <svg viewBox="0 0 100 100" class="diagram-svg">
              <circle cx="50" cy="50" r="3" fill="#cc3333" opacity="0.8"/>
              <line x1="15" y1="20" x2="50" y2="50" stroke="#cc3333" stroke-width="0.5" opacity="0.6"/>
              <line x1="85" y1="25" x2="50" y2="50" stroke="#cc3333" stroke-width="0.5" opacity="0.6"/>
              <line x1="20" y1="80" x2="50" y2="50" stroke="#cc3333" stroke-width="0.5" opacity="0.6"/>
              <line x1="80" y1="75" x2="50" y2="50" stroke="#cc3333" stroke-width="0.5" opacity="0.6"/>
              <line x1="50" y1="10" x2="50" y2="50" stroke="#cc3333" stroke-width="0.5" opacity="0.6"/>
              <line x1="10" y1="50" x2="50" y2="50" stroke="#cc3333" stroke-width="0.5" opacity="0.6"/>
              <circle cx="15" cy="20" r="2" fill="none" stroke="#666" stroke-width="0.5"/>
              <circle cx="85" cy="25" r="2" fill="none" stroke="#666" stroke-width="0.5"/>
              <circle cx="20" cy="80" r="2" fill="none" stroke="#666" stroke-width="0.5"/>
              <circle cx="80" cy="75" r="2" fill="none" stroke="#666" stroke-width="0.5"/>
              <circle cx="50" cy="10" r="2" fill="none" stroke="#666" stroke-width="0.5"/>
              <circle cx="10" cy="50" r="2" fill="none" stroke="#666" stroke-width="0.5"/>
            </svg>
          </div>
          <div class="diagram-desc">${item.description}</div>
        `;
        div.addEventListener('click', (e) => {
          e.stopPropagation();
          zoomPinboardItem(div, 'diagram-zoomed-active');
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
      document.querySelectorAll('.full-postit.zoomed, .sketch-zoomed-active, .photo-zoomed-active, .receipt-zoomed-active, .diagram-zoomed-active').forEach(p => {
        // Restore saved inline styles before removing zoom class
        if (p.dataset.originalTransform !== undefined) {
          p.style.transform = p.dataset.originalTransform;
          p.style.top = p.dataset.originalTop || '';
          p.style.left = p.dataset.originalLeft || '';
        }
        p.classList.remove('zoomed', 'sketch-zoomed-active', 'photo-zoomed-active', 'receipt-zoomed-active', 'diagram-zoomed-active');
      });
      overlay.classList.remove('active');
    });

    // Reveal items only after background image is loaded
    if (!surface.classList.contains('bg-loaded')) {
      const bgImg = new Image();
      bgImg.onload = () => surface.classList.add('bg-loaded');
      bgImg.src = 'assets/cork-bg.png';
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
          flipPage('right', () => { journalSpreadIndex--; renderSpread(); trackCurrentSpread(); });
        }
      });
      prevBtn._bound = true;
    }
    if (!nextBtn._bound) {
      nextBtn.addEventListener('click', () => {
        const pages = WaveSystem.getVisibleContent(JOURNAL_PAGES);
        const totalSpreads = Math.ceil(pages.length / pagesPerSpread);
        if (journalSpreadIndex < totalSpreads - 1) {
          flipPage('left', () => { journalSpreadIndex++; renderSpread(); trackCurrentSpread(); });
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

  function trackCurrentSpread() {
    const pages = WaveSystem.getVisibleContent(JOURNAL_PAGES);
    const startIndex = journalSpreadIndex * pagesPerSpread;
    for (let i = 0; i < pagesPerSpread; i++) {
      const entryIndex = startIndex + i;
      if (entryIndex < pages.length) {
        WaveSystem.trackEngagement('journal', pages[entryIndex].page);
      }
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
  // Map tape IDs to image assets
  const TAPE_IMAGES = { 'T-01': 'tape1.png', 'T-02': 'tape2.png', 'T-03': 'tape3.png', 'T-04': 'tape4.png', 'T-05': 'tape5.png' };
  const TAPE_LABELS = { 'T-01': 'tape1 label.png', 'T-02': 'tape2 label.png', 'T-03': 'tape3 label.png', 'T-04': 'tape4 label.png', 'T-05': 'tape5 label.png' };

  function populateCassette() {
    const stack = document.getElementById('cassette-tape-stack');
    if (!stack) return;

    stack.innerHTML = '';

    // Filter tapes by wave, safe requirement, and tape prerequisite
    const visibleTapes = WaveSystem.getVisibleContent(CASSETTE_TAPES).filter(tape => {
      if (tape.requiresSafe && !WaveSystem.isSafeOpened()) return false;
      if (tape.requiresTape && !WaveSystem.hasTapePlayed(tape.requiresTape)) return false;
      return true;
    });

    visibleTapes.forEach(tape => {
      const img = document.createElement('img');
      img.className = 'cassette-tape-thumb';
      img.src = `assets/${TAPE_IMAGES[tape.id]}`;
      img.alt = tape.label;
      img.title = tape.label;
      if (tape.id === currentCassetteId) img.classList.add('active');
      img.addEventListener('click', () => loadTape(tape));
      stack.appendChild(img);
    });

    // Setup controls (once)
    const playBtn = document.getElementById('cassette-play');
    const stopBtn = document.getElementById('cassette-stop');
    const rewindBtn = document.getElementById('cassette-rewind');
    if (playBtn && !playBtn._bound) {
      playBtn.addEventListener('click', () => {
        if (!currentCassetteId) return;
        playBtn.classList.add('active');
        WaveSystem.trackEngagement('tape', currentCassetteId);
      });
      stopBtn.addEventListener('click', () => {
        playBtn.classList.remove('active');
      });
      rewindBtn.addEventListener('click', () => {
        playBtn.classList.remove('active');
      });
      playBtn._bound = true;
    }
  }

  function loadTape(tape) {
    currentCassetteId = tape.id;
    const loadedTape = document.getElementById('cassette-loaded-tape');

    // Show tape label on top of player
    if (loadedTape) {
      loadedTape.innerHTML = `<img src="assets/${TAPE_LABELS[tape.id]}" alt="${tape.label}">`;
    }

    // Highlight active tape in stack
    document.querySelectorAll('.cassette-tape-thumb').forEach(img => {
      img.classList.toggle('active', img.alt === tape.label);
    });

    // Stop any playback
    document.getElementById('cassette-play')?.classList.remove('active');
  }

  // ===== SAFE + DOSSIER =====
  const CORRECT_CODE = [3, 17, 58];
  let safeDialValue = 0;       // current number the dial points to (0-99)
  let safeCodeEntries = [];    // numbers confirmed so far
  let safeDialRotation = 0;    // visual rotation in degrees
  let safeDragging = false;
  let safeDragStart = 0;
  let safeRotationStart = 0;

  function populateSafe() {
    const container = document.getElementById('safe-container');
    if (!container) return;

    const display = document.getElementById('safe-display');
    if (!display) return;

    // Reset state from any previous session
    const door = document.getElementById('safe-door');
    container.classList.remove('safe-opened', 'safe-dial-active');
    if (door) door.classList.remove('safe-door-opened');
    const dossier = document.getElementById('safe-dossier');
    if (dossier) { dossier.classList.add('hidden'); dossier.innerHTML = ''; }
    safeCodeEntries = [];
    safeDialValue = 0;
    safeDialRotation = 0;

    // Already opened — show opened safe, click to view dossier
    if (WaveSystem.isSafeOpened()) {
      display.textContent = 'OPEN';
      const door = document.getElementById('safe-door');
      door.classList.add('safe-door-opened');
      door.addEventListener('click', () => {
        container.classList.add('safe-opened');
        renderDossier();
      }, { once: true });
      return;
    }

    if (WaveSystem.isSafeDialAvailable()) {
      display.textContent = 'PULL HANDLE TO CONFIRM';
      container.classList.add('safe-dial-active');
      setupSafeDial();
    } else if (WaveSystem.getWave() >= 5) {
      display.textContent = 'LOCKED';
      container.classList.remove('safe-dial-active');
    }
  }

  function setupSafeDial() {
    const dial = document.getElementById('safe-dial');
    if (!dial || dial._bound) return;

    // Render tick numbers around dial (every 5: 0, 5, 10, ... 55)
    const numbersEl = document.getElementById('safe-dial-numbers');
    if (numbersEl) {
      numbersEl.innerHTML = '';
      for (let i = 0; i < 100; i += 10) {
        const span = document.createElement('span');
        span.className = 'safe-dial-num';
        span.textContent = i;
        const angle = (i / 100) * 360;
        span.style.transform = `rotate(${angle}deg) translateY(-42px) rotate(-${angle}deg)`;
        numbersEl.appendChild(span);
      }
    }

    updateSafeDigitDisplay();

    // Scroll to rotate dial
    dial.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      safeDialRotation += delta * (360 / 100); // ~3.27 degrees per tick = 110 ticks per full rotation
      safeDialValue = ((Math.round(-safeDialRotation / (360 / 100)) % 100) + 100) % 100;
      dial.style.transform = `rotate(${safeDialRotation}deg)`;
      updateSafeCurrentNumber();
    }, { passive: false });

    // Drag to rotate (mouse)
    dial.addEventListener('mousedown', (e) => {
      safeDragging = true;
      safeDragStart = getAngleFromCenter(e, dial);
      safeRotationStart = safeDialRotation;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!safeDragging) return;
      const angle = getAngleFromCenter(e, dial);
      const delta = angle - safeDragStart;
      safeDialRotation = safeRotationStart + delta;
      safeDialValue = ((Math.round(-safeDialRotation / (360 / 100)) % 100) + 100) % 100;
      dial.style.transform = `rotate(${safeDialRotation}deg)`;
      updateSafeCurrentNumber();
    });

    document.addEventListener('mouseup', () => { safeDragging = false; });

    // Drag to rotate (touch)
    dial.addEventListener('touchstart', (e) => {
      safeDragging = true;
      safeDragStart = getAngleFromCenter(e.touches[0], dial);
      safeRotationStart = safeDialRotation;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!safeDragging) return;
      const angle = getAngleFromCenter(e.touches[0], dial);
      const delta = angle - safeDragStart;
      safeDialRotation = safeRotationStart + delta;
      safeDialValue = ((Math.round(-safeDialRotation / (360 / 100)) % 100) + 100) % 100;
      dial.style.transform = `rotate(${safeDialRotation}deg)`;
      updateSafeCurrentNumber();
    }, { passive: true });

    document.addEventListener('touchend', () => { safeDragging = false; });

    // Click the confirm area (handle) to lock in current number
    const handle = document.getElementById('safe-handle');
    if (handle) {
      handle.addEventListener('click', () => {
        if (safeCodeEntries.length >= 3) return;
        confirmSafeDigit();
      });
    }

    dial._bound = true;
  }

  function getAngleFromCenter(event, element) {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(event.clientY - cy, event.clientX - cx) * (180 / Math.PI);
  }

  function updateSafeCurrentNumber() {
    const hint = document.getElementById('safe-hint');
    if (hint) hint.textContent = String(safeDialValue).padStart(2, '0');
    updateSafeDigitDisplay();
  }

  function updateSafeDigitDisplay() {
    for (let i = 0; i < 3; i++) {
      const el = document.getElementById(`safe-digit-${i}`);
      if (el) {
        if (i < safeCodeEntries.length) {
          el.textContent = String(safeCodeEntries[i]).padStart(2, '0');
          el.classList.add('confirmed');
        } else if (i === safeCodeEntries.length) {
          el.textContent = String(safeDialValue).padStart(2, '0');
          el.classList.add('active');
          el.classList.remove('confirmed');
        } else {
          el.textContent = '??';
          el.classList.remove('confirmed', 'active');
        }
      }
    }
  }

  function confirmSafeDigit() {
    safeCodeEntries.push(safeDialValue);
    updateSafeDigitDisplay();

    const display = document.getElementById('safe-display');

    if (safeCodeEntries.length < 3) {
      // Flash the handle to show number accepted
      const handle = document.getElementById('safe-handle');
      handle.classList.add('flash');
      setTimeout(() => handle.classList.remove('flash'), 300);
      display.textContent = `DIGIT ${safeCodeEntries.length}/3 LOCKED — ROTATE FOR NEXT`;
      return;
    }

    // All 3 entered — check code
    const correct = safeCodeEntries[0] === CORRECT_CODE[0] &&
                    safeCodeEntries[1] === CORRECT_CODE[1] &&
                    safeCodeEntries[2] === CORRECT_CODE[2];

    if (correct) {
      display.textContent = 'ACCESS GRANTED';
      display.classList.add('granted');
      const handle = document.getElementById('safe-handle');
      handle.classList.add('turned');
      WaveSystem.trackEngagement('safe');

      setTimeout(() => {
        const door = document.getElementById('safe-door');
        door.classList.add('safe-door-opened');
        // Click on the opened safe (file inside) to view dossier
        door.addEventListener('click', () => {
          document.getElementById('safe-container').classList.add('safe-opened');
          renderDossier();
        }, { once: true });
        populateCassette();
      }, 1000);
    } else {
      display.textContent = 'ACCESS DENIED';
      display.classList.add('denied');
      // Flash door red
      document.getElementById('safe-door').classList.add('denied-flash');
      setTimeout(() => {
        document.getElementById('safe-door').classList.remove('denied-flash');
        display.classList.remove('denied');
        safeCodeEntries = [];
        updateSafeDigitDisplay();
        display.textContent = 'PULL HANDLE TO CONFIRM';
      }, 2000);
    }
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
    const data = wave >= 6 ? SOURCE_MONITOR.wave6 : SOURCE_MONITOR.wave5;

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

  // ===== UV LAMP =====
  let uvActive = false;

  // Hidden UV lamp clickable in the desk scene
  function updateUVLampClickable() {
    let lampEl = document.getElementById('uv-lamp-hidden');
    if (!lampEl) {
      // Create the hidden clickable in the room scene
      lampEl = document.createElement('div');
      lampEl.id = 'uv-lamp-hidden';
      lampEl.className = 'uv-lamp-hidden';
      lampEl.title = ''; // no tooltip — must discover by cursor change
      const scene = document.querySelector('.room-scene');
      if (scene) {
        scene.appendChild(lampEl);
        lampEl.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!WaveSystem.isUVLampFound()) {
            WaveSystem.trackEngagement('uvLampFind');
            // Brief visual feedback: lamp glows
            lampEl.classList.add('found');
            setTimeout(() => lampEl.classList.remove('found'), 2000);
            // Update UV toggle visibility on pinboard
            updateUVToggleVisibility();
          }
        });
      }
    }
    // If already found, add a subtle indicator
    if (WaveSystem.isUVLampFound()) {
      lampEl.classList.add('discovered');
    }
  }

  function updateUVToggleVisibility() {
    const toggle = document.getElementById('uv-toggle');
    if (!toggle) return;
    // UV toggle only appears after the lamp has been found in the desk
    if (WaveSystem.isUVLampFound()) {
      toggle.classList.add('visible');
    } else {
      toggle.classList.remove('visible');
      if (uvActive) deactivateUV();
    }
  }

  function setupUVLamp() {
    const toggle = document.getElementById('uv-toggle');
    const pinboardFull = document.querySelector('.pinboard-full');
    const uvLayer = document.getElementById('uv-layer');
    const uvMask = document.getElementById('uv-mask');
    if (!toggle || !pinboardFull || !uvLayer || !uvMask) return;

    updateUVToggleVisibility();

    // Render UV items from data
    renderUVItems();

    // Toggle UV mode
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (uvActive) {
        deactivateUV();
      } else {
        activateUV();
      }
    });

    // Mouse tracking for UV radius
    pinboardFull.addEventListener('mousemove', (e) => {
      if (!uvActive) return;
      updateUVRadius(e, pinboardFull);
    });

    // Touch tracking for mobile
    pinboardFull.addEventListener('touchmove', (e) => {
      if (!uvActive) return;
      const touch = e.touches[0];
      updateUVRadius(touch, pinboardFull);
    }, { passive: true });

    // Also update on touchstart
    pinboardFull.addEventListener('touchstart', (e) => {
      if (!uvActive) return;
      const touch = e.touches[0];
      updateUVRadius(touch, pinboardFull);
    }, { passive: true });
  }

  function activateUV() {
    uvActive = true;
    WaveSystem.trackEngagement('uvLamp');
    const toggle = document.getElementById('uv-toggle');
    const pinboardFull = document.querySelector('.pinboard-full');
    const uvLayer = document.getElementById('uv-layer');
    const uvMask = document.getElementById('uv-mask');
    toggle.classList.add('active');
    pinboardFull.classList.add('uv-mode');
    uvLayer.classList.add('active');
    uvMask.classList.add('active');
    // Set initial mask to center
    uvMask.style.background = 'radial-gradient(circle 0px at 50% 50%, transparent 100%, rgba(0,0,0,0.85) 100%)';
  }

  function deactivateUV() {
    uvActive = false;
    const toggle = document.getElementById('uv-toggle');
    const pinboardFull = document.querySelector('.pinboard-full');
    const uvLayer = document.getElementById('uv-layer');
    const uvMask = document.getElementById('uv-mask');
    toggle.classList.remove('active');
    pinboardFull.classList.remove('uv-mode');
    uvLayer.classList.remove('active');
    uvMask.classList.remove('active');
    // Hide all UV items
    uvLayer.querySelectorAll('.uv-item').forEach(el => el.classList.remove('uv-visible'));
  }

  function updateUVRadius(event, container) {
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    const radiusPx = Math.min(rect.width, rect.height) * 0.18; // ~18% radius

    // Update mask: transparent circle follows cursor
    const uvMask = document.getElementById('uv-mask');
    uvMask.style.background = `radial-gradient(circle ${radiusPx}px at ${xPct}% ${yPct}%, transparent 80%, rgba(0,0,0,0.85) 100%)`;

    // Show/hide UV items based on proximity to cursor
    const uvLayer = document.getElementById('uv-layer');
    uvLayer.querySelectorAll('.uv-item').forEach(el => {
      const itemRect = el.getBoundingClientRect();
      const itemCenterX = itemRect.left + itemRect.width / 2 - rect.left;
      const itemCenterY = itemRect.top + itemRect.height / 2 - rect.top;
      const dist = Math.sqrt((x - itemCenterX) ** 2 + (y - itemCenterY) ** 2);
      if (dist < radiusPx * 1.1) {
        el.classList.add('uv-visible');
      } else {
        el.classList.remove('uv-visible');
      }
    });
  }

  function renderUVItems() {
    const uvLayer = document.getElementById('uv-layer');
    if (!uvLayer) return;

    let html = '';
    PINBOARD_UV.forEach((item, i) => {
      if (item.type === 'arrow') {
        html += `<div class="uv-item uv-arrow" style="top:${item.from.top};left:${item.from.left};transform:rotate(${item.rotation || 0}deg)">
          ← ${item.label} →
        </div>`;
      } else if (item.type === 'note') {
        html += `<div class="uv-item uv-note" style="top:${item.position.top};left:${item.position.left};transform:rotate(${item.rotation || 0}deg)">
          ${item.text}
        </div>`;
      } else if (item.type === 'circle') {
        html += `<div class="uv-item uv-circle" style="top:${item.position.top};left:${item.position.left};width:${item.radius};height:${item.radius}">
          <span class="uv-circle-label">${item.label}</span>
        </div>`;
      }
    });
    uvLayer.innerHTML = html;
  }

})();
