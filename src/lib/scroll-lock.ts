let locks = 0;
let undo: (() => void) | null = null;

function scrollbarWidth(): number {
  const gutter = document.documentElement.clientWidth;
  return gutter > 0 ? window.innerWidth - gutter : 0;
}

export function lockScroll(): () => void {
  if (typeof document === 'undefined') return () => {};

  if (!undo) {
    const { style } = document.body;
    const overflow = style.overflow;
    const paddingRight = style.paddingRight;
    const gutter = scrollbarWidth();

    style.overflow = 'hidden';
    if (gutter > 0) {
      style.paddingRight = `${(Number.parseFloat(paddingRight) || 0) + gutter}px`;
    }

    undo = () => {
      style.overflow = overflow;
      style.paddingRight = paddingRight;
    };
  }

  locks += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks > 0) return;
    undo?.();
    undo = null;
  };
}
