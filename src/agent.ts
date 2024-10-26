import type { AgentData } from './types';

export class ModernClippy {
  private element!: HTMLElement;
  public container!: HTMLElement;
  private currentAnimation?: any;
  private queue: (() => void)[] = [];
  private data: AgentData;
  private overlay!: HTMLElement;
  
  constructor(agentData: AgentData) {
    this.data = agentData;
    this.setupDOM();
  }

  private setupDOM() {
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'clippy-agent';
    this.container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    `;

    // Create main element
    this.element = document.createElement('div');
    this.element.className = 'clippy-main';
    this.element.style.cssText = `
      position: relative;
      width: ${this.data.framesize[0]}px;
      height: ${this.data.framesize[1]}px;
    `;

    // Create overlay for speech bubbles
    this.overlay = document.createElement('div');
    this.overlay.className = 'clippy-overlay';
    this.overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    `;

    this.container.appendChild(this.element);
    this.container.appendChild(this.overlay);
  }

  public show() {
    document.body.appendChild(this.container);
    this.play('Idle');
  }

  public hide() {
    this.container.remove();
  }

  public async play(animationName: string): Promise<void> {
    const animation = this.data.animations[animationName];
    if (!animation) {
      console.error(`Animation ${animationName} not found`);
      return;
    }

    if (this.currentAnimation) {
      if (animation.useQueue) {
        return new Promise((resolve) => {
          this.queue.push(async () => {
            await this.playAnimation(animation);
            resolve();
          });
        });
      } else {
        clearTimeout(this.currentAnimation);
      }
    }

    return this.playAnimation(animation);
  }

  private async playAnimation(animation: any): Promise<void> {
    return new Promise((resolve) => {
      let frameIndex = 0;

      const animate = () => {
        const frame = animation.frames[frameIndex];
        this.renderFrame(frame);

        frameIndex++;

        if (frameIndex < animation.frames.length) {
          this.currentAnimation = setTimeout(animate, frame.duration);
        } else {
          this.currentAnimation = undefined;
          if (this.queue.length > 0) {
            const next = this.queue.shift();
            next?.();
          }
          resolve();
        }
      };

      animate();
    });
  }

  private renderFrame(frame: any) {
    const { imageMap, position } = frame;
    this.element.style.cssText = `
      position: relative;
      width: ${imageMap.width}px;
      height: ${imageMap.height}px;
      background-image: url(${imageMap.source});
      background-position: -${imageMap.x}px -${imageMap.y}px;
      transform: translate(${position.x}px, ${position.y}px);
    `;
  }

  public speak(text: string, duration = 3000) {
    const bubble = document.createElement('div');
    bubble.className = 'clippy-bubble';
    bubble.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid black;
      border-radius: 5px;
      padding: 8px;
      max-width: 200px;
      top: -60px;
      left: -100px;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    bubble.textContent = text;

    this.overlay.appendChild(bubble);
    requestAnimationFrame(() => {
      bubble.style.opacity = '1';
    });

    setTimeout(() => {
      bubble.style.opacity = '0';
      setTimeout(() => bubble.remove(), 300);
    }, duration);
  }

  public moveTo(x: number, y: number, duration = 1000) {
    const startX = parseInt(this.container.style.right) || 0;
    const startY = parseInt(this.container.style.bottom) || 0;
    
    const animation = this.container.animate([
      { right: `${startX}px`, bottom: `${startY}px` },
      { right: `${x}px`, bottom: `${y}px` }
    ], {
      duration,
      easing: 'ease-in-out',
      fill: 'forwards'
    });

    animation.onfinish = () => {
      this.container.style.right = `${x}px`;
      this.container.style.bottom = `${y}px`;
    };
  }
}