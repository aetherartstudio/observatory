// ============================================================
// KANAPUTZ OBSERVATORY — Content Data (v12 Wave-Tagged)
// ============================================================
// 5 waves, time-only release (design brief v12).
// Every item carries { wave, releaseDay } — releaseDay is the drip
// offset (in days) from that wave's start. WaveSystem.getVisibleContent
// filters by both. 30 terminal sightings (13+5+5+7+0).
//
// CONTENT SOURCES OF TRUTH (Dropbox / observatory design /
// "text assets for observatory"): pinboard-content-map.xlsx,
// notepad-content-map.docx, map-dots.xlsx. Edit those, then
// regenerate these blocks — do not hand-edit texts here.

// ===== TERMINAL SIGHTINGS (30 entries across waves 1–4) =====
const SIGHTINGS = [
  // ----- WAVE 1 (13): global documentation, pre-Fading. Early entries dry
  // ----- Type-only language; names appear from mid-wave (journal naming beat, day 8).
  { wave: 1, releaseDay: 0, date: '2024-09-03', time: '22:14:33', location: 'SHI-07 / TAIPEI-TW', observer: 'R-01', type: 'Type 1', description: 'First confirmed visual. Small specimen moved at impossible speed across Shilin Night Market entrance. Stopped abruptly at flower stall. Remained motionless 47 sec observing potted orchid. Then vanished.' },
  { wave: 1, releaseDay: 0, date: '2024-09-12', time: '01:23:08', location: 'MUM-02 / MUMBAI-IN', observer: 'R-19', type: 'Type 4', description: 'Large-mouthed specimen detected near arguing couple outside train station. Opened mouth wide — appeared to inhale surrounding atmosphere. Couple stopped arguing within 12 sec. Specimen visibly inflated to approx 1.5x resting volume. Waddled away.' },
  { wave: 1, releaseDay: 0, date: '2024-09-18', time: '23:55:17', location: 'LON-05 / LONDON-UK', observer: 'R-31', type: 'Type 2', description: 'Specimen raised arms dramatically, extended tongue, performed aggressive hip display toward two arguing pedestrians. Neither pedestrian alarmed. Both laughing within 4 sec. Specimen continued display for 20 sec after conflict resolved.' },
  { wave: 1, releaseDay: 0, date: '2024-09-25', time: '02:07:44', location: 'TOK-08 / TOKYO-JP', observer: 'R-09', type: 'Type 3', description: 'Rhythmic movement detected. Tall specimen swaying near market music speaker. Tail displacement knocked over three stalls. Specimen appeared unaware of damage. Vendors laughing.' },
  { wave: 1, releaseDay: 0, date: '2024-11-03', time: '02:58:16', location: 'NYC-07 / NEW YORK-US', observer: 'R-31', type: null, description: 'Multiple specimens detected within 200m radius. All four types present simultaneously — first documented co-occurrence. Duration: 4 min 22 sec. All specimens moved in same direction before dispersing.' },
  { wave: 1, releaseDay: 2, date: '2024-10-02', time: '04:18:55', location: 'BKK-03 / BANGKOK-TH', observer: 'R-27', type: 'Type 1', description: 'Specimen performed perimeter patrol of children\'s playground. Zigzag pattern, stopping every 3-4m. One child approached — specimen froze, body softened visibly. Tiny smile observed. Child giggled. Specimen resumed patrol.' },
  { wave: 1, releaseDay: 3, date: '2024-11-10', time: '03:53:08', location: 'SHI-11 / TAIPEI-TW', observer: 'R-14', type: 'Type 4', description: 'Type 4 inflation event near arguing couple. Approx 2x volume. Deflation took 45 sec.' },
  { wave: 1, releaseDay: 5, date: '2024-10-25', time: '01:45:33', location: 'BER-03 / BERLIN-DE', observer: 'R-22', type: 'Type 3', description: 'Type 3 detected near subway busker playing guitar. Began involuntary rhythm sway. Full-body movement escalated within 30 sec. Tail swept umbrella stand into the street. Busker incorporated chaos into performance. Crowd doubled.' },
  { wave: 1, releaseDay: 8, date: '2024-10-18', time: '23:12:09', location: 'SHI-05 / TAIPEI-TW', observer: 'R-07', type: 'Type 2', description: 'Specimen "MrQ" (designation per field journal) attempted to intimidate a street cat. Arms raised, tongue extended, hips shaking. Cat unimpressed. Specimen escalated — performed headbutt charge at trash can. Got dizzy. Flexed proudly.' },
  { wave: 1, releaseDay: 9, date: '2024-11-28', time: '01:22:14', location: 'NYC-07 / NEW YORK-US', observer: 'R-31', type: 'Type 1', description: 'Specimen "Fugu" — sprint-to-tenderness cycle confirmed. Explosive sprint down platform, sudden freeze at sight of sleeping kitten near ventilation grate. Full tender pause: 62 sec.' },
  { wave: 1, releaseDay: 11, date: '2024-12-03', time: '23:09:37', location: 'PAR-12 / PARIS-FR', observer: 'R-18', type: 'Type 3', description: 'Montmartre sighting. "Groovix" detected near accordion player. Rhythm drift escalated to full-body groove. Tail whipped through three easels. Artists seemed delighted rather than upset.' },
  { wave: 1, releaseDay: 12, date: '2024-12-18', time: '00:55:21', location: 'SHI-03 / TAIPEI-TW', observer: 'R-14', type: 'Type 2', description: 'MrQ confronted group of teenagers playing loud music. Performed concert mode: jumping, arm-waving, butt-shaking. Started involuntary crowd wave among teenagers. All parties laughing within 15 sec.' },
  { wave: 1, releaseDay: 13, date: '2024-12-22', time: '03:17:42', location: 'BKK-05 / BANGKOK-TH', observer: 'R-27', type: 'Type 1', description: 'Chatuchak Market. Fugu detected near spice vendor. Sprint-freeze pattern: 4 cycles in 3 min. Each freeze oriented toward different small detail — dewdrop on chili pepper, butterfly resting on ginger root.' },

  // ----- WAVE 2 (5): energy loss dominant, DIMINISHED flags, alarm — with the Fading -----
  { wave: 2, releaseDay: 0, date: '2025-01-05', time: '02:33:49', location: 'SHI-14 / TAIPEI-TW', observer: 'R-01', type: 'Type 4', description: 'Muncha positioned near hospital entrance. Antennae vibrating continuously. Absorbed ambient emotional weight for 8 min — longest recorded session. Inflation gradual, reaching 3x resting volume. ENERGY STATUS: DIMINISHED — slow deflation, squeaking sounds weak. Something is costing them.' },
  { wave: 2, releaseDay: 2, date: '2025-01-12', time: '04:07:29', location: 'NYC-07 / NEW YORK-US', observer: 'R-31', type: 'Type 1', description: 'Fugu sprint-to-tenderness cycle. ENERGY STATUS: DIMINISHED — sprint speed measurably slower than September baseline. Tender pauses shorter: 14 sec avg vs 22 sec. They moved differently when they left.' },
  { wave: 2, releaseDay: 5, date: '2025-01-18', time: '01:14:55', location: 'SEL-04 / SEOUL-KR', observer: 'R-12', type: 'Type 4', description: 'Muncha positioned between stressed office worker and vending machine. Antennae vibrating. Absorbed what appeared to be ambient frustration. Inflated 2x. ENERGY STATUS: DIMINISHED — deflation took 90 sec vs 30 sec baseline. Worker relaxed. Specimen did not.' },
  { wave: 2, releaseDay: 8, date: '2025-01-25', time: '23:12:09', location: 'SHI-05 / TAIPEI-TW', observer: 'R-07', type: 'Type 2', description: 'MrQ display intensity declining. Performance duration: 20 sec vs 45 sec norm. ENERGY STATUS: DIMINISHED — theatrical posture less exaggerated. Headbutt charge slower. Flexed, but dimmer.' },
  { wave: 2, releaseDay: 11, date: '2025-02-01', time: '22:07:33', location: 'SHI-14 / TAIPEI-TW', observer: 'R-07', type: null, description: 'Four-type convergence event #7. Duration: 18 min — longest recorded. Fugu trembling. MrQ silent — first recorded non-performance. Groovix swaying without visible rhythm. Muncha deflated, still, antennae flat. Something was different.' },

  // ----- WAVE 3 (5): convergence confirmed, Shilin concentration — with the Taiwan arrival -----
  { wave: 3, releaseDay: 0, date: '2025-02-10', time: '01:14:55', location: 'SHI-25 / TAIPEI-TW', observer: 'R-01', type: 'Type 1', description: 'Followed Fugu for 3 hours. Alternated between explosive sprints and complete stillness. Led to location outside Shilin district boundaries. [COORDINATES REDACTED]. Specimen oriented toward fixed point for 4 min 11 sec.' },
  { wave: 3, releaseDay: 2, date: '2025-02-15', time: '02:38:17', location: 'SHI-07 / TAIPEI-TW', observer: 'R-14', type: null, description: 'All four types observed within 50m radius. Duration increasing: 12 min 44 sec. All oriented in same direction during final 3 min. Direction consistent with previous convergence events.' },
  { wave: 3, releaseDay: 4, date: '2025-02-20', time: '23:45:33', location: 'TPE-01 / TAIPEI-TW', observer: 'R-01', type: null, description: 'UV analysis of Shilin receipts confirms residual energy signatures at 7 of 12 documented sighting locations. Pattern is radial. Center point calculations underway.' },
  { wave: 3, releaseDay: 7, date: '2025-02-25', time: '03:28:51', location: 'SHI-30 / TAIPEI-TW', observer: 'R-14', type: 'Type 3', description: 'Groovix performing sustained rhythmic movement without external music. Duration: 7 min. Tail movements traced figure-eight pattern. Ground vibration measurable at 15m. Three nearby specimens appeared to respond — all oriented toward Groovix position.' },
  { wave: 3, releaseDay: 10, date: '2025-03-01', time: '01:55:08', location: 'JIU-02 / JIUFEN-TW', observer: 'R-01', type: 'Type 1', description: 'Jiufen Old Street. Fugu sprinted from Shilin to Jiufen — 30km in estimated 4 min. Stopped at temple steps. Tender pause: 3 min 47 sec. Longest recorded. Oriented toward ocean.' },

  // ----- WAVE 4 (7): Source proximity, anomalies hiding safe code 3-17-58 -----
  { wave: 4, releaseDay: 0, date: '2025-03-05', time: '02:44:19', location: 'SRC-01 / ??????-TW', observer: 'R-01', type: null, description: 'Source detector activated. Initial reading: coherence 34%. Fluctuating. M. says the readings are correct.' },
  { wave: 4, releaseDay: 1, date: '2025-03-08', time: '04:11:55', location: 'SHI-07 / TAIPEI-TW', observer: 'R-14', type: 'Type 1', description: 'Fugu sprint frequency doubled in 72 hours. Route patterns increasingly direct — fewer zigzags, longer stillness. Tender pauses now oriented exclusively toward Source bearing.' },
  { wave: 4, releaseDay: 2, date: '2025-03-10', time: '04:02:48', location: '03-17-58 / ??????-??', observer: '---', type: '-------', description: '%%SIGNAL ANOMALY. COORDINATES DO NOT RESOLVE. ENTRY FLAGGED.%%', isAnomaly: true },
  { wave: 4, releaseDay: 3, date: '2025-03-12', time: '01:55:44', location: 'SHI-ALL / TAIPEI-TW', observer: 'R-01', type: null, description: '14 specimens detected simultaneously across Shilin. All types. All moving toward same external point. Source detector: coherence 67%.' },
  { wave: 4, releaseDay: 4, date: '2025-03-15', time: '00:42:31', location: 'SRC-01 / ??????-TW', observer: 'R-01', type: null, description: 'Source coherence: 58%. Steady increase. Crystal responds to convergence — spikes +12-15%. M. suggests the relationship is bidirectional.' },
  { wave: 4, releaseDay: 5, date: '2025-03-17', time: '23:28:44', location: 'LOC: 03-17-58', observer: '???', type: null, description: '%%DATA CORRUPTION — TIMESTAMP MISMATCH — COORDINATES ECHO PREVIOUS ANOMALY — FLAGGED FOR REVIEW%%', isAnomaly: true },
  { wave: 4, releaseDay: 6, date: '2025-03-18', time: '04:22:07', location: 'SRC-01 / ??????-TW', observer: 'R-01', type: null, description: 'Crystal responding to ambient conditions without specimen proximity. Self-sustaining? M.: "It remembers." Coherence: 71%.' },
];

