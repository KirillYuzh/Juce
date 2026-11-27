import type { ReactNode, SVGProps } from 'react';
import { ANTD_VIEW_BOX, antdIcons, type IconName } from './icons';

export type { IconName };

const customIcons = {
  vk: {
    viewBox: '1.7 1.7 20.6 20.6',
    content: (
      <path d="M3 8h2.4c.3 4 2 6 3 6 .7 0 .8-.6.8-2.2V8h2.3v3.4c0 1 .2 1.3.5 1.3.4 0 .9-.5 1.7-1.7.6-1 1-2 1.2-3h2.3c-.2 1.6-1.1 3.4-2.3 4.9 1.4 1.5 2.4 3 2.9 4.1h-2.5c-.4-.8-1.1-1.8-1.9-2.7-.3-.3-.5-.5-.8-.5-.4 0-.6.3-.6 1V15H10c-3.6 0-6-2.7-6-7Z" />
    ),
  },
  ok: {
    viewBox: '1.7 1.7 20.6 20.6',
    content: (
      <path d="M12 3a4.2 4.2 0 1 0 0 8.4A4.2 4.2 0 0 0 12 3Zm0 2a2.2 2.2 0 1 1 0 4.4A2.2 2.2 0 0 1 12 5Zm-4.6 6.9c.5.9 1.3 1.7 2.3 2.3l-2.2 2.2 1.4 1.4 2.1-2.1c.3.1.7.2 1 .2s.7-.1 1-.2l2.1 2.1 1.4-1.4-2.2-2.2c1-.6 1.8-1.4 2.3-2.3l-1.5-1.1c-.9 1.6-2.2 2.4-3.1 2.4s-2.2-.8-3.1-2.4l-1.5 1.1Z" />
    ),
  },
  upload: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path
          d="M7.5 3h6L18 7.5V19a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path
          d="M13.5 3v4.5H18"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path
          d="M12 17V9.75m0 0 2.75 2.75M12 9.75 9.25 12.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  folder: {
    viewBox: '0 0 24 24',
    content: (
      <path
        d="M3.5 7.5A2.5 2.5 0 0 1 6 5h3.1c.5 0 1 .2 1.35.56l1.15 1.19H18a2.5 2.5 0 0 1 2.5 2.5v8.25A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5V7.5Z"
        fill="currentColor"
        stroke="none"
      />
    ),
  },
  branch: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <circle cx="6.5" cy="5.5" r="2" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="6.5" cy="18.5" r="2" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="17.5" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <path d="M6.5 7.5v9" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <path
          d="M6.5 12.5H11a4.5 4.5 0 0 0 4.5-4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </>
    ),
  },
  issue: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
      </>
    ),
  },
  eye: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path
          d="M2.75 12S6.4 6.5 12 6.5 21.25 12 21.25 12 17.6 17.5 12 17.5 2.75 12 2.75 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth={1.5} />
      </>
    ),
  },
  fork: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <circle cx="6" cy="5.5" r="2.1" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="18" cy="5.5" r="2.1" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="12" cy="18.5" r="2.1" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <path
          d="M6 7.6V9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.6M12 11v5.4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </>
    ),
  },
  tag: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <path
          d="M12.6 3H5.25A2.25 2.25 0 0 0 3 5.25v7.35c0 .6.24 1.17.66 1.6l7.1 7.1a2.25 2.25 0 0 0 3.18 0l6.36-6.36a2.25 2.25 0 0 0 0-3.18l-7.1-7.1a2.26 2.26 0 0 0-1.6-.66Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <circle cx="7.6" cy="7.6" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
  },
  clock: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <path
          d="M12 7.5V12l3 1.75"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  play: {
    viewBox: '0 0 24 24',
    content: (
      <>
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth={1.5} />
        <path d="M10 8.8 16 12l-6 3.2V8.8Z" fill="currentColor" stroke="none" />
      </>
    ),
  },
} satisfies Record<string, { viewBox: string; content: ReactNode }>;

type CustomIconName = keyof typeof customIcons;

function isCustomIcon(name: IconName): name is CustomIconName {
  return name in customIcons;
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, ...rest }: IconProps) {
  const custom = isCustomIcon(name) ? customIcons[name] : null;
  const antd = isCustomIcon(name) ? null : antdIcons[name];

  return (
    <svg
      width={size}
      height={size}
      viewBox={custom ? custom.viewBox : ANTD_VIEW_BOX}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {custom ? custom.content : antd?.map((path) => <path key={path} d={path} />)}
    </svg>
  );
}
