export const A = "https://jaikarpothula.com/Assets";

export const contact = {
  email: "Jaikardevgame@gmail.com",
  linkedin: "https://www.linkedin.com/in/jaikar-pothula-489b681a5/",
  behance: "https://www.behance.net/jaikarpothula",
  artstation: "https://www.artstation.com/jaikarpothula007",
  itch: "https://jim-jam-play.itch.io/customizedangel",
  linkedinQr: `${A}/LOGO/qr.png`,
  playQr:
    "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.vaultgames.findtheoctopushiddenobjectgames",
  play: "https://play.google.com/store/apps/details?id=com.vaultgames.findtheoctopushiddenobjectgames&hl=en_US",
};

export const links = {
  steam:
    "https://store.steampowered.com/app/3295930/THE_DARK_ARRIVAL__SHADOWS_OF_THE_PAST/",
  figmaDarkArrival:
    "https://www.figma.com/design/MaSahDVicf0yEAzQPHE5LF/DARK-ARRIVAL-NEW?node-id=108-2",
  figmaSuite13:
    "https://www.figma.com/design/GY9Xha8TuDwjtyIfUJiHHO/SUITE-13?node-id=0-1",
  figmaCoffee:
    "https://www.figma.com/design/UffzIQh10TRuDHRvieG42S/COFFEE-BEAN-UI-UX-FINAL-CASE-STUDY?node-id=0-1&t=gnSchA6om4bCi8sM-1",
  figmaSmartGuardian:
    "https://www.figma.com/design/IqFqKy1cWpD6k9X3DkV8c6/SMART-GUARDIAN?node-id=1-2&t=cVQGuMg1kbxleZba-1",
  smartGuardianBreakdown:
    "https://69eff7255c35f6a00c5068a4--tourmaline-gingersnap-67b9f5.netlify.app/",
  coffeeVideo: "https://www.youtube.com/watch?v=f6GRO7mVbo8",
  itchCustomizedAngel: "https://jim-jam-play.itch.io/customizedangel",
  resumeGame: `${A}/resumes/Jaikar_Pothula_Master_Resume_Game_UI_UX.pdf`,
  resumeProduct: `${A}/resumes/Jaikar_Pothula_Master_Resume_Product_Design.pdf`,
  pdfDarkArrival: `${A}/pdfs/The_Dark_Arrival_Case_Study.pdf`,
  pdfCustomizedAngel: `${A}/pdfs/Customized_Angel_Case_Study.pdf`,
  pdfOctopus: `${A}/pdfs/Find_the_Hidden_Octopus_UIUX_Case_Study.pdf`,
  pdfRonin: `${A}/pdfs/Tale_of_Ronin_UI_UX_Case_Study.pdf`,
  pdfFindTheDog: `${A}/pdfs/find_the_dog_case_study.pdf`,
  artstation: "https://www.artstation.com/jaikarpothula007",
  play: contact.play,
};

export type ProjectLink = { label: string; href: string };
export type CaseStudy = {
  problem: string;
  decision: string;
  outcome: string;
  proof: string[];
};
/** One headline impact figure plus the fact that backs it up. */
export type ProjectImpact = { label: string; value: string; detail: string };
/** Supporting production details every case file carries. */
export type ProjectDetails = {
  role: string;
  scope: string;
  engine: string;
  team: string;
  contribution: string[];
};
export type Project = {
  id: string;
  category: "game" | "product";
  kind: string;
  status: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  links: ProjectLink[];
  study: CaseStudy;
  impact: ProjectImpact[];
  details: ProjectDetails;
};

