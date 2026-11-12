import type { ReactNode, SVGProps } from 'react';
import { ANTD_VIEW_BOX, antdIcons, type IconName } from './icons';

export type { IconName };

// Brand marks Ant Design does not ship: VK and Odnoklassniki keep their own paths.
const customIcons: Record<'vk' | 'ok', ReactNode> = {
  vk: (
    <path d="M3 8h2.4c.3 4 2 6 3 6 .7 0 .8-.6.8-2.2V8h2.3v3.4c0 1 .2 1.3.5 1.3.4 0 .9-.5 1.7-1.7.6-1 1-2 1.2-3h2.3c-.2 1.6-1.1 3.4-2.3 4.9 1.4 1.5 2.4 3 2.9 4.1h-2.5c-.4-.8-1.1-1.8-1.9-2.7-.3-.3-.5-.5-.8-.5-.4 0-.6.3-.6 1V15H10c-3.6 0-6-2.7-6-7Z" />
  ),
  ok: (
    <path d="M12 3a4.2 4.2 0 1 0 0 8.4A4.2 4.2 0 0 0 12 3Zm0 2a2.2 2.2 0 1 1 0 4.4A2.2 2.2 0 0 1 12 5Zm-4.6 6.9c.5.9 1.3 1.7 2.3 2.3l-2.2 2.2 1.4 1.4 2.1-2.1c.3.1.7.2 1 .2s.7-.1 1-.2l2.1 2.1 1.4-1.4-2.2-2.2c1-.6 1.8-1.4 2.3-2.3l-1.5-1.1c-.9 1.6-2.2 2.4-3.1 2.4s-2.2-.8-3.1-2.4l-1.5 1.1Z" />
  ),
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={name === 'vk' || name === 'ok' ? '1.7 1.7 20.6 20.6' : ANTD_VIEW_BOX}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {name === 'vk' || name === 'ok'
        ? customIcons[name]
        : antdIcons[name].map((path) => <path key={path} d={path} />)}
    </svg>
  );
}
