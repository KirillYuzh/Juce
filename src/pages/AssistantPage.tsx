import { useEffect, useRef, useState } from 'react';
import { Header } from '../components/blocks/Header';
import { Chat } from '../components/ai/Chat';
import type { ChatMessage } from '../components/ai/Chat';
import type { PromptInputPayload, PromptInputStatus } from '../components/ai/PromptInput';
import { homeNav } from '../data/home';

const startMessages: ChatMessage[] = [
  {
    id: 'a1',
    role: 'assistant',
    content:
      'Привет! Я Джупсик. Разберу код на Java или Go, объясню алгоритм, помогу с доказательством по линейной алгебре или дискретке.\n\nС чего начнём?',
  },
];

export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(startMessages);
  const [status, setStatus] = useState<PromptInputStatus>('ready');
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const send = ({ text }: PromptInputPayload) => {
    if (status === 'streaming') return;
    setMessages((current) => [...current, { id: `u-${Date.now()}`, role: 'user', content: text }]);
    setStatus('streaming');
    timer.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content:
            'Это демонстрационный ответ. В реальном приложении сюда приходит поток от модели.\n\nМожно передать рассуждения, источники и действия под сообщением.',
          reasoning: 'Разбираю условие задачи и вспоминаю, какой термин здесь нужен.',
          reasoningDuration: 2,
          sources: [{ url: 'https://dev.java/', title: 'dev.java: документация JDK' }],
        },
      ]);
      setStatus('ready');
      timer.current = null;
    }, 900);
  };

  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setStatus('ready');
  };

  return (
    <>
      <Header nav={homeNav} variant="home" />
      <main>
        <div
          className="tb-container"
          style={{ display: 'flex', justifyContent: 'center', paddingBlock: 32 }}
        >
          <div
            style={{ width: '100%', maxWidth: 720, height: 'calc(100vh - 160px)', minHeight: 520 }}
          >
            <Chat
              messages={messages}
              onSend={send}
              onStop={stop}
              status={status}
              suggestions={['Почему утекает горутина?', 'Объясни ранг матрицы']}
              onRetry={(id) =>
                setMessages((current) => current.filter((message) => message.id !== id))
              }
            />
          </div>
        </div>
      </main>
    </>
  );
}