export const projects: Project[] = [
  {
    id: "the-dark-arrival",
    category: "game",
    kind: "PC GAME UI",
    status: "STEAM · LIVE",
    title: "THE DARK ARRIVAL",
    description:
      "An interactive 3D Investigator Journal that turns narrative evidence into gameplay decisions through diegetic UI.",
    tags: ["UE5 / UMG", "BLUEPRINTS", "DIEGETIC UI"],
    image: `${A}/Dark%20Arrival/Screenshot_2026-03-31_195708.png`,
    impact: [
      { label: "SHIPPED", value: "STEAM", detail: "The Dark Arrival: Shadows of the Past, live on Steam" },
      { label: "SHOWN AT", value: "GDC 2026", detail: "Production UI running in the playable build" },
      { label: "UI SYSTEM", value: "1 KIT", detail: "Menus, HUD and journal share one UMG component system" },
    ],
    details: {
      role: "Technical UI Designer",
      scope: "Diegetic 3D Investigator Journal, HUD, menus",
      engine: "Unreal Engine 5 · UMG · Blueprints",
      team: "Game team — UI design and implementation owned end to end",
      contribution: [
        "Designed the evidence layer as an in-world 3D journal instead of a flat menu",
        "Built modular UMG widgets driven by Blueprint logic",
        "Documented the component system in Figma for handoff",
      ],
    },
    study: {
      problem:
        "Narrative evidence was scattered across the game, so players lost track of what they had found and why it mattered.",
      decision:
        "Designed the evidence layer as a diegetic 3D Investigator Journal and architected it as modular UMG / Blueprint widgets instead of a flat menu.",
      outcome:
        "Evidence review became a gameplay decision: players connect clues in-world while menus, HUD, and journal share one component system.",
      proof: [
        "Shipped on Steam — The Dark Arrival: Shadows of the Past",
        "Production UI in the GDC 2026 playable build",
        "Figma source + full case-study PDF available below",
      ],
    },
    links: [
      { label: "01 · VIEW ON STEAM ↗", href: links.steam },
      { label: "02 · OPEN FIGMA SOURCE ↗", href: links.figmaDarkArrival },
      { label: "03 · VIEW / DOWNLOAD CASE STUDY PDF ↓", href: links.pdfDarkArrival },
    ],
  },
  {
    id: "suite-13",
    category: "game",
    kind: "PC GAME UI",
    status: "IN DEVELOPMENT",
    title: "SUITE 13",
    description:
      "A system-driven thriller HUD built around audio-visual cues, restrained screen clutter, and tension-first feedback.",
    tags: ["UE5 / UMG", "HUD LOGIC", "MOTION"],
    impact: [
      { label: "STATE", value: "IN DEV", detail: "System-driven thriller HUD, active build" },
      { label: "APPROACH", value: "CUE-LED", detail: "Audio-visual feedback replaces persistent panels" },
      { label: "SPECS", value: "DOCUMENTED", detail: "HUD logic and motion specs captured in Figma" },
    ],
    details: {
      role: "Technical UI Designer",
      scope: "HUD system, feedback states, motion language",
      engine: "Unreal Engine 5 · UMG",
      team: "In-development title — UI systems and motion",
      contribution: [
        "Defined a system-first HUD around audio-visual cues",
        "Cut persistent screen clutter to protect tension",
        "Specified motion and state logic in Figma",
      ],
    },
    study: {
      problem:
        "A thriller HUD that shows too much breaks tension; a HUD that shows too little leaves the player guessing.",
      decision:
        "Built the interface system-first around audio-visual cues and restrained screen clutter, letting feedback carry state instead of persistent panels.",
      outcome:
        "A tension-first HUD where every element earns its place and player feedback stays readable during pressure moments.",
      proof: [
        "In development in UE5 / UMG",
        "HUD logic and motion specs documented in Figma",
      ],
    },
    links: [{ label: "OPEN CASE FILE ↗", href: links.figmaSuite13 }],
  },
  {
    id: "customized-angel",
    category: "game",
    kind: "PC GAME UI",
    status: "UNITY",
    title: "CUSTOMIZED ANGEL",
    description:
      "Timeline-based UI systems for tracking layered gameplay events and logical deductions.",
    tags: ["UNITY C#", "SYSTEM DESIGN", "ANIMATION"],
    image: `${A}/Videos/jaikar-pothula-title.png`,
    impact: [
      { label: "PLAYABLE", value: "ITCH.IO", detail: "Public build available to play" },
      { label: "CORE SYSTEM", value: "TIMELINE", detail: "Event-order UI for layered deductions" },
      { label: "ALSO OWNED", value: "BRANDING", detail: "Branding plus animated UI states" },
    ],
    details: {
      role: "Technical UI Designer",
      scope: "Timeline UI systems, deduction tracking, branding",
      engine: "Unity · C#",
      team: "Game team — UI systems, animation and branding",
      contribution: [
        "Designed timeline-based UI that exposes event order",
        "Implemented deduction tracking and animated UI states",
        "Produced the title branding and case-study PDF",
      ],
    },
    study: {
      problem:
        "Layered gameplay events and deductions were hard to follow, so players could not reason about cause and effect.",
      decision:
        "Designed timeline-based UI systems in Unity C# to expose event order, plus branding and animated UI states to reinforce the logic.",
      outcome:
        "Players can read the timeline, track deductions, and act with confidence in a playable build.",
      proof: [
        "Playable on itch.io",
        "Timeline tracking, deduction logic, branding and animated UI",
        "Full case-study PDF available below",
      ],
    },
    links: [
      { label: "01 · PLAY ON ITCH.IO ↗", href: links.itchCustomizedAngel },
      { label: "02 · VIEW / DOWNLOAD CASE STUDY PDF ↓", href: links.pdfCustomizedAngel },
    ],
  },
  {
    id: "find-the-octopus",
    category: "game",
    kind: "MOBILE GAME UI",
    status: "PLAY STORE · LIVE",
    title: "FIND THE OCTOPUS",
    description:
      "A bright live-service system for progression, timed power-ups, mission rewards, and VIP monetization.",
    tags: ["UNITY UGUI", "2D ART", "LIVE OPS"],
    image: `${A}/FIND%20THE%20OCTOPUS/jaikar-pothula-show-case-2.png`,
    impact: [
      { label: "SHIPPED", value: "PLAY STORE", detail: "Live mobile title on Google Play" },
      { label: "LIVE-OPS", value: "4 SYSTEMS", detail: "Progression, timed power-ups, mission rewards, VIP" },
      { label: "ART", value: "2D IN-HOUSE", detail: "Matching 2D art produced alongside the UI" },
    ],
    details: {
      role: "Game UI/UX Designer",
      scope: "Progression, monetization and live-ops UI, 2D art",
      engine: "Unity · uGUI",
      team: "Mobile live-service team",
      contribution: [
        "Built a bright, small-screen-first live-service UI language",
        "Designed the reward loop across power-ups, missions and VIP",
        "Produced supporting 2D art assets",
      ],
    },
    study: {
      problem:
        "A casual hidden-object game needed progression and monetization systems that stay legible on small screens.",
      decision:
        "Built a bright live-service system in Unity uGUI covering level progression, timed power-ups, mission rewards, and VIP monetization, with matching 2D art.",
      outcome:
        "A live Play Store title with a repeatable reward loop and consistent UI language across every live-ops surface.",
      proof: [
        "Live on Google Play",
        "Progression, power-ups, mission rewards, VIP systems and 2D art",
        "Full case-study PDF available below",
      ],
    },
    links: [
      { label: "01 · PLAY STORE ↗", href: links.play },
      { label: "02 · VIEW / DOWNLOAD CASE STUDY PDF ↓", href: links.pdfOctopus },
    ],
  },
  {
    id: "tale-of-ronin",
    category: "game",
    kind: "PC GAME UI",
    status: "UNITY",
    title: "TALE OF RONIN",
    description:
      "Interaction systems shaped around a restrained sumi-e art direction.",
    tags: ["UNITY", "ART DIRECTION", "INTERACTION"],
    image: `${A}/Videos/HERO.png`,
    impact: [
      { label: "DIRECTION", value: "SUMI-E", detail: "Ink-led art direction carried into the interface" },
      { label: "OUTPUT", value: "1 LANGUAGE", detail: "Interface and world share one visual language" },
      { label: "ARTIFACT", value: "MOOD BOARD", detail: "Documented interaction set and mood board" },
    ],
    details: {
      role: "UI/UX Designer",
      scope: "Interaction systems and art direction",
      engine: "Unity",
      team: "Concept project — art direction and interaction design",
      contribution: [
        "Shaped interaction systems around the sumi-e direction",
        "Held hierarchy and legibility inside a restrained palette",
        "Documented the mood board and interaction set",
      ],
    },
    study: {
      problem:
        "A restrained sumi-e art direction leaves little room for conventional UI without breaking the mood.",
      decision:
        "Shaped interaction systems around the art direction itself, keeping ink-led visual language while preserving hierarchy and legibility.",
      outcome:
        "Interface and world share one visual language, with a documented mood board and interaction set.",
      proof: [
        "Unity interaction systems and visual mood board",
        "Full case-study PDF available below",
      ],
    },
    links: [
      { label: "VIEW / DOWNLOAD CASE STUDY PDF ↓", href: links.pdfRonin },
    ],
  },
  {
    id: "find-the-dog",
    category: "game",
    kind: "MOBILE GAME UI",
    status: "UNITY UGUI",
    title: "FIND THE DOG",
    description:
      "Readable menus and modular casual-game progression on small screens.",
    tags: ["UNITY UGUI", "MOBILE UI", "PROGRESSION"],
    image: `${A}/Find%20the%20Dog/jaikar-pothula-main-title-1.png`,
    impact: [
      { label: "PLATFORM", value: "MOBILE", detail: "Small-screen-first casual game UI" },
      { label: "SYSTEM", value: "MODULAR", detail: "Progression components reused across screens" },
      { label: "RESULT", value: "NO REDRAWS", detail: "New levels reuse the same blocks" },
    ],
    details: {
      role: "Game UI/UX Designer",
      scope: "Menus and casual-game progression system",
      engine: "Unity · uGUI",
      team: "Mobile casual game team",
      contribution: [
        "Designed readable menus for phone scale",
        "Built modular progression components",
        "Packaged the work as a case-study PDF",
      ],
    },
    study: {
      problem:
        "Casual mobile menus get crowded fast, and progression stops being readable at phone scale.",
      decision:
        "Designed readable menus and modular casual-game progression components in Unity uGUI so screens reuse the same blocks.",
      outcome:
        "A consistent, small-screen-first UI set that scales across levels without redrawing layouts.",
      proof: [
        "Unity uGUI mobile UI and progression system",
        "Full case-study PDF available below",
      ],
    },
    links: [
      { label: "VIEW / DOWNLOAD CASE STUDY PDF ↓", href: links.pdfFindTheDog },
    ],
  },
  {
    id: "coffee-bean",
    category: "product",
    kind: "PRODUCT UI/UX",
    status: "COFFEE EXPERIENCE",
    title: "COFFEE BEAN",
    description:
      "A product UI/UX case study for a coffee discovery and ordering experience, developed from user flows and wireframes through visual design and interactive prototyping.",
    tags: ["FIGMA", "USER FLOWS", "PROTOTYPING"],
    image: "https://i.ytimg.com/vi/f6GRO7mVbo8/maxresdefault.jpg",
    impact: [
      { label: "FLOW", value: "1 PATH", detail: "Discovery and checkout resolved into one flow" },
      { label: "FIDELITY", value: "PROTOTYPE", detail: "Interactive Figma prototype, not static screens" },
      { label: "WALKTHROUGH", value: "VIDEO", detail: "Full case-study video published" },
    ],
    details: {
      role: "Product UI/UX Designer",
      scope: "User flows, wireframes, visual design, prototype",
      engine: "Figma",
      team: "Self-directed product case study",
      contribution: [
        "Mapped user flows and wireframes before visual design",
        "Merged discovery and ordering into a single path",
        "Built and recorded an interactive prototype walkthrough",
      ],
    },
    study: {
      problem:
        "Coffee discovery and ordering asks people to browse and buy in the same session, which usually means two competing flows.",
      decision:
        "Worked from user flows and wireframes through visual design into an interactive Figma prototype, resolving discovery and checkout into one path.",
      outcome:
        "A validated, prototyped ordering experience presented as a full product UI/UX case study.",
      proof: [
        "Walkthrough case-study video",
        "Interactive Figma prototype and flows",
      ],
    },
    links: [
      { label: "01 · WATCH CASE STUDY VIDEO ↗", href: links.coffeeVideo },
      { label: "02 · OPEN FIGMA CASE STUDY ↗", href: links.figmaCoffee },
    ],
  },
  {
    id: "smart-guardian",
    category: "product",
    kind: "PRODUCT DESIGN",
    status: "HEALTH & SAFETY",
    title: "SMART GUARDIAN",
    description:
      "AI-assisted elder safety UX for fall detection, health monitoring, and emergency response — designed for clarity when every second matters.",
    tags: ["FIGMA", "USER FLOWS", "PROTOTYPING"],
    impact: [
      { label: "DOMAIN", value: "HEALTH", detail: "Fall detection, health monitoring, emergency response" },
      { label: "RULE", value: "1 ACTION", detail: "One obvious action per state, for use under stress" },
      { label: "PUBLISHED", value: "BREAKDOWN", detail: "Interactive app breakdown available online" },
    ],
    details: {
      role: "Product Designer",
      scope: "AI-assisted safety flows, wireframes, prototype",
      engine: "Figma",
      team: "Self-directed product case study",
      contribution: [
        "Designed emergency flows for fast comprehension",
        "Reduced each state to a single obvious action",
        "Published an interactive app breakdown",
      ],
    },
    study: {
      problem:
        "Elder safety products must communicate fall detection, health status, and emergencies to users under stress, in seconds.",
      decision:
        "Designed AI-assisted flows in Figma around clarity first — one obvious action per state for fall detection, health monitoring, and emergency response.",
      outcome:
        "Health and emergency flows built for fast comprehension and confident action, documented as an app breakdown.",
      proof: [
        "Interactive app breakdown published online",
        "Figma flows, wireframes and prototype",
      ],
    },
    links: [
      { label: "01 · VIEW APP BREAKDOWN ↗", href: links.smartGuardianBreakdown },
      { label: "02 · OPEN FIGMA FILE ↗", href: links.figmaSmartGuardian },
    ],
  },
];