// ===== MAP DOTS =====
// Source of truth for positions/waves: map-dots.xlsx (observatory design folder).
// v12 wave progression: W1 = 7 dots (staggered), W2 = +5, W3 = +5, W4 = +3. Total 20.
const MAP_SIGHTINGS = [
  // Wave 1 — first scattered sightings, then spread widens across the wave
  { id: 0, wave: 1, releaseDay: 0, city: 'Bangkok', location: 'Chatuchak Market', left: '72%', top: '48%', description: 'Type 1 detected near spice vendor. Sprint-freeze cycle: 4 repetitions.' },
  { id: 1, wave: 1, releaseDay: 0, city: 'Tokyo', location: 'Shibuya Crossing', left: '80%', top: '40%', description: 'Type 2 theatrical display during rush hour. Universal laughter reported by 14 witnesses.' },
  { id: 2, wave: 1, releaseDay: 0, city: 'Berlin', location: 'U-Bahn Alexanderplatz', left: '50%', top: '34%', description: 'Type 3 rhythmic anomaly. Three commuters displaced by tail. No injuries.' },
  { id: 4, wave: 1, releaseDay: 3, city: 'New York', location: 'Subway Tunnel B-7', left: '29%', top: '35%', description: 'Type 1 sprint-to-tenderness. 62 sec pause at sleeping kitten. Transit camera confirmed.' },
  { id: 6, wave: 1, releaseDay: 5, city: 'London', location: 'Southbank', left: '47%', top: '33%', description: 'Type 2 aggressive hip display near busker. Both pedestrians laughing within 4 sec.' },
  { id: 3, wave: 1, releaseDay: 8, city: 'Paris', location: 'Montmartre', left: '48%', top: '34%', description: 'Type 3 near accordion player. Three easels destroyed. The journal calls him "Groovix."' },
  { id: 5, wave: 1, releaseDay: 10, city: 'Mumbai', location: 'Train Station District', left: '65%', top: '47%', description: 'Type 4 tension absorption event. Couple stopped arguing within 12 sec. First Muncha sighting outside Asia.' },
  // Wave 2 — energy loss patterns, more cities report
  { id: 7, wave: 2, releaseDay: 0, city: 'Seoul', location: 'Gangnam Station', left: '79%', top: '39%', description: 'Type 4 absorbed ambient frustration near vending machine. Worker visibly relaxed. ENERGY STATUS: DIMINISHED.' },
  { id: 8, wave: 2, releaseDay: 0, city: 'Taipei', location: 'Shilin Night Market', left: '77%', top: '42%', description: 'PRIMARY CLUSTER. All four types present. Convergence events increasing. ENERGY STATUS: DIMINISHED across all specimens.' },
  { id: 9, wave: 2, releaseDay: 3, city: 'São Paulo', location: 'Liberdade District', left: '33%', top: '58%', description: 'Type 1 confirmed in South America. Sprint duration 40% shorter than Sept baseline. Energy depletion visible.' },
  { id: 10, wave: 2, releaseDay: 6, city: 'Istanbul', location: 'Grand Bazaar', left: '56%', top: '38%', description: 'Type 3 rhythmic event disrupted three carpet stalls. Shorter duration than previous — stopped after 11 sec.' },
  { id: 11, wave: 2, releaseDay: 9, city: 'Melbourne', location: 'Queen Victoria Market', left: '84%', top: '65%', description: 'Type 2 — first Australian sighting. Display lacked usual intensity. Witnesses described it as "tired."' },
  // Wave 3 — convergence confirmed, global spread
  { id: 12, wave: 3, releaseDay: 0, city: 'Cape Town', location: 'V&A Waterfront', left: '52%', top: '63%', description: 'Type 1 — first Southern Hemisphere sprint observed. Oriented toward Taipei bearing 127° SE.' },
  { id: 13, wave: 3, releaseDay: 2, city: 'Mexico City', location: 'Mercado de la Merced', left: '22%', top: '44%', description: 'Type 4 absorption near food court. Three separate tension events neutralised. Specimen visibly slower than baseline.' },
  { id: 14, wave: 3, releaseDay: 4, city: 'Cairo', location: 'Khan el-Khalili', left: '55%', top: '42%', description: 'Type 3 tail displacement inside narrow souk alley. Duration 6 sec — well below baseline average of 22 sec.' },
  { id: 15, wave: 3, releaseDay: 7, city: 'Toronto', location: 'St. Lawrence Market', left: '27%', top: '33%', description: 'Multi-type sighting. Types 1 and 2 observed simultaneously. Both oriented ESE before dispersal.' },
  { id: 16, wave: 3, releaseDay: 9, city: 'Osaka', location: 'Dōtonbori', left: '81%', top: '41%', description: 'Type 2 theatrical display — but muted. No laughter from witnesses. Specimen paused mid-routine, oriented toward Taipei.' },
  // Wave 4 — Source proximity, final global sightings
  { id: 17, wave: 4, releaseDay: 0, city: 'Jakarta', location: 'Tanah Abang Market', left: '74%', top: '54%', description: 'Type 1 sprint lasted 0.8 sec — shortest on record. Specimen remained motionless for 4 min facing bearing 127° SE.' },
  { id: 18, wave: 4, releaseDay: 2, city: 'Hanoi', location: 'Old Quarter', left: '74%', top: '44%', description: 'Types 1, 3, and 4 observed moving in formation toward SE. No interaction with environment. First coordinated migration event.' },
  { id: 19, wave: 4, releaseDay: 4, city: 'Manila', location: 'Quiapo District', left: '79%', top: '47%', description: 'All four types. No characteristic behaviours displayed. Silent transit toward bearing 127° SE. ENERGY STATUS: CRITICAL.' },
];

