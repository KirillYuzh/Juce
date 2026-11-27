import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from './Card';
import { Button } from '../Button';
import { Image } from '../Image';

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
    <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
      <Card style={{ width: 280 }}>
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

      <Card style={{ width: 280 }}>
        <CardMedia position="top">
          <Image src="/images/wang/laugh.jpeg" alt="" ratio="photo" />
        </CardMedia>
        <CardBody>
          <CardTitle>Обложка сверху</CardTitle>
          <CardDescription>Фото держит пропорцию 16/10 и обрезается по центру.</CardDescription>
        </CardBody>
      </Card>

      <Card style={{ width: 320 }}>
        <CardMedia position="side">
          <Image src="/images/wang/listen.png" alt="" ratio="square" />
        </CardMedia>
        <CardBody>
          <CardTitle>Боковая обложка</CardTitle>
          <CardDescription>Медиа растягивается на всю высоту карточки.</CardDescription>
        </CardBody>
      </Card>
    </div>
  ),
};
