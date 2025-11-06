// Centralized API base and path joiner to avoid double /api and localhost fallbacks in prod

const resolveApiOrigin = (): string => {
  const fromEnv = (import.meta as any).env?.VITE_API_URL as string | undefined;
  if (fromEnv && typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // If running on vercel preview/prod without env var, default to backend origin
    if (host.endsWith('vercel.app')) {
      const envOrigin = (import.meta as any).env?.VITE_API_URL as string | undefined;
      if (envOrigin && typeof envOrigin === 'string' && envOrigin.trim()) {
        return envOrigin.replace(/\/+$/, '');
      }
      return 'https://cmiss.onrender.com';
    }
  }
  return 'http://localhost:5000';
};

export const API_ORIGIN = resolveApiOrigin();

// Join helper that guarantees a single /api prefix and no double slashes
export const apiUrl = (path: string): string => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const withApi = clean.startsWith('/api') ? clean : `/api${clean}`;
  return `${API_ORIGIN}${withApi}`;
};
