import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, CookieNotice, Tooltip } from './Feedback';
import { Button } from './Button';

const meta: Meta = {
  title: 'Primitives/Feedback',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Alerts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 640 }}>
      <Alert
        action={
          <Button variant="secondary" size="s">
            Как это сделать?
          </Button>
        }
      >
        Установите сертификаты безопасности Минцифры, чтобы сохранить доступ к сервисам и услугам
        Т-Банка
      </Alert>
      <Alert tone="success">Заявка одобрена. Карту привезём завтра</Alert>
      <Alert tone="warning">Проверьте реквизиты перед отправкой перевода</Alert>
      <Alert tone="error">Не удалось отправить платёж. Попробуйте ещё раз</Alert>
    </div>
  ),
};

export const Tooltips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, paddingBlock: 48 }}>
      <Tooltip text="Кэшбэк рублями до 30%">
        <Button variant="secondary" size="m">
          Наведите на меня
        </Button>
      </Tooltip>
    </div>
  ),
};

export const Cookie: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ minHeight: '100vh' }}>
      <CookieNotice />
    </div>
  ),
};
