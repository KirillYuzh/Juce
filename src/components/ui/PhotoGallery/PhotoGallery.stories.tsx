import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhotoGallery, type PhotoGalleryItem } from './PhotoGallery';

const meta = {
  title: 'Primitives/Photo gallery',
  component: PhotoGallery,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof PhotoGallery>;

export default meta;
type Story = StoryObj;

const photo = (fill: string, accent: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='960' height='600'%3E%3Crect width='960' height='600' fill='%23${fill}'/%3E%3Ccircle cx='480' cy='300' r='140' fill='%23${accent}'/%3E%3C/svg%3E`;

const items: PhotoGalleryItem[] = [
  {
    id: 'forest',
    src: photo('2f4f3f', 'd7e5c9'),
    alt: 'Утренний лес',
    caption: 'Туман между сосен, съёмка на рассвете.',
  },
  {
    id: 'river',
    src: photo('2b4a5f', 'cfe0f0'),
    alt: 'Горная река',
    caption: 'Вода цвета стекла на перекате.',
  },
  {
    id: 'house',
    src: photo('4f3f2f', 'ecd9c2'),
    alt: 'Домик у озера',
    caption: 'Деревянный дом на сваях у самой воды.',
  },
];

export const Default: Story = {
  render: () => (
    <div style={{ width: 720 }}>
      <PhotoGallery items={items} columns={3} />
    </div>
  ),
};
