import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromptInput, type PromptInputPayload, type PromptInputStatus } from './PromptInput';

const meta: Meta = {
  title: 'AI/Prompt input',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

function Demo({ initialStatus = 'ready' as PromptInputStatus }) {
  const [status, setStatus] = useState<PromptInputStatus>(initialStatus);
  const [sent, setSent] = useState<PromptInputPayload | null>(null);
  return (
    <div style={{ width: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <PromptInput
        status={status}
        onSubmit={(payload) => {
          setSent(payload);
          setStatus('streaming');
          window.setTimeout(() => setStatus('ready'), 1600);
        }}
        onStop={() => setStatus('ready')}
      />
      {sent && (
        <pre
          style={{
            margin: 0,
            padding: 12,
            borderRadius: 12,
            background: 'var(--tb-bg-secondary)',
            font: '400 12px/18px var(--tb-font-mono)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {JSON.stringify({ text: sent.text, files: sent.files.map((file) => file.name) }, null, 2)}
        </pre>
      )}
    </div>
  );
}

export const Default: Story = {
  render: () => <Demo />,
};

export const WithActions: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <PromptInput
        actions={
          <button
            type="button"
            style={{
              height: 32,
              padding: '0 10px',
              borderRadius: 8,
              background: 'var(--tb-secondary-soft)',
              font: '500 12px/18px var(--tb-font-text)',
            }}
          >
            Модель: Джус-1
          </button>
        }
        hint="Ответ придёт в чат"
      />
    </div>
  ),
};

export const Streaming: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <PromptInput status="streaming" defaultValue="Объясни разницу между процессом и потоком" onStop={() => undefined} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <PromptInput disabled placeholder="Поле недоступно" />
    </div>
  ),
};
