// ============================================================
// KANAPUTZ OBSERVATORY — Main Application
// ============================================================

(function() {
  'use strict';

  let terminal = null;
  let isDetailOpen = false;
  let journalSpreadIndex = 0;
  let pagesPerSpread = 2;

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    setupHotspots();
    setupCloseButton();
    setupKeyboard();
    populateDetailViews();
  });

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
      terminal = new SightingTerminal(feedEl);
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
        const profPrev = document.getElementById('profile-prev');
        if (profPrev && profPrev.offsetParent !== null) profPrev.click();
      }
      if (e.key === 'ArrowRight' && isDetailOpen) {
        const nextBtn = document.getElementById('journal-next');
        if (nextBtn && nextBtn.offsetParent !== null) nextBtn.click();
        const profNext = document.getElementById('profile-next');
        if (profNext && profNext.offsetParent !== null) profNext.click();
      }
      // Press D to toggle debug mode (shows hotspot borders)
      if ((e.key === 'd' || e.key === 'D') && !isDetailOpen) {
        document.getElementById('room').classList.toggle('debug');
      }
      // Hold Spacebar to reveal all hotspots (like Telltale adventure games)
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

    // --- Mobile/Touch support ---
    // Tap on empty room area (not a zone): briefly reveal all hotspot sparkles
    document.getElementById('room').addEventListener('click', (e) => {
      if (!e.target.closest('.zone') && !isDetailOpen) {
        const room = document.getElementById('room');
        room.classList.add('reveal');
        setTimeout(() => room.classList.remove('reveal'), 1500);
      }
    });
  }

  // ===== POPULATE DETAIL VIEWS =====
  function populateDetailViews() {
    populateProfiles();
    populatePinboard();
    populateNotepad();
    populateSketches();
    populateMap();
  }

  // --- Profiles (single-view with navigation) ---
  let currentProfileIndex = 0;

  function populateProfiles() {
    const viewport = document.getElementById('profiles-viewport');
    if (!viewport) return;

    const svgShapes = {
      'Groovix': `<svg viewBox="0 0 100 120"><path d="M50,20 Q55,10 60,15 Q65,5 58,3 Q50,0 45,8 Q40,3 38,12 Q32,8 35,18 L30,28 Q25,35 22,50 Q18,65 22,80 L20,90 Q18,98 22,102 L28,98 Q30,94 32,90 L38,86 Q42,84 48,86 L52,90 Q54,94 56,98 L62,102 Q66,100 64,94 L62,86 Q66,76 64,60 Q63,45 58,35 Z" fill="none" stroke="#5588cc" stroke-width="1.5"/><circle cx="52" cy="12" r="3" fill="none" stroke="#5588cc" stroke-width="1"/></svg>`,
      'Fugu': `<svg viewBox="0 0 100 100"><path d="M50,25 Q70,12 75,25 Q80,15 78,30 Q85,28 80,38 Q85,45 78,48 Q82,55 75,58 Q78,65 70,65 Q72,75 65,78 Q60,85 50,82 Q40,85 35,78 Q28,75 30,65 Q22,65 25,58 Q18,55 25,48 Q18,45 25,38 Q20,28 28,30 Q25,15 30,25 Q32,12 50,25 Z" fill="none" stroke="#5588cc" stroke-width="1.5"/><circle cx="40" cy="38" r="4" fill="none" stroke="#5588cc" stroke-width="1"/><circle cx="60" cy="35" r="3" fill="none" stroke="#5588cc" stroke-width="1"/><path d="M35,52 Q45,60 65,50" fill="none" stroke="#5588cc" stroke-width="1"/></svg>`,
      'Mr. Q': `<svg viewBox="0 0 100 110"><ellipse cx="50" cy="55" rx="30" ry="35" fill="none" stroke="#5588cc" stroke-width="1.5"/><circle cx="42" cy="45" r="4" fill="none" stroke="#5588cc" stroke-width="1"/><path d="M40,65 Q50,75 60,65" fill="none" stroke="#5588cc" stroke-width="1.5"/><line x1="42" y1="20" x2="38" y2="8" stroke="#5588cc" stroke-width="1.5"/><circle cx="38" cy="6" r="3" fill="none" stroke="#5588cc" stroke-width="1"/><line x1="55" y1="22" x2="58" y2="10" stroke="#5588cc" stroke-width="1.5"/><circle cx="58" cy="8" r="2.5" fill="none" stroke="#5588cc" stroke-width="1"/><line x1="50" y1="90" x2="40" y2="105" stroke="#5588cc" stroke-width="1.5"/><line x1="50" y1="90" x2="60" y2="105" stroke="#5588cc" stroke-width="1.5"/></svg>`,
      'Muncha': `<svg viewBox="0 0 100 110"><circle cx="50" cy="45" r="32" fill="none" stroke="#5588cc" stroke-width="1.5"/><circle cx="45" cy="38" r="5" fill="none" stroke="#5588cc" stroke-width="1"/><circle cx="2" cy="2" r="1.5" fill="#5588cc" transform="translate(43,36)"/><path d="M35,58 Q42,68 58,62" fill="none" stroke="#5588cc" stroke-width="1.5"/><rect x="38" y="58" width="5" height="6" rx="1" fill="none" stroke="#5588cc" stroke-width="1"/><rect x="45" y="60" width="5" height="5" rx="1" fill="none" stroke="#5588cc" stroke-width="1"/><rect x="52" y="59" width="4" height="5" rx="1" fill="none" stroke="#5588cc" stroke-width="1"/><path d="M38,15 L35,5" stroke="#5588cc" stroke-width="1.5"/><path d="M62,15 L65,5" stroke="#5588cc" stroke-width="1.5"/><line x1="40" y1="77" x2="35" y2="100" stroke="#5588cc" stroke-width="1.5"/><line x1="60" y1="77" x2="65" y2="100" stroke="#5588cc" stroke-width="1.5"/></svg>`,
    };

    function renderProfile(index) {
      const profile = PROFILES[index];
      viewport.innerHTML = `
        <div class="profile-card">
          <div class="profile-card-header">
            <div class="profile-avatar">${svgShapes[profile.name] || ''}</div>
            <div>
              <div class="profile-name">${profile.name.toUpperCase()}</div>
              <div class="profile-class">${profile.classification}</div>
            </div>
          </div>
          <div class="profile-field">
            <div class="profile-field-label">First Sighting</div>
            <div class="profile-field-value">${profile.firstSighting}</div>
          </div>
          <div class="profile-field">
            <div class="profile-field-label">Estimated Height</div>
            <div class="profile-field-value">${profile.height}</div>
          </div>
          <div class="profile-field">
            <div class="profile-field-label">Distinguishing Features</div>
            <div class="profile-field-value">${profile.distinguishing}</div>
          </div>
          <div class="profile-field">
            <div class="profile-field-label">Observed Behavior</div>
            <div class="profile-field-value">${profile.behavior}</div>
          </div>
          <div class="profile-field">
            <div class="profile-field-label">Threat Assessment</div>
            <div class="profile-field-value">${profile.dangerLevel}</div>
          </div>
          <div class="profile-notes">"${profile.notes}"</div>
        </div>
      `;
      document.getElementById('profile-count').textContent = `${index + 1} / ${PROFILES.length}`;
    }

    renderProfile(0);

    document.getElementById('profile-prev').addEventListener('click', () => {
      currentProfileIndex = (currentProfileIndex - 1 + PROFILES.length) % PROFILES.length;
      renderProfile(currentProfileIndex);
    });
    document.getElementById('profile-next').addEventListener('click', () => {
      currentProfileIndex = (currentProfileIndex + 1) % PROFILES.length;
      renderProfile(currentProfileIndex);
    });
  }

  // --- Pinboard ---
  function populatePinboard() {
    const surface = document.getElementById('pinboard-surface');
    if (!surface) return;

    // Place post-its — constrained within the cork area of the background image
    const postitPositions = [
      { top: '-1%', left: '21%' },
      { top: '2%', left: '40%' },
      { top: '-1%', left: '55%' },
      { top: '22%', left: '23%' },
      { top: '25%', left: '43%' },
      { top: '45%', left: '21%' },
      { top: '47%', left: '42%' },
      { top: '64%', left: '23%' },
      { top: '66%', left: '40%' },
      { top: '23%', left: '58%' },
      { top: '49%', left: '55%' },
      { top: '66%', left: '57%' },
    ];

    const POSTIT_IMAGES = [
      'postit-1.png', 'postit-2.png', 'postit-3.png', 'postit-4.png',
      'postit-5.png', 'postit-6.png', 'postit-7.png', 'postit-8.png',
      'postit-9.png', 'postit-10.png', 'postit-11.png'
    ];

    POSTIT_NOTES.forEach((note, i) => {
      const pos = postitPositions[i] || { top: `${5 + (i * 8) % 80}%`, left: `${2 + (i * 15) % 55}%` };
      const img = POSTIT_IMAGES[i % POSTIT_IMAGES.length];
      const div = document.createElement('div');
      div.className = 'full-postit';
      div.style.backgroundImage = `url('assets/${img}')`;
      div.style.transform = `rotate(${note.rotation}deg)`;
      div.style.top = pos.top;
      div.style.left = pos.left;
      div.textContent = note.text;
      div.addEventListener('click', (e) => {
        e.stopPropagation();
        const overlay = document.querySelector('.postit-overlay');
        if (div.classList.contains('zoomed')) {
          div.classList.remove('zoomed');
          overlay.classList.remove('active');
        } else {
          document.querySelectorAll('.full-postit.zoomed').forEach(p => p.classList.remove('zoomed'));
          div.classList.add('zoomed');
          overlay.classList.add('active');
        }
      });
      surface.appendChild(div);
    });

    // Overlay to close zoomed post-it
    let overlay = document.querySelector('.postit-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'postit-overlay';
      document.querySelector('#pinboard-detail').appendChild(overlay);
    }
    overlay.addEventListener('click', () => {
      document.querySelectorAll('.full-postit.zoomed').forEach(p => p.classList.remove('zoomed'));
      overlay.classList.remove('active');
    });

    // Place photos
    const photoPositions = [
      { top: '0%', left: '66%', rotation: -3 },
      { top: '23%', left: '69%', rotation: 4 },
      { top: '45%', left: '64%', rotation: -2 },
      { top: '65%', left: '67%', rotation: 5 },
    ];

    PROFILES.forEach((profile, i) => {
      const pos = photoPositions[i];
      const photo = document.createElement('div');
      photo.className = 'pinboard-photo';
      photo.style.top = pos.top;
      photo.style.left = pos.left;
      photo.style.transform = `rotate(${pos.rotation}deg)`;
      photo.innerHTML = `
        <div class="pinboard-photo-placeholder">?</div>
        <div class="pinboard-photo-label">${profile.name}</div>
      `;
      surface.appendChild(photo);
    });

    // Reveal post-its only after the background image is loaded
    const bgImg = new Image();
    bgImg.onload = () => surface.classList.add('bg-loaded');
    bgImg.src = 'assets/cork-bg.png';
    // Fallback in case image is already cached
    if (bgImg.complete) surface.classList.add('bg-loaded');
  }

  // --- Notepad (page-flip journal) ---
  function populateNotepad() {
    const book = document.getElementById('journal-book');
    if (!book) return;

    const isMobileTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const isNarrow = window.matchMedia('(max-width: 768px)');
    const notebookOuter = document.querySelector('.notebook-outer');
    function updatePageMode() {
      const singlePage = isMobileTouch || isNarrow.matches;
      pagesPerSpread = singlePage ? 1 : 2;
      if (notebookOuter) notebookOuter.classList.toggle('single-page', singlePage);
    }
    updatePageMode();
    isNarrow.addEventListener('change', () => {
      updatePageMode();
      journalSpreadIndex = 0;
      renderSpread();
    });

    renderSpread();

    document.getElementById('journal-prev').addEventListener('click', () => {
      if (journalSpreadIndex > 0) {
        flipPage('right', () => { journalSpreadIndex--; renderSpread(); });
      }
    });
    document.getElementById('journal-next').addEventListener('click', () => {
      const totalSpreads = Math.ceil(NOTEBOOK_ENTRIES.length / pagesPerSpread);
      if (journalSpreadIndex < totalSpreads - 1) {
        flipPage('left', () => { journalSpreadIndex++; renderSpread(); });
      }
    });

    // Swipe support for mobile
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
  }

  function renderSpread() {
    const book = document.getElementById('journal-book');
    const totalSpreads = Math.ceil(NOTEBOOK_ENTRIES.length / pagesPerSpread);
    const startIndex = journalSpreadIndex * pagesPerSpread;

    let html = '<div class="journal-spread">';
    for (let i = 0; i < pagesPerSpread; i++) {
      const entryIndex = startIndex + i;
      const pageNum = entryIndex + 1;
      const side = (pagesPerSpread === 2) ? (i === 0 ? 'left' : 'right') : '';

      if (entryIndex < NOTEBOOK_ENTRIES.length) {
        const entry = NOTEBOOK_ENTRIES[entryIndex];
        html += `
          <div class="journal-page ${side}">
            <div class="journal-page-content">
              <div class="notebook-date">${entry.date}</div>
              <div class="notebook-text">${entry.text}</div>
            </div>
            <div class="journal-page-number">${pageNum}</div>
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
      const right = Math.min(startIndex + 2, NOTEBOOK_ENTRIES.length);
      countEl.textContent = `${left}–${right} / ${NOTEBOOK_ENTRIES.length}`;
    } else {
      countEl.textContent = `${startIndex + 1} / ${NOTEBOOK_ENTRIES.length}`;
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

  // --- Sightings Map (click dots to show info) ---
  function populateMap() {
    const mapScreen = document.getElementById('map-screen');
    const mapInfo = document.getElementById('map-info');
    if (!mapScreen || !mapInfo) return;

    mapScreen.querySelectorAll('.map-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(dot.getAttribute('data-sighting'));
        const sighting = SIGHTINGS[idx];
        if (!sighting) return;

        mapInfo.innerHTML = `
          <div class="map-info-date">${sighting.date} — ${sighting.time}</div>
          <div class="map-info-location">${sighting.location}</div>
          <div class="map-info-desc">${sighting.description}</div>
        `;
        mapInfo.classList.add('active');
      });
    });

    // Click on monitor (not a dot) closes the info panel
    document.querySelector('.map-monitor').addEventListener('click', () => {
      mapInfo.classList.remove('active');
    });

    // Show dots only after monitor image loads
    const bgImg = new Image();
    bgImg.onload = () => mapScreen.classList.add('bg-loaded');
    bgImg.src = 'assets/terminal2-bg.png';
    if (bgImg.complete) mapScreen.classList.add('bg-loaded');
  }

  // --- Sketches (wall-pinned layout with image assets) ---
  function populateSketches() {
    const wall = document.getElementById('sketches-grid');
    if (!wall) return;

    // Wall positions — 5 sketches scattered randomly (smaller to leave room for more)
    const positions = [
      { left: '4%',  top: '6%',  width: '16%', rotation: -3 },
      { left: '32%', top: '3%',  width: '17%', rotation: 2 },
      { left: '64%', top: '8%',  width: '15%', rotation: -1 },
      { left: '8%',  top: '50%', width: '16%', rotation: 1 },
      { left: '45%', top: '48%', width: '18%', rotation: -2 },
    ];

    // Wall annotations (scrawled on wall between sketches)
    const annotations = [
      { text: 'same species??', left: '60%', top: '55%', rotation: -5 },
      { text: '→ compare with Berlin photo', left: '78%', top: '75%', rotation: 2 },
      { text: 'SOURCE connection?', left: '80%', top: '40%', rotation: -90 },
    ];

    WALL_SKETCHES.forEach((sketch, i) => {
      const pos = positions[i];
      const item = document.createElement('div');
      item.className = 'sketch-wall-item';
      item.style.left = pos.left;
      item.style.top = pos.top;
      item.style.width = pos.width;
      item.style.transform = `rotate(${pos.rotation}deg)`;

      item.innerHTML = `<img src="${sketch.image}" alt="${sketch.name}" class="sketch-wall-img"/>`;

      // Click to zoom
      item.addEventListener('click', () => {
        const overlay = document.querySelector('.sketch-overlay');
        const zoomed = document.querySelector('.sketch-zoomed');
        zoomed.innerHTML = `
          <img src="${sketch.image}" alt="${sketch.name}" class="sketch-zoomed-img"/>
        `;
        overlay.classList.add('active');
        zoomed.classList.add('active');
      });

      wall.appendChild(item);
    });

    // Zoom overlay
    let overlay = document.querySelector('.sketch-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sketch-overlay';
      const zoomed = document.createElement('div');
      zoomed.className = 'sketch-zoomed';
      document.getElementById('sketches-detail').appendChild(overlay);
      document.getElementById('sketches-detail').appendChild(zoomed);

      const closeZoom = () => {
        overlay.classList.remove('active');
        zoomed.classList.remove('active');
      };
      overlay.addEventListener('click', closeZoom);
      zoomed.addEventListener('click', closeZoom);
    }

    // Add wall annotations
    annotations.forEach(ann => {
      const el = document.createElement('div');
      el.className = 'sketch-wall-annotation';
      el.style.left = ann.left;
      el.style.top = ann.top;
      el.style.transform = `rotate(${ann.rotation}deg)`;
      el.textContent = ann.text;
      wall.appendChild(el);
    });
  }

})();
