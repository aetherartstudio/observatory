// ============================================================
// KANAPUTZ OBSERVATORY — Wave System Controller
// ============================================================
// Engagement-based progressive disclosure across 5 waves.
// Every data item has a `wave` property. Only items where
// item.wave <= currentWave are shown.
// State persists via localStorage for cross-session continuity.

const WaveSystem = (function() {
  'use strict';

  const STORAGE_KEY = 'kanaputz_observatory_state';
  const SCHEMA_VERSION = 1;
  const MAX_WAVE = 5;

  // ===== STATE =====

  let state = {
    wave: 1,
    engagement: {
      journalPagesOpened: new Set(),
      tapesPlayed: new Set(),
      mapDotsClicked: new Set(),
      shilinDotsClicked: new Set(),
      terminalEntriesRead: new Set(),
      mNoteFound: false,
      shilinZoomExplored: false,
      uvLampUsed: false,
      safeOpened: false
    },
    debugOverride: null
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

  // ===== WAVE PROGRESSION THRESHOLDS =====

  const WAVE_THRESHOLDS = {
    2: { journalPages: 2, terminalEntries: 1, mapDots: 2 },
    3: { journalPages: 4, tapesPlayed: 1, mapDots: 5, mNoteFound: true },
    4: { journalPages: 6, shilinZoomExplored: true, shilinDots: 3, uvLampUsed: true },
    5: { safeOpened: true }
  };

  // ===== LOCALSTORAGE PERSISTENCE =====

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return; // first visit — keep defaults

      const saved = JSON.parse(raw);
      if (!saved || saved.version !== SCHEMA_VERSION) {
        // Schema mismatch — reset to clean state
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      const e = saved.engagement || {};
      state.wave = Math.max(1, Math.min(MAX_WAVE, saved.wave || 1));
      state.debugOverride = (typeof saved.debugOverride === 'number') ? saved.debugOverride : null;

      // Restore Sets from arrays
      state.engagement.journalPagesOpened = new Set(e.journalPagesOpened || []);
      state.engagement.tapesPlayed = new Set(e.tapesPlayed || []);
      state.engagement.mapDotsClicked = new Set(e.mapDotsClicked || []);
      state.engagement.shilinDotsClicked = new Set(e.shilinDotsClicked || []);
      state.engagement.terminalEntriesRead = new Set(e.terminalEntriesRead || []);
      state.engagement.mNoteFound = !!e.mNoteFound;
      state.engagement.shilinZoomExplored = !!e.shilinZoomExplored;
      state.engagement.uvLampUsed = !!e.uvLampUsed;
      state.engagement.safeOpened = !!e.safeOpened;
    } catch (err) {
      console.warn('WaveSystem: failed to load state, resetting', err);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function saveState() {
    try {
      const data = {
        version: SCHEMA_VERSION,
        wave: state.wave,
        engagement: {
          journalPagesOpened: [...state.engagement.journalPagesOpened],
          tapesPlayed: [...state.engagement.tapesPlayed],
          mapDotsClicked: [...state.engagement.mapDotsClicked],
          shilinDotsClicked: [...state.engagement.shilinDotsClicked],
          terminalEntriesRead: [...state.engagement.terminalEntriesRead],
          mNoteFound: state.engagement.mNoteFound,
          shilinZoomExplored: state.engagement.shilinZoomExplored,
          uvLampUsed: state.engagement.uvLampUsed,
          safeOpened: state.engagement.safeOpened
        },
        debugOverride: state.debugOverride
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('WaveSystem: failed to save state', err);
    }
  }

  function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    state.wave = 1;
    state.debugOverride = null;
    state.engagement.journalPagesOpened.clear();
    state.engagement.tapesPlayed.clear();
    state.engagement.mapDotsClicked.clear();
    state.engagement.shilinDotsClicked.clear();
    state.engagement.terminalEntriesRead.clear();
    state.engagement.mNoteFound = false;
    state.engagement.shilinZoomExplored = false;
    state.engagement.uvLampUsed = false;
    state.engagement.safeOpened = false;
    document.dispatchEvent(new CustomEvent('wavechange', { detail: { wave: getWave() } }));
    updateDebugPanel();
  }

  // ===== WAVE CONTROL =====

  function getWave() {
    return (state.debugOverride !== null) ? state.debugOverride : state.wave;
  }

  // Organic progression — earned through engagement
  function setWaveOrganic(n) {
    const clamped = Math.max(1, Math.min(MAX_WAVE, n));
    if (clamped <= state.wave) return; // can't regress organically
    const prev = state.wave;
    state.wave = clamped;
    state.debugOverride = null;
    saveState();
    document.dispatchEvent(new CustomEvent('wavechange', { detail: { wave: getWave() } }));
    document.dispatchEvent(new CustomEvent('waveunlock', { detail: { wave: clamped, previousWave: prev } }));
    updateDebugPanel();
  }

  // Debug override — manually set visible wave without changing earned state
  function setWaveDebug(n) {
    state.debugOverride = Math.max(1, Math.min(MAX_WAVE, n));
    saveState();
    document.dispatchEvent(new CustomEvent('wavechange', { detail: { wave: getWave() } }));
    updateDebugPanel();
  }

  // Clear debug override — return to earned wave
  function clearDebugOverride() {
    state.debugOverride = null;
    saveState();
    document.dispatchEvent(new CustomEvent('wavechange', { detail: { wave: getWave() } }));
    updateDebugPanel();
  }

  // Legacy setWave — used by debug panel buttons
  function setWave(n) {
    setWaveDebug(n);
  }

  // Filter any array by wave — returns items where item.wave <= currentWave
  function getVisibleContent(array) {
    return array.filter(item => item.wave <= getWave());
  }

  // ===== ENGAGEMENT TRACKING =====

  function trackEngagement(type, id) {
    switch (type) {
      case 'journal':
        state.engagement.journalPagesOpened.add(id);
        break;
      case 'tape':
        state.engagement.tapesPlayed.add(id);
        break;
      case 'mapDot':
        state.engagement.mapDotsClicked.add(id);
        break;
      case 'shilinDot':
        state.engagement.shilinDotsClicked.add(id);
        break;
      case 'terminalEntry':
        state.engagement.terminalEntriesRead.add(id);
        break;
      case 'mNote':
        state.engagement.mNoteFound = true;
        break;
      case 'shilinZoom':
        state.engagement.shilinZoomExplored = true;
        break;
      case 'uvLamp':
        state.engagement.uvLampUsed = true;
        break;
      case 'safe':
        state.engagement.safeOpened = true;
        break;
    }
    saveState();
    checkWaveProgression();
    updateDebugPanel();
  }

  // ===== WAVE PROGRESSION ENGINE =====

  function meetsThreshold(req) {
    const e = state.engagement;
    const totalMapDots = e.mapDotsClicked.size + e.shilinDotsClicked.size;

    if (req.journalPages && e.journalPagesOpened.size < req.journalPages) return false;
    if (req.terminalEntries && e.terminalEntriesRead.size < req.terminalEntries) return false;
    if (req.mapDots && totalMapDots < req.mapDots) return false;
    if (req.tapesPlayed && e.tapesPlayed.size < req.tapesPlayed) return false;
    if (req.mNoteFound && !e.mNoteFound) return false;
    if (req.shilinZoomExplored && !e.shilinZoomExplored) return false;
    if (req.shilinDots && e.shilinDotsClicked.size < req.shilinDots) return false;
    if (req.uvLampUsed && !e.uvLampUsed) return false;
    if (req.safeOpened && !e.safeOpened) return false;
    return true;
  }

  function checkWaveProgression() {
    // Don't auto-promote during debug override
    if (state.debugOverride !== null) return;

    const currentOrganic = state.wave;
    let nextWave = currentOrganic;

    // Check each threshold from current+1 upward
    for (let w = currentOrganic + 1; w <= MAX_WAVE; w++) {
      const req = WAVE_THRESHOLDS[w];
      if (!req) continue;
      if (meetsThreshold(req)) {
        nextWave = w;
      } else {
        break; // sequential — can't skip waves
      }
    }

    if (nextWave > currentOrganic) {
      setWaveOrganic(nextWave);
    }
  }

  // ===== SAFE GATE (separate from wave progression) =====

  function isSafeDialAvailable() {
    const e = state.engagement;
    const totalMapDots = e.mapDotsClicked.size + e.shilinDotsClicked.size;
    return getWave() >= featureWaves.safeDial &&
      e.journalPagesOpened.size >= 3 &&
      e.tapesPlayed.size >= 1 &&
      totalMapDots >= 3;
  }

  function isSafeOpened() {
    return state.engagement.safeOpened;
  }

  function hasTapePlayed(tapeId) {
    return state.engagement.tapesPlayed.has(tapeId);
  }

  function isFeatureAvailable(featureId) {
    if (featureId === 'safeDial') return isSafeDialAvailable();
    return getWave() >= (featureWaves[featureId] || 999);
  }

  function getEngagement() {
    const e = state.engagement;
    return {
      journalPages: e.journalPagesOpened.size,
      tapes: e.tapesPlayed.size,
      mapDots: e.mapDotsClicked.size + e.shilinDotsClicked.size,
      shilinDots: e.shilinDotsClicked.size,
      terminalEntries: e.terminalEntriesRead.size,
      mNoteFound: e.mNoteFound,
      shilinZoomExplored: e.shilinZoomExplored,
      uvLampUsed: e.uvLampUsed,
      safeOpened: e.safeOpened
    };
  }

  // Get unmet requirements for the next wave (for debug panel)
  function getNextWaveNeeds() {
    const nextW = state.wave + 1;
    if (nextW > MAX_WAVE) return null;
    const req = WAVE_THRESHOLDS[nextW];
    if (!req) return null;

    const e = state.engagement;
    const totalMapDots = e.mapDotsClicked.size + e.shilinDotsClicked.size;
    const needs = [];

    if (req.journalPages && e.journalPagesOpened.size < req.journalPages) {
      needs.push(`${req.journalPages - e.journalPagesOpened.size} more journal page(s)`);
    }
    if (req.terminalEntries && e.terminalEntriesRead.size < req.terminalEntries) {
      needs.push(`${req.terminalEntries - e.terminalEntriesRead.size} more terminal entry(ies)`);
    }
    if (req.mapDots && totalMapDots < req.mapDots) {
      needs.push(`${req.mapDots - totalMapDots} more map dot(s)`);
    }
    if (req.tapesPlayed && e.tapesPlayed.size < req.tapesPlayed) {
      needs.push(`${req.tapesPlayed - e.tapesPlayed.size} more tape(s)`);
    }
    if (req.mNoteFound && !e.mNoteFound) needs.push("M.'s note");
    if (req.shilinZoomExplored && !e.shilinZoomExplored) needs.push('Shilin zoom');
    if (req.shilinDots && e.shilinDotsClicked.size < req.shilinDots) {
      needs.push(`${req.shilinDots - e.shilinDotsClicked.size} more Shilin dot(s)`);
    }
    if (req.uvLampUsed && !e.uvLampUsed) needs.push('UV lamp');
    if (req.safeOpened && !e.safeOpened) needs.push('Open safe');

    return { wave: nextW, needs };
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
      <div class="debug-actions">
        <button class="debug-action-btn" id="debug-organic">⟳ ORGANIC</button>
        <button class="debug-action-btn debug-reset" id="debug-reset">✕ RESET</button>
      </div>
      <div class="debug-info">
        <div>Earned: <span id="debug-wave-earned">${state.wave}</span> | Showing: <span id="debug-wave-num">${getWave()}</span>${state.debugOverride !== null ? ' (override)' : ''}</div>
        <div>Journal: <span id="debug-journal">0</span> | Tapes: <span id="debug-tapes">0</span> | Map: <span id="debug-dots">0</span></div>
        <div>Terminal: <span id="debug-terminal">0</span> | M.note: <span id="debug-mnote">✗</span> | Shilin: <span id="debug-shilin">✗</span></div>
        <div>UV: <span id="debug-uv">✗</span> | Safe dial: <span id="debug-safe-dial">NO</span> | Safe: <span id="debug-safe-open">NO</span></div>
        <div class="debug-next" id="debug-next"></div>
      </div>
      <div class="debug-features" id="debug-features"></div>
    `;
    document.body.appendChild(panel);

    // Wave button clicks — debug override
    panel.querySelectorAll('.debug-wave-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setWaveDebug(parseInt(btn.dataset.wave));
      });
    });

    // Organic button — clear override
    document.getElementById('debug-organic').addEventListener('click', () => {
      clearDebugOverride();
    });

    // Reset button — full state reset
    document.getElementById('debug-reset').addEventListener('click', () => {
      resetState();
    });

    updateDebugPanel();
  }

  function updateDebugPanel() {
    const panel = document.getElementById('wave-debug-panel');
    if (!panel) return;

    const e = state.engagement;
    const totalMapDots = e.mapDotsClicked.size + e.shilinDotsClicked.size;

    // Wave numbers
    const earnedEl = document.getElementById('debug-wave-earned');
    if (earnedEl) earnedEl.textContent = state.wave;
    const numEl = document.getElementById('debug-wave-num');
    if (numEl) numEl.textContent = getWave() + (state.debugOverride !== null ? ' (override)' : '');

    // Engagement metrics
    const je = document.getElementById('debug-journal');
    if (je) je.textContent = e.journalPagesOpened.size;
    const te = document.getElementById('debug-tapes');
    if (te) te.textContent = e.tapesPlayed.size;
    const de = document.getElementById('debug-dots');
    if (de) de.textContent = totalMapDots;
    const tr = document.getElementById('debug-terminal');
    if (tr) tr.textContent = e.terminalEntriesRead.size;
    const mn = document.getElementById('debug-mnote');
    if (mn) mn.textContent = e.mNoteFound ? '✓' : '✗';
    const sh = document.getElementById('debug-shilin');
    if (sh) sh.textContent = e.shilinZoomExplored ? '✓' : '✗';
    const uv = document.getElementById('debug-uv');
    if (uv) uv.textContent = e.uvLampUsed ? '✓' : '✗';
    const sd = document.getElementById('debug-safe-dial');
    if (sd) sd.textContent = isSafeDialAvailable() ? 'YES' : 'NO';
    const so = document.getElementById('debug-safe-open');
    if (so) so.textContent = e.safeOpened ? 'YES' : 'NO';

    // Next wave needs
    const nextEl = document.getElementById('debug-next');
    if (nextEl) {
      const info = getNextWaveNeeds();
      if (info && info.needs.length > 0) {
        nextEl.textContent = `→ W${info.wave}: ${info.needs.join(', ')}`;
      } else if (state.wave >= MAX_WAVE) {
        nextEl.textContent = '→ MAX WAVE REACHED';
      } else {
        nextEl.textContent = '→ Ready for next wave!';
      }
    }

    // Highlight active wave button — show earned vs override
    panel.querySelectorAll('.debug-wave-btn').forEach(btn => {
      const w = parseInt(btn.dataset.wave);
      btn.classList.toggle('active', w === getWave());
      btn.classList.toggle('earned', w <= state.wave && state.debugOverride !== null);
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

  // ===== INITIALIZATION =====

  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    createDebugPanel();
    // Dispatch initial wavechange so all consumers render with correct wave
    document.dispatchEvent(new CustomEvent('wavechange', { detail: { wave: getWave() } }));
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
    hasTapePlayed,
    getEngagement,
    toggleDebugPanel,
    resetState,
    clearDebugOverride
  };
})();
