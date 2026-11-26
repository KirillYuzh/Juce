import { useCopy } from '../../../../src/components/ui/clipboard';

export function CopyButton({ value }: { value: string }) {
  const { copied, copy } = useCopy(value);
  return <button onClick={copy}>{copied ? 'Скопировано' : 'Скопировать'}</button>;
}

export function platform() {
  const { language } = navigator;
  const name = window['navigator'].userAgent;
  return `${navigator.userAgent} ${language} ${globalThis.navigator.language} ${name}`;
}
