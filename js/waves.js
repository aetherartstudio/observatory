// ============================================================
// KANAPUTZ OBSERVATORY — Wave System Controller (v12)
// ============================================================
// TIME-ONLY release across 5 waves (design brief v12).
// Waves unlock purely on elapsed time since LAUNCH_DATE; inside
// each wave, individual items drip in on per-item `releaseDay`
// offsets. No engagement thresholds, no accounts.
// localStorage keeps only cosmetic, loss-tolerant flags
// (UV lamp found/used, safe opened, first-visit markers).
//
// Wave map (offsets from LAUNCH_DATE = Week 6 Day 1 of the
// social calendar):
//   W1  +0d   "They are everywhere — and they have names"
//   W2  +14d  "Something is wrong"           (with the Fading)
//   W3  +28d  "Converging on Taipei"         (Phase 4 opens)
//   W4  +35d  "The Source is in Shilin"      (safe puzzle live)
//   W5  +42d  "The full picture"             (gallery bridge)

const WaveSystem = (function() {
  'use strict';

  const STORAGE_KEY = 'kanaputz_observatory_state';
  const SCHEMA_VERSION = 3; // bumped for v12 restructure (5 waves, time-only)
  const MAX_WAVE = 5;

  // ===== LAUNCH CONFIGURATION =====
  // SET TO THE REAL LAUNCH DATE (Week 6 Day 1 of the social calendar)
  // BEFORE GO-LIVE. While this date is in the future, organic visitors
  // see Wave 1 launch-day content only — use the debug panel (D key)
  // to preview any wave.
  const LAUNCH_DATE = new Date('2026-12-31T00:00:00Z');

  // Gallery opening day (Week 12). Flips the Source Monitor from
  // installation footage to the live crystal feed. Adjust to the real
  // date once the Gallery team fixes it.
  const GALLERY_DATE = new Date(LAUNCH_DATE.getTime() + 44 * 86400000);

  // Time gates: days since LAUNCH_DATE for each wave (v12 offsets)
  const TIME_GATES = { 1: 0, 2: 14, 3: 28, 4: 35, 5: 42 };

  // ===== STATE (cosmetic flags only — safe to lose) =====
  let state = {
    uvLampFound: false,   // discovered the hidden clickable
    uvLampUsed: false,    // actually toggled UV on pinboard
    safeOpened: false,    // entered 3-17-58
    liveEntryShown: false, // the one-time "live typing" terminal moment
    debugOverride: null
  };

  // Feature availability per wave (v12)
  const featureWaves = {
    terminal:      1,
    map:           1,
    mapFootage:    2,
    journal:       1,
    pinboard:      1,
    cassette:      1,
    uvLampObject:  2, // the hidden lamp appears in the clutter from W2
    uv:            1, // UV toggle appears after uvLampFound, not wave-gated
    safe:          1, // safe visible (locked) from launch — it is in the desk art
    safeDial:      4, // dial becomes interactive at W4 (anomalies carry the code)
    sourceMonitor: 5
  };

  // ===== TIME =====
  function daysSinceLaunch() {
    const diff = Date.now() - LAUNCH_DATE.getTime();
    return Math.max(0, Math.floor(diff / 86400000));
  }

  function timeGateMet(wave) {
    return daysSinceLaunch() >= (TIME_GATES[wave] || 0);
  }

  // Highest wave whose time gate has passed — the only wave authority
  function computeWaveFromClock() {
    let w = 1;
    for (let i = 2; i <= MAX_WAVE; i++) {
      if (timeGateMet(i)) w = i; else break;
    }
    return w;
  }

  function isGalleryLive() {
    if (state.debugOverride !== null) return state.debugOverride >= MAX_WAVE;
    return Date.now() >= GALLERY_DATE.getTime();
  }

  // ===== LOCALSTORAGE (wrapped — in-app browsers may wipe or block) =====
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || saved.version !== SCHEMA_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      state.uvLampFound = !!saved.uvLampFound;
      state.uvLampUsed = !!saved.uvLampUsed;
      state.safeOpened = !!saved.safeOpened;
      state.liveEntryShown = !!saved.liveEntryShown;
      state.debugOverride = (typeof saved.debugOverride === 'number') ? saved.debugOverride : null;
    } catch (err) {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: SCHEMA_VERSION,
        uvLampFound: state.uvLampFound,
        uvLampUsed: state.uvLampUsed,
        safeOpened: state.safeOpened,
        liveEntryShown: state.liveEntryShown,
        debugOverride: state.debugOverride
      }));
    } catch (err) { /* storage unavailable — degrade gracefully */ }
  }

  function resetState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    state.uvLampFound = false;
    state.uvLampUsed = false;
    state.safeOpened = false;
    state.liveEntryShown = false;
    state.debugOverride = null;
    document.dispatchEvent(new CustomEvent('wavechange', { detail: { wave: getWave() } }));
    updateDebugPanel();
  }

  // ===== WAVE CONTROL =====
  function getWave() {
    return (state.debugOverride !== null) ? state.debugOverride : computeWaveFromClock();
  }

  // Debug override — preview any wave. Overriding to MAX_WAVE also
  // opens the safe so post-safe content (dossier, T-06, final note)
  // can be QA'd; any other override closes it again.
  function setWaveDebug(n) {
    state.debugOverride = Math.max(1, Math.min(MAX_WAVE, n));
    state.safeOpened = (state.debugOverride >= MAX_WAVE);
    saveState();
    document.dispatchEvent(new CustomEvent('wavechange', { detail: { wave: getWave() } }));
    updateDebugPanel();
  }

  function clearDebugOverride() {
    state.debugOverride = null;
    saveState();
    document.dispatchEvent(new CustomEvent('wavechange', { detail: { wave: getWave() } }));
    updateDebugPanel();
  }

  function setWave(n) { setWaveDebug(n); }

  // Days elapsed inside a given wave's window (for drip gating)
  function daysIntoWave(wave) {
    return daysSinceLaunch() - (TIME_GATES[wave] || 0);
  }

  // Item visibility: wave gate + per-item drip offset.
  // In debug override, the whole selected wave (all drips) is shown.
  function itemVisible(item, wave) {
    if (item.wave > wave) return false;
    if (item.replacedByWave && wave >= item.replacedByWave) return false;
    if (state.debugOverride !== null) return true;
    const rd = item.releaseDay || 0;
    return daysIntoWave(item.wave) >= rd;
  }

  function getVisibleContent(array) {
    const wave = getWave();
    return array.filter(item => itemVisible(item, wave));
  }

  // An item counts as "newly pinned" for ~3 days after its release —
  // returning visitors spot what changed (the pin sits askew).
  function isNewlyReleased(item) {
    if (state.debugOverride !== null) return false;
    const releaseDays = (TIME_GATES[item.wave] || 0) + (item.releaseDay || 0);
    const age = daysSinceLaunch() - releaseDays;
    return age >= 0 && age < 3;
  }

  // Next scheduled content drop (for the terminal footer).
  // Scans an array of items for the soonest future release.
  function getNextDropInfo(arrays) {
    let bestDays = null;
    (arrays || []).forEach(arr => {
      arr.forEach(item => {
        const rel = (TIME_GATES[item.wave] || 0) + (item.releaseDay || 0);
        if (rel > daysSinceLaunch() && (bestDays === null || rel < bestDays)) bestDays = rel;
      });
    });
    if (bestDays === null) return null;
    const when = new Date(LAUNCH_DATE.getTime() + bestDays * 86400000);
    // Diegetic timestamp: always the small hours, Taipei time
    const y = when.getUTCFullYear();
    const m = String(when.getUTCMonth() + 1).padStart(2, '0');
    const d = String(when.getUTCDate()).padStart(2, '0');
    return { date: `${y}-${m}-${d}`, label: `${m}-${d} 03:00 TST` };
  }

  // ===== ENGAGEMENT API (v12: cosmetic flags only) =====
  // Wave progression no longer consumes engagement. The tracked flags
  // that remain are the two skill gates + the one-time live entry.
  function trackEngagement(type, id) {
    switch (type) {
      case 'uvLampFind': state.uvLampFound = true; break;
      case 'uvLamp':     state.uvLampUsed = true; break;
      case 'safe':       state.safeOpened = true; break;
      case 'liveEntry':  state.liveEntryShown = true; break;
      default: return; // journal/tape/mapDot/… — accepted, no longer stored
    }
    saveState();
    updateDebugPanel();
  }

  // ===== GATE QUERIES =====
  function isSafeDialAvailable() { return getWave() >= featureWaves.safeDial; }
  function isSafeOpened() { return state.safeOpened; }
  function isUVLampFound() { return state.uvLampFound; }
  function isLiveEntryShown() { return state.liveEntryShown; }
  function hasTapePlayed() { return true; } // no per-tape history in v12

  function isFeatureAvailable(featureId) {
    if (featureId === 'safeDial') return isSafeDialAvailable();
    if (featureId === 'uv') return state.uvLampFound;
    return getWave() >= (featureWaves[featureId] || 999);
  }

  // ===== DEBUG PANEL =====
  function createDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'wave-debug-panel';
    panel.className = 'wave-debug-panel';
    panel.innerHTML = `
      <div class="debug-title">WAVE CONTROL (v12 — time-only)</div>
      <div class="debug-waves">
        ${[1,2,3,4,5].map(w => `<button class="debug-wave-btn" data-wave="${w}">${w}</button>`).join('')}
      </div>
      <div class="debug-actions">
        <button class="debug-action-btn" id="debug-organic">⟳ CLOCK</button>
        <button class="debug-action-btn debug-reset" id="debug-reset">✕ RESET</button>
      </div>
      <div class="debug-info">
        <div>Clock wave: <span id="debug-wave-earned"></span> | Showing: <span id="debug-wave-num"></span></div>
        <div>Days since launch: <span id="debug-days"></span> | Next gate: <span id="debug-time-gate"></span></div>
        <div>Gallery live: <span id="debug-gallery"></span></div>
        <div>UV found: <span id="debug-uv-found">✗</span> | UV used: <span id="debug-uv">✗</span> | Safe dial: <span id="debug-safe-dial">NO</span> | Safe: <span id="debug-safe-open">NO</span></div>
      </div>
      <div class="debug-features" id="debug-features"></div>
    `;
    document.body.appendChild(panel);

    panel.querySelectorAll('.debug-wave-btn').forEach(btn => {
      btn.addEventListener('click', () => setWaveDebug(parseInt(btn.dataset.wave)));
    });
    document.getElementById('debug-organic').addEventListener('click', clearDebugOverride);
    document.getElementById('debug-reset').addEventListener('click', resetState);

    updateDebugPanel();
  }

  function updateDebugPanel() {
    const panel = document.getElementById('wave-debug-panel');
    if (!panel) return;

    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    set('debug-wave-earned', computeWaveFromClock());
    set('debug-wave-num', getWave() + (state.debugOverride !== null ? ' (override)' : ''));
    set('debug-days', daysSinceLaunch());
    const clockWave = computeWaveFromClock();
    if (clockWave >= MAX_WAVE) {
      set('debug-time-gate', 'ALL OPEN');
    } else {
      const nextW = clockWave + 1;
      set('debug-time-gate', `W${nextW} in ${TIME_GATES[nextW] - daysSinceLaunch()}d`);
    }
    set('debug-gallery', isGalleryLive() ? 'YES' : 'NO');
    set('debug-uv-found', state.uvLampFound ? '✓' : '✗');
    set('debug-uv', state.uvLampUsed ? '✓' : '✗');
    set('debug-safe-dial', isSafeDialAvailable() ? 'YES' : 'NO');
    set('debug-safe-open', state.safeOpened ? 'YES' : 'NO');

    panel.querySelectorAll('.debug-wave-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.wave) === getWave());
    });

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
    if (panel) panel.classList.toggle('visible');
  }

  // ===== INITIALIZATION =====
  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    createDebugPanel();
    document.dispatchEvent(new CustomEvent('wavechange', { detail: { wave: getWave() } }));

    // Re-check the clock every minute — a wave or drip that unlocks
    // mid-session appears without a reload (subtle notification via app.js).
    let lastWave = getWave();
    setInterval(() => {
      if (state.debugOverride !== null) return;
      const w = computeWaveFromClock();
      if (w !== lastWave) {
        const prev = lastWave;
        lastWave = w;
        document.dispatchEvent(new CustomEvent('wavechange', { detail: { wave: w } }));
        document.dispatchEvent(new CustomEvent('waveunlock', { detail: { wave: w, previousWave: prev } }));
      }
      updateDebugPanel();
    }, 60000);
  });

  // Public API (superset of v10 so existing callers keep working)
  return {
    setWave,
    getWave,
    getVisibleContent,
    trackEngagement,
    isFeatureAvailable,
    isSafeDialAvailable,
    isSafeOpened,
    isUVLampFound,
    isLiveEntryShown,
    isGalleryLive,
    isNewlyReleased,
    getNextDropInfo,
    hasTapePlayed,
    toggleDebugPanel,
    resetState,
    clearDebugOverride,
    daysSinceLaunch,
    daysIntoWave,
    timeGateMet
  };
})();
