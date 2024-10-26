# Modern Clippy

A modern, TypeScript implementation of the classic Microsoft Office Assistant (Clippy) for web applications. This lightweight library brings back the nostalgic office assistant with modern web technologies and improved functionality.

![Clippy Screenshot](https://raw.githubusercontent.com/microsoft/Microsoft.Github.io/master/projects/clippy/assets/clippy.png)

## Features

- 🎯 Lightweight and dependency-free
- 📝 Written in TypeScript
- 🎨 Smooth animations
- 💬 Speech bubbles with customizable messages
- 🌐 Easy integration with any web application
- 🎮 Interactive animations and movements
- 📱 Responsive and mobile-friendly

## Installation

```bash
npm install modern-clippy
```

## Quick Start

### Basic Usage

```javascript
import { initClippy } from 'modern-clippy';

async function init() {
    const clippy = await initClippy();
    clippy.speak("Hello! Need help?");
}

init();
```

### With Custom Base Path

If your static assets are served from a different path:

```javascript
import { initClippy } from 'modern-clippy';

async function init() {
    const clippy = await initClippy({
        basePath: "/static/clippy"  // Path to your clippy assets
    });
    clippy.speak("Hello! Need help?");
}

init();
```

## Integration Examples

### HTML

```html
<script type="module">
    import { initClippy } from './modern-clippy.js';
    
    let clippy;
    
    async function init() {
        clippy = await initClippy();
        clippy.speak("Hello!");
    }
    
    init();
</script>
```

### React

```jsx
import { useEffect } from 'react';
import { initClippy } from 'modern-clippy';

function App() {
    useEffect(() => {
        const loadClippy = async () => {
            const clippy = await initClippy();
            clippy.speak('Hello from React!');
        };
        
        loadClippy();
    }, []);

    return <div>Your App Content</div>;
}
```

### Vue

```vue
<script setup>
import { onMounted } from 'vue';
import { initClippy } from 'modern-clippy';

onMounted(async () => {
    const clippy = await initClippy();
    clippy.speak('Hello from Vue!');
});
</script>
```

### Flask

```html
<script type="module">
    import { initClippy } from "{{ url_for('static', filename='clippy/modern-clippy.js') }}";
    
    async function init() {
        const clippy = await initClippy({
            basePath: "/static/clippy"
        });
        clippy.speak("Hello from Flask!");
    }
    
    init();
</script>
```

## API Reference

### initClippy(options?)

Initializes Clippy with optional configuration.

```typescript
interface ClippyOptions {
    basePath?: string;  // Base path for static assets
}
```

### Clippy Methods

```typescript
clippy.speak(text: string, duration?: number): void;  // Show a speech bubble
clippy.play(animationName: string): Promise<void>;    // Play an animation
clippy.moveTo(x: number, y: number): void;           // Move Clippy to position
clippy.show(): void;                                 // Show Clippy
clippy.hide(): void;                                 // Hide Clippy
```

### Available Animations

- `Idle`: Default idle animation
- `Wave`: Waving animation

## Project Structure

```
modern-clippy/
├── src/
│   ├── agent.ts         # Main Clippy agent class
│   ├── types.ts         # TypeScript interfaces
│   ├── loader.ts        # Asset loader functionality
│   ├── sprites.ts       # Sprite definitions
│   └── index.ts         # Main entry point
├── dist/                # Built files
└── public/             # Static assets
    └── agents/
        └── Clippy/
            └── map.png  # Clippy sprite sheet
```

## Building

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original Clippy assets from Microsoft Office
- Inspired by the classic [ClippyJS](https://github.com/smore-inc/clippy.js)