export const libraryItems = [
  {
    meta: "PC · STEAM · LIVE",
    title: "THE DARK ARRIVAL",
    blurb: "3D Investigator Journal, menus, and diegetic gameplay systems.",
    cta: "VIEW ON STEAM ↗",
    href: links.steam,
    image: `${A}/Dark%20Arrival/Screenshot_2026-03-31_195708.png`,
  },
  {
    meta: "PC · UE5 · IN DEVELOPMENT",
    title: "SUITE 13",
    blurb: "Minimal thriller HUD with tension-led audio and visual feedback.",
    cta: "OPEN FIGMA ↗",
    href: links.figmaSuite13,
  },
  {
    meta: "PC · UNITY C# · ITCH.IO",
    title: "CUSTOMIZED ANGEL",
    blurb: "Timeline tracking, deduction logic, branding, and animated UI.",
    cta: "PLAY ON ITCH.IO ↗",
    href: links.itchCustomizedAngel,
    image: `${A}/Videos/jaikar-pothula-title.png`,
  },
  {
    meta: "PC · UNITY",
    title: "TALE OF RONIN",
    blurb: "Interaction systems shaped around a restrained sumi-e art direction.",
    cta: "VIEW / DOWNLOAD CASE STUDY PDF ↓",
    href: links.pdfRonin,
    image: `${A}/Videos/HERO.png`,
  },
  {
    meta: "MOBILE · UNITY UGUI",
    title: "FIND THE DOG",
    blurb: "Readable menus and modular casual-game progression on small screens.",
    cta: "VIEW / DOWNLOAD CASE STUDY PDF ↓",
    href: links.pdfFindTheDog,
    image: `${A}/Find%20the%20Dog/jaikar-pothula-main-title-1.png`,
  },
  {
    meta: "MOBILE · PLAY STORE · LIVE",
    title: "FIND THE OCTOPUS",
    blurb: "Progression, power-ups, mission rewards, VIP systems, and 2D art.",
    cta: "PLAY STORE ↗",
    href: links.play,
    image: `${A}/FIND%20THE%20OCTOPUS/jaikar-pothula-show-case-2.png`,
  },
  {
    meta: "PRODUCT · COFFEE EXPERIENCE",
    title: "COFFEE BEAN",
    blurb: "User flows, wireframes, visual design, and an interactive Figma prototype.",
    cta: "OPEN FIGMA CASE STUDY ↗",
    href: links.figmaCoffee,
    image: "https://i.ytimg.com/vi/f6GRO7mVbo8/maxresdefault.jpg",
  },
  {
    meta: "PRODUCT · HEALTH & SAFETY",
    title: "SMART GUARDIAN",
    blurb: "Fall detection, health monitoring, and emergency-response flows.",
    cta: "OPEN FIGMA FILE ↗",
    href: links.figmaSmartGuardian,
  },
];

