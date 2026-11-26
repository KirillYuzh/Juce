import {
  createContext,
  useContext,
  useId,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type HTMLAttributes,
} from 'react';
import { cx } from '../../lib/cx';
import { useControllableState } from '../../lib/use-controllable-state';

interface CollapsibleContextValue {
  open: boolean;
  contentId: string;
  keepMounted: boolean;
  setOpen: (open: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export interface CollapsibleProps extends ComponentProps<'div'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  keepMounted?: boolean;
}

export function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  keepMounted = false,
  children,
  className,
  ...rest
}: CollapsibleProps) {
  const [current, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const reactId = useId().replace(/:/g, '');

  return (
    <CollapsibleContext.Provider
      value={{ open: current, contentId: `collapsible-${reactId}`, keepMounted, setOpen }}
    >
      <div {...rest} className={cx(className)} data-state={current ? 'open' : 'closed'}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

function useCollapsible(component: string) {
  const context = useContext(CollapsibleContext);
  if (!context) throw new Error(`${component} must be used inside <Collapsible>`);
  return context;
}

export function CollapsibleTrigger({
  children,
  onClick,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, contentId, keepMounted, setOpen } = useCollapsible('CollapsibleTrigger');
  return (
    <button
      {...rest}
      type="button"
      className={className}
      aria-expanded={open}
      aria-controls={open || keepMounted ? contentId : undefined}
      data-state={open ? 'open' : 'closed'}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(!open);
      }}
    >
      {children}
    </button>
  );
}

export function CollapsibleContent({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { open, contentId, keepMounted } = useCollapsible('CollapsibleContent');

  if (!open && !keepMounted) return null;

  return (
    <div
      {...rest}
      id={contentId}
      className={className}
      data-state={open ? 'open' : 'closed'}
      hidden={!open}
      inert={!open}
      aria-hidden={!open || undefined}
    >
      {children}
    </div>
  );
}
