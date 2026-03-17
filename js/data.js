// ============================================================
// KANAPUTZ OBSERVATORY — Content Data
// Edit this file to add new content to the room.
// No code changes needed — just add entries to the arrays.
// ============================================================

const SIGHTINGS = [
  { date: "2024-11-03", time: "02:17", location: "Taipei Night Market, Taiwan", description: "Entity observed hovering near steam vent. Appeared attracted to dumpling stand glow." },
  { date: "2024-11-18", time: "23:45", location: "Berlin U-Bahn, Station Alexanderplatz", description: "Small creature spotted pressed against vending machine glass. Seemed mesmerized by LED display." },
  { date: "2024-12-01", time: "04:33", location: "Shibuya Crossing, Tokyo", description: "Multiple entities (3) seen weaving between pedestrians. No one appeared to notice." },
  { date: "2025-01-14", time: "01:02", location: "Montmartre, Paris", description: "Single specimen found sitting on cafe chair, mimicking posture of nearby sculpture." },
  { date: "2025-02-07", time: "22:19", location: "Subway Tunnel B-7, New York", description: "Faint chittering heard. Maintenance crew reported 'weird shadow'. No visual confirmation." },
  { date: "2025-03-22", time: "03:58", location: "Jiufen Old Street, Taiwan", description: "Two entities photographed near red lanterns. Image degraded. Shapes consistent with prior sightings." },
  { date: "2025-04-11", time: "00:41", location: "Camden Market, London", description: "Street vendor reported merchandise rearranged overnight. Teeth marks on wooden stall beam." },
  { date: "2025-05-30", time: "05:12", location: "Tamsui Fisherman's Wharf, Taiwan", description: "Entity seen perched on dock post at dawn. Appeared to be watching the sunrise." },
  { date: "2025-06-19", time: "21:07", location: "Flea Market, Istanbul", description: "Carpet dealer reported 'small laughing thing' hiding under kilim stack. Gone upon investigation." },
  { date: "2025-07-08", time: "02:54", location: "Charging Station, Seoul", description: "Entity found sitting cross-legged in front of EV charging port. Green indicator light pulsing in sync with its breathing." },
  { date: "2025-08-25", time: "04:20", location: "Abandoned Warehouse, Taipei", description: "Cluster of 5+ entities detected. Arranged in circle around flickering fluorescent tube. Possible Source-seeking behavior." },
  { date: "2025-09-14", time: "23:33", location: "Rooftop Garden, Singapore", description: "Single entity observed touching plants. Leaves appeared to brighten momentarily. Coincidence not ruled out." },
  { date: "2025-10-02", time: "01:15", location: "Underground Passage, Prague", description: "Tourist photo shows blurred figure with oversized head. Matches Muncha profile." },
  { date: "2025-11-20", time: "03:07", location: "Night Bus #42, Taipei", description: "Driver reported passenger seat vibrating. Security camera shows small shape pressed against window, watching city lights." },
  { date: "2025-12-31", time: "23:59", location: "Multiple Locations Worldwide", description: "SURGE EVENT: 47 simultaneous sightings reported across 12 countries. Duration: 90 seconds. Correlation with midnight fireworks unknown." },
  { date: "2026-01-18", time: "02:22", location: "Server Room, Hsinchu Science Park", description: "Entity discovered sleeping between blade servers. Core temperature dropped 2.1C in surrounding rack." },
  { date: "2026-02-04", time: "04:48", location: "Art Gallery Storage, Taipei", description: "Sculpture wrapping disturbed. Small footprints in dust. Crystal fragment found nearby - composition unknown." },
  { date: "2026-03-01", time: "00:30", location: "Observatory Field Station Alpha", description: "Source detector fluctuation +340%. Brief. No visual. Something is building." },
];

