import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider, useToast } from './ToastProvider';
import { Button } from '../Button';

const TOAST_SOURCE = `const { toast } = useToast();

toast({
  tone: 'success',
  title: 'Экспорт завершён',
  description: 'Файл лежит в разделе «Загрузки»',
  action: {
    label: 'Открыть',
    onClick: () => window.open('https://example.com/downloads', '_blank', 'noopener'),
  },
});`;

const meta: Meta = {
  title: 'Primitives/Toast',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

function ToastExamples() {
  const { toast } = useToast();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button
        variant="secondary"
        size="m"
        onClick={() =>
          toast({ title: 'Черновик сохранён', description: 'Изменения видите только вы' })
        }
      >
        Neutral
      </Button>
      <Button
        variant="secondary"
        size="m"
        onClick={() =>
          toast({ tone: 'success', title: 'Разбор готов', description: '34 источника проверены' })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        size="m"
        onClick={() =>
          toast({
            tone: 'error',
            title: 'Не удалось загрузить',
            description: 'Проверьте соединение',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="secondary"
        size="m"
        onClick={() =>
          toast({
            tone: 'warning',
            title: 'Два примера не собрались',
            description: 'Проверьте вручную',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="primary"
        size="m"
        onClick={() =>
          toast({
            tone: 'success',
            title: 'Экспорт завершён',
            description: 'Файл лежит в разделе «Загрузки»',
            action: {
              label: 'Открыть',
              onClick: () => window.open('https://example.com/downloads', '_blank', 'noopener'),
            },
          })
        }
      >
        С действием
      </Button>
    </div>
  );
}

export const Toasts: Story = {
  render: () => (
    <ToastProvider position="bottom-right">
      <ToastExamples />
    </ToastProvider>
  ),
  parameters: { docs: { source: { code: TOAST_SOURCE } } },
};
