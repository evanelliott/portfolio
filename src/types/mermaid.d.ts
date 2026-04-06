// filepath: src/types/mermaid.d.ts
declare module 'mermaid' {
  export interface MermaidConfig {
    startOnLoad?: boolean;
    theme?: 'default' | 'forest' | 'dark' | 'neutral' | string;
    securityLevel?: 'strict' | 'loose' | 'antiscript';
    [key: string]: unknown;
  }

  export function initialize(config: MermaidConfig): void;
  export function run(): Promise<void>;
  export function contentLoaded(): void;
  
  const mermaid: {
    initialize: (config: MermaidConfig) => void;
    run: () => Promise<void>;
    contentLoaded: () => void;
    [key: string]: unknown;
  };
  
  export default mermaid;
}