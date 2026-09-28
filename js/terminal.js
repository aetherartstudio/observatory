// ============================================================
// DOS Terminal — Live Sighting Feed
// ============================================================

class SightingTerminal {
  constructor(containerEl, entries) {
    this.container = containerEl;
    this.entries = entries || [...SIGHTINGS];
    this.currentIndex = 0;
    this.typeSpeed = 25;
    this.entryDelay = 2000;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.container.innerHTML = '';
    const header = this.container.parentElement.querySelector('.terminal-header');
    if (header) {
      header.firstElementChild.textContent = '  ' + TERMINAL_LINES.header_title;
      header.querySelector('.terminal-status').textContent = TERMINAL_LINES.header_status;
    }
    this.addSystemLine(TERMINAL_LINES.boot_1);
    this.addSystemLine(TERMINAL_LINES.boot_2);
    this.addSystemLine(TERMINAL_LINES.boot_3);
    setTimeout(() => {
      this.addSystemLine(TERMINAL_LINES.boot_4);
      this.addSystemLine(TERMINAL_LINES.boot_5);
      setTimeout(() => {
        this.addSystemLine(TERMINAL_LINES.records_found.replace('{count}', this.entries.length));
        this.addSystemLine('');
        this.addSystemLine(TERMINAL_LINES.feed_start);
        this.addSystemLine('');
        setTimeout(() => this.showNextEntry(), 800);
      }, 600);
    }, 400);
  }

  addSystemLine(text) {
    const line = document.createElement('div');
    line.className = 'feed-entry';
    line.style.opacity = '1';
    line.style.animation = 'none';
    line.style.borderLeft = 'none';
    line.style.color = 'rgba(50,255,50,0.5)';
    line.style.fontSize = '14px';
    line.style.marginBottom = '4px';
    line.textContent = text;
    this.container.appendChild(line);
    this.scrollToBottom();
  }

  showNextEntry() {
    if (!this.running) return;

    // One-time "live" moment (v12): on a first session, hold back the
    // final entry, go quiet, then let it type itself in after a delay —
    // the feed is alive while the visitor watches.
    const canGoLive = typeof WaveSystem !== 'undefined' && !WaveSystem.isLiveEntryShown();
    if (canGoLive && this.entries.length >= 3 && this.currentIndex === this.entries.length - 1 && !this._liveQueued) {
      this._liveQueued = true;
      this.addSystemLine('');
      this.addSystemLine(TERMINAL_LINES.live_waiting);
      this.liveTimer = setTimeout(() => {
        if (!this.running) return;
        WaveSystem.trackEngagement('liveEntry');
        this.addSystemLine('');
        this.addSystemLine(TERMINAL_LINES.live_incoming);
        setTimeout(() => this.showNextEntry(), 900);
      }, 40000);
      return;
    }

    if (this.currentIndex >= this.entries.length) {
      this.addSystemLine('');
      this.addNextObservationLine();
      this.addCursor();
      return;
    }

    const entry = this.entries[this.currentIndex];
    const div = document.createElement('div');
    div.className = 'feed-entry';
    if (entry.isAnomaly) div.classList.add('feed-anomaly');
    div.style.animationDelay = '0s';

    const dateLine = document.createElement('div');
    dateLine.className = 'feed-date';
    dateLine.textContent = `[${entry.date} ${entry.time} UTC]`;

    const locLine = document.createElement('div');
    locLine.className = 'feed-location';
    locLine.textContent = `LOC: ${entry.location}`;

    const descLine = document.createElement('div');
    descLine.className = 'feed-desc';

    div.appendChild(dateLine);
    div.appendChild(locLine);
    div.appendChild(descLine);
    this.container.appendChild(div);
    this.scrollToBottom();

    // Typewriter effect for description
    this.typeText(descLine, `> ${entry.description}`, () => {
      // Track that this entry was read (engagement-based wave progression)
      WaveSystem.trackEngagement('terminalEntry', `${entry.date}-${entry.time}`);
      this.currentIndex++;
      setTimeout(() => this.showNextEntry(), this.entryDelay);
    });
  }

  typeText(el, text, callback) {
    let i = 0;
    const type = () => {
      if (!this.running) return;
      if (i < text.length) {
        el.textContent = text.substring(0, i + 1) + '_';
        i++;
        this.scrollToBottom();
        setTimeout(type, this.typeSpeed);
      } else {
        el.textContent = text;
        if (callback) callback();
      }
    };
    type();
  }

  // Diegetic footer: when the next drip is scheduled (v12 time-only waves)
  addNextObservationLine() {
    let info = null;
    try {
      info = WaveSystem.getNextDropInfo([SIGHTINGS, JOURNAL_PAGES, PINBOARD_ITEMS, CASSETTE_TAPES]);
    } catch (e) { /* data arrays not present — degrade */ }
    if (info) {
      this.addSystemLine(TERMINAL_LINES.next_drop.replace('{next}', info.label));
    } else {
      this.addSystemLine(TERMINAL_LINES.no_next_drop);
    }
  }

  addCursor() {
    const cursor = document.createElement('div');
    cursor.style.color = 'var(--dos-green)';
    cursor.style.fontSize = '16px';
    cursor.style.marginTop = '10px';
    cursor.textContent = TERMINAL_LINES.prompt + ' ';
    const blink = document.createElement('span');
    blink.className = 'blink';
    blink.textContent = '_';
    cursor.appendChild(blink);
    this.container.appendChild(cursor);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  stop() {
    this.running = false;
    if (this.liveTimer) { clearTimeout(this.liveTimer); this.liveTimer = null; }
  }
}