// ===== SHILIN DETAIL MAP DOTS (zoom unlocks Wave 3) =====
const SHILIN_DOTS = [
  // Wave 3 — convergence cluster mapped
  { id: 's0', wave: 3, releaseDay: 0, location: 'Shilin Night Market — Main Gate', left: '35%', top: '30%', description: 'Primary convergence node. All four types documented. Highest frequency of multi-type co-occurrence events.' },
  { id: 's1', wave: 3, releaseDay: 0, location: 'Jiantan MRT Station', left: '25%', top: '22%', description: 'Transit point. Type 1 specimens sprint between station and market in under 3 sec. Route consistent.' },
  { id: 's2', wave: 3, releaseDay: 1, location: 'Shilin Residence Park', left: '55%', top: '45%', description: 'Type 3 rhythmic events. Tail displacement damaged two park benches. Groundkeeper unaware of cause.' },
  { id: 's3', wave: 3, releaseDay: 3, location: 'Wenlin Road Intersection', left: '40%', top: '55%', description: 'Type 4 absorption events concentrated here. Three documented cases of ambient tension reduction.' },
  { id: 's4', wave: 3, releaseDay: 5, location: 'Shilin Elementary — Perimeter', left: '60%', top: '35%', description: 'Type 1 perimeter patrol pattern. Multiple tender pauses near playground fence.' },
  { id: 's5', wave: 3, releaseDay: 7, location: 'Zhishan Garden', left: '70%', top: '28%', description: 'Type 2 theatrical display. Duration 45 sec. Three witnesses, all laughing.' },
  { id: 's6', wave: 3, releaseDay: 9, location: 'Danan Road Market Alley', left: '30%', top: '65%', description: 'Multi-specimen event #4. All types. Duration 8 min 22 sec. All oriented toward same bearing before dispersal.' },
  // Wave 4 — Source proximity
  { id: 's7', wave: 4, releaseDay: 0, location: 'Shilin District — Outer Edge', left: '18%', top: '75%', description: 'Source proximity readings spike. UV residue on pavement. Not a sighting location — an orientation point.' },
  { id: 's8', wave: 4, releaseDay: 1, location: 'Keelung River Bank — North', left: '75%', top: '18%', description: 'Type 4 stationary for 22 min facing south. No absorption activity. Ambient hum detected on audio.' },
  { id: 's9', wave: 4, releaseDay: 3, location: 'Tianmu Sports Park', left: '15%', top: '40%', description: 'All types converging from different entry points. Arrived within 90 sec of each other. Departed in unison toward SE.' },
  { id: 'source', wave: 4, releaseDay: 2, location: '[SOURCE LOCATION — COORDINATES WITHHELD]', left: '82%', top: '72%', description: 'Camera shakes. Timestamp anomaly. No visible specimen. Audio contains low, warm hum. Duration: longer than standard clip.', isSource: true },
];

