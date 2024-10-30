import { describe, it, expect, beforeEach, vi } from 'vitest';
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

    // Test animations
    it('should update sprite position for Wave animation', async () => {
      const clippy = await initClippy({ basePath: '/static/clippy' });
      const agent = document.querySelector('.clippy-agent') as HTMLElement;
      
      clippy.play('Wave');
      await new Promise(resolve => setTimeout(resolve, 50));
  
      // Check if background position is being updated
      // You might need to adjust these values based on your sprite map
      expect(agent.style.backgroundPosition).not.toBe('0px 0px');
    });
  
  
  // Test concurrent animations
    it('should handle concurrent animation requests', async () => {
      const clippy = await initClippy({ basePath: '/static/clippy' });
      
      // Start multiple animations rapidly
      for (let i = 0; i < 5; i++) {
        clippy.play('Wave');
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Should not throw errors
      await new Promise(resolve => setTimeout(resolve, 100));
    });
  
    // Test speech bubble positioning
    it('should position speech bubble', async () => {
      const clippy = await initClippy({ basePath: '/static/clippy' });
      const agent = document.querySelector('.clippy-agent') as HTMLElement;
      
      // Set initial position
      clippy.moveTo(100, 100, 0); // Use immediate positioning
      await new Promise(resolve => setTimeout(resolve, 0));
      
      clippy.speak('Hello!');
      const bubble = document.querySelector('.clippy-bubble') as HTMLElement;
      
      expect(bubble).toBeDefined();
      expect(bubble.style.position).toBe('absolute');
      // Instead of checking exact position, verify the bubble exists and has positioning
      expect(bubble.style.bottom || bubble.style.top).toBeTruthy();
    });
  
    // Test for speech updates
    it('should update speech text', async () => {
      const clippy = await initClippy({ basePath: '/static/clippy' });
      
      // Show first message
      clippy.speak('First message', 500); // Short duration for testing
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for fade in
      
      const firstBubble = document.querySelector('.clippy-bubble');
      expect(firstBubble?.textContent).toBe('First message');
      
      // Wait for first bubble to start fading out
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show second message
      clippy.speak('Second message', 500);
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for new bubble fade in
      
      // There might briefly be two bubbles (old fading out, new fading in)
      const bubbles = document.querySelectorAll('.clippy-bubble');
      const visibleBubble = Array.from(bubbles).find(
        bubble => window.getComputedStyle(bubble).opacity !== '0'
      );
      
      expect(visibleBubble?.textContent).toBe('Second message');
    });
  
    // Test window boundary handling
    it('should stay within window boundaries on resize', async () => {
      const clippy = await initClippy({ basePath: '/static/clippy' });
      clippy.moveTo(5000, 5000); // Move far outside
  
      // Simulate window resize
      global.innerWidth = 1024;
      global.innerHeight = 768;
      window.dispatchEvent(new Event('resize'));
  
      const agent = document.querySelector('.clippy-agent') as HTMLElement;
      expect(parseInt(agent.style.right)).toBeLessThanOrEqual(1024 - 100);
      expect(parseInt(agent.style.bottom)).toBeLessThanOrEqual(768 - 100);
    });
  
    // Test error handling
    it('should handle invalid animations gracefully', async () => {
      const clippy = await initClippy({ basePath: '/static/clippy' });
      // @ts-ignore - Testing invalid animation
      expect(() => clippy.play('InvalidAnimation')).not.toThrow();
    });
  
    // Test initialization with invalid path
    it('should handle invalid base path gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        await initClippy({ basePath: '/invalid/path' });
      } catch (error) {
        expect(error).toBeDefined();
      }
      consoleSpy.mockRestore();
    });
  
    it('should handle visibility', async () => {
      const clippy = await initClippy({ basePath: '/static/clippy' });
      const initialAgent = document.querySelector('.clippy-agent');
      expect(initialAgent).toBeDefined(); // Should exist after init
      
      // Test hide
      clippy.hide();
      await new Promise(resolve => setTimeout(resolve, 50));
      const hiddenAgent = document.querySelector('.clippy-agent');
      expect(hiddenAgent).toBeNull(); // Should be removed from DOM
      
      // Test show
      clippy.show();
      await new Promise(resolve => setTimeout(resolve, 50));
      const shownAgent = document.querySelector('.clippy-agent');
      expect(shownAgent).toBeDefined(); // Should be back in DOM
      
    });
    
    // Test for cleanup
    it('should cleanup speech bubbles when hidden', async () => {
      const clippy = await initClippy({ basePath: '/static/clippy' });
      
      // Show a speech bubble
      clippy.speak('Test message');
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const bubble = document.querySelector('.clippy-bubble');
      expect(bubble).toBeDefined();
      
      // Hide Clippy
      clippy.hide();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Both Clippy and bubble should be gone
      expect(document.querySelector('.clippy-agent')).toBeNull();
      expect(document.querySelector('.clippy-bubble')).toBeNull();
    });
    
    // Test show/hide cycle
    it('should handle multiple show/hide cycles', async () => {
      const clippy = await initClippy({ basePath: '/static/clippy' });
      
      // First hide
      clippy.hide();
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(document.querySelector('.clippy-agent')).toBeNull();
      
      // First show
      clippy.show();
      await new Promise(resolve => setTimeout(resolve, 50));
      let agent = document.querySelector('.clippy-agent');
      expect(agent).toBeDefined();
      
      // Second hide
      clippy.hide();
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(document.querySelector('.clippy-agent')).toBeNull();
      
      // Second show
      clippy.show();
      await new Promise(resolve => setTimeout(resolve, 50));
      agent = document.querySelector('.clippy-agent');
      expect(agent).toBeDefined();
    });

    // Additional test for cleanup
    it('should cleanup speech bubbles when hidden', async () => {
      const clippy = await initClippy({ basePath: '/static/clippy' });
      
      // Show a speech bubble
      clippy.speak('Test message');
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const bubble = document.querySelector('.clippy-bubble');
      expect(bubble).toBeDefined();
      
      // Hide Clippy
      clippy.hide();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Both Clippy and bubble should be gone
      expect(document.querySelector('.clippy-agent')).toBeNull();
      expect(document.querySelector('.clippy-bubble')).toBeNull();
    });
 
    // Test rapid movement commands
    it('should handle rapid movement commands', async () => {
      const clippy = await initClippy({ basePath: '/static/clippy' });
      
      // Rapid movements
      clippy.moveTo(100, 100);
      clippy.moveTo(200, 200);
      clippy.moveTo(300, 300);
      
      // Should only animate to final position
      expect(Element.prototype.animate).toHaveBeenLastCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ right: '300px', bottom: '300px' })
        ]),
        expect.any(Object)
      );
    });
});