export const processSteps = [
  {
    num: "01",
    glyph: "⌖",
    title: "SYSTEM DESIGN",
    body: "Translate mechanics and product requirements into clear, decision-driven interfaces.",
    points: ["Mechanics & flows", "Information hierarchy", "Player decision paths"],
  },
  {
    num: "02",
    glyph: "⌘",
    title: "ARCHITECTURE",
    body: "Build modular frameworks that scale cleanly across screens, states, and teams.",
    points: ["UMG / Blueprint systems", "Reusable components", "Design tokens"],
  },
  {
    num: "03",
    glyph: "△",
    title: "IMPLEMENTATION",
    body: "Ship responsive interfaces in-engine and in product builds under real constraints.",
    points: ["UE5 & Unity", "Motion & feedback", "Performance testing"],
  },
];

export const coreLoadout = [
  "FIGMA",
  "UE5 UMG",
  "BLUEPRINT",
  "UNITY C#",
  "AFTER EFFECTS",
  "PERFORCE",
];

export const capabilityTabs = [
  { num: "01", label: "UX & SYSTEMS", note: "Flows, hierarchy, player guidance" },
  { num: "02", label: "VISUAL UI", note: "HUDs, menus, design systems" },
  { num: "03", label: "TECHNICAL UI", note: "UMG, Blueprint, Unity C#" },
  { num: "04", label: "MOTION & FEEDBACK", note: "States, transitions, game feel" },
];

