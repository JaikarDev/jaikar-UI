import { A } from "./portfolio";

export type MediaItem = {
  kind: "video" | "image";
  src: string;
  caption: string;
  /** poster frame for videos */
  poster?: string;
};

const enc = (path: string) => `${A}/${path.split("/").map(encodeURIComponent).join("/")}`;

/**
 * Real production media shipped in the portfolio asset library
 * (jaikarpothula.com/Assets) — mapped per case file.
 */
export const projectMedia: Record<string, MediaItem[]> = {
  "the-dark-arrival": [
    {
      kind: "video",
      src: enc("Dark Arrival/DARK ARRIVAL MAIN MENU VIDEO 1.mp4"),
      caption: "MAIN MENU · MOTION PASS",
      poster: enc("Dark Arrival/Loading screen image.png"),
    },
    { kind: "image", src: enc("Dark Arrival/Screenshot_2026-03-31_195708.png"), caption: "INVESTIGATOR JOURNAL · IN-WORLD" },
    { kind: "image", src: enc("Dark Arrival/Book.png"), caption: "3D JOURNAL · EVIDENCE LAYER" },
    { kind: "image", src: enc("Dark Arrival/Loading screen image.png"), caption: "LOADING SCREEN" },
    { kind: "image", src: enc("Dark Arrival/Capsul dark arrival steam image 14.png"), caption: "STEAM CAPSULE ART" },
    { kind: "image", src: enc("Dark Arrival/DARK ARRIVAL TITLE.png"), caption: "TITLE TREATMENT" },
  ],
  "suite-13": [
    {
      kind: "video",
      src: enc("Suite13/Main menu video.mp4"),
      caption: "MAIN MENU · MOTION PASS",
      poster: enc("Suite13/LOAD SCREEN 6.png"),
    },
    {
      kind: "video",
      src: enc("Suite13/OPTIONS VIDEO.mp4"),
      caption: "OPTIONS FLOW · INTERACTION",
      poster: enc("Suite13/2.png"),
    },
    {
      kind: "video",
      src: enc("Suite13/outside video.mp4"),
      caption: "EXTERIOR SEQUENCE",
      poster: enc("Suite13/2.png"),
    },
    { kind: "image", src: enc("Suite13/LOAD SCREEN 6.png"), caption: "LOAD SCREEN" },
    { kind: "image", src: enc("Suite13/Leaving SUit 13 With out saving.png"), caption: "EXIT CONFIRMATION MODAL" },
    { kind: "image", src: enc("Suite13/SUITE 13 TITLE on black.png"), caption: "TITLE LOCK-UP" },
  ],
  "customized-angel": [
    { kind: "image", src: enc("Customized_Angel_Case_Study/CUSTOMIZED ANGEL/TITLE.png"), caption: "TITLE SCREEN" },
    { kind: "image", src: enc("Customized_Angel_Case_Study/CUSTOMIZED ANGEL/PsI78P.gif"), caption: "ANIMATED HUD LOGIC" },
    { kind: "image", src: enc("Customized_Angel_Case_Study/Customized_Angel_Case_Study-03.png"), caption: "CASE STUDY · SYSTEM MAP" },
    { kind: "image", src: enc("Customized_Angel_Case_Study/Customized_Angel_Case_Study-05.png"), caption: "CASE STUDY · UI KIT" },
    { kind: "image", src: enc("Customized_Angel_Case_Study/Customized_Angel_Case_Study-08.png"), caption: "CASE STUDY · SCREEN FLOW" },
    { kind: "image", src: enc("Customized_Angel_Case_Study/CUSTOMIZED ANGEL/6.png"), caption: "CUSTOMISATION PANEL" },
  ],
  "find-the-octopus": [
    {
      kind: "video",
      src: enc("FIND THE OCTOPUS/i_need_the_video_for_this_imag.mp4"),
      caption: "GAMEPLAY · HIDDEN OBJECT LOOP",
      poster: enc("FIND THE OCTOPUS/jaikar-pothula-show-case-2.png"),
    },
    { kind: "image", src: enc("FIND THE OCTOPUS/jaikar-pothula-show-case-2.png"), caption: "SHOWCASE SHEET" },
    { kind: "image", src: enc("FIND THE OCTOPUS/jaikar-pothula-sprite-sheet.png"), caption: "ICON / SPRITE SHEET" },
    { kind: "image", src: enc("FIND THE OCTOPUS/Octopus_clock.png"), caption: "TIMER COMPONENT" },
    { kind: "image", src: enc("FIND THE OCTOPUS/HIT EFFECT.png"), caption: "HIT FEEDBACK" },
    { kind: "image", src: enc("FIND THE OCTOPUS/Shop button.png"), caption: "SHOP ENTRY BUTTON" },
  ],
  "find-the-dog": [
    { kind: "image", src: enc("Find the Dog/GAME PLAY 1.gif"), caption: "GAMEPLAY LOOP 01" },
    { kind: "image", src: enc("Find the Dog/GAME PLAY 2.gif"), caption: "GAMEPLAY LOOP 02" },
    { kind: "image", src: enc("Find the Dog/EVERY IMAGE/Main Menu.png"), caption: "MAIN MENU" },
    { kind: "image", src: enc("Find the Dog/EVERY IMAGE/INSIDE GAME UI.png"), caption: "IN-GAME HUD" },
    { kind: "image", src: enc("Find the Dog/EVERY IMAGE/Search where the dog in the map.png"), caption: "MAP SEARCH STATE" },
    { kind: "image", src: enc("Find the Dog/Game overview/jaikar-pothula-overview.png"), caption: "SYSTEM OVERVIEW" },
  ],
  "smart-guardian": [
    {
      kind: "video",
      src: enc("Smart Guardian/Screen Recording 2026-05-04 143739.mp4"),
      caption: "PROTOTYPE WALKTHROUGH",
      poster: enc("Smart Guardian/1.png"),
    },
    { kind: "image", src: enc("Smart Guardian/1.png"), caption: "ONBOARDING" },
    { kind: "image", src: enc("Smart Guardian/4.png"), caption: "DASHBOARD" },
    { kind: "image", src: enc("Smart Guardian/7.png"), caption: "ALERT DETAIL" },
    { kind: "image", src: enc("Smart Guardian/10.png"), caption: "SETTINGS" },
  ],
  "tale-of-ronin": [
    {
      kind: "video",
      src: enc("Videos/MAIN MENU.mp4"),
      caption: "MAIN MENU · MOTION STUDY",
      poster: enc("Videos/HERO.png"),
    },
    { kind: "image", src: enc("Videos/TALE OF RONIN VISUAL MOOD BOARD.png"), caption: "VISUAL MOOD BOARD" },
    { kind: "image", src: enc("Videos/HERO.png"), caption: "KEY ART" },
  ],
  "coffee-bean": [
    { kind: "image", src: "https://i.ytimg.com/vi/f6GRO7mVbo8/maxresdefault.jpg", caption: "CASE-STUDY WALKTHROUGH" },
  ],
};

export const mediaFor = (id: string): MediaItem[] => projectMedia[id] ?? [];
