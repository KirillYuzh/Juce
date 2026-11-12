import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bubble, BubbleContent, Message, MessageContent, MessageFooter } from './Message';
import { IconButton } from '../ui/Button';

const meta: Meta = {
  title: 'AI/Message',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const UserAndAssistant: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 520 }}>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Как работает планировщик Go?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent>
          <p style={{ margin: 0 }}>
            Планировщик раскладывает горутины по потокам ОС и переключает их на точках
            блокировки: канал, мьютекс, системный вызов.
          </p>
          <MessageFooter>
            <IconButton icon="copy" label="Скопировать" size="s" variant="plain" />
            <IconButton icon="thumbsUp" label="Полезно" size="s" variant="plain" />
            <IconButton icon="refresh" label="Повторить" size="s" variant="plain" />
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  ),
};

export const Bubbles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Bubble>
        <BubbleContent>Обычный ответ</BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>Ответ с обводкой</BubbleContent>
      </Bubble>
      <Bubble variant="accent">
        <BubbleContent>Акцентный вариант</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Сообщение пользователя справа</BubbleContent>
      </Bubble>
    </div>
  ),
};