export const capabilities = [
  {
    num: "01",
    title: "DESIGNING THE PLAYER’S PATH",
    body: "I turn mechanics and requirements into understandable journeys, then test the structure before visual polish begins.",
    chips: [
      "User flows",
      "Information architecture",
      "Wireframes",
      "Interactive prototypes",
      "Onboarding",
      "Accessibility",
    ],
  },
  {
    num: "02",
    title: "BUILDING A VISUAL LANGUAGE",
    body: "I create interfaces that belong to the world while preserving hierarchy, legibility, and consistency across every state.",
    chips: [
      "HUD design",
      "Menus",
      "Design systems",
      "Iconography",
      "2D game art",
      "Responsive UI",
    ],
  },
  {
    num: "03",
    title: "FROM FIGMA INTO ENGINE",
    body: "I build modular UI, connect states and inputs, and collaborate with engineers so the final experience matches the design intent.",
    chips: [
      "UE5 UMG",
      "Widget Blueprints",
      "Common UI",
      "Unity uGUI",
      "C#",
      "State machines",
    ],
  },
  {
    num: "04",
    title: "FEEDBACK PLAYERS CAN FEEL",
    body: "Motion communicates hierarchy, confirms actions, teaches behaviors, and adds character without slowing the player down.",
    chips: [
      "UI animation",
      "Micro-interactions",
      "Transitions",
      "After Effects",
      "Audio-visual cues",
      "Motion specs",
    ],
  },
];

