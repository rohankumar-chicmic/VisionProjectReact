/// <reference types="vite/client" />
export interface ComponentProps {
    children: React.ReactNode | React.Fc<React.ReactNode>;
}

interface ImportMetaEnv {
    readonly VITE_BASE_NAME?: string;
    readonly VITE_GRANT_PLATFORM_PROXY_ADDRESS?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface Window {
    ethereum?: unknown;
}
