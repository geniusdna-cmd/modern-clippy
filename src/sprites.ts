interface Frame {
  duration: number;
  imageMap: {
    source: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  position: {
    x: number;
    y: number;
  };
}

interface Animation {
  frames: Frame[];
  useQueue: boolean;
}

interface AnimationMap {
  [key: string]: Animation;
}

export function getClippyAnimations(basePath: string): AnimationMap {
  // Frame dimensions from the original data
  const FRAME_WIDTH = 124;
  const FRAME_HEIGHT = 93;
  
  // Convert original animation data into our format
  const convertAnimation = (frames: any[]): Animation => {
    return {
      frames: frames.map(frame => ({
        duration: frame.duration,
        imageMap: {
          source: `${basePath}/agents/Clippy/map.png`,
          x: frame.images[0][0],
          y: frame.images[0][1],
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT
        },
        // Add a small vertical offset for certain animations
        position: {
          x: 0,
          y: frame.images[0][1] === 0 ? 0 : -10
        }
      })),
      // Set useQueue true if animation should play sequentially
      useQueue: true
    };
  };

  // Return supported animations
  return {
    "Idle": {
      frames: [{
        duration: 400,
        imageMap: {
          source: `${basePath}/agents/Clippy/map.png`,
          x: 0,
          y: 0,
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT
        },
        position: { x: 0, y: 0 }
      }],
      useQueue: false
    },
    "Wave": convertAnimation([
      { duration: 100, images: [[1116, 1767]] },
      { duration: 100, images: [[1240, 1767]] },
      { duration: 100, images: [[1364, 1767]] },
      { duration: 100, images: [[1488, 1767]] },
      { duration: 100, images: [[1612, 1767]] },
      { duration: 100, images: [[1736, 1767]] },
      { duration: 100, images: [[1860, 1767]] },
      { duration: 100, images: [[1984, 1767]] },
      { duration: 100, images: [[2108, 1767]] },
      { duration: 100, images: [[2232, 1767]] },
      { duration: 100, images: [[2356, 1767]] },
      { duration: 100, images: [[2480, 1767]] },
      { duration: 100, images: [[2604, 1767]] },
      { duration: 100, images: [[2728, 1767]] }
    ]),
    "Thinking": convertAnimation([
      { duration: 100, images: [[124, 93]] },
      { duration: 100, images: [[248, 93]] },
      { duration: 100, images: [[372, 93]] },
      { duration: 100, images: [[496, 93]] },
      { duration: 100, images: [[620, 93]] },
      { duration: 100, images: [[744, 93]] },
      { duration: 100, images: [[868, 93]] },
      { duration: 100, images: [[992, 93]] }
    ]),
    "Explain": convertAnimation([
      { duration: 100, images: [[1116, 186]] },
      { duration: 100, images: [[1240, 186]] },
      { duration: 900, images: [[1364, 186]] },
      { duration: 100, images: [[1240, 186]] },
      { duration: 100, images: [[1116, 186]] }
    ]),
    "GetAttention": convertAnimation([
      { duration: 100, images: [[1240, 651]] },
      { duration: 100, images: [[1364, 651]] },
      { duration: 100, images: [[1488, 651]] },
      { duration: 100, images: [[1612, 651]] },
      { duration: 100, images: [[1736, 651]] },
      { duration: 100, images: [[1860, 651]] },
      { duration: 100, images: [[1984, 651]] },
      { duration: 100, images: [[2108, 651]] }
    ]),
    "Congratulate": convertAnimation([
      { duration: 100, images: [[0, 0]] },
      { duration: 100, images: [[124, 0]] },
      { duration: 100, images: [[248, 0]] },
      { duration: 100, images: [[372, 0]] },
      { duration: 100, images: [[496, 0]] },
      { duration: 100, images: [[620, 0]] },
      { duration: 100, images: [[744, 0]] },
      { duration: 100, images: [[868, 0]] }
    ])
  };
}