import { useCopy } from '../../../../src/components/ui/clipboard';

export function platform(): string {
  const { language } = navigator;
  return `${navigator.userAgent} ${language}`;
}

export const read = useCopy;
