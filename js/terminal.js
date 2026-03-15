// ============================================================
// DOS Terminal — Live Sighting Feed
// ============================================================

class SightingTerminal {
  constructor(containerEl) {
    this.container = containerEl;
    this.entries = [...SIGHTINGS];
    this.currentIndex = 0;
    this.typeSpeed = 25;
    this.entryDelay = 2000;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.container.innerHTML = '';
    this.addSystemLine('KANAPUTZ OBSERVATION NETWORK v3.7.1');
    this.addSystemLine('================================');
    this.addSystemLine('CONNECTING TO FIELD STATIONS...');
    setTimeout(() => {
      this.addSystemLine('CONNECTION ESTABLISHED');
      this.addSystemLine('LOADING SIGHTING DATABASE...');
      setTimeout(() => {
        this.addSystemLine(`${this.entries.length} RECORDS FOUND`);
        this.addSystemLine('');
        this.addSystemLine('--- BEGIN LIVE FEED ---');
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
    if (this.currentIndex >= this.entries.length) {
      this.addSystemLine('');
      this.addSystemLine('[ MONITORING... AWAITING NEW SIGNALS ]');
      this.addCursor();
      return;
    }

    const entry = this.entries[this.currentIndex];
    const div = document.createElement('div');
    div.className = 'feed-entry';
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

  addCursor() {
    const cursor = document.createElement('div');
    cursor.style.color = 'var(--dos-green)';
    cursor.style.fontSize = '16px';
    cursor.style.marginTop = '10px';
    cursor.innerHTML = 'C:\\OBSERVATORY\\FEED&gt; <span class="blink">_</span>';
    this.container.appendChild(cursor);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  stop() {
    this.running = false;
  }
}
