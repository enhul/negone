/// <reference path="../.astro/types.d.ts" />

declare global {
  interface SDKTypeMode {
    strict: true;
  }
  
  interface ImportMetaEnv {
    readonly VITE_GROQ_API_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
  namespace NodeJS {
    interface ProcessEnv {
      readonly GROQ_API_KEY: string;
    }
  }
}