const PROFILES = [
  {
    name: "Groovix",
    classification: "Type-G / Kinetic",
    firstSighting: "Taipei, November 2024",
    height: "~18cm",
    distinguishing: "Elongated neck, spiky dorsal crest, curved tail. Highly expressive eye placement (top of head).",
    behavior: "Hyperactive. Constantly in motion. Tends to mimic dance-like movements observed in humans. Has been seen 'grooving' near speakers and vibrating surfaces. Appears to feed on rhythmic energy.",
    dangerLevel: "None",
    notes: "Most frequently sighted specimen. Possibly the first to have crossed over. Shows no fear of humans. Seems genuinely entertained by our behavior. I've started leaving music on at the field station. It helps."
  },
  {
    name: "Fugu",
    classification: "Type-F / Chaotic",
    firstSighting: "Tokyo, December 2024",
    height: "~22cm (variable — appears to inflate)",
    distinguishing: "Massive jaw with irregular teeth. Spiny exterior. Bulging asymmetric eyes. Body covered in spike-like protrusions.",
    behavior: "Unpredictable. Alternates between stillness and sudden bursts of frantic movement. Has been observed laughing (or what sounds like laughing) at inappropriate moments. Attracted to chaos — traffic, arguments, crowded spaces.",
    dangerLevel: "None (despite appearance)",
    notes: "Looks terrifying. Acts like a toddler who just discovered bubble wrap. I think the spines are decorative. Or maybe a defense mechanism from their home dimension. Either way, Fugu has never harmed anything. Knocked over my coffee twice though."
  },
  {
    name: "Mr. Q",
    classification: "Type-Q / Observer",
    firstSighting: "Paris, January 2025",
    height: "~20cm",
    distinguishing: "Rounded body, small antennae, wide open mouth with visible tongue. Perpetually surprised expression. Stubby limbs.",
    behavior: "The watcher. Mr. Q tends to find elevated positions and simply... observe. Rarely moves unless startled. Has been documented staring at humans for extended periods with what can only be described as bemused curiosity.",
    dangerLevel: "None",
    notes: "Of all specimens, Mr. Q unnerves me the most — not because he's threatening, but because he seems to understand more than the others. Sometimes I catch him looking at my notes. I've started writing in code. He doesn't seem to mind."
  },
  {
    name: "Muncha",
    classification: "Type-M / Consumer",
    firstSighting: "London, April 2025",
    height: "~16cm",
    distinguishing: "Spherical body, oversized head-to-body ratio, prominent teeth along bottom jaw. Small pointed ears. Stubby legs.",
    behavior: "Compulsive chewer. Will attempt to gnaw on virtually any object. Shows preference for wooden and paper materials. Despite aggressive chewing, rarely causes significant damage — teeth appear designed for grip, not destruction.",
    dangerLevel: "None (watch your pencils)",
    notes: "Muncha ate three pages of my field journal before I noticed. The irony is not lost on me that a creature from another dimension chose to consume my documentation about creatures from another dimension. I've switched to digital notes. She now chews on my USB cables."
  }
];

