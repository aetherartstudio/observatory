# The Observatory — Kanaputz Research Station

## Project Overview
A narrative web experience for the Kanaputz universe. Players explore a fictional research station desk scene, discovering clues about mysterious creatures through interactive elements. Content unlocks progressively across 5 waves released purely on time (design brief v12) — no engagement thresholds, no accounts.

**Live site:** https://aetherartstudio.github.io/observatory/
**Deployment:** GitHub Pages from `master` branch — every push to master auto-deploys.

## Project Structure

```
D:/Dropbox/Kanaputz/observatory-v2/
├── index.html          # Single-page app, all HTML structure
├── css/style.css       # All styling (zones, overlays, monitors, effects)
├── js/
│   ├── app.js          # Main application logic (hotspots, safe, map, cassette, UV lamp, pinboard)
│   ├── waves.js        # Wave system controller — progressive disclosure, state persistence, debug panel
│   ├── data.js         # All content data (sightings, journal, pinboard items, map dots, UV items, dossier)
│   └── terminal.js     # CRT terminal typewriter effect
└── assets/             # Images, video, audio (JPG for large photos, PNG for transparency)
```

## Key Concepts

### Wave System (waves.js) — v12, TIME-ONLY
- 5 waves, offsets from `LAUNCH_DATE`: +0 / +14 / +28 / +35 / +42 days
  (W1 "They are everywhere — and they have names" · W2 "Something is wrong" ·
  W3 "Converging on Taipei" · W4 "The Source is in Shilin" · W5 "The full picture")
- Every content item carries `{ wave, releaseDay }` — releaseDay drips it in N days
  after its wave starts, so the desk keeps changing between waves
- `LAUNCH_DATE` is a placeholder future date until go-live: organic visitors see
  Wave 1 launch-day content only; preview any wave with the debug panel (D key)
- `GALLERY_DATE` (LAUNCH_DATE + 44d default) flips the Source Monitor from
  installation footage to the live feed — set to the real gallery opening date
- localStorage (`kanaputz_observatory_state`) keeps ONLY cosmetic flags:
  uvLampFound / uvLampUsed / safeOpened / liveEntryShown. Safe to lose (in-app browsers wipe it)
- Feature waves: safe visible (locked) from W1, safeDial W4, sourceMonitor W5,
  Shilin zoom W3, UV lamp object appears W2 (UV content W3+, safe hint W4)
- Only T-06 and the dossier are behind the safe (code 3-17-58); the safe gates
  content, never wave progression
- `WaveSystem.getVisibleContent(array)` filters by wave + releaseDay
- CONTENT SOURCES OF TRUTH: `pinboard-content-map.xlsx`, `notepad-content-map.docx`,
  `map-dots.xlsx` in `D:/Dropbox/Kanaputz/viral marketing/observatory design/text assets
  for observatory/` — edit those and regenerate data.js blocks, don't hand-edit texts

### Interactive Elements (Clickable Zones)
All zones are positioned as percentage-based overlays on the room background image (`room-bg.jpg`, 3840×2160).

| Zone ID | Element | Approx Position |
|---------|---------|-----------------|
| `#zone-safe` | Safe with combination dial | left:4%, top:26% |
| `#zone-terminal` | Left monitor (DOS terminal) | left:16%, top:34% |
| `#zone-profiles` | Right monitor (map/sightings) | left:36%, top:31% |
| `#zone-pinboard` | Cork pinboard on wall | left:54%, top:0% |
| `#zone-notepad` | Field notebook | left:35%, top:68% |
| `#zone-cassette` | Cassette tape player | left:77%, top:75% |
| `#zone-source` | Source monitor (wave 5+) | left:55%, top:46% |
| `.uv-lamp-hidden` | Hidden UV lamp (discovery) | left:71%, top:79% |

