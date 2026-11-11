import {
  createContext,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

interface CollapsibleContextValue {
  open: boolean;
  contentId: string;
  keepMounted: boolean;
  setOpen: (open: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  keepMounted?: boolean;
  children: ReactNode;
  className?: string;
}

export function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  keepMounted = false,
  children,
  className,
}: CollapsibleProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const reactId = useId().replace(/:/g, '');
  const controlled = open !== undefined;
  const current = controlled ? open : innerOpen;
  const setOpen = (next: boolean) => {
    if (!controlled) setInnerOpen(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider
      value={{ open: current, contentId: `collapsible-${reactId}`, keepMounted, setOpen }}
    >
      <div className={className} data-state={current ? 'open' : 'closed'}>
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
  const { open, contentId, setOpen } = useCollapsible('CollapsibleTrigger');
  return (
    <button
      type="button"
      className={className}
      aria-expanded={open}
      aria-controls={contentId}
      data-state={open ? 'open' : 'closed'}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(!open);
      }}
      {...rest}
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
      id={contentId}
      className={className}
      data-state={open ? 'open' : 'closed'}
      hidden={!open}
      {...rest}
    >
      {children}
    </div>
  );
}
