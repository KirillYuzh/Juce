import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageScroller, useMessageScrollerScrollable } from './MessageScroller';
import { Bubble, BubbleContent, Message, MessageContent } from './Message';
import { Button } from '../ui/Button';

const meta: Meta = {
  title: 'AI/Message scroller',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

interface DemoMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const initial: DemoMessage[] = Array.from({ length: 10 }, (_, index) => ({
  id: `m-${index}`,
  role: index % 2 === 0 ? 'user' : 'assistant',
  text:
    index % 2 === 0
      ? `Вопрос номер ${index / 2 + 1}`
      : 'Ответ ассистента с несколькими строками текста, чтобы появилась прокрутка.',
}));

function ScrollState() {
  const { start, end } = useMessageScrollerScrollable();
  return (
    <span style={{ font: '400 12px/18px var(--tb-font-text)', color: 'var(--tb-text-tertiary)' }}>
      {start ? 'выше есть' : 'начало'} · {end ? 'ниже есть' : 'конец'}
    </span>
  );
}

function Demo() {
  const [messages, setMessages] = useState(initial);

  const add = () => {
    setMessages((current) => [
      ...current,
      {
        id: `m-${current.length}`,
        role: current.length % 2 === 0 ? 'user' : 'assistant',
        text: `Новое сообщение ${current.length + 1}. Прокрутка должна следовать за концом только если читатель внизу.`,
      },
    ]);
  };

  return (
    <MessageScroller.Provider autoScroll defaultScrollPosition="end">
      <div style={{ width: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Button size="s" variant="secondary" onClick={add}>
            Добавить сообщение
          </Button>
          <ScrollState />
        </div>
        <div
          style={{
            height: 420,
            overflow: 'hidden',
            borderRadius: 24,
            border: '1px solid var(--tb-border)',
            background: 'var(--tb-white)',
          }}
        >
          <MessageScroller.Root style={{ height: '100%' }}>
            <MessageScroller.Viewport>
              <MessageScroller.Content>
                {messages.map((message) => (
                  <MessageScroller.Item
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === 'user'}
                  >
                    <Message align={message.role === 'user' ? 'end' : 'start'}>
                      <MessageContent>
                        {message.role === 'user' ? (
                          <Bubble align="end">
                            <BubbleContent>{message.text}</BubbleContent>
                          </Bubble>
                        ) : (
                          <Bubble variant="outline">
                            <BubbleContent>{message.text}</BubbleContent>
                          </Bubble>
                        )}
                      </MessageContent>
                    </Message>
                  </MessageScroller.Item>
                ))}
              </MessageScroller.Content>
            </MessageScroller.Viewport>
            <MessageScroller.Button />
          </MessageScroller.Root>
        </div>
      </div>
    </MessageScroller.Provider>
  );
}

export const Default: Story = {
  render: () => <Demo />,
};

export const OpeningAtStart: Story = {
  render: () => (
    <div
      style={{
        height: 360,
        width: 520,
        overflow: 'hidden',
        borderRadius: 24,
        border: '1px solid var(--tb-border)',
      }}
    >
      <MessageScroller.Provider defaultScrollPosition="start">
        <MessageScroller.Root style={{ height: '100%' }}>
          <MessageScroller.Viewport>
            <MessageScroller.Content>
              {initial.map((message) => (
                <MessageScroller.Item key={message.id} messageId={message.id}>
                  <Message align={message.role === 'user' ? 'end' : 'start'}>
                    <MessageContent>
                      <Bubble align={message.role === 'user' ? 'end' : 'start'}>
                        <BubbleContent>{message.text}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScroller.Item>
              ))}
            </MessageScroller.Content>
          </MessageScroller.Viewport>
          <MessageScroller.Button />
        </MessageScroller.Root>
      </MessageScroller.Provider>
    </div>
  ),
};