// ===== JOURNAL PAGES (10 pages, waves 1–4) =====
// Source of truth: notepad-content-map.docx. One hand only — M. never
// writes in the journal. In-fiction dates are non-sequential by design.
const JOURNAL_PAGES = [
  { wave: 1, releaseDay: 0, page: 1, date: 'September 3', text: 'Something moved impossibly fast tonight, then stopped dead and stared at a flower growing through a pavement crack. It stayed forty-seven seconds. I timed it on the second pass of my watch because I did not believe the first.<br><br>I have started calling them Kanaputz. I do not know why the word came to me. It surfaced and it stuck.<br><br>Bought a micro-cassette recorder on the way home. If I am going to lose my mind, I want it documented in my own voice.', marginNote: 'How can something that fast care about something that small?', contentType: 'text' },
  { wave: 1, releaseDay: 0, page: 2, date: 'November 19', text: 'A Type 2 performed a theatrical display outside my apartment tonight. Arms raised, tongue out, hips moving. Eleven minutes. It was not threatening. It was performing. For whom?<br><br>If I tell anyone, they will think I have lost it. But I haven\'t lost it. I\'ve found something.', marginNote: null, contentType: 'text' },
  { wave: 1, releaseDay: 4, page: 3, date: 'September 17', text: 'Three more sightings in two weeks. All different. One sprinted. One danced. One ate — I do not have a better word for what it did to the argument outside the noodle shop.<br><br>Recurring locations: always busy places, always emotional contexts. Steam vents. Night markets. Arguments. Laughter.', marginNote: 'Four of them. At least four.', contentType: 'text' },
  { wave: 1, releaseDay: 8, page: 4, date: 'October 12', text: 'Taxonomy formalised. Type 1: speed + sudden tenderness. Type 2: theatrical aggression. Type 3: involuntary rhythm, tail damage. Type 4: ingestion of tension, inflation/deflation.<br><br>Later, different ink: Type designations tell me what they do. They tell me nothing about who they are. The fast one is Fugu — he puffs like one. The performer is Mr Q. The tall one is Groovix. The eater is Muncha.<br><br>I am aware this is not scientific. I no longer care after midnight.', marginNote: 'Steam vents. Night markets. Arguments. Laughter. Always near emotional intensity. Why?', contentType: 'text' },
  { wave: 2, releaseDay: 0, page: 5, date: 'October 29', text: 'Three of the four specimens observed tonight showed diminished activity after the argument outside the school. Muncha inflated as usual but took nearly twice as long to deflate. Something is costing them. They are dimmer afterward.<br><br>If they are absorbing something, where does it go? And what happens when they run out?', marginNote: 'Muncha keeps eating whatever is in the air. It is not food.', contentType: 'text' },
  { wave: 2, releaseDay: 3, page: 6, date: 'November 5', text: 'Spoke to M. about the energy pattern. She was not surprised. She said: Of course they are losing it. They carry what we cannot hold.<br><br>M. does not think like a researcher. She perceives something I cannot measure. I am not sure I trust her methods. I am sure she sees something I do not.<br><br>(I recorded the call. She knows. She said the tape would not matter. I do not know what she meant by that.)', marginNote: null, contentType: 'text' },
  { wave: 3, releaseDay: 0, page: 7, date: 'January 8', text: 'Regardless of type, regardless of city, every sighting ends with movement in the same general direction. I have plotted 200+ vectors. They converge on Taipei. Within Taipei, on Shilin. Within Shilin, on one point I have not yet visited.<br><br>Groovix led me halfway there tonight without knowing I followed. The name fits him. Rhythm in his blood, a tail he cannot control.', marginNote: 'What is at that point? What are they going toward — or returning to?', contentType: 'text' },
  { wave: 3, releaseDay: 5, page: 8, date: 'January 12', text: 'Followed Fugu for three hours. It alternated between explosive sprints and complete stillness. Each pause shorter than the last. It was accelerating. It led me to the edge of Shilin — to the point on my map. I stood there. I did not go closer. The air felt different. Warmer.<br><br>When I played the tape back I heard—', marginNote: 'If I can feel it, how strong must it be for them?', contentType: 'text' },
  { wave: 4, releaseDay: 0, page: 9, date: 'January 15', text: 'Called M. She will come to Taipei.<br><br>Later: M. arrived. We went to Shilin together. She did not need the map. She walked directly to the location. She said she could feel it from the train station. "Like a window left open in winter. You can feel where it is by the temperature change."<br><br>I have installed a camera.', marginNote: 'M. didn\'t hesitate. How long has she known? What else hasn\'t she told me?<br><br>3:17 a.m. It lasted fifty-eight seconds. I keep writing these numbers.', contentType: 'text' },
  { wave: 4, releaseDay: 4, page: 10, date: 'February 2', text: 'I have been watching four of them gather at the site every night this week. They arrive from different directions. They stay near the centre — not touching it, not each other. Just present. Groovix sways. Fugu is still. Muncha sits. Mr Q stands with his arms down, which I have never seen before.<br><br>They stayed for twenty-two minutes. I do not know what happened. But they moved differently when they left.<br><br>I am going to write everything down. All of it. In case someone needs to know.', marginNote: null, contentType: 'text' }
];

