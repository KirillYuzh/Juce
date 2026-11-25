import { cx } from '../../../../src/lib/cx';

export function cxClasses(first: string, active: boolean) {
  return cx(first, active && 'active');
}

export const card = cx('card', false, 'active');
