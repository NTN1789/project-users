/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // Adicione outras variáveis conforme necessário
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }