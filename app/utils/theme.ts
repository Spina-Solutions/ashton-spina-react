export type ThemeMode = 'light' | 'dark' | 'system';

export function readThemeCookie(doc?: Document): ThemeMode | null {
  try {
    const c = (doc ?? document).cookie || '';
    const m = /(?:^|; )theme=([^;]+)/.exec(c);
    return (m ? decodeURIComponent(m[1]) : null) as ThemeMode | null;
  } catch {
    return null;
  }
}

export function writeThemeCookie(mode: ThemeMode): void {
  try {
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 5).toUTCString();
    document.cookie = `theme=${encodeURIComponent(mode)}; Expires=${expires}; Path=/; SameSite=Lax`;
  } catch {}
}

export function applyTheme(mode: ThemeMode): void {
  try {
    const isDark = mode === 'dark' ? true : mode === 'light' ? false : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    // Optionally sync theme-color meta
    const meta = document.querySelector('meta[name="theme-color"][media]') as HTMLMetaElement | null;
    if (meta) meta.content = isDark ? '#0b1220' : '#ffffff';
  } catch {}
}

export function setTheme(mode: ThemeMode): void {
  applyTheme(mode);
  writeThemeCookie(mode);
}


