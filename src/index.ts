import { ModernClippy } from './agent';
import { loadAgent } from './loader';
export * from './agent';
export * from './types';
export * from './loader';

export interface ClippyOptions {
  basePath: string;
}

export async function initClippy(options: ClippyOptions = { basePath: '' }): Promise<ModernClippy> {
    const clippy = await loadAgent('Clippy', options.basePath);
    clippy.show();
    return clippy;
}