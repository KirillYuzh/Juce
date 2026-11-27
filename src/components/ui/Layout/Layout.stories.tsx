import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, Stack } from './Layout';
import { Button } from '../Button';
import { Text } from '../Typography';

const meta: Meta = {
  title: 'Primitives/Layout',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const tiles = ['Первый', 'Второй', 'Третий', 'Четвёртый', 'Пятый', 'Шестой'];

function Tile({ label }: { label: string }) {
  return <div className="tb-text-m">{label}</div>;
}

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 560 }}>
      <Stack gap="3">
        <Text weight="bold">Stack: колонка</Text>
        <Button size="s">Первая кнопка</Button>
        <Button size="s" variant="secondary">
          Вторая кнопка
        </Button>
      </Stack>

      <Stack direction="row" gap="2" align="center" justify="between" wrap>
        <Button size="s" variant="secondary">
          Слева
        </Button>
        <Button size="s" variant="secondary">
          По центру
        </Button>
        <Button size="s" variant="secondary">
          Справа
        </Button>
      </Stack>

      <Grid columns={3} gap="3">
        {tiles.map((tile) => (
          <Tile key={tile} label={tile} />
        ))}
      </Grid>

      <Grid minItemWidth="m" gap="3">
        {tiles.map((tile) => (
          <Tile key={tile} label={tile} />
        ))}
      </Grid>
    </div>
  ),
};
