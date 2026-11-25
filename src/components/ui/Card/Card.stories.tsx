import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';
import { Button } from '../Button';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Card>
      <CardBody>
        <CardHeader>
          <CardTitle>Граф зависимостей</CardTitle>
        </CardHeader>
        <CardDescription>Читаем граф проекта и не теряем контекст.</CardDescription>
      </CardBody>
      <CardFooter>
        <Button size="s" href="#">
          Открыть
        </Button>
      </CardFooter>
    </Card>
  ),
};
