import type { Meta, StoryObj } from '@storybook/react-vite';
import { Markdown } from './Markdown';

const meta: Meta<typeof Markdown> = {
  title: 'AI/Markdown',
  component: Markdown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 640 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Markdown>;

const answer = `## Почему горутина утекает

Отправка в **небуферизованный** канал блокирует горутину, пока её никто не прочитает. Если получатель уже вышел, отправитель остаётся ждать навсегда.

### Как это выглядит

\`\`\`go
func leak() {
    ch := make(chan int)
    go func() { ch <- 1 }() // никто не прочитает — горутина висит
}
\`\`\`

Три способа починить:

1. Дать каналу буфер: \`make(chan int, 1)\`.
2. Читать через \`select\` вместе с \`ctx.Done()\`.
3. Закрывать канал со стороны отправителя.

| Способ | Когда подходит | Минусы |
| --- | --- | --- |
| Буфер | известно число событий | нужно угадать размер |
| \`select\` | отмена по контексту | чуть больше кода |
| Закрытие | несколько читателей | паника при записи в закрытый |

> Утечка не видна в профиле сразу: горутина просто спит, а память под стек остаётся.

Подробности — в [документации по каналам](https://go.dev/ref/spec#Channel_types).

- [x] Проверить отправителя
- [ ] Добавить \`ctx.Done()\`
- [ ] Написать тест на утечку

---

Для сравнения: в Java такой поток остался бы в \`WAITING\` на \`take()\`.`;

export const Default: Story = {
  args: { children: answer },
};

export const Streaming: Story = {
  name: 'Streaming caret',
  args: { children: answer.slice(0, 240), streaming: true },
};

export const Inline: Story = {
  name: 'Inline only',
  args: {
    children:
      'Класс `String` неизменяемый, поэтому `s + "a"` создаёт новый объект. Подробнее — в [javadoc](https://docs.oracle.com/en/java/).',
  },
};
