// ============================================================
// KANAPUTZ OBSERVATORY — Wave System Controller
// ============================================================
// Controls progressive content disclosure across 5 waves.
// Every data item has a `wave` property. Only items where
// item.wave <= currentWave are shown.

const WaveSystem = (function() {
  'use strict';

  let currentWave = 5; // Default to wave 5 (all content) for development
  const MAX_WAVE = 5;

  // Engagement tracking — gates the safe in Wave 3
  const engagement = {
    journalPagesOpened: new Set(),
    tapesPlayed: new Set(),
    mapDotsClicked: new Set(),
    safeOpened: false
  };

  // Feature availability per wave
  const featureWaves = {
    terminal:      1,
    map:           1,
    mapFootage:    2,
    journal:       1,
    pinboard:      1,
    cassette:      1,
    uv:            3,
    safe:          2,
    safeDial:      3, // + engagement threshold
    sourceMonitor: 4
  };

  function setWave(n) {
    currentWave = Math.max(1, Math.min(MAX_WAVE, n));
    // Reset engagement on wave change (debug mode resets state)
    engagement.journalPagesOpened.clear();
    engagement.tapesPlayed.clear();
    engagement.mapDotsClicked.clear();
    engagement.safeOpened = false;
    // Notify all listeners
    document.dispatchEvent(new CustomEvent('wavechange', { detail: { wave: currentWave } }));
    updateDebugPanel();
  }

  function getWave() {
    return currentWave;
  }

  // Filter any array by wave — returns items where item.wave <= currentWave
  function getVisibleContent(array) {
    return array.filter(item => item.wave <= currentWave);
  }

  // Track engagement actions
  function trackEngagement(type, id) {
    switch (type) {
      case 'journal':
        engagement.journalPagesOpened.add(id);
        break;
      case 'tape':
        engagement.tapesPlayed.add(id);
        break;
      case 'mapDot':
        engagement.mapDotsClicked.add(id);
        break;
      case 'safe':
        engagement.safeOpened = true;
        break;
    }
    updateDebugPanel();
  }

  // Check if safe dial should be available
  // Requires: 3+ journal pages, 1+ tape, 3+ map dots, and Wave 3+
  function isSafeDialAvailable() {
    return currentWave >= featureWaves.safeDial &&
      engagement.journalPagesOpened.size >= 3 &&
      engagement.tapesPlayed.size >= 1 &&
      engagement.mapDotsClicked.size >= 3;
  }

  function isSafeOpened() {
    return engagement.safeOpened;
  }

  // Check if a feature is available at the current wave
  function isFeatureAvailable(featureId) {
    if (featureId === 'safeDial') return isSafeDialAvailable();
    return currentWave >= (featureWaves[featureId] || 999);
  }

  function getEngagement() {
    return {
      journalPages: engagement.journalPagesOpened.size,
      tapes: engagement.tapesPlayed.size,
      mapDots: engagement.mapDotsClicked.size,
      safeOpened: engagement.safeOpened
    };
  }

  // ===== DEBUG PANEL =====

  function createDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'wave-debug-panel';
    panel.className = 'wave-debug-panel';
    panel.innerHTML = `
      <div class="debug-title">WAVE CONTROL</div>
      <div class="debug-waves">
        ${[1,2,3,4,5].map(w => `<button class="debug-wave-btn" data-wave="${w}">${w}</button>`).join('')}
      </div>
      <div class="debug-info">
        <div>Current: <span id="debug-wave-num">${currentWave}</span></div>
        <div>Journal: <span id="debug-journal">0</span>/3</div>
        <div>Tapes: <span id="debug-tapes">0</span>/1</div>
        <div>Map dots: <span id="debug-dots">0</span>/3</div>
        <div>Safe dial: <span id="debug-safe-dial">NO</span></div>
        <div>Safe opened: <span id="debug-safe-open">NO</span></div>
      </div>
      <div class="debug-features" id="debug-features"></div>
    `;
    document.body.appendChild(panel);

    // Wave button clicks
    panel.querySelectorAll('.debug-wave-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setWave(parseInt(btn.dataset.wave));
      });
    });

    updateDebugPanel();
  }

  function updateDebugPanel() {
    const panel = document.getElementById('wave-debug-panel');
    if (!panel) return;

    // Update wave number
    const numEl = document.getElementById('debug-wave-num');
    if (numEl) numEl.textContent = currentWave;

    // Update engagement
    const je = document.getElementById('debug-journal');
    if (je) je.textContent = engagement.journalPagesOpened.size;
    const te = document.getElementById('debug-tapes');
    if (te) te.textContent = engagement.tapesPlayed.size;
    const de = document.getElementById('debug-dots');
    if (de) de.textContent = engagement.mapDotsClicked.size;
    const sd = document.getElementById('debug-safe-dial');
    if (sd) sd.textContent = isSafeDialAvailable() ? 'YES' : 'NO';
    const so = document.getElementById('debug-safe-open');
    if (so) so.textContent = engagement.safeOpened ? 'YES' : 'NO';

    // Highlight active wave button
    panel.querySelectorAll('.debug-wave-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.wave) === currentWave);
    });

    // Update feature availability
    const featEl = document.getElementById('debug-features');
    if (featEl) {
      featEl.innerHTML = Object.keys(featureWaves).map(f => {
        const available = isFeatureAvailable(f);
        return `<span class="${available ? 'feat-on' : 'feat-off'}">${f}</span>`;
      }).join('');
    }
  }

  function toggleDebugPanel() {
    const panel = document.getElementById('wave-debug-panel');
    if (panel) {
      panel.classList.toggle('visible');
    }
  }

  // Initialize debug panel on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    createDebugPanel();
  });

  // Public API
  return {
    setWave,
    getWave,
    getVisibleContent,
    trackEngagement,
    isFeatureAvailable,
    isSafeDialAvailable,
    isSafeOpened,
    getEngagement,
    toggleDebugPanel
  };
})();