export const dailyToolkit = [
  "FIGMA",
  "UNREAL ENGINE 5",
  "UNITY",
  "PHOTOSHOP",
  "ILLUSTRATOR",
  "AFTER EFFECTS",
  "GIT",
  "PERFORCE",
];

export const toolGroups = [
  {
    label: "DESIGN",
    items: ["Figma · Sketch", "Photoshop · Illustrator", "After Effects · Adobe Suite"],
  },
  { label: "ENGINE", items: ["UE5 UMG · Blueprint", "Common UI · Unity C#"] },
  { label: "PIPELINE", items: ["Git · Perforce", "Jira · Confluence"] },
  { label: "EXPERIENCE", items: ["3+ years", "shipping UI"] },
];

export const showcase = [
  { label: "OPTIONS UX", image: `${A}/Videos/Small%20capusule.png` },
  { label: "CAPSULE", image: `${A}/Videos/Small%20capusule.png` },
  { label: "TIMELINE HUD", image: `${A}/Videos/PsI78P.gif` },
  { label: "RONIN VISUAL DIRECTION", image: `${A}/Videos/HERO.png` },
  { label: "CUSTOMIZED ANGEL UI", image: `${A}/Videos/jaikar-pothula-title.png` },
  {
    label: "DARK ARRIVAL · STEAM",
    image: `${A}/Videos/Capsul%20dark%20arrival%20steam%20image%2014.png`,
  },
  {
    label: "MOOD BOARD",
    image: `${A}/Videos/TALE%20OF%20RONIN%20VISUAL%20MOOD%20BOARD.png`,
  },
];

export const galleryMoreWork = [
  {
    label: "DARK ARRIVAL · IN-ENGINE UI",
    image: `${A}/Dark%20Arrival/Screenshot_2026-03-31_195708.png`,
  },
  {
    label: "OCTOPUS · LIVE OPS UI",
    image: `${A}/FIND%20THE%20OCTOPUS/jaikar-pothula-show-case-2.png`,
  },
  {
    label: "FIND THE DOG · MOBILE UI",
    image: `${A}/Find%20the%20Dog/jaikar-pothula-main-title-1.png`,
  },
  { label: "GAME UI CAPSULE", image: `${A}/Videos/Small%20capusule.png` },
  { label: "ANIMATED HUD LOGIC", image: `${A}/Videos/PsI78P.gif` },
  {
    label: "RONIN · ART DIRECTION",
    image: `${A}/Videos/TALE%20OF%20RONIN%20VISUAL%20MOOD%20BOARD.png`,
  },
];

