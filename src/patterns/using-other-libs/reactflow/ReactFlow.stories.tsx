import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Badge } from '../../../components/ui/Display';
import styles from './ReactFlow.module.css';

const meta: Meta = {
  title: 'Patterns/Using other libs/reactflow',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Граф на React Flow (@xyflow/react): слои кита от токенов до страниц. Библиотека вызывается напрямую, без обёрток — узлы стандартного типа с нашим содержимым в data.label, рёбра — встроенные безье-связи. SVG-атрибуты не понимают var(), поэтому роли --tb-surface, --tb-text-primary, --tb-border-strong и радиус с шрифтом разрешаются через getComputedStyle, а при смене data-theme граф собирается заново с новыми цветами.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const PROBE = 'position:absolute;width:0;height:0;visibility:hidden;pointer-events:none';

interface Palette {
  surface: string;
  bg: string;
  text: string;
  border: string;
  borderStrong: string;
  radius: string;
  font: string;
  padding: string;
}

function readPalette(host: HTMLElement): Palette {
  const probe = document.createElement('span');
  probe.style.cssText = PROBE;
  host.appendChild(probe);
  const style = getComputedStyle(probe);
  const color = (role: string) => {
    probe.style.color = `var(${role})`;
    return style.color;
  };
  const palette: Palette = {
    surface: color('--tb-surface'),
    bg: color('--tb-bg-secondary'),
    text: color('--tb-text-primary'),
    border: color('--tb-border'),
    borderStrong: color('--tb-border-strong'),
    radius: style.getPropertyValue('--tb-radius-control').trim(),
    font: style.getPropertyValue('--tb-font-text').trim(),
    padding: style.getPropertyValue('--tb-space-3').trim(),
  };
  probe.remove();
  return palette;
}

interface Layer {
  id: string;
  title: string;
  badge: string;
  x: number;
  y: number;
}

const LAYERS: Layer[] = [
  { id: 'tokens', title: 'Токены', badge: 'lib', x: 0, y: 140 },
  { id: 'primitives', title: 'Примитивы', badge: 'ui', x: 230, y: 140 },
  { id: 'prebuilt', title: 'Prebuilt', badge: 'prebuilt', x: 460, y: 24 },
  { id: 'blocks', title: 'Blocks', badge: 'blocks', x: 460, y: 256 },
  { id: 'pages', title: 'Страницы', badge: 'pages', x: 690, y: 140 },
];

const LINKS: [string, string][] = [
  ['tokens', 'primitives'],
  ['primitives', 'prebuilt'],
  ['primitives', 'blocks'],
  ['prebuilt', 'pages'],
  ['blocks', 'pages'],
];

const label = (title: string, badge: string): ReactNode => (
  <div className={styles.label}>
    <span className={styles.title}>{title}</span>
    <Badge>{badge}</Badge>
  </div>
);

const nodeStyle = (palette: Palette): CSSProperties => ({
  width: 168,
  background: palette.surface,
  color: palette.text,
  border: `1px solid ${palette.borderStrong}`,
  borderRadius: palette.radius,
  fontFamily: palette.font,
  padding: palette.padding,
});

const controlsStyle = (palette: Palette): CSSProperties =>
  ({
    background: palette.surface,
    border: `1px solid ${palette.border}`,
    borderRadius: palette.radius,
    overflow: 'hidden',
    '--xy-controls-button-background-color': palette.surface,
    '--xy-controls-button-border-color': palette.border,
    '--xy-controls-button-color': palette.text,
  }) as CSSProperties;

function LayerGraph({ theme }: { theme: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState<Palette | null>(null);

  useLayoutEffect(() => {
    const element = host.current;
    if (!element) return;
    element.dataset.theme = theme;
    setPalette(readPalette(element));
  }, [theme]);

  const graph = useMemo(() => {
    if (!palette) return null;

    const nodes: Node[] = LAYERS.map((layer) => ({
      id: layer.id,
      position: { x: layer.x, y: layer.y },
      data: { label: label(layer.title, layer.badge) },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: nodeStyle(palette),
    }));

    const edges: Edge[] = LINKS.map(([source, target]) => ({
      id: `${source}-${target}`,
      source,
      target,
      style: { stroke: palette.borderStrong, strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: palette.borderStrong },
    }));

    return { nodes, edges };
  }, [palette]);

  return (
    <div ref={host} className={styles.scene}>
      {graph && palette && (
        <ReactFlow
          nodes={graph.nodes}
          edges={graph.edges}
          fitView
          nodesConnectable={false}
          edgesFocusable={false}
        >
          <Background color={palette.border} bgColor={palette.bg} gap={20} />
          <Controls style={controlsStyle(palette)} />
          <MiniMap
            pannable
            zoomable
            ariaLabel="Мини-карта графа"
            bgColor={palette.surface}
            nodeColor={palette.border}
            nodeStrokeColor={palette.borderStrong}
            style={{ border: `1px solid ${palette.border}`, borderRadius: palette.radius }}
          />
        </ReactFlow>
      )}
    </div>
  );
}

const flowSource = `import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Badge } from '../../../components/ui/Display';
import styles from './ReactFlow.module.css';

const PROBE = 'position:absolute;width:0;height:0;visibility:hidden;pointer-events:none';

interface Palette {
  surface: string;
  bg: string;
  text: string;
  border: string;
  borderStrong: string;
  radius: string;
  font: string;
  padding: string;
}

function readPalette(host: HTMLElement): Palette {
  const probe = document.createElement('span');
  probe.style.cssText = PROBE;
  host.appendChild(probe);
  const style = getComputedStyle(probe);
  const color = (role: string) => {
    probe.style.color = \`var(\${role})\`;
    return style.color;
  };
  const palette: Palette = {
    surface: color('--tb-surface'),
    bg: color('--tb-bg-secondary'),
    text: color('--tb-text-primary'),
    border: color('--tb-border'),
    borderStrong: color('--tb-border-strong'),
    radius: style.getPropertyValue('--tb-radius-control').trim(),
    font: style.getPropertyValue('--tb-font-text').trim(),
    padding: style.getPropertyValue('--tb-space-3').trim(),
  };
  probe.remove();
  return palette;
}

interface Layer {
  id: string;
  title: string;
  badge: string;
  x: number;
  y: number;
}

const LAYERS: Layer[] = [
  { id: 'tokens', title: 'Токены', badge: 'lib', x: 0, y: 140 },
  { id: 'primitives', title: 'Примитивы', badge: 'ui', x: 230, y: 140 },
  { id: 'prebuilt', title: 'Prebuilt', badge: 'prebuilt', x: 460, y: 24 },
  { id: 'blocks', title: 'Blocks', badge: 'blocks', x: 460, y: 256 },
  { id: 'pages', title: 'Страницы', badge: 'pages', x: 690, y: 140 },
];

const LINKS: [string, string][] = [
  ['tokens', 'primitives'],
  ['primitives', 'prebuilt'],
  ['primitives', 'blocks'],
  ['prebuilt', 'pages'],
  ['blocks', 'pages'],
];

const label = (title: string, badge: string): ReactNode => (
  <div className={styles.label}>
    <span className={styles.title}>{title}</span>
    <Badge>{badge}</Badge>
  </div>
);

const nodeStyle = (palette: Palette): CSSProperties => ({
  width: 168,
  background: palette.surface,
  color: palette.text,
  border: \`1px solid \${palette.borderStrong}\`,
  borderRadius: palette.radius,
  fontFamily: palette.font,
  padding: palette.padding,
});

const controlsStyle = (palette: Palette): CSSProperties =>
  ({
    background: palette.surface,
    border: \`1px solid \${palette.border}\`,
    borderRadius: palette.radius,
    overflow: 'hidden',
    '--xy-controls-button-background-color': palette.surface,
    '--xy-controls-button-border-color': palette.border,
    '--xy-controls-button-color': palette.text,
  }) as CSSProperties;

function LayerGraph({ theme }: { theme: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState<Palette | null>(null);

  useLayoutEffect(() => {
    const element = host.current;
    if (!element) return;
    element.dataset.theme = theme;
    setPalette(readPalette(element));
  }, [theme]);

  const graph = useMemo(() => {
    if (!palette) return null;

    const nodes: Node[] = LAYERS.map((layer) => ({
      id: layer.id,
      position: { x: layer.x, y: layer.y },
      data: { label: label(layer.title, layer.badge) },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: nodeStyle(palette),
    }));

    const edges: Edge[] = LINKS.map(([source, target]) => ({
      id: \`\${source}-\${target}\`,
      source,
      target,
      style: { stroke: palette.borderStrong, strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: palette.borderStrong },
    }));

    return { nodes, edges };
  }, [palette]);

  return (
    <div ref={host} className={styles.scene}>
      {graph && palette && (
        <ReactFlow
          nodes={graph.nodes}
          edges={graph.edges}
          fitView
          nodesConnectable={false}
          edgesFocusable={false}
        >
          <Background color={palette.border} bgColor={palette.bg} gap={20} />
          <Controls style={controlsStyle(palette)} />
          <MiniMap
            pannable
            zoomable
            ariaLabel="Мини-карта графа"
            bgColor={palette.surface}
            nodeColor={palette.border}
            nodeStrokeColor={palette.borderStrong}
            style={{ border: \`1px solid \${palette.border}\`, borderRadius: palette.radius }}
          />
        </ReactFlow>
      )}
    </div>
  );
}

export function Layers() {
  return <LayerGraph theme="light" />;
}`;

export const Architecture: Story = {
  name: 'Layers',
  render: (_args, context) => <LayerGraph theme={String(context.globals.theme ?? 'light')} />,
  parameters: { docs: { source: { code: flowSource } } },
};
