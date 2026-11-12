import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from './Trace';
import { Icon, type IconName } from '../ui/Icon';
import { Spinner } from '../ui/Display';

const meta: Meta = {
  title: 'AI/Trace',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const Box = ({ children }: { children: ReactNode }) => <div style={{ width: 380 }}>{children}</div>;

function Step({
  icon = 'checkCircle',
  title,
  description,
}: {
  icon?: IconName;
  title: string;
  description?: string;
}) {
  return (
    <TraceLine>
      <TraceIcon>
        <Icon name={icon} size={16} />
      </TraceIcon>
      <TraceTitle>{title}</TraceTitle>
      {description && <TraceDescription>{description}</TraceDescription>}
    </TraceLine>
  );
}

export const Default: Story = {
  render: () => (
    <Box>
      <Trace>
        <Step title="Нашёл определение ранга" description="0,3 с" />
        <Step title="Сверил с примером" description="0,2 с" />
        <Step title="Собрал ответ" />
      </Trace>
    </Box>
  ),
};

export const Statuses: Story = {
  render: () => (
    <Box>
      <Trace>
        <TraceLine status="running">
          <TraceIcon>
            <Spinner size={14} />
          </TraceIcon>
          <TraceTitle>Ищу информацию</TraceTitle>
        </TraceLine>
        <Step title="Прочитал страницу" description="0,4 с" />
        <TraceLine status="error">
          <TraceIcon>
            <Icon name="alertCircle" size={16} />
          </TraceIcon>
          <TraceTitle>Не удалось открыть документацию</TraceTitle>
        </TraceLine>
      </Trace>
    </Box>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <Box>
      <Trace>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <Step title="4 шага" description="1,2 с" icon="chevronDown" />
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              <Step title="Открыл конспект по алгебре" />
              <Step title="Выбрал базис из миноров" />
              <Step title="Посчитал определитель" />
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </Box>
  ),
};

export const Links: Story = {
  render: () => (
    <Box>
      <Trace>
        <TraceLine>
          <TraceIcon>
            <Icon name="file" size={16} />
          </TraceIcon>
          <TraceTitle>docs/tariffs.md</TraceTitle>
          <TraceIcon>
            <Icon name="arrowUpRight" size={14} />
          </TraceIcon>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <Icon name="code" size={16} />
          </TraceIcon>
          <TraceTitle>src/lib/rates.ts:42</TraceTitle>
        </TraceLine>
      </Trace>
    </Box>
  ),
};
