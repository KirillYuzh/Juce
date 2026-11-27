import { useId } from 'react';

export function useDomId(): string {
  return useId().replace(/:/g, '');
}