const NOTEBOOK_ENTRIES = [
  {
    date: "November 15, 2024",
    text: "First confirmed sighting. I don't know what I saw tonight. Something small, fast, and absolutely not in any field guide I've ever read. It was near the night market, pressed against a steam vent, and it was... smiling? I need sleep. But I also need to go back tomorrow. I set up a motion-triggered camera near the same vent before leaving. If this thing comes back, I want proof — something more than my shaking hands and a sketch on a napkin. The night market vendor next door said she's seen 'the little shadow' before, always around closing time, always near the warmest spots."
  },
  {
    date: "December 20, 2024",
    text: "Three more sightings this month. Tokyo, Berlin, Taipei again. They're not isolated incidents. Whatever these things are, they're appearing in cities — always at night, always near sources of light or energy. I've started a proper log. My colleagues think I'm losing it. Maybe I am."
  },
  {
    date: "February 2, 2025",
    text: "I've named four distinct specimens so far. Groovix was the first. Then Fugu in Tokyo — terrifying to look at, harmless in practice. Mr. Q showed up in Paris last month. And now Muncha in London (she ate my sandwich). They're all different, but they share something: they seem drawn to human emotion. Especially chaos. Especially joy."
  },
  {
    date: "April 28, 2025",
    text: "Working theory: they're not FROM here. The way they interact with our world — it's like tourists who don't speak the language but find everything hilarious. They don't understand our technology, but they're fascinated by it. Groovix tried to 'dance' with a Roomba yesterday. I have it on camera."
  },
  {
    date: "July 3, 2025",
    text: "The crystal fragment from the gallery storage. I can't stop thinking about it. It doesn't match any known mineral. And the way the entities behave around it — reverent, almost. Like it's a piece of something larger. Something important to them. I've started calling it the Source. No scientific basis for that name. It just felt right."
  },
  {
    date: "September 18, 2025",
    text: "They appear when things get heavy. I've cross-referenced every sighting with local news data. Pattern is clear: conflict, tension, stress spikes — that's when the cracks open. That's when they slip through. But here's what I can't explain: after they appear, the tension... lifts. People laugh. Things feel lighter. Coincidence? I don't believe in those anymore."
  },
  {
    date: "November 30, 2025",
    text: "The Source theory is holding. Multiple fragments detected now. They seem to react to collective emotional states — dim when the world is angry, brighter when calm prevails. I sound insane writing this. But the data doesn't lie. Something is responding to us. Or maybe... it always was, and we just weren't paying attention."
  },
  {
    date: "January 22, 2026",
    text: "New Year's Eve surge. 47 sightings in 90 seconds. Across the entire planet. Whatever barrier separates their world from ours — it's thinning. They're coming through more frequently. More of them each time. I should be scared. Instead I find myself leaving the window open at night, hoping Groovix will visit again. What is happening to me."
  },
  {
    date: "March 10, 2026",
    text: "Source detector spiked again last night. +340%. Something is building. I can feel it. The entities are gathering — not randomly anymore, but with purpose. They're looking for something. Or someone. The investigation continues. I'm not sure I'm the one conducting it anymore."
  }
];

const POSTIT_NOTES = [
  { text: "WHY always near light sources??", color: "#f7dc6f", rotation: -3 },
  { text: "Check hedonometer data — correlation with sighting frequency?", color: "#f1948a", rotation: 2 },
  { text: "Fugu seen LAUGHING during thunderstorm. Why?", color: "#82e0aa", rotation: -1 },
  { text: "Crystal fragment = piece of the Source?", color: "#85c1e9", rotation: 4 },
  { text: "They never appear alone anymore", color: "#f7dc6f", rotation: -2 },
  { text: "Mr. Q was watching me again. 3 hours. Didn't blink.", color: "#f5b7b1", rotation: 1 },
  { text: "Muncha chewed through the USB cable AGAIN", color: "#82e0aa", rotation: -4 },
  { text: "Night market vendor says they've 'always been here'. What does she know?", color: "#f7dc6f", rotation: 3 },
  { text: "DO NOT tell Chen about the Source readings. Not yet.", color: "#f1948a", rotation: -2 },
  { text: "Dimension cracks = emotional pressure valves? The Void breathes?", color: "#85c1e9", rotation: 1 },
  { text: "New Year's Eve: 47 sightings. 12 countries. 90 seconds. THIS IS NOT RANDOM.", color: "#f1948a", rotation: -1 },
  { text: "Groovix danced for 4 minutes straight today. I cried. I don't know why.", color: "#f7dc6f", rotation: 2 },
];

const WALL_SKETCHES = [
  { name: "Groovix", description: "Sketch #001 — Observed dancing near steam vent. Note elongated neck, spiky crest.", svgId: "sketch-groovix" },
  { name: "Fugu", description: "Sketch #002 — Captured during inflation event. Spines fully extended.", svgId: "sketch-fugu" },
  { name: "Mr. Q", description: "Sketch #003 — Stationary observation pose. Subject was watching ME.", svgId: "sketch-mrq" },
  { name: "Muncha", description: "Sketch #004 — Mid-chew. Subject consumed 3 pencils during sketch session.", svgId: "sketch-muncha" },
];
