/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface Window {
    gtag: (command: string, action: string, params?: any) => void;
    dataLayer: any[];
}