// ===== PINBOARD ITEMS =====
// Source of truth: pinboard-content-map.xlsx ("text assets for observatory").
const PINBOARD_ITEMS = [
  // W1 (launch, drips across two weeks): observations, sketches, M.'s first notes, the naming
  { wave: 1, releaseDay: 0, type: 'postit', asset: 'postit-13.png', text: 'Night market, 3am — four distinct silhouettes. None matching known fauna.', color: '#f7dc6f', rotation: -2, position: { top: '2%', left: '2%' }, author: 'researcher' },
  { wave: 1, releaseDay: 0, type: 'postit', asset: 'postit-2.png', text: 'The fast one stopped at a flower growing through concrete. Stayed 47 seconds. WHY?', color: '#f1948a', rotation: 3, position: { top: '48%', left: '32%' }, author: 'researcher' },
  { wave: 1, releaseDay: 0, type: 'postit', asset: 'postit-3.png', text: 'Type 4 — mouth takes up 70% of body. Inflates when near arguments. Deflates when they stop.', color: '#82e0aa', rotation: 0, position: { top: '2%', left: '62%' }, author: 'researcher' },
  { wave: 1, releaseDay: 2, type: 'postit', asset: 'postit-4.png', id: 'why-shilin', text: 'Every sighting clusters around Shilin. WHY SHILIN?', color: '#85c1e9', rotation: 1, position: { top: '55%', left: '82%' }, author: 'researcher' },
  { wave: 1, releaseDay: 0, type: 'sketch', image: 'fugu-sketch-1.png', position: { top: '28%', left: '2%' }, rotation: 2, label: '', replacedByWave: 2 },
  { wave: 2, releaseDay: 0, type: 'sketch', image: 'fugu-sketch-2.png', position: { top: '28%', left: '2%' }, rotation: 2, label: '' },
  { wave: 1, releaseDay: 0, type: 'sketch', image: 'MrQ-sketch-1.png', position: { top: '16%', left: '35%' }, rotation: -3, label: '' },
  { wave: 1, releaseDay: 0, type: 'sketch', image: 'groovix-sketch-1.png', position: { top: '50%', left: '4%' }, rotation: -3, label: '' },
  { wave: 1, releaseDay: 0, type: 'sketch', image: 'muncha-sketch-1.png', position: { top: '52%', left: '48%' }, rotation: 4, label: '' },
  { wave: 1, releaseDay: 5, type: 'postit', asset: 'postit-5.png', text: 'They carry what we cannot hold. It is not free.', color: '#f5b7b1', rotation: -2, position: { top: '14%', left: '18%' }, author: 'm' },
  { wave: 1, releaseDay: 6, type: 'postit', asset: 'postit-6.png', text: 'Fugu stopped mid-sprint and went completely still. Something small had caught his attention. He stayed that way for almost a minute.', color: '#f5b7b1', rotation: 5, position: { top: '14%', left: '74%' }, author: 'm' },
  { wave: 1, releaseDay: 6, type: 'postit', asset: 'postit-7.png', id: 'everywhere', text: 'Berlin, NYC, Paris, Bangkok — they are EVERYWHERE. But they keep coming back to Taipei.', color: '#f7dc6f', rotation: 2, position: { top: '24%', left: '48%' }, author: 'researcher' },
  { wave: 1, releaseDay: 8, type: 'postit', asset: 'postit-8.png', text: 'Names are not scientific. I have named them anyway. Fugu. Mr Q. Groovix. Muncha.', color: '#82e0aa', rotation: -3, position: { top: '38%', left: '68%' }, author: 'researcher' },
  { wave: 1, releaseDay: 10, type: 'postit', asset: 'postit-12.png', text: 'She keeps pinning things to my board. I did not ask her to.', color: '#f7dc6f', rotation: 2, position: { top: '70%', left: '14%' }, author: 'researcher' },

  // W2: energy loss, alarm — with the Fading
  { wave: 2, releaseDay: 0, type: 'postit', asset: 'postit-9.png', text: 'Energy output declining across ALL types. What is costing them?', color: '#f1948a', rotation: 4, position: { top: '62%', left: '72%' }, author: 'researcher' },
  { wave: 2, releaseDay: 2, type: 'postit', asset: 'postit-10.png', text: 'MrQ performed for 20 seconds today. Used to be 45. He flexed at the end but it was dimmer.', color: '#f7dc6f', rotation: -3, position: { top: '2%', left: '40%' }, author: 'researcher' },
  { wave: 2, releaseDay: 4, type: 'receipt', position: { top: '2%', left: '26%' }, rotation: 3, vendor: 'SHILIN MARKET STALL #17', date: '2024-11-10', items: ['Tea egg ×2', 'Stinky tofu ×1', '---', 'ANOMALOUS RESIDUE DETECTED'], total: 'NT$ 85' },
  { wave: 2, releaseDay: 5, type: 'photo', image: 'groovix polaroid.png', position: { top: '30%', left: '56%' }, rotation: -2, label: 'Shilin Night Market — 02:40', caption: 'Motion blur near flower stall. Fugu?' },
  { wave: 2, releaseDay: 7, type: 'postit', asset: 'postit-11.png', text: 'M.: "Not from here. The cost is the distance."', color: '#f5b7b1', rotation: -2, position: { top: '55%', left: '22%' }, author: 'm' },

  // W3: convergence confirmed, crystal sketch, diagram
  { wave: 3, releaseDay: 0, type: 'diagram', position: { top: '2%', left: '82%' }, rotation: -1, title: 'CONVERGENCE VECTORS', description: 'All specimen trajectories — directional arrows all pointing toward Taipei. Radial pattern confirmed. Center: [REDACTED]' },
  { wave: 3, releaseDay: 2, type: 'sketch', image: 'source crystal-1.png', position: { top: '36%', left: '18%' }, rotation: 1, label: '' },
  { wave: 3, releaseDay: 4, type: 'postit', asset: 'postit-12.png', text: 'M.: "They are not wandering here. They are arriving."', color: '#f5b7b1', rotation: 3, position: { top: '30%', left: '82%' }, author: 'm' },
  { wave: 3, releaseDay: 6, type: 'postit', asset: 'postit-13.png', id: 'fugu-direction', text: 'Followed Fugu for 3 hours. Sprint paths no longer random. He knows where he is going.', color: '#85c1e9', rotation: -1, position: { top: '58%', left: '55%' }, author: 'researcher' },
  { wave: 3, releaseDay: 9, type: 'receipt', position: { top: '44%', left: '40%' }, rotation: -4, vendor: '7-ELEVEN SHILIN #229', date: '2025-01-08', items: ['Battery pack ×1', 'Onigiri ×2', '---', 'UV TRACE: POSITIVE'], total: 'NT$ 147' },

  // W4: Source proximity, anomalies, safety valve
  { wave: 4, releaseDay: 0, type: 'postit', asset: 'postit-11.png', id: 'feed-hint', text: 'the feed hides what the feed cannot say.', color: '#f1948a', rotation: -3, position: { top: '2%', left: '52%' }, author: 'researcher' },
  { wave: 4, releaseDay: 0, type: 'postit', asset: 'postit-3.png', id: 'convergence-all', text: 'All observed specimens moving in the same direction. Every type. Every continent.', color: '#85c1e9', rotation: -2, position: { top: '68%', left: '28%' }, author: 'researcher' },
  { wave: 4, releaseDay: 2, type: 'photo', image: 'MrQ polaroid.png', position: { top: '10%', left: '52%' }, rotation: 2, label: '', caption: '' },
  { wave: 4, releaseDay: 4, type: 'postit', asset: 'postit-5.png', id: 'safety-valve', text: 'Three numbers. I keep repeating them on the tape.', color: '#f7dc6f', rotation: 3, position: { top: '44%', left: '64%' }, author: 'researcher' },

  // W5: after safe — M.'s final note
  { wave: 5, releaseDay: 0, type: 'postit', asset: 'postit-1.png', text: 'M. sat with them. Eleven minutes. Then: "It remembers." Look around you. They are closer than you think.', color: '#f5b7b1', rotation: -3, position: { top: '68%', left: '4%' }, author: 'm' },
];

// UV layer content: annotations from Wave 3, safe hint from Wave 4 (brief v12).
const PINBOARD_UV = [
  { type: 'note', text: 'PULL → they keep pulling toward one point', postitId: 'why-shilin', wave: 3 },
  { type: 'note', text: 'All paths converge → SE bearing 127°', postitId: 'fugu-direction', wave: 3 },
  { type: 'note', text: 'NON-SHILIN LOCATIONS = transit only?', postitId: 'everywhere', wave: 3 },
  { type: 'note', text: 'Source dot matches. Confirm with M.', postitId: 'convergence-all', wave: 4 },
  { type: 'note', text: '03 . 17 . 58 — check the feed', postitId: 'feed-hint', wave: 4 },
];

// ===== CASSETTE TAPES (v12 lineup — dictaphone logic) =====
// A micro-cassette recorder is a dictaphone: dictated logs, recorded
// calls, and the one natively audible phenomenon (the hum). M.'s voice
// arrives in Wave 2 (T-03); only T-06 is locked behind the safe.
const CASSETTE_TAPES = [
  { id: 'T-01', wave: 1, releaseDay: 0, requiresSafe: false, label: 'T-01: Field Log 01', description: 'Dictated the night of the first sighting. Night-market ambience, breath, excitement he is embarrassed by: "It was fast. Impossibly fast. And then it just... stopped. There was a flower growing through a crack in the concrete and it stood there, perfectly still, looking at it. I need to come back tomorrow."', audioUrl: null },
  { id: 'T-02', wave: 1, releaseDay: 7, requiresSafe: false, label: 'T-02: Naming Them', description: 'At the desk, late. Reviewing notes aloud, formal at first — "Type 2 exhibits theatrical display behavior" — then a pause. "Type 2 is not a type. He performs. ...Mr Q. I am calling him Mr Q." The other three follow, faster, warmer. "This is not scientific. I no longer care after midnight."', audioUrl: null },
  { id: 'T-03', wave: 2, releaseDay: 0, requiresSafe: false, label: 'T-03: The Call', description: 'A recorded phone call — M.\'s voice for the first time, thin and calm through the line. He describes the diminished readings. She is unsurprised: "Of course they are losing it. They carry what we cannot hold." He asks what that means. A silence long enough to hurt. Click. Then his voice alone: "She wasn\'t surprised. Why wasn\'t she surprised?"', audioUrl: null },
  { id: 'T-04', wave: 3, releaseDay: 0, requiresSafe: false, label: 'T-04: Vectors', description: 'Dictated at the desk, papers shuffling. "Every type, every sighting, same direction. Two hundred and eleven vectors." He hesitates before the word: "I have started calling the endpoint... the Source. I don\'t know what it is. I intend to find out."', audioUrl: null },
  { id: 'T-05', wave: 4, releaseDay: 0, requiresSafe: false, label: 'T-05: The Site', description: 'At the Shilin location, with M. present. Almost no narration — night insects, distant market, and underneath, a low warm hum the recorder half-catches. A whispered exchange: "Do you feel that?" — "It feels you." Long silence. Then, murmured to himself: "Three seventeen. ...Fifty-eight seconds."', audioUrl: null },
  { id: 'T-06', wave: 5, releaseDay: 0, requiresSafe: true, label: 'T-06: The Interview', description: 'The formal sit-down. M. in full for the first time: "Groovix does not dance because he wants to. The rhythm is in him." Inter-dimensional visitors. Joy fragments. "The crystal is the door. Or what\'s left of it." "They need the Source the way we need air." Then: "When people gather with the right intention—" Mid-word, the tape cuts. Bulk erasure. When it resumes, quieter: "Let\'s leave that part out."', audioUrl: null },
];

