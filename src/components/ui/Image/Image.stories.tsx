import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from './Image';
import { Icon } from '../Icon';
import { Stack } from '../Layout';

const meta: Meta<typeof Image> = {
  title: 'Primitives/Image',
  component: Image,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = {
  render: () => (
    <Stack direction="row" gap="6" wrap align="start">
      <Stack gap="3" style={{ width: 260 }}>
        <Image src="/images/wang/explain.jpeg" alt="Кадр из объяснения" ratio="photo" />
        <Image src="/images/wang/laugh.jpeg" alt="Кадр из смеха" ratio="photo" />
      </Stack>
      <Stack gap="3" style={{ width: 200 }}>
        <Image src="/images/wang/smile.png" alt="Улыбка" ratio="square" />
        <Image src="/images/wang/listen.png" alt="Слушает" ratio="square" />
      </Stack>
      <Stack gap="3" style={{ width: 320 }}>
        <Image src="/images/wang/roof.png" alt="Крыша дома" ratio="photo" />
        <Image
          src="/images/wang/missing.png"
          alt=""
          fallback={<Icon name="file" size={32} />}
          ratio="photo"
        />
      </Stack>
    </Stack>
  ),
};
