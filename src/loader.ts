import { ModernClippy } from './agent';
import { getClippyAnimations } from './sprites';

export async function loadAgent(_agentName: string, basePath: string = ''): Promise<ModernClippy> {
  const imagePath = `${basePath}/agents/Clippy/map.png`;
  
  // Load the sprite sheet first
  await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = imagePath;
  });
  
  return new ModernClippy({
    animations: getClippyAnimations(basePath),
    framesize: [124, 93],
    overlayCount: 1,
    sounds: [],
    sizes: [[124, 93]]
  });
}