### Safe Mechanics (app.js)
- Combination: **[3, 17, 58]** — 100 ticks (0–99), 3.6° per tick
- Flow: rotate dial → pull handle to confirm each digit → 3 correct → video animation → click to view dossier
- Uses `safeDoorClickable` flag pattern (not anonymous listeners) to prevent click handler persistence across resets
- `WaveSystem.isSafeOpened()` persists in localStorage; return visits show static opened-safe image
- Room background swaps to `room-bg-opened safe.png` when safe is opened

### Cassette Player
- 6 tapes (v12 dictaphone lineup): T-01 Field Log 01 (W1), T-02 Naming Them (W1+7d),
  T-03 The Call — M.'s voice first heard (W2), T-04 Vectors (W3), T-05 The Site (W4),
  T-06 The Interview (W5, safe-locked)
- Assets `tape1.png`–`tape6.png` with label overlays `tapeN label.png`
- NOTE: tape6.png / `tape6 label.png` are generated placeholders (Caveat font) — replace with artist versions
- Tape stack on left, player on right with play/stop/rewind buttons

### Map (Right Monitor)
- LCD monitor with two views: global map and Shilin zoom
- Background swaps between `right monitor levelled with global map-bg.jpg` and `right monitor levelled without map-bg.jpg`
- Progressive sightings across waves (v12: W1=7, W2=12, W3=17, W4=20 global, dripped; 11 Shilin dots from W3). Positions/waves mastered in `map-dots.xlsx`

### UV Lamp
- Hidden clickable in desk scene; discovered by cursor change, no visual indicator
- Once found, UV toggle appears on pinboard
- Torch effect: single pinboard-level `uv-mask` with radial gradient, raised to z-index 1001 when items are zoomed
- Reveals hidden text on post-its and UV annotations on pinboard

### Terminal (Left Monitor)
- CRT scanline/grainy effects via CSS
- Background: `left monitor-bg.jpg`
- Typewriter effect via `terminal.js`

## Debug Mode
- **Toggle:** Press `D` key (or triple-tap on mobile)
- **Adds `.debug` class** to `#room` and `#detail-overlay`
- **Shows:** Red dashed outlines on all zones, purple outline on UV lamp, wave control panel
- **Cursor position indicator:** Fixed green bar at top center showing `X% / Y%` relative to nearest positioned container — useful for positioning zones after asset changes
- **Wave shortcuts:** Debug panel has wave 1–5 buttons; safe state auto-sets (opened at wave 5 override)
- **Spacebar:** Hold to reveal all hotspot sparkles

## Asset Conventions
- **Large background images:** Convert to JPG (quality 90) for web performance. Source TIF/PNG files kept in assets folder.
- **Transparency needed:** Use PNG (post-its, tapes, overlays, safe elements)
- **Video:** MP4 (safe-opening.mp4)
- **Cache busting:** Increment `?v=N` on CSS link in index.html when making style changes

## Common Tasks

### Updating room background
1. Place new TIF/PNG in `assets/`
2. Convert: `python -c "from PIL import Image; img = Image.open('assets/NewFile.tif').convert('RGB'); img.save('assets/room-bg.jpg', 'JPEG', quality=90)"`
3. Use debug mode cursor overlay to get new zone coordinates
4. Update zone positions in `css/style.css` (search for `#zone-`)

### Adjusting zone positions
Zones use `left`, `top`, `width`, `height` as percentages of the room background. User provides top-left and bottom-right corners; convert:
- `left` = top-left X
- `top` = top-left Y
- `width` = bottom-right X − top-left X
- `height` = bottom-right Y − top-left Y

### Git workflow
```bash
cd "D:/Dropbox/Kanaputz/observatory-v2"
git add <files>
git commit -m "message"
git push   # auto-deploys to GitHub Pages
```

## Important Notes
- Claude Code launches from `D:/Dropbox/Baldone website (new design)/` but this project is at `D:/Dropbox/Kanaputz/observatory-v2/` — always use absolute paths.
- The `{ once: true }` pattern on event listeners causes bugs when elements are reused across resets. Use flag variables (e.g., `safeDoorClickable`) with a single persistent listener instead.
- Handle clicks inside the safe door bubble up — always use `e.stopPropagation()` on the handle click handler.
