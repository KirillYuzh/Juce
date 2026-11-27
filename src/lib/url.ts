const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

const RELATIVE_BASE = 'https://relative.invalid';

export function hostOf(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname ? hostname.replace(/^www\./, '') : url;
  } catch {
    return url;
  }
}

export function safeHref(url: string): string | undefined {
  if (!url.trim()) return undefined;
  try {
    const parsed = new URL(url, RELATIVE_BASE);
    return SAFE_PROTOCOLS.has(parsed.protocol) ? url : undefined;
  } catch {
    return undefined;
  }
}