// ===== SAFE DOSSIER =====
const SAFE_DOSSIER = {
  sections: [
    { title: 'Section 1 — Type Profiles', content: [
      { type: 'Type 1 — Fugu', classification: 'Hyper-alert Sprinter / Perceptive Guardian', text: 'Detects low vibration, danger, and emotional tension before others. Reacts with explosive speed — spine compresses into aerodynamic "bullet mode." Beneath the hyper-vigilance: a profoundly tender heart. When encountering small wonders — a baby smiling, dew on a leaf — stops completely, posture softens, warm expression emerges. Flagship: blink-and-miss-it sprint + tender pause.', footnote: 'Journal designation "Fugu" — references defensive compression posture.' },
      { type: 'Type 2 — MrQ', classification: 'Theatrical Aggressor / Performer', text: 'Overconfident, dramatic, emotionally reactive. Believes it is scaring away negative energy. Actual function: hyperactive performer. Arms perpetually raised. Glossy head for headbutt charges. Tongue display intended as intimidation consistently produces laughter. Flagship: frantic jumping with arm-shaking + rhythmic hip movement.', footnote: 'Journal designation "Mr Q" — references inquisitive head-tilt.' },
      { type: 'Type 3 — Groovix', classification: 'Involuntary Rhythmic Mover / Accidental Destructor', text: 'Tall, gentle, clumsy. Long tail with wide swinging range. Natural rhythm sway even when idle — involuntary nervous system response. Cannot separate emotional state from physical movement. When exposed to rhythm, movement spreads until environmental damage occurs. Flagship: involuntary rhythmic movement escalating to accidental structural damage.', footnote: 'Journal designation "Groovix." Note: specimen never decides to dance. Movement happens to it.' },
      { type: 'Type 4 — Muncha', classification: 'Tension Ingester / Inflation-Deflation Cycle', text: 'Attempts to help by "eating" emotional heaviness. Mouth comprises 70% of body. Two antennae vibrate when detecting ingestible energy. Can inflate to 4x resting volume. Deflation rapid, accompanied by squeaking. Tiny limbs create characteristic waddle. Flagship: tension devouring + visible inflation cycle.', footnote: 'Journal designation "Muncha" — the first he named.' }
    ]},
    { title: 'Section 2 — Energy Depletion Analysis', content: 'Specimens that absorb emotional heaviness lose coherence. The more they absorb, the dimmer they become. Prolonged exposure to high-tension environments produces measurable decline in sprint speed (Type 1), display intensity (Type 2), rhythm stability (Type 3), and deflation rate (Type 4).\n\nThey instinctively seek something to restore themselves. Three hypotheses:\n\nHypothesis A (Researcher): Inter-dimensional organisms displaced by energy imbalance. Behaviors are instinctive responses to emotional frequency differentials. They do not intend to help. They react. The energy cost is physical.\n\nHypothesis B (M.): Concentrations of joy — condensed from a world where joy is the baseline. Absorbing our heaviness depletes what they are made of. They need the Source the way we need air.\n\nHypothesis C (Integrated): Both perspectives describe the same phenomenon at different scales. Physically real AND energetically coherent. The distinction may not apply.' },
    { title: 'Section 3 — Convergence Report', content: 'Directional analysis of all documented sighting trajectories.\n\nEvery type. Every location. Every continent. When not engaged in immediate behavioral response, all specimens orient in the same direction. Sprint paths, dance routes, waddle trajectories — bearing 127° SE from European observations, adjusted for curvature.\n\nAll roads lead to Shilin. Within Shilin, to one specific location.\n\n██████████████████ coordinates confirmed ██████████████████\n\nThe convergence is accelerating. Frequency of multi-type co-occurrence events has increased 340% since January.' },
    { title: 'Section 4 — The Source', content: '██████████████████████████████████████████████████████████████████████\n\n...an anchor between their origin and this world...\n\n██████████████████████████████████████████████████████████████████████\n\n...the crystal stabilises them...\n\n█████████████████████████████████████████████████████████████████████████████████\n\nAll observed specimens appear to be moving in the same direction.\n\n████████████████████████████████████████', isRedacted: true },
    { title: 'Section 5 — Incident Report', content: 'CLASSIFIED — Proximity Event\nShilin District — 03:17\n\n████████████ approached ████████████ at coordinates ██████████. Duration: ██ minutes. All four types present. ████████████████████████ readings exceeded ████████████.\n\nObserver: "███████████████████ something I cannot ████████████."\n\nConclusion: Observation concluded. Not approached.\n\n[Torn section — bottom third missing]', isRedacted: true }
  ],
  finalPage: 'If you are reading this, you have been paying attention.\nThat means you understand enough.\nThe rest you have to see.'
};

