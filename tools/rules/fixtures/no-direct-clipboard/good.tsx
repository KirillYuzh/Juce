import { useCopy } from '../../../../src/components/ui/clipboard';

export function CopyButton({ value }: { value: string }) {
  const { copied, copy } = useCopy(value);
  return <button onClick={copy}>{copied ? 'Скопировано' : 'Скопировать'}</button>;
}
