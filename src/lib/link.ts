import type { AnchorHTMLAttributes, ComponentType, ReactNode } from 'react';

export interface LinkRendererProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: ReactNode;
}

export type LinkRenderer = ComponentType<LinkRendererProps>;
