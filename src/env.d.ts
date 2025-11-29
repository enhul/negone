/// <reference path="../.astro/types.d.ts" />

declare global {
  interface SDKTypeMode {
    strict: true;
  }
  
  interface ImportMetaEnv {
    readonly VITE_OPENAI_API_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