export const astraFacts = [
  { label: "WHY", value: "Readable navigation with cinematic pacing" },
  { label: "DESIGNED", value: "Menus, states, focus feedback, transitions" },
  { label: "SOFTWARE", value: "Figma · Photoshop · After Effects · Unity" },
  { label: "OUTPUT", value: "UI screens · HUD language · motion prototype" },
];

export const astraCards = [
  {
    tag: "UE5 · UMG",
    title: "DARK ARRIVAL MAIN MENU",
    body: "Cinematic horror navigation, state feedback, and production-ready Unreal implementation.",
  },
  {
    tag: "HUD · MOTION",
    title: "SUITE 13 INTERFACE",
    body: "Minimal thriller UI shaped around tension, timing, and clear player feedback.",
  },
  {
    tag: "PRODUCT UX",
    title: "SMART GUARDIAN",
    body: "Health and emergency flows designed for fast comprehension and confident action.",
  },
];

export const artstationThumbs = [
  {
    alt: "ArtStation game UI project preview",
    src: "https://cdnb.artstation.com/p/assets/covers/images/100/616/981/small_square/jaikar-pothula-jaikar-pothula-title-info.jpg?1783491605",
  },
  {
    alt: "Dark Arrival ArtStation case study preview",
    src: "https://cdna.artstation.com/p/assets/images/images/100/236/782/micro_square/jaikar-pothula-the-dark-arrival-uiux-case-study-01.jpg?1782279576",
  },
  {
    alt: "Mobile UI ArtStation project preview",
    src: "https://cdnb.artstation.com/p/assets/images/images/100/429/709/small_square/jaikar-pothula-icon.jpg?1782882440",
  },
  {
    alt: "Find the Octopus ArtStation case study preview",
    src: "https://cdna.artstation.com/p/assets/images/images/100/237/714/micro_square/jaikar-pothula-find-the-hidden-octopus-uiux-case-study-01.jpg?1782282996",
  },
  {
    alt: "Find the Dog ArtStation project preview",
    src: "https://cdnb.artstation.com/p/assets/images/images/097/588/333/small_square/jaikar-pothula-main-title-1.jpg?1774603671",
  },
  {
    alt: "Unreal Engine ArtStation project preview",
    src: "https://cdna.artstation.com/p/assets/images/images/091/792/090/small_square/jaikar-pothula-screenshot-2025-09-12-222853.jpg?1757828443",
  },
];

export const experience = [
  {
    period: "2024 — NOW",
    meta: "CONTRACT · UNITED STATES · REMOTE",
    company: "VAULT PRODUCTIONS PRIVATE LIMITED",
    role: "Technical UI Designer · Aug 2024 - Present",
    summary:
      "Owned UI/UX design across shipped games and digital-product experiences, moving from user flows and reusable Figma systems to production-ready implementation.",
    bullets: [
      "Built a 3D Investigator Journal driving narrative and gameplay decisions",
      "Architected modular UMG / Blueprint frameworks for menus, HUDs, and diegetic systems",
      "Designed casual live-service UI for Find the Octopus - level progression, rewards, and VIP monetization",
      "Created product UI flows, wireframes, interactive prototypes, and reusable Figma components with a focus on clarity, accessibility, and scalable handoff",
      "Applied shared design-system thinking across game and product interfaces, defining hierarchy, interaction states, responsive behavior, and developer-ready specifications",
      "Shipped production UI for The Dark Arrival on Steam (GDC 2026 playable build)",
    ],
    link: { label: "View on Steam ↗", href: links.steam },
  },
  {
    period: "2025",
    meta: "PART-TIME · SAN FRANCISCO · HYBRID",
    company: "ACADEMY OF ART UNIVERSITY",
    role: "Game Development · Sep 2025 - Dec 2025",
    bullets: [
      "Collaborated within a cross-functional student team to design and implement core gameplay systems using Unreal Engine and ZBrush",
      "Contributed to gameplay mechanics prototyping, asset integration, and iterative refinement through bi-weekly milestone cycles",
      "Developed product-oriented user flows, wireframes, interface concepts, and interactive prototypes in Figma",
      "Applied UX principles across game and product contexts, including information hierarchy, accessibility, usability, and clear interaction feedback",
      "Translated design concepts into functional in-engine implementations and production-ready UI specifications, balancing technical constraints with user clarity",
      "Documented workflows, system logic, and design decisions; presented iterative builds, prototypes, and technical breakdowns",
      "Incorporated playtest and usability feedback into gameplay adjustments and product UX improvements",
    ],
  },
  {
    period: "2025",
    meta: "FREELANCE · UNITED STATES · REMOTE",
    company: "NEKURATI / FREELANCE",
    role: "UI Designer · Mar 2025 - Aug 2025",
    bullets: [
      "Led end-to-end UI/UX design for Nekurati, defining menu architecture, interaction patterns, and visual identity",
      "Designed main menu systems, interactive controls, and navigation flows to reduce player friction",
      "Developed fantasy-themed crystal, dragon, and ornamental UI assets",
      "Built high-fidelity Figma prototypes and translated assets into engine-ready UI",
      "Established typography standards and button interaction states",
    ],
  },
  {
    period: "2025",
    meta: "APPRENTICESHIP · SAN FRANCISCO BAY AREA · ON-SITE",
    company: "CUSTOMIZED ANGEL",
    role: "Designer & Programmer · Feb 2025 - May 2025",
    bullets: [
      "Collaborated with a five-person international team to design and develop a 2D game prototype",
      "Worked as Designer & Programmer on UI systems and interactive mechanics",
      "Created visual branding and UI animations using Adobe Creative Suite and Unity",
      "Coordinated weekly team reviews to maintain consistent creative delivery",
    ],
  },
];

