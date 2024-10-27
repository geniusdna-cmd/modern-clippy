import { expect } from 'vitest';

interface CustomMatchers<R = unknown> {
  toHaveBeenAnimated(): R;
}

declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toHaveBeenAnimated(element: Element) {
    const animate = element.animate as any;
    const hasBeenCalled = animate?.mock?.calls?.length > 0;
    
    return {
      pass: hasBeenCalled,
      message: () => 
        `expected element ${hasBeenCalled ? 'not ' : ''}to have been animated`,
    };
  },
});