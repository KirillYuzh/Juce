import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from '../components/blocks/Header';
import { Chat, type ChatMessage } from '../components/ai/Chat';
import { planRetry } from '../components/ai/chat-retry';
import type { PromptInputPayload } from '../components/ai/PromptInput';
import { demoAssistantMessage, demoChatReplyDelay } from '../components/ai/chat-demo';
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
  const timer = useRef<number | null>(null);
  const idRef = useRef(0);
  const messagesRef = useRef(messages);
  const busy = messages.some((message) => message.streaming);
  const busyRef = useRef(busy);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    busyRef.current = busy;
  }, [busy]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const nextId = useCallback((prefix: string) => {
    idRef.current += 1;
    return `${prefix}-${idRef.current}`;
  }, []);

  const startReply = useCallback((replyId: string) => {
    timer.current = window.setTimeout(() => {
      setMessages((current) =>
        current.map((message) => (message.id === replyId ? demoAssistantMessage(replyId) : message))
      );
      busyRef.current = false;
      timer.current = null;
    }, demoChatReplyDelay);
  }, []);

  const send = ({ text }: PromptInputPayload) => {
    if (busyRef.current) return;
    busyRef.current = true;
    const userId = nextId('u');
    const replyId = nextId('a');
    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', content: text },
      { id: replyId, role: 'assistant', content: '', streaming: true },
    ]);
    startReply(replyId);
  };

  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    busyRef.current = false;
    const stoppedId = nextId('a');
    setMessages((current) => [
      ...current.filter((message) => !message.streaming),
      {
        id: stoppedId,
        role: 'assistant',
        content: '',
        error: true,
        errorText: 'Остановлено. Ответ можно повторить.',
      },
    ]);
  };

  const retry = useCallback(
    (id: string) => {
      if (busyRef.current) return;
      const plan = planRetry(messagesRef.current, id);
      if (!plan) return;
      busyRef.current = true;
      const replyId = nextId('a');
      setMessages([
        ...plan.messages,
        { id: replyId, role: 'assistant', content: '', streaming: true },
      ]);
      startReply(replyId);
    },
    [nextId, startReply]
  );

  return (
    <>
      <Header nav={homeNav} />
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
              onRetry={retry}
              showReasoning
              showSources
              suggestions={['Почему утекает горутина?', 'Объясни ранг матрицы']}
            />
          </div>
        </div>
      </main>
    </>
  );
}
