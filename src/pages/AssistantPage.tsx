import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from '../components/blocks/Header';
import { Chat, type ChatMessage } from '../components/ai/Chat';
import { planRetry } from '../components/ai/chat-retry';
import type { PromptInputPayload, PromptInputStatus } from '../components/ai/PromptInput';
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
  const [status, setStatus] = useState<PromptInputStatus>('ready');
  const timer = useRef<number | null>(null);
  const idRef = useRef(0);
  const messagesRef = useRef(messages);
  const statusRef = useRef(status);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = null;
    },
    []
  );

  const clearTimer = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const nextId = useCallback((prefix: string) => {
    idRef.current += 1;
    return `${prefix}-${idRef.current}`;
  }, []);

  const startReply = useCallback(() => {
    clearTimer();
    setStatus('streaming');
    timer.current = window.setTimeout(() => {
      idRef.current += 1;
      setMessages((current) => [...current, demoAssistantMessage(`a-${idRef.current}`)]);
      setStatus('ready');
      timer.current = null;
    }, demoChatReplyDelay);
  }, [clearTimer]);

  const send = ({ text }: PromptInputPayload) => {
    if (status !== 'ready') return;
    setMessages((current) => [...current, { id: nextId('u'), role: 'user', content: text }]);
    startReply();
  };

  const stop = () => {
    clearTimer();
    const stopped: ChatMessage = {
      id: nextId('a'),
      role: 'assistant',
      content: '',
      error: true,
      errorText: 'Остановлено. Ответ можно повторить.',
    };
    setMessages((current) => [...current, stopped]);
    setStatus('ready');
  };

  const retry = useCallback(
    (id: string) => {
      if (statusRef.current !== 'ready') return;
      const plan = planRetry(messagesRef.current, id);
      if (!plan) return;
      setMessages(plan.messages);
      startReply();
    },
    [startReply]
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
              status={status}
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
