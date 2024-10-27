import { describe, it, expect, beforeEach } from 'vitest';
import { initClippy } from '../index';

describe('Clippy', () => {
  beforeEach(() => {
    // Create a mock body element
    document.body.innerHTML = '';
    
    // Mock Image loading
    global.Image = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      src: string = '';
      constructor() {
        setTimeout(() => this.onload(), 0);
      }
    } as any;

    // Mock the animate function
    Element.prototype.animate = vi.fn().mockReturnValue({
      onfinish: null,
      finished: Promise.resolve(),
    });
  });

  it('should initialize without errors', async () => {
    const clippy = await initClippy({ basePath: '/static/clippy' });
    expect(clippy).toBeDefined();
  });

  it('should create DOM elements when shown', async () => {
    const clippy = await initClippy({ basePath: '/static/clippy' });
    expect(document.querySelector('.clippy-agent')).toBeDefined();
  });

  it('should show speech bubble when speaking', async () => {
    const clippy = await initClippy({ basePath: '/static/clippy' });
    clippy.speak('Hello!');
    const bubble = document.querySelector('.clippy-bubble');
    expect(bubble).toBeDefined();
    expect(bubble?.textContent).toBe('Hello!');
  });
  it('should move to specified coordinates', async () => {
    const clippy = await initClippy({ basePath: '/static/clippy' });
    
    // Get the initial position
    const agent = document.querySelector('.clippy-agent') as HTMLElement;
    const initialRight = agent.style.right || '20px';  // Default from setupDOM
    const initialBottom = agent.style.bottom || '20px'; // Default from setupDOM
    
    // Move Clippy
    clippy.moveTo(100, 200);
    
    // Verify animate was called with correct parameters
    expect(Element.prototype.animate).toHaveBeenCalledWith(
      [
        { right: initialRight, bottom: initialBottom },
        { right: '100px', bottom: '200px' }
      ],
      {
        duration: 1000,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );

    // Trigger the animation finish callback
    const animateCall = (Element.prototype.animate as any).mock.results[0].value;
    if (animateCall.onfinish) {
      animateCall.onfinish();
    }

    // Check final position
    expect(agent.style.right).toBe('100px');
    expect(agent.style.bottom).toBe('200px');
  });

  // Alternative approach: test that movement is relative
  it('should move relatively from current position', async () => {
    const clippy = await initClippy({ basePath: '/static/clippy' });
    const agent = document.querySelector('.clippy-agent') as HTMLElement;
    
    // First movement
    clippy.moveTo(100, 200);
    let animateCall = (Element.prototype.animate as any).mock.results[0].value;
    if (animateCall.onfinish) animateCall.onfinish();

    // Second movement
    clippy.moveTo(150, 250);
    
    // Verify the second animation starts from the previous position
    expect(Element.prototype.animate).toHaveBeenLastCalledWith(
      [
        { right: '100px', bottom: '200px' },
        { right: '150px', bottom: '250px' }
      ],
      {
        duration: 1000,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );
  });

  // Add test for immediate positioning without animation
  it('should allow immediate positioning', async () => {
    const clippy = await initClippy({ basePath: '/static/clippy' });
    const agent = document.querySelector('.clippy-agent') as HTMLElement;
    
    // Move without animation (duration = 0)
    clippy.moveTo(100, 200, 0);
    
    // Should still call animate but with duration 0
    expect(Element.prototype.animate).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({
        duration: 0
      })
    );

    // Position should be updated immediately
    expect(agent.style.right).toBe('100px');
    expect(agent.style.bottom).toBe('200px');
  });
});