export const articles = [
  {
    meta: "INSIGHT · MEDIUM",
    title: "MIND & ART: HUMAN TOUCH IN GAME UI",
    body: "How intuition and artistic intent shape immersive UI and player experience.",
    href: "https://medium.com/@jaikardevgame/mind-art-why-the-human-touch-drives-game-ui-1401c728775d",
  },
  {
    meta: "INSIGHT · MEDIUM",
    title: "DESIGNING THE LENS: UI AS PLAYER EXPERIENCE",
    body: "A reflection on UI as the player's primary connection to gameplay.",
    href: "https://medium.com/@jaikardevgame/designing-the-lens-my-journey-as-a-ui-artist-c98276a52c1d",
  },
  {
    meta: "INSIGHT · LINKEDIN",
    title: "SHIFT: LAST FARE UI & NARRATIVE DESIGN",
    body: "How interface design supports storytelling, diegesis, and immersion.",
    href: "https://www.linkedin.com/pulse/shift-last-fare-jaikar-pothula-r1y4c/",
  },
];

export const docCards = [
  {
    kicker: "FIGMA SOURCE",
    title: "THE DARK ARRIVAL",
    cta: "OPEN PROJECT ↗",
    href: "https://www.figma.com/design/MaSahDVicf0yEAzQPHE5LF/DARK-ARRIVAL-NEW?node-id=108-2&t=WqVLTpmU4lk8LbEm-1",
  },
  {
    kicker: "FIGMA SOURCE",
    title: "SUITE 13",
    cta: "OPEN PROJECT ↗",
    href: "https://www.figma.com/design/GY9Xha8TuDwjtyIfUJiHHO/SUITE-13?node-id=0-1&t=JdmWKcerLHyde7ii-1",
  },
  {
    kicker: "RESUME",
    title: "GAME UI / UX RESUME",
    cta: "VIEW / DOWNLOAD PDF ↓",
    href: links.resumeGame,
  },
];

export const resumes = [
  {
    kicker: "GAME UI / TECHNICAL UI RESUME",
    title: "GAME UI / UX",
    body: "For teams hiring game and technical UI roles.",
    href: links.resumeGame,
  },
  {
    kicker: "PRODUCT DESIGN RESUME",
    title: "PRODUCT DESIGN",
    body: "For teams hiring digital-product UX/UI roles.",
    href: links.resumeProduct,
  },
];

export const navSections = [
  { id: "work", label: "WORK" },
  { id: "showcase", label: "SHOWCASE" },
  { id: "documentation", label: "CASE FILES" },
  { id: "capabilities", label: "CAPABILITIES" },
  { id: "process", label: "PROCESS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "writing", label: "WRITING" },
  { id: "contact", label: "CONTACT" },
  { id: "guestbook", label: "GUESTBOOK" },
];