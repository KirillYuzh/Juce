const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);
const PROTOCOL_PATTERN = /^[a-z][a-z0-9+.-]*:/i;

function hasControlChar(value: string): boolean {
  return Array.from(value).some((char) => {
    const code = char.charCodeAt(0);
    return code < 0x20 || code === 0x7f;
  });
}

export function hostOf(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname ? hostname.replace(/^www\./, '') : url;
  } catch {
    return url;
  }
}

export function safeHref(url: string): string | undefined {
  const href = url.trim();
  if (!href || hasControlChar(href)) return undefined;

  const protocol = PROTOCOL_PATTERN.exec(href)?.[0];
  if (protocol) {
    if (!SAFE_PROTOCOLS.has(protocol.toLowerCase())) return undefined;
    try {
      return new URL(href).href;
    } catch {
      return undefined;
    }
  }

  if (href.startsWith('//')) return undefined;
  return href;
}