// ===== SOURCE MONITOR (Wave 5) =====
// `pre` = installation footage (Wave 5 drop, before gallery opening day);
// `live` = live crystal feed (from gallery opening day — WaveSystem.isGalleryLive()).
const SOURCE_MONITOR = {
  pre: { coherence: 73, status: 'ACTIVE — CALIBRATING', feed: 'Crystal installation in progress. Coherence baseline establishing. Specimens orienting toward Source bearing.', readings: ['CRYSTAL STATE: RESPONSIVE', 'AMBIENT FREQ: 432.7 Hz', 'CONVERGENCE EVENTS: 7 (last 48h)', 'SPECIMEN PROXIMITY: DETECTED', 'MEMBRANE STABILITY: 67%'] },
  live: { coherence: 89, status: 'LIVE — GALLERY FEED', feed: 'Physical convergence confirmed. Crystal luminescence visible without instruments. Live feed: Shilin gallery floor.', readings: ['CRYSTAL STATE: SELF-SUSTAINING', 'AMBIENT FREQ: 528.0 Hz (LOCKED)', 'CONVERGENCE EVENTS: CONTINUOUS', 'SPECIMEN COUNT: EXCEEDS SENSOR RANGE', 'MEMBRANE STABILITY: 94%', 'NOTE: The Source remembers.'] }
};

// ===== CREATURE PROFILES =====
const PROFILES = [
  { name: 'Fugu', type: 'Type 1', classification: 'Hyper-alert Sprinter', firstSighting: 'September 3, 2024', height: '22cm (variable)', behavior: 'Explosive speed, then sudden tender stillness at beauty.', dangerLevel: 'Minimal', notes: 'First to move. First to feel.' },
  { name: 'MrQ', type: 'Type 2', classification: 'Explosive Cheerleader', firstSighting: 'November 19, 2024', height: '20cm', behavior: 'Theatrical fake intimidation. Everything is a performance.', dangerLevel: 'Minimal', notes: 'Believes he is terrifying. Has never terrified anyone.' },
  { name: 'Groovix', type: 'Type 3', classification: 'Clumsy Dancing Giant', firstSighting: 'October 25, 2024', height: '18cm (tallest)', behavior: 'Involuntary rhythm. Tail causes accidental destruction.', dangerLevel: 'Moderate — structural damage', notes: 'Never decides to dance. Movement happens to him.' },
  { name: 'Muncha', type: 'Type 4', classification: 'Anxiety Eater', firstSighting: 'September 12, 2024', height: '16cm', behavior: 'Devours emotional heaviness. Inflates, deflates. Mouth is 70% of body.', dangerLevel: 'None', notes: 'Pure enthusiasm, zero restraint.' }
];

// ===== POST-IT IMAGE ASSETS =====
const POSTIT_IMAGES = [
  'postit-1.png', 'postit-2.png', 'postit-3.png', 'postit-4.png',
  'postit-5.png', 'postit-6.png', 'postit-7.png', 'postit-8.png',
  'postit-9.png', 'postit-10.png', 'postit-11.png', 'postit-12.png',
  'postit-13.png'
];
