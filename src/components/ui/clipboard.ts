import { useEffect, useRef, useState } from 'react';

function legacyCopy(text: string): boolean {
  const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  try {
    area.select();
    area.setSelectionRange(0, area.value.length);
    if (typeof document.execCommand !== 'function') return false;
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    area.remove();
    active?.focus();
  }
}

async function writeClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return legacyCopy(text);
    }
  }
  return legacyCopy(text);
}

export function useCopy(text: string, resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    const ok = await writeClipboard(text);
    if (!mounted.current) return ok;
    if (!ok) {
      setCopied(false);
      return false;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (mounted.current) setCopied(false);
    }, resetMs);
    return true;
  };

  return { copied, copy };
}
