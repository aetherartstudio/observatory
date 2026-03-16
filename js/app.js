// ============================================================
// KANAPUTZ OBSERVATORY — Main Application
// ============================================================

(function() {
  'use strict';

  let terminal = null;
  let isDetailOpen = false;

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
  }

  // ===== POPULATE DETAIL VIEWS =====
  function populateDetailViews() {
    populateProfiles();
    populatePinboard();
    populateNotepad();
    populateSketches();
  }

  // --- Profiles ---
  function populateProfiles() {
    const grid = document.getElementById('profiles-grid');
    if (!grid) return;

    const svgShapes = {
      'Groovix': `<svg viewBox="0 0 100 120"><path d="M50,20 Q55,10 60,15 Q65,5 58,3 Q50,0 45,8 Q40,3 38,12 Q32,8 35,18 L30,28 Q25,35 22,50 Q18,65 22,80 L20,90 Q18,98 22,102 L28,98 Q30,94 32,90 L38,86 Q42,84 48,86 L52,90 Q54,94 56,98 L62,102 Q66,100 64,94 L62,86 Q66,76 64,60 Q63,45 58,35 Z" fill="none" stroke="#5588cc" stroke-width="1.5"/><circle cx="52" cy="12" r="3" fill="none" stroke="#5588cc" stroke-width="1"/></svg>`,
      'Fugu': `<svg viewBox="0 0 100 100"><path d="M50,25 Q70,12 75,25 Q80,15 78,30 Q85,28 80,38 Q85,45 78,48 Q82,55 75,58 Q78,65 70,65 Q72,75 65,78 Q60,85 50,82 Q40,85 35,78 Q28,75 30,65 Q22,65 25,58 Q18,55 25,48 Q18,45 25,38 Q20,28 28,30 Q25,15 30,25 Q32,12 50,25 Z" fill="none" stroke="#5588cc" stroke-width="1.5"/><circle cx="40" cy="38" r="4" fill="none" stroke="#5588cc" stroke-width="1"/><circle cx="60" cy="35" r="3" fill="none" stroke="#5588cc" stroke-width="1"/><path d="M35,52 Q45,60 65,50" fill="none" stroke="#5588cc" stroke-width="1"/></svg>`,
      'Mr. Q': `<svg viewBox="0 0 100 110"><ellipse cx="50" cy="55" rx="30" ry="35" fill="none" stroke="#5588cc" stroke-width="1.5"/><circle cx="42" cy="45" r="4" fill="none" stroke="#5588cc" stroke-width="1"/><path d="M40,65 Q50,75 60,65" fill="none" stroke="#5588cc" stroke-width="1.5"/><line x1="42" y1="20" x2="38" y2="8" stroke="#5588cc" stroke-width="1.5"/><circle cx="38" cy="6" r="3" fill="none" stroke="#5588cc" stroke-width="1"/><line x1="55" y1="22" x2="58" y2="10" stroke="#5588cc" stroke-width="1.5"/><circle cx="58" cy="8" r="2.5" fill="none" stroke="#5588cc" stroke-width="1"/><line x1="50" y1="90" x2="40" y2="105" stroke="#5588cc" stroke-width="1.5"/><line x1="50" y1="90" x2="60" y2="105" stroke="#5588cc" stroke-width="1.5"/></svg>`,
      'Muncha': `<svg viewBox="0 0 100 110"><circle cx="50" cy="45" r="32" fill="none" stroke="#5588cc" stroke-width="1.5"/><circle cx="45" cy="38" r="5" fill="none" stroke="#5588cc" stroke-width="1"/><circle cx="2" cy="2" r="1.5" fill="#5588cc" transform="translate(43,36)"/><path d="M35,58 Q42,68 58,62" fill="none" stroke="#5588cc" stroke-width="1.5"/><rect x="38" y="58" width="5" height="6" rx="1" fill="none" stroke="#5588cc" stroke-width="1"/><rect x="45" y="60" width="5" height="5" rx="1" fill="none" stroke="#5588cc" stroke-width="1"/><rect x="52" y="59" width="4" height="5" rx="1" fill="none" stroke="#5588cc" stroke-width="1"/><path d="M38,15 L35,5" stroke="#5588cc" stroke-width="1.5"/><path d="M62,15 L65,5" stroke="#5588cc" stroke-width="1.5"/><line x1="40" y1="77" x2="35" y2="100" stroke="#5588cc" stroke-width="1.5"/><line x1="60" y1="77" x2="65" y2="100" stroke="#5588cc" stroke-width="1.5"/></svg>`,
    };

    PROFILES.forEach(profile => {
      const card = document.createElement('div');
      card.className = 'profile-card';
      card.innerHTML = `
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
      `;
      grid.appendChild(card);
    });
  }

  // --- Pinboard ---
  function populatePinboard() {
    const surface = document.getElementById('pinboard-surface');
    if (!surface) return;

    // Place post-its
    const postitPositions = [
      { top: '5%', left: '2%' },
      { top: '8%', left: '25%' },
      { top: '5%', left: '50%' },
      { top: '30%', left: '3%' },
      { top: '35%', left: '30%' },
      { top: '55%', left: '5%' },
      { top: '58%', left: '28%' },
      { top: '75%', left: '2%' },
      { top: '78%', left: '25%' },
      { top: '32%', left: '55%' },
      { top: '60%', left: '50%' },
      { top: '80%', left: '52%' },
    ];

    POSTIT_NOTES.forEach((note, i) => {
      const pos = postitPositions[i] || { top: `${5 + (i * 8) % 80}%`, left: `${2 + (i * 15) % 55}%` };
      const div = document.createElement('div');
      div.className = 'full-postit';
      div.style.background = note.color;
      div.style.transform = `rotate(${note.rotation}deg)`;
      div.style.top = pos.top;
      div.style.left = pos.left;
      div.textContent = note.text;
      surface.appendChild(div);
    });

    // Place photos
    const photoPositions = [
      { top: '8%', left: '72%', rotation: -3 },
      { top: '30%', left: '78%', rotation: 4 },
      { top: '52%', left: '70%', rotation: -2 },
      { top: '72%', left: '76%', rotation: 5 },
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

    // Add strings
    const strings = [
      { top: '18%', left: '15%', width: '60%', angle: 5 },
      { top: '45%', left: '20%', width: '55%', angle: -8 },
      { top: '68%', left: '10%', width: '70%', angle: 3 },
      { top: '35%', left: '40%', width: '40%', angle: 15 },
    ];

    strings.forEach(s => {
      const line = document.createElement('div');
      line.className = 'pinboard-string';
      line.style.top = s.top;
      line.style.left = s.left;
      line.style.width = s.width;
      line.style.transform = `rotate(${s.angle}deg)`;
      surface.appendChild(line);
    });
  }

  // --- Notepad ---
  function populateNotepad() {
    const container = document.getElementById('notepad-entries');
    if (!container) return;

    NOTEBOOK_ENTRIES.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'notebook-entry';
      div.innerHTML = `
        <div class="notebook-date">${entry.date}</div>
        <div class="notebook-text">${entry.text}</div>
      `;
      container.appendChild(div);
    });
  }

  // --- Sketches ---
  function populateSketches() {
    const grid = document.getElementById('sketches-grid');
    if (!grid) return;

    const sketchSVGs = [
      // Groovix - elongated, dynamic pose
      `<svg viewBox="0 0 200 250" class="sketch-full-svg">
        <path d="M100,50 Q110,30 120,40 Q130,20 118,15 Q105,8 95,22 Q85,12 82,28 Q72,20 78,35 L68,55 Q58,70 50,95 Q42,120 50,150 L46,170 Q40,190 50,200 L60,192 Q65,185 70,175 L80,165 Q88,160 98,165 L108,175 Q112,185 118,192 L128,200 Q135,196 130,185 L126,170 Q135,145 130,115 Q128,90 118,70 Z" fill="none" stroke="#4a3520" stroke-width="2" opacity="0.8"/>
        <circle cx="112" cy="30" r="6" fill="none" stroke="#4a3520" stroke-width="1.5"/>
        <circle cx="113" cy="29" r="2" fill="#4a3520" opacity="0.5"/>
        <path d="M95,58 Q88,55 85,50 Q82,46 78,48" fill="none" stroke="#4a3520" stroke-width="1"/>
        <path d="M70,150 L55,145 Q50,142 48,138" fill="none" stroke="#4a3520" stroke-width="1.5"/>
        <text x="100" y="240" text-anchor="middle" font-family="Caveat" font-size="14" fill="#6a5a4a">Tail curves when agitated</text>
        <path d="M130,115 Q140,112 145,118 Q150,125 145,130" fill="none" stroke="#4a3520" stroke-width="1" stroke-dasharray="3,3"/>
        <text x="155" y="125" font-family="Caveat" font-size="10" fill="#8a6a4a">spines?</text>
      </svg>`,
      // Fugu - spiky, wide
      `<svg viewBox="0 0 200 220" class="sketch-full-svg">
        <path d="M100,50 Q140,25 150,50 Q160,30 155,55 Q170,50 160,70 Q172,80 158,88 Q168,100 155,105 Q162,118 148,120 Q155,135 140,135 Q145,150 130,152 Q120,165 100,160 Q80,165 70,152 Q55,150 60,135 Q48,135 52,120 Q38,118 45,105 Q32,100 42,88 Q28,80 40,70 Q30,50 45,55 Q40,30 50,50 Q60,25 100,50 Z" fill="none" stroke="#4a3520" stroke-width="2" opacity="0.8"/>
        <circle cx="80" cy="75" r="8" fill="none" stroke="#4a3520" stroke-width="1.5"/>
        <circle cx="81" cy="74" r="3" fill="#4a3520" opacity="0.4"/>
        <circle cx="120" cy="70" r="6" fill="none" stroke="#4a3520" stroke-width="1.5"/>
        <circle cx="121" cy="69" r="2" fill="#4a3520" opacity="0.4"/>
        <path d="M75,100 Q90,115 125,98" fill="none" stroke="#4a3520" stroke-width="1.5"/>
        <line x1="80" y1="100" x2="78" y2="108" stroke="#4a3520" stroke-width="1"/>
        <line x1="88" y1="104" x2="87" y2="112" stroke="#4a3520" stroke-width="1"/>
        <line x1="96" y1="106" x2="96" y2="114" stroke="#4a3520" stroke-width="1"/>
        <line x1="104" y1="105" x2="105" y2="113" stroke="#4a3520" stroke-width="1"/>
        <line x1="112" y1="102" x2="114" y2="110" stroke="#4a3520" stroke-width="1"/>
        <text x="100" y="200" text-anchor="middle" font-family="Caveat" font-size="14" fill="#6a5a4a">Spines extend when excited</text>
        <text x="160" y="90" font-family="Caveat" font-size="10" fill="#cc5533">LOUD</text>
      </svg>`,
      // Mr. Q - round, observant
      `<svg viewBox="0 0 200 240" class="sketch-full-svg">
        <ellipse cx="100" cy="110" rx="55" ry="65" fill="none" stroke="#4a3520" stroke-width="2" opacity="0.8"/>
        <circle cx="82" cy="90" r="8" fill="none" stroke="#4a3520" stroke-width="1.5"/>
        <circle cx="83" cy="89" r="3" fill="#4a3520" opacity="0.4"/>
        <path d="M78,125 Q95,145 115,125" fill="none" stroke="#4a3520" stroke-width="2"/>
        <path d="M88,130 L85,140 Q90,142 95,138" fill="none" stroke="#4a3520" stroke-width="1" fill="#f4eed8"/>
        <line x1="82" y1="42" x2="75" y2="18" stroke="#4a3520" stroke-width="2"/>
        <circle cx="73" cy="14" r="5" fill="none" stroke="#4a3520" stroke-width="1.5"/>
        <line x1="110" y1="46" x2="118" y2="22" stroke="#4a3520" stroke-width="2"/>
        <circle cx="120" cy="18" r="4" fill="none" stroke="#4a3520" stroke-width="1.5"/>
        <line x1="80" y1="175" x2="65" y2="215" stroke="#4a3520" stroke-width="2"/>
        <line x1="120" y1="175" x2="135" y2="215" stroke="#4a3520" stroke-width="2"/>
        <text x="100" y="235" text-anchor="middle" font-family="Caveat" font-size="14" fill="#6a5a4a">Watches for hours. Unblinking.</text>
        <path d="M140,85 L165,80" stroke="#4a3520" stroke-width="0.5" stroke-dasharray="2,2"/>
        <text x="168" y="82" font-family="Caveat" font-size="10" fill="#8a6a4a">aware?</text>
      </svg>`,
      // Muncha - spherical, toothy
      `<svg viewBox="0 0 200 230" class="sketch-full-svg">
        <circle cx="100" cy="85" r="58" fill="none" stroke="#4a3520" stroke-width="2" opacity="0.8"/>
        <circle cx="88" cy="68" r="10" fill="none" stroke="#4a3520" stroke-width="1.5"/>
        <circle cx="90" cy="66" r="4" fill="#4a3520" opacity="0.4"/>
        <path d="M68,110 Q82,130 118,118" fill="none" stroke="#4a3520" stroke-width="2"/>
        <rect x="74" y="110" width="8" height="12" rx="2" fill="none" stroke="#4a3520" stroke-width="1"/>
        <rect x="86" y="114" width="8" height="10" rx="2" fill="none" stroke="#4a3520" stroke-width="1"/>
        <rect x="98" y="112" width="7" height="11" rx="2" fill="none" stroke="#4a3520" stroke-width="1"/>
        <rect x="108" y="110" width="6" height="10" rx="2" fill="none" stroke="#4a3520" stroke-width="1"/>
        <path d="M72" y1="28" x2="68" y2="8" stroke="#4a3520" stroke-width="2"/>
        <path d="M72,28 L65,8" fill="none" stroke="#4a3520" stroke-width="2"/>
        <path d="M128,28 L135,8" fill="none" stroke="#4a3520" stroke-width="2"/>
        <line x1="78" y1="143" x2="65" y2="195" stroke="#4a3520" stroke-width="2"/>
        <line x1="122" y1="143" x2="135" y2="195" stroke="#4a3520" stroke-width="2"/>
        <text x="100" y="218" text-anchor="middle" font-family="Caveat" font-size="14" fill="#6a5a4a">Chews EVERYTHING. 3 pencils lost.</text>
        <path d="M140,75 L160,70" stroke="#cc3333" stroke-width="1"/>
        <text x="162" y="72" font-family="Caveat" font-size="11" fill="#cc3333">bite marks on desk!</text>
      </svg>`,
    ];

    WALL_SKETCHES.forEach((sketch, i) => {
      const card = document.createElement('div');
      card.className = 'sketch-full-card';
      card.innerHTML = `
        ${sketchSVGs[i] || ''}
        <div class="sketch-full-name">${sketch.name}</div>
        <div class="sketch-full-desc">${sketch.description}</div>
      `;
      grid.appendChild(card);
    });
  }

})();
