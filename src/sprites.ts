export function getClippyAnimations(basePath: string) {
  return {
    "Idle": {
      "frames": [{
        "duration": 400,
        "imageMap": {
          "source": `${basePath}/agents/Clippy/map.png`,  // Use provided basePath
          "x": 0,
          "y": 0,
          "width": 124,
          "height": 93
        },
        "position": {"x": 0, "y": 0}
      }],
      "useQueue": false
    },
    "Wave": {
      "frames": [
        {
          "duration": 400,
          "imageMap": {
            "source": `${basePath}/agents/Clippy/map.png`,  // Use provided basePath
            "x": 124,
            "y": 0,
            "width": 124,
            "height": 93
          },
          "position": {"x": 0, "y": -10}
        },
        {
          "duration": 400,
          "imageMap": {
            "source": `${basePath}/agents/Clippy/map.png`,  // Use provided basePath
            "x": 0,
            "y": 0,
            "width": 124,
            "height": 93
          },
          "position": {"x": 0, "y": 0}
        }
      ],
      "useQueue": true
    }
  };
}
