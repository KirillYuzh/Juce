const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

export function hostOf(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname ? hostname.replace(/^www\./, '') : url;
  } catch {
    return url;
  }
}

export function safeHref(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    return SAFE_PROTOCOLS.has(parsed.protocol) ? parsed.href : undefined;
  } catch {
    return undefined;
  }
}
