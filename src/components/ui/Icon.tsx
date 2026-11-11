import type { ReactNode, SVGProps } from 'react';

// Single source of truth for glyphs used across the kit.

export type IconName =
  | 'search'
  | 'user'
  | 'menu'
  | 'close'
  | 'chevronDown'
  | 'chevronLeft'
  | 'chevronRight'
  | 'arrowRight'
  | 'check'
  | 'star'
  | 'info'
  | 'shield'
  | 'phone'
  | 'mail'
  | 'doc'
  | 'apple'
  | 'android'
  | 'vk'
  | 'ok'
  | 'telegram';

const icons: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 21 21" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </>
  ),
  menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  arrowRight: <path d="M4 12h15M13 6l6 6-6 6" />,
  check: <path d="m4 12 5 5L20 6" />,
  star: (
    <path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.3 6.5 20.2l1.1-6.2L3 9.6l6.3-.9L12 3Z" />
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.6v.1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  phone: (
    <path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4c0 1-1 2-2 2A17 17 0 0 1 3 5c0-1 1-2 2-2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
  apple: (
    <path
      d="M16.4 12.7c0-2 1.6-3 1.7-3.1-.9-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.6 2 1-.1 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.5-1-2.5-2.9ZM14.4 6.5c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-1 1.6-.8 2.5.9.1 1.8-.5 2.4-1.2Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  android: (
    <>
      <path d="M5 9h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9Z" />
      <path d="m7 9 1.2-3M17 9l-1.2-3M9.5 13.5v.1M14.5 13.5v.1M3 10v6M21 10v6" />
    </>
  ),
  vk: (
    <path
      d="M3 8h2.4c.3 4 2 6 3 6 .7 0 .8-.6.8-2.2V8h2.3v3.4c0 1 .2 1.3.5 1.3.4 0 .9-.5 1.7-1.7.6-1 1-2 1.2-3h2.3c-.2 1.6-1.1 3.4-2.3 4.9 1.4 1.5 2.4 3 2.9 4.1h-2.5c-.4-.8-1.1-1.8-1.9-2.7-.3-.3-.5-.5-.8-.5-.4 0-.6.3-.6 1V15H10c-3.6 0-6-2.7-6-7Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  ok: (
    <path
      d="M12 3a4.2 4.2 0 1 0 0 8.4A4.2 4.2 0 0 0 12 3Zm0 2a2.2 2.2 0 1 1 0 4.4A2.2 2.2 0 0 1 12 5Zm-4.6 6.9c.5.9 1.3 1.7 2.3 2.3l-2.2 2.2 1.4 1.4 2.1-2.1c.3.1.7.2 1 .2s.7-.1 1-.2l2.1 2.1 1.4-1.4-2.2-2.2c1-.6 1.8-1.4 2.3-2.3l-1.5-1.1c-.9 1.6-2.2 2.4-3.1 2.4s-2.2-.8-3.1-2.4l-1.5 1.1Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  telegram: (
    <path
      d="M21 4.3 2.9 11.2c-.9.3-.9.9-.2 1.1l4.6 1.4 1.8 5.3c.2.5.4.6.9.3l2.6-1.9 4.5 3.3c.7.4 1.1.2 1.3-.7L21 4.3Zm-3.2 3-8 7.1-.4 2.4-1.3-3.9 9.7-5.6Z"
      fill="currentColor"
      stroke="none"
    />
  ),
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {icons[name]}
    </svg>
  );
}
