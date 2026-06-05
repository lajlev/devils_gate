export const LEVELS = [
  // Level 1: First Steps — pure platforming, no key
  {
    name: 'First Steps',
    bgColor: 0xc87c1e,
    spawn: { x: 60, y: 440 },
    door: { x: 740, y: 440 },
    platforms: [
      { x: 0, y: 472, w: 256, h: 32 },
      { x: 320, y: 408, w: 160, h: 32 },
      { x: 544, y: 472, w: 256, h: 32 },
    ],
    spikes: [],
  },

  // Level 2: The Key — introduce key mechanic
  {
    name: 'The Key',
    bgColor: 0x1a6c5c,
    spawn: { x: 60, y: 440 },
    door: { x: 740, y: 440 },
    key: { x: 400, y: 280 },
    platforms: [
      { x: 0, y: 472, w: 224, h: 32 },
      { x: 272, y: 392, w: 128, h: 32 },
      { x: 352, y: 312, w: 96, h: 32 },
      { x: 448, y: 392, w: 128, h: 32 },
      { x: 576, y: 472, w: 224, h: 32 },
    ],
    spikes: [
      { x: 250, y: 462 }, { x: 560, y: 462 },
    ],
  },

  // Level 3: Boing! — discover bounce pads
  {
    name: 'Boing!',
    bgColor: 0x2d5c3e,
    spawn: { x: 60, y: 536 },
    door: { x: 720, y: 140 },
    key: { x: 400, y: 140 },
    platforms: [
      { x: 0, y: 568, w: 800, h: 32 },
      { x: 0, y: 344, w: 160, h: 32 },
      { x: 336, y: 172, w: 128, h: 32 },
      { x: 640, y: 280, w: 160, h: 32 },
      { x: 672, y: 172, w: 128, h: 32 },
    ],
    spikes: [
      { x: 280, y: 558 }, { x: 520, y: 558 },
    ],
    bouncePads: [
      { x: 176, y: 552 },
      { x: 80, y: 328 },
      { x: 576, y: 552 },
      { x: 720, y: 264 },
    ],
  },

  // Level 4: Crumble — platforms disappear beneath you
  {
    name: 'Crumble',
    bgColor: 0x7a3030,
    spawn: { x: 60, y: 440 },
    door: { x: 740, y: 440 },
    key: { x: 400, y: 344 },
    platforms: [
      { x: 0, y: 472, w: 128, h: 32 },
      { x: 672, y: 472, w: 128, h: 32 },
      { x: 336, y: 376, w: 128, h: 32 },
    ],
    spikes: [],
    crumblingPlatforms: [
      { x: 160, y: 472, w: 96 },
      { x: 288, y: 472, w: 96 },
      { x: 416, y: 472, w: 96 },
      { x: 544, y: 472, w: 96 },
    ],
  },

  // Level 5: Ride Along — moving platforms
  {
    name: 'Ride Along',
    bgColor: 0x2a2a5c,
    spawn: { x: 60, y: 536 },
    door: { x: 720, y: 200 },
    key: { x: 400, y: 300 },
    platforms: [
      { x: 0, y: 568, w: 160, h: 32 },
      { x: 352, y: 332, w: 96, h: 32 },
      { x: 672, y: 232, w: 128, h: 32 },
    ],
    spikes: [
      { x: 200, y: 558 }, { x: 240, y: 558 },
    ],
    movingPlatforms: [
      { x: 160, y: 500, w: 96, moveX: 120, moveY: 0, duration: 2500 },
      { x: 288, y: 408, w: 96, moveX: 100, moveY: 0, duration: 2000 },
      { x: 512, y: 308, w: 96, moveX: 100, moveY: 0, duration: 2000 },
    ],
  },

  // Level 6: Fake Out — some platforms are illusions
  {
    name: 'Fake Out',
    bgColor: 0x555555,
    spawn: { x: 60, y: 408 },
    door: { x: 740, y: 408 },
    key: { x: 400, y: 488 },
    platforms: [
      { x: 0, y: 440, w: 160, h: 32 },
      { x: 640, y: 440, w: 160, h: 32 },
      { x: 192, y: 520, w: 96, h: 32 },
      { x: 352, y: 520, w: 96, h: 32 },
      { x: 512, y: 520, w: 96, h: 32 },
    ],
    spikes: [],
    fakePlatforms: [
      { x: 192, y: 440, w: 96 },
      { x: 352, y: 440, w: 96 },
      { x: 512, y: 440, w: 96 },
    ],
  },

  // Level 7: Warp! — teleporters
  {
    name: 'Warp!',
    bgColor: 0x3a1a5c,
    spawn: { x: 60, y: 440 },
    door: { x: 400, y: 120 },
    key: { x: 740, y: 440 },
    platforms: [
      { x: 0, y: 472, w: 192, h: 32 },
      { x: 608, y: 472, w: 192, h: 32 },
      { x: 288, y: 344, w: 160, h: 32 },
      { x: 352, y: 152, w: 96, h: 32 },
    ],
    spikes: [
      { x: 260, y: 462 }, { x: 540, y: 462 },
    ],
    teleporters: [
      { x1: 160, y1: 462, x2: 700, y2: 462 },
      { x1: 370, y1: 334, x2: 400, y2: 142 },
    ],
  },

  // Level 8: Spring Fling — bounce pads + moving platforms
  {
    name: 'Spring Fling',
    bgColor: 0x5c5c1a,
    spawn: { x: 60, y: 536 },
    door: { x: 400, y: 76 },
    key: { x: 720, y: 300 },
    platforms: [
      { x: 0, y: 568, w: 800, h: 32 },
      { x: 0, y: 344, w: 128, h: 32 },
      { x: 640, y: 332, w: 160, h: 32 },
      { x: 352, y: 108, w: 96, h: 32 },
    ],
    spikes: [
      { x: 300, y: 558 }, { x: 500, y: 558 },
    ],
    bouncePads: [
      { x: 160, y: 552 },
      { x: 80, y: 328 },
    ],
    movingPlatforms: [
      { x: 192, y: 280, w: 96, moveX: 200, moveY: 0, duration: 3000 },
      { x: 480, y: 200, w: 96, moveX: 120, moveY: 0, duration: 2000 },
    ],
  },

  // Level 9: Trust Fall — crumbling bridge over fake safety nets
  {
    name: 'Trust Fall',
    bgColor: 0x3a1a1a,
    spawn: { x: 60, y: 344 },
    door: { x: 740, y: 488 },
    key: { x: 400, y: 488 },
    platforms: [
      { x: 0, y: 376, w: 128, h: 32 },
      { x: 672, y: 520, w: 128, h: 32 },
      { x: 192, y: 520, w: 96, h: 32 },
      { x: 352, y: 520, w: 96, h: 32 },
      { x: 512, y: 520, w: 96, h: 32 },
    ],
    spikes: [],
    crumblingPlatforms: [
      { x: 160, y: 376, w: 96 },
      { x: 288, y: 376, w: 96 },
      { x: 416, y: 376, w: 96 },
      { x: 544, y: 376, w: 96 },
    ],
    fakePlatforms: [
      { x: 192, y: 448, w: 96 },
      { x: 352, y: 448, w: 96 },
      { x: 512, y: 448, w: 96 },
    ],
  },

  // Level 10: Devil's Gate — all mechanics combined
  {
    name: "Devil's Gate",
    bgColor: 0x1a0a0a,
    spawn: { x: 60, y: 536 },
    door: { x: 400, y: 60 },
    key: { x: 740, y: 440 },
    platforms: [
      { x: 0, y: 568, w: 192, h: 32 },
      { x: 608, y: 472, w: 192, h: 32 },
      { x: 0, y: 312, w: 128, h: 32 },
      { x: 352, y: 92, w: 96, h: 32 },
    ],
    spikes: [
      { x: 250, y: 558 }, { x: 300, y: 558 }, { x: 550, y: 462 },
    ],
    bouncePads: [
      { x: 144, y: 552 },
    ],
    crumblingPlatforms: [
      { x: 160, y: 312, w: 96 },
      { x: 288, y: 312, w: 96 },
      { x: 416, y: 312, w: 96 },
    ],
    teleporters: [
      { x1: 480, y1: 302, x2: 700, y2: 462 },
    ],
    movingPlatforms: [
      { x: 640, y: 440, w: 96, moveX: 0, moveY: -280, duration: 3000 },
    ],
  },
];
