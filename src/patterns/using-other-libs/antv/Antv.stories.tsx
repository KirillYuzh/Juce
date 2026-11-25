import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Graph, type Cell, type EdgeMetadata, type Node, type NodeMetadata } from '@antv/x6';

const meta: Meta = {
  title: 'Patterns/Using other libs/antv',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Примеры на AntV X6 из документации библиотеки: BPMN-процесс (showcase/practices/bpmn) и компактная блок-схема по мотивам официального примера flowchart. Библиотека вызывается напрямую, без обёрток. Из примеров изменены цвета (теперь только токены темы), подписи переведены на русский, блок-схема сокращена до семи узлов и одной развилки. X6 пишет значения в SVG-атрибуты, где var() не работает, поэтому цвета, шрифт и радиус читаются из токенов контейнера через getComputedStyle, а тема контейнера задаётся через data-theme.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const frame = (width: number): CSSProperties => ({
  overflow: 'hidden',
  width,
  borderRadius: 'var(--tb-radius-surface)',
  background: 'var(--tb-surface)',
  boxShadow: 'inset 0 0 0 1px var(--tb-border)',
});

type ThemeToken =
  | '--tb-bg-secondary'
  | '--tb-surface'
  | '--tb-text-primary'
  | '--tb-text-secondary'
  | '--tb-border-control'
  | '--tb-primary'
  | '--tb-on-primary'
  | '--tb-success-text'
  | '--tb-error-text'
  | '--tb-font-text'
  | '--tb-radius-control';

function tokenReader(element: HTMLElement) {
  const style = getComputedStyle(element);
  return (name: ThemeToken) => style.getPropertyValue(name).trim();
}

const BPMN_NODES: NodeMetadata[] = [
  {
    id: 'lane-employee',
    shape: 'lane',
    width: 240,
    height: 600,
    position: { x: 60, y: 60 },
    attrs: { 'name-text': { text: 'Сотрудник' } },
  },
  {
    id: 'lane-system',
    shape: 'lane',
    width: 240,
    height: 600,
    position: { x: 320, y: 60 },
    attrs: { 'name-text': { text: 'Система' } },
  },
  {
    id: 'lane-lead',
    shape: 'lane',
    width: 240,
    height: 600,
    position: { x: 580, y: 60 },
    attrs: { 'name-text': { text: 'Руководитель' } },
  },
  {
    id: 'start',
    shape: 'start-event',
    width: 40,
    height: 40,
    position: { x: 160, y: 100 },
    parent: 'lane-employee',
  },
  {
    id: 'apply',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 120, y: 190 },
    label: 'Заявка на отпуск',
    parent: 'lane-employee',
  },
  {
    id: 'check',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 380, y: 110 },
    label: 'Автопроверка',
    parent: 'lane-system',
  },
  {
    id: 'approve',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 640, y: 110 },
    label: 'Согласование',
    parent: 'lane-lead',
  },
  {
    id: 'exgw',
    shape: 'gateway-exclusive',
    width: 40,
    height: 40,
    position: { x: 680, y: 260 },
    parent: 'lane-lead',
  },
  {
    id: 'subproc',
    shape: 'subprocess',
    width: 160,
    height: 70,
    position: { x: 100, y: 330 },
    label: 'Дополнить данные',
    parent: 'lane-employee',
  },
  {
    id: 'archive',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 370, y: 300 },
    label: 'Учесть в системе',
    parent: 'lane-system',
  },
  {
    id: 'pgw',
    shape: 'gateway-parallel',
    width: 40,
    height: 40,
    position: { x: 410, y: 450 },
    parent: 'lane-system',
  },
  {
    id: 'notify',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 370, y: 540 },
    label: 'Уведомить HR',
    parent: 'lane-system',
  },
  {
    id: 'confirm',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 120, y: 440 },
    label: 'Подтвердить',
    parent: 'lane-employee',
  },
  {
    id: 'pgw2',
    shape: 'gateway-parallel',
    width: 40,
    height: 40,
    position: { x: 160, y: 550 },
    parent: 'lane-employee',
  },
  {
    id: 'end',
    shape: 'end-event',
    width: 40,
    height: 40,
    position: { x: 160, y: 620 },
    parent: 'lane-employee',
  },
];

type BpmnEdge = EdgeMetadata & { from: AnchorSide; to: AnchorSide };

const BPMN_EDGES: BpmnEdge[] = [
  { id: 'e1', source: 'start', target: 'apply', from: 'bottom', to: 'top', label: 'начало' },
  { id: 'e2', source: 'apply', target: 'check', from: 'right', to: 'left' },
  { id: 'e3', source: 'check', target: 'approve', from: 'right', to: 'left' },
  { id: 'e4', source: 'approve', target: 'exgw', from: 'bottom', to: 'top' },
  {
    id: 'e5',
    source: 'exgw',
    target: 'subproc',
    from: 'left',
    to: 'right',
    label: 'не хватает данных',
  },
  {
    id: 'e6',
    source: 'exgw',
    target: 'archive',
    from: 'bottom',
    to: 'bottom',
    label: 'согласовано',
  },
  { id: 'e7', source: 'subproc', target: 'archive', from: 'right', to: 'left', label: 'готово' },
  { id: 'e8', source: 'archive', target: 'pgw', from: 'bottom', to: 'top' },
  { id: 'e9', source: 'pgw', target: 'notify', from: 'bottom', to: 'top' },
  { id: 'e10', source: 'pgw', target: 'confirm', from: 'left', to: 'right' },
  { id: 'e11', source: 'notify', target: 'pgw2', from: 'left', to: 'right' },
  { id: 'e12', source: 'confirm', target: 'pgw2', from: 'bottom', to: 'top' },
  { id: 'e13', source: 'pgw2', target: 'end', from: 'bottom', to: 'top', label: 'конец' },
];

const BPMN_DETAILS = '1. Справка\n2. Резервный слот';

type AnchorSide = 'top' | 'right' | 'bottom' | 'left';

type FlowNode = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  pill?: boolean;
  diamond?: boolean;
};

const FLOW_NODES: FlowNode[] = [
  { id: 'start', x: 40, y: 40, width: 120, height: 40, label: 'Начало', pill: true },
  { id: 'draft', x: 40, y: 116, width: 120, height: 48, label: 'Черновик' },
  { id: 'check', x: 220, y: 116, width: 120, height: 48, label: 'Проверка' },
  { id: 'decision', x: 400, y: 90, width: 120, height: 100, label: 'Одобрено?', diamond: true },
  { id: 'publish', x: 600, y: 40, width: 150, height: 48, label: 'Публикация' },
  { id: 'end', x: 600, y: 140, width: 150, height: 40, label: 'Готово', pill: true },
  { id: 'rework', x: 600, y: 230, width: 150, height: 48, label: 'Доработка' },
];

const FLOW_EDGES: Array<{
  source: string;
  target: string;
  from: AnchorSide;
  to: AnchorSide;
  label?: string;
}> = [
  { source: 'start', target: 'draft', from: 'bottom', to: 'top' },
  { source: 'draft', target: 'check', from: 'right', to: 'left' },
  { source: 'check', target: 'decision', from: 'right', to: 'left' },
  { source: 'decision', target: 'publish', from: 'top', to: 'left', label: 'да' },
  { source: 'decision', target: 'rework', from: 'bottom', to: 'left', label: 'нет' },
  { source: 'publish', target: 'end', from: 'bottom', to: 'top' },
  { source: 'rework', target: 'check', from: 'bottom', to: 'bottom', label: 'на доработку' },
];


const BPMN_SOURCE = `import { useEffect, useRef } from 'react';
import { Graph, type Cell, type EdgeMetadata, type Node, type NodeMetadata } from '@antv/x6';

type ThemeToken =
  | '--tb-bg-secondary'
  | '--tb-surface'
  | '--tb-text-primary'
  | '--tb-text-secondary'
  | '--tb-border-control'
  | '--tb-primary'
  | '--tb-on-primary'
  | '--tb-success-text'
  | '--tb-error-text'
  | '--tb-font-text'
  | '--tb-radius-control';

const NODES: NodeMetadata[] = [
  {
    id: 'lane-employee',
    shape: 'lane',
    width: 240,
    height: 600,
    position: { x: 60, y: 60 },
    attrs: { 'name-text': { text: 'Сотрудник' } },
  },
  {
    id: 'lane-system',
    shape: 'lane',
    width: 240,
    height: 600,
    position: { x: 320, y: 60 },
    attrs: { 'name-text': { text: 'Система' } },
  },
  {
    id: 'lane-lead',
    shape: 'lane',
    width: 240,
    height: 600,
    position: { x: 580, y: 60 },
    attrs: { 'name-text': { text: 'Руководитель' } },
  },
  {
    id: 'start',
    shape: 'start-event',
    width: 40,
    height: 40,
    position: { x: 160, y: 100 },
    parent: 'lane-employee',
  },
  {
    id: 'apply',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 120, y: 190 },
    label: 'Заявка на отпуск',
    parent: 'lane-employee',
  },
  {
    id: 'check',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 380, y: 110 },
    label: 'Автопроверка',
    parent: 'lane-system',
  },
  {
    id: 'approve',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 640, y: 110 },
    label: 'Согласование',
    parent: 'lane-lead',
  },
  {
    id: 'exgw',
    shape: 'gateway-exclusive',
    width: 40,
    height: 40,
    position: { x: 680, y: 260 },
    parent: 'lane-lead',
  },
  {
    id: 'subproc',
    shape: 'subprocess',
    width: 160,
    height: 70,
    position: { x: 100, y: 330 },
    label: 'Дополнить данные',
    parent: 'lane-employee',
  },
  {
    id: 'archive',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 370, y: 300 },
    label: 'Учесть в системе',
    parent: 'lane-system',
  },
  {
    id: 'pgw',
    shape: 'gateway-parallel',
    width: 40,
    height: 40,
    position: { x: 410, y: 450 },
    parent: 'lane-system',
  },
  {
    id: 'notify',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 370, y: 540 },
    label: 'Уведомить HR',
    parent: 'lane-system',
  },
  {
    id: 'confirm',
    shape: 'activity',
    width: 120,
    height: 60,
    position: { x: 120, y: 440 },
    label: 'Подтвердить',
    parent: 'lane-employee',
  },
  {
    id: 'pgw2',
    shape: 'gateway-parallel',
    width: 40,
    height: 40,
    position: { x: 160, y: 550 },
    parent: 'lane-employee',
  },
  {
    id: 'end',
    shape: 'end-event',
    width: 40,
    height: 40,
    position: { x: 160, y: 620 },
    parent: 'lane-employee',
  },
];

const EDGES = [
  { id: 'e1', source: 'start', target: 'apply', from: 'bottom', to: 'top', label: 'начало' },
  { id: 'e2', source: 'apply', target: 'check', from: 'right', to: 'left' },
  { id: 'e3', source: 'check', target: 'approve', from: 'right', to: 'left' },
  { id: 'e4', source: 'approve', target: 'exgw', from: 'bottom', to: 'top' },
  { id: 'e5', source: 'exgw', target: 'subproc', from: 'left', to: 'right', label: 'не хватает данных' },
  { id: 'e6', source: 'exgw', target: 'archive', from: 'bottom', to: 'bottom', label: 'согласовано' },
  { id: 'e7', source: 'subproc', target: 'archive', from: 'right', to: 'left', label: 'готово' },
  { id: 'e8', source: 'archive', target: 'pgw', from: 'bottom', to: 'top' },
  { id: 'e9', source: 'pgw', target: 'notify', from: 'bottom', to: 'top' },
  { id: 'e10', source: 'pgw', target: 'confirm', from: 'left', to: 'right' },
  { id: 'e11', source: 'notify', target: 'pgw2', from: 'left', to: 'right' },
  { id: 'e12', source: 'confirm', target: 'pgw2', from: 'bottom', to: 'top' },
  { id: 'e13', source: 'pgw2', target: 'end', from: 'bottom', to: 'top', label: 'конец' },
];

const DETAILS = '1. Справка\\n2. Резервный слот';

export function BpmnGraph({ theme }: { theme: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.dataset.theme = theme;
    const style = getComputedStyle(element);
    const token = (name: ThemeToken) => style.getPropertyValue(name).trim();
    const font = token('--tb-font-text');
    const radius = token('--tb-radius-control');

    Graph.registerNode(
      'start-event',
      {
        inherit: 'circle',
        attrs: {
          body: {
            strokeWidth: 2,
            stroke: token('--tb-success-text'),
            fill: token('--tb-bg-secondary'),
          },
        },
      },
      true
    );

    Graph.registerNode(
      'end-event',
      {
        inherit: 'circle',
        attrs: {
          body: {
            strokeWidth: 4,
            stroke: token('--tb-error-text'),
            fill: token('--tb-bg-secondary'),
          },
        },
      },
      true
    );

    Graph.registerNode(
      'activity',
      {
        inherit: 'rect',
        attrs: {
          body: {
            rx: radius,
            ry: radius,
            stroke: token('--tb-primary'),
            fill: token('--tb-bg-secondary'),
            strokeWidth: 1,
          },
          label: { fontSize: 12, fill: token('--tb-text-primary'), fontFamily: font },
        },
      },
      true
    );

    Graph.registerNode(
      'subprocess',
      {
        inherit: 'rect',
        markup: [
          { tagName: 'rect', selector: 'body' },
          { tagName: 'text', selector: 'label' },
          { tagName: 'text', selector: 'expand' },
          { tagName: 'text', selector: 'details' },
        ],
        attrs: {
          body: {
            rx: radius,
            ry: radius,
            stroke: token('--tb-primary'),
            fill: token('--tb-bg-secondary'),
            strokeWidth: 1,
          },
          label: {
            ref: 'body',
            refX: '50%',
            refY: '50%',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fontSize: 12,
            fill: token('--tb-text-primary'),
            fontFamily: font,
          },
          expand: {
            ref: 'body',
            refX: '100%',
            refY: '100%',
            x: -8,
            y: -8,
            textVerticalAnchor: 'bottom',
            textAnchor: 'end',
            fontSize: 16,
            fontWeight: 'bold',
            fill: token('--tb-primary'),
            cursor: 'pointer',
            text: '+',
            event: 'subproc:toggle',
          },
          details: {
            ref: 'body',
            refX: '50%',
            refY: 44,
            textAnchor: 'middle',
            textVerticalAnchor: 'top',
            fontSize: 12,
            fill: token('--tb-text-secondary'),
            fontFamily: font,
            display: 'none',
            textWrap: { width: -24 },
            text: '',
          },
        },
      },
      true
    );

    const gateway = (name: string, symbol: string) =>
      Graph.registerNode(
        name,
        {
          inherit: 'polygon',
          attrs: {
            body: {
              refPoints: '0,10 10,0 20,10 10,20',
              strokeWidth: 2,
              stroke: token('--tb-primary'),
              fill: token('--tb-bg-secondary'),
            },
            label: {
              text: symbol,
              fontSize: 22,
              fontWeight: 'bold',
              fill: token('--tb-primary'),
              fontFamily: font,
            },
          },
        },
        true
      );

    gateway('gateway-exclusive', '×');
    gateway('gateway-parallel', '⨁');

    Graph.registerNode(
      'lane',
      {
        inherit: 'rect',
        markup: [
          { tagName: 'rect', selector: 'body' },
          { tagName: 'rect', selector: 'name-rect' },
          { tagName: 'text', selector: 'name-text' },
        ],
        attrs: {
          body: { fill: token('--tb-surface'), stroke: token('--tb-border-control'), strokeWidth: 1 },
          'name-rect': {
            width: 240,
            height: 30,
            fill: token('--tb-primary'),
            stroke: token('--tb-primary'),
            strokeWidth: 0,
          },
          'name-text': {
            ref: 'name-rect',
            refX: 0.5,
            refY: 0.5,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fontWeight: 'bold',
            fill: token('--tb-on-primary'),
            fontSize: 12,
            fontFamily: font,
          },
        },
      },
      true
    );

    Graph.registerEdge(
      'bpmn-edge',
      {
        inherit: 'edge',
        attrs: {
          line: {
            stroke: token('--tb-border-control'),
            strokeWidth: 2,
            targetMarker: {
              name: 'classic',
              size: 7,
              fill: token('--tb-text-primary'),
              stroke: token('--tb-text-primary'),
            },
          },
        },
      },
      true
    );

    const graph = new Graph({
      container: element,
      autoResize: true,
      panning: true,
      background: { color: 'transparent' },
      grid: false,
    });

    const cells: Cell[] = [];
    const nodes = new Map<string, Node>();

    for (const item of NODES) {
      const node = graph.createNode(item);
      nodes.set(node.id, node);
      cells.push(node);
    }

    for (const item of EDGES) {
      const edge = graph.createEdge({
        ...item,
        shape: 'bpmn-edge',
        source: {
          cell: item.source as string,
          anchor: { name: item.from },
          connectionPoint: { name: 'anchor' },
        },
        target: {
          cell: item.target as string,
          anchor: { name: item.to },
          connectionPoint: { name: 'anchor' },
        },
        router: {
          name: 'manhattan',
          args: {
            padding: { top: 8, right: 8, bottom: 8, left: 8 },
            excludeShapes: ['lane'],
            excludeTerminals: ['source', 'target'],
            startDirections: [item.from],
            endDirections: [item.to],
          },
        },
      });

      if (item.label) {
        edge.setLabels([
          {
            attrs: {
              body: { fill: token('--tb-surface') },
              label: {
                text: String(item.label),
                fill: token('--tb-text-secondary'),
                fontSize: 11,
                fontFamily: font,
              },
            },
          },
        ]);
      }

      const sourceParent = nodes.get(String(edge.getSourceCellId()))?.prop('parent');
      const targetParent = nodes.get(String(edge.getTargetCellId()))?.prop('parent');

      if (sourceParent && targetParent && sourceParent !== targetParent) {
        edge.attr('line/strokeDasharray', '5,5');
      }

      cells.push(edge);
    }

    graph.resetCells(cells);

    for (const node of nodes.values()) {
      const parentId = node.prop('parent');
      if (typeof parentId !== 'string') continue;

      const parent = nodes.get(parentId);
      if (parent) parent.addChild(node);
    }

    graph.on('subproc:toggle', ({ node }: { node: Node }) => {
      const data = node.getData() ?? {};
      const expanded = Boolean(data.expanded);
      const next = !expanded;

      node.attr('expand/text', next ? '-' : '+');
      node.attr('details/display', next ? 'block' : 'none');

      if (next) node.attr('details/text', DETAILS);

      const lines = DETAILS.split(/\\n/).length;
      const size = node.getSize();

      node.size(size.width, next ? Math.max(70, 40 + lines * 18 + 24) : 70);

      node.attr('label', {
        textVerticalAnchor: next ? 'top' : 'middle',
        refY: next ? 18 : '50%',
        refX: '50%',
        ref: 'body',
      });

      node.setData({ ...data, expanded: next });
    });

    graph.zoomToFit({ padding: 10, maxScale: 1 });

    return () => graph.dispose();
  }, [theme]);

  return (
    <div
      style={{
        overflow: 'hidden',
        width: 880,
        borderRadius: 'var(--tb-radius-surface)',
        background: 'var(--tb-surface)',
        boxShadow: 'inset 0 0 0 1px var(--tb-border)',
      }}
    >
      <div ref={ref} style={{ height: 620 }} />
    </div>
  );
}`;

const FLOWCHART_SOURCE = `import { useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';

type ThemeToken =
  | '--tb-bg-secondary'
  | '--tb-surface'
  | '--tb-text-primary'
  | '--tb-text-secondary'
  | '--tb-border-control'
  | '--tb-font-text'
  | '--tb-radius-control';

const FLOW_NODES = [
  { id: 'start', x: 40, y: 40, width: 120, height: 40, label: 'Начало', pill: true },
  { id: 'draft', x: 40, y: 116, width: 120, height: 48, label: 'Черновик' },
  { id: 'check', x: 220, y: 116, width: 120, height: 48, label: 'Проверка' },
  { id: 'decision', x: 400, y: 90, width: 120, height: 100, label: 'Одобрено?', diamond: true },
  { id: 'publish', x: 600, y: 40, width: 150, height: 48, label: 'Публикация' },
  { id: 'end', x: 600, y: 140, width: 150, height: 40, label: 'Готово', pill: true },
  { id: 'rework', x: 600, y: 230, width: 150, height: 48, label: 'Доработка' },
];

const FLOW_EDGES = [
  { source: 'start', target: 'draft', from: 'bottom', to: 'top' },
  { source: 'draft', target: 'check', from: 'right', to: 'left' },
  { source: 'check', target: 'decision', from: 'right', to: 'left' },
  { source: 'decision', target: 'publish', from: 'top', to: 'left', label: 'да' },
  { source: 'decision', target: 'rework', from: 'bottom', to: 'left', label: 'нет' },
  { source: 'publish', target: 'end', from: 'bottom', to: 'top' },
  { source: 'rework', target: 'check', from: 'bottom', to: 'bottom', label: 'на доработку' },
];

function FlowchartGraph({ theme }: { theme: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.dataset.theme = theme;
    const style = getComputedStyle(element);
    const token = (name: ThemeToken) => style.getPropertyValue(name).trim();

    const graph = new Graph({
      container: element,
      autoResize: true,
      panning: true,
      background: { color: 'transparent' },
      grid: false,
    });

    const label = {
      fill: token('--tb-text-primary'),
      fontFamily: token('--tb-font-text'),
      fontSize: 12,
      fontWeight: 500,
    };

    for (const node of FLOW_NODES) {
      const radius = node.pill ? node.height / 2 : token('--tb-radius-control');

      graph.addNode({
        id: node.id,
        shape: node.diamond ? 'polygon' : 'rect',
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        label: node.label,
        attrs: {
          body: node.diamond
            ? {
                refPoints: '0,10 10,0 20,10 10,20',
                fill: token('--tb-bg-secondary'),
                stroke: token('--tb-border-control'),
                strokeWidth: 1,
              }
            : {
                rx: radius,
                ry: radius,
                fill: token('--tb-bg-secondary'),
                stroke: token('--tb-border-control'),
                strokeWidth: 1,
              },
          label,
        },
      });
    }

    for (const edge of FLOW_EDGES) {
      graph.addEdge({
        source: {
          cell: edge.source,
          anchor: { name: edge.from },
          connectionPoint: { name: 'anchor' },
        },
        target: {
          cell: edge.target,
          anchor: { name: edge.to },
          connectionPoint: { name: 'anchor' },
        },
        router: {
          name: 'manhattan',
          args: {
            padding: { top: 16, right: 16, bottom: 16, left: 16 },
            excludeTerminals: ['source', 'target'],
            startDirections: [edge.from],
            endDirections: [edge.to],
          },
        },
        connector: { name: 'rounded', args: { radius: 8 } },
        attrs: {
          line: {
            stroke: token('--tb-border-control'),
            strokeWidth: 1.5,
            targetMarker: {
              name: 'block',
              size: 7,
              fill: token('--tb-text-primary'),
              stroke: token('--tb-text-primary'),
            },
          },
        },
        labels: edge.label
          ? [
              {
                attrs: {
                  body: { fill: token('--tb-surface') },
                  label: {
                    text: edge.label,
                    fill: token('--tb-text-secondary'),
                    fontSize: 11,
                    fontFamily: token('--tb-font-text'),
                  },
                },
              },
            ]
          : undefined,
      });
    }

    return () => graph.dispose();
  }, [theme]);

  return <div ref={ref} style={{ height: 360 }} />;
}`;

function BpmnGraph({ theme }: { theme: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.dataset.theme = theme;
    const token = tokenReader(element);
    const font = token('--tb-font-text');
    const radius = token('--tb-radius-control');

    Graph.registerNode(
      'start-event',
      {
        inherit: 'circle',
        attrs: {
          body: {
            strokeWidth: 2,
            stroke: token('--tb-success-text'),
            fill: token('--tb-bg-secondary'),
          },
        },
      },
      true
    );

    Graph.registerNode(
      'end-event',
      {
        inherit: 'circle',
        attrs: {
          body: {
            strokeWidth: 4,
            stroke: token('--tb-error-text'),
            fill: token('--tb-bg-secondary'),
          },
        },
      },
      true
    );

    Graph.registerNode(
      'activity',
      {
        inherit: 'rect',
        attrs: {
          body: {
            rx: radius,
            ry: radius,
            stroke: token('--tb-primary'),
            fill: token('--tb-bg-secondary'),
            strokeWidth: 1,
          },
          label: { fontSize: 12, fill: token('--tb-text-primary'), fontFamily: font },
        },
      },
      true
    );

    Graph.registerNode(
      'subprocess',
      {
        inherit: 'rect',
        markup: [
          { tagName: 'rect', selector: 'body' },
          { tagName: 'text', selector: 'label' },
          { tagName: 'text', selector: 'expand' },
          { tagName: 'text', selector: 'details' },
        ],
        attrs: {
          body: {
            rx: radius,
            ry: radius,
            stroke: token('--tb-primary'),
            fill: token('--tb-bg-secondary'),
            strokeWidth: 1,
          },
          label: {
            ref: 'body',
            refX: '50%',
            refY: '50%',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fontSize: 12,
            fill: token('--tb-text-primary'),
            fontFamily: font,
          },
          expand: {
            ref: 'body',
            refX: '100%',
            refY: '100%',
            x: -8,
            y: -8,
            textVerticalAnchor: 'bottom',
            textAnchor: 'end',
            fontSize: 16,
            fontWeight: 'bold',
            fill: token('--tb-primary'),
            cursor: 'pointer',
            text: '+',
            event: 'subproc:toggle',
          },
          details: {
            ref: 'body',
            refX: '50%',
            refY: 44,
            textAnchor: 'middle',
            textVerticalAnchor: 'top',
            fontSize: 12,
            fill: token('--tb-text-secondary'),
            fontFamily: font,
            display: 'none',
            textWrap: { width: -24 },
            text: '',
          },
        },
      },
      true
    );

    const gateway = (name: string, symbol: string) =>
      Graph.registerNode(
        name,
        {
          inherit: 'polygon',
          attrs: {
            body: {
              refPoints: '0,10 10,0 20,10 10,20',
              strokeWidth: 2,
              stroke: token('--tb-primary'),
              fill: token('--tb-bg-secondary'),
            },
            label: {
              text: symbol,
              fontSize: 22,
              fontWeight: 'bold',
              fill: token('--tb-primary'),
              fontFamily: font,
            },
          },
        },
        true
      );

    gateway('gateway-exclusive', '×');
    gateway('gateway-parallel', '⨁');

    Graph.registerNode(
      'lane',
      {
        inherit: 'rect',
        markup: [
          { tagName: 'rect', selector: 'body' },
          { tagName: 'rect', selector: 'name-rect' },
          { tagName: 'text', selector: 'name-text' },
        ],
        attrs: {
          body: {
            fill: token('--tb-surface'),
            stroke: token('--tb-border-control'),
            strokeWidth: 1,
          },
          'name-rect': {
            width: 240,
            height: 30,
            fill: token('--tb-primary'),
            stroke: token('--tb-primary'),
            strokeWidth: 0,
          },
          'name-text': {
            ref: 'name-rect',
            refX: 0.5,
            refY: 0.5,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fontWeight: 'bold',
            fill: token('--tb-on-primary'),
            fontSize: 12,
            fontFamily: font,
          },
        },
      },
      true
    );

    Graph.registerEdge(
      'bpmn-edge',
      {
        inherit: 'edge',
        attrs: {
          line: {
            stroke: token('--tb-border-control'),
            strokeWidth: 2,
            targetMarker: {
              name: 'classic',
              size: 7,
              fill: token('--tb-text-primary'),
              stroke: token('--tb-text-primary'),
            },
          },
        },
      },
      true
    );

    const graph = new Graph({
      container: element,
      autoResize: true,
      panning: true,
      background: { color: 'transparent' },
      grid: false,
    });

    const cells: Cell[] = [];
    const nodes = new Map<string, Node>();

    for (const item of BPMN_NODES) {
      const node = graph.createNode(item);
      nodes.set(node.id, node);
      cells.push(node);
    }

    for (const item of BPMN_EDGES) {
      const edge = graph.createEdge({
        ...item,
        shape: 'bpmn-edge',
        source: {
          cell: item.source as string,
          anchor: { name: item.from },
          connectionPoint: { name: 'anchor' },
        },
        target: {
          cell: item.target as string,
          anchor: { name: item.to },
          connectionPoint: { name: 'anchor' },
        },
        router: {
          name: 'manhattan',
          args: {
            padding: { top: 8, right: 8, bottom: 8, left: 8 },
            excludeShapes: ['lane'],
            excludeTerminals: ['source', 'target'],
            startDirections: [item.from],
            endDirections: [item.to],
          },
        },
      });

      if (item.label) {
        edge.setLabels([
          {
            attrs: {
              body: { fill: token('--tb-surface') },
              label: {
                text: String(item.label),
                fill: token('--tb-text-secondary'),
                fontSize: 11,
                fontFamily: font,
              },
            },
          },
        ]);
      }

      const sourceParent = nodes.get(String(edge.getSourceCellId()))?.prop('parent');
      const targetParent = nodes.get(String(edge.getTargetCellId()))?.prop('parent');

      if (sourceParent && targetParent && sourceParent !== targetParent) {
        edge.attr('line/strokeDasharray', '5,5');
      }

      cells.push(edge);
    }

    graph.resetCells(cells);

    for (const node of nodes.values()) {
      const parentId = node.prop('parent');
      if (typeof parentId !== 'string') continue;

      const parent = nodes.get(parentId);
      if (parent) parent.addChild(node);
    }

    graph.on('subproc:toggle', ({ node }: { node: Node }) => {
      const data = node.getData() ?? {};
      const expanded = Boolean(data.expanded);
      const next = !expanded;

      node.attr('expand/text', next ? '-' : '+');
      node.attr('details/display', next ? 'block' : 'none');

      if (next) node.attr('details/text', BPMN_DETAILS);

      const lines = BPMN_DETAILS.split(/\n/).length;
      const size = node.getSize();

      node.size(size.width, next ? Math.max(70, 40 + lines * 18 + 24) : 70);

      node.attr('label', {
        textVerticalAnchor: next ? 'top' : 'middle',
        refY: next ? 18 : '50%',
        refX: '50%',
        ref: 'body',
      });

      node.setData({ ...data, expanded: next });
    });

    graph.zoomToFit({ padding: 10, maxScale: 1 });

    return () => graph.dispose();
  }, [theme]);

  return <div ref={ref} style={{ height: 620 }} />;
}

function FlowchartGraph({ theme }: { theme: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.dataset.theme = theme;
    const token = tokenReader(element);

    const graph = new Graph({
      container: element,
      autoResize: true,
      panning: true,
      background: { color: 'transparent' },
      grid: false,
    });

    const label = {
      fill: token('--tb-text-primary'),
      fontFamily: token('--tb-font-text'),
      fontSize: 12,
      fontWeight: 500,
    };

    for (const node of FLOW_NODES) {
      const radius = node.pill ? node.height / 2 : token('--tb-radius-control');

      graph.addNode({
        id: node.id,
        shape: node.diamond ? 'polygon' : 'rect',
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        label: node.label,
        attrs: {
          body: node.diamond
            ? {
                refPoints: '0,10 10,0 20,10 10,20',
                fill: token('--tb-bg-secondary'),
                stroke: token('--tb-border-control'),
                strokeWidth: 1,
              }
            : {
                rx: radius,
                ry: radius,
                fill: token('--tb-bg-secondary'),
                stroke: token('--tb-border-control'),
                strokeWidth: 1,
              },
          label,
        },
      });
    }

    for (const edge of FLOW_EDGES) {
      graph.addEdge({
        source: {
          cell: edge.source,
          anchor: { name: edge.from },
          connectionPoint: { name: 'anchor' },
        },
        target: {
          cell: edge.target,
          anchor: { name: edge.to },
          connectionPoint: { name: 'anchor' },
        },
        router: {
          name: 'manhattan',
          args: {
            padding: { top: 16, right: 16, bottom: 16, left: 16 },
            excludeTerminals: ['source', 'target'],
            startDirections: [edge.from],
            endDirections: [edge.to],
          },
        },
        connector: { name: 'rounded', args: { radius: 8 } },
        attrs: {
          line: {
            stroke: token('--tb-border-control'),
            strokeWidth: 1.5,
            targetMarker: {
              name: 'block',
              size: 7,
              fill: token('--tb-text-primary'),
              stroke: token('--tb-text-primary'),
            },
          },
        },
        labels: edge.label
          ? [
              {
                attrs: {
                  body: { fill: token('--tb-surface') },
                  label: {
                    text: edge.label,
                    fill: token('--tb-text-secondary'),
                    fontSize: 11,
                    fontFamily: token('--tb-font-text'),
                  },
                },
              },
            ]
          : undefined,
      });
    }

    return () => graph.dispose();
  }, [theme]);

  return <div ref={ref} style={{ height: 360 }} />;
}

export const Bpmn: Story = {
  name: 'BPMN',
  parameters: { docs: { source: { code: BPMN_SOURCE } } },
  render: (_args, context) => (
    <div style={frame(880)}>
      <BpmnGraph theme={String(context.globals.theme ?? 'light')} />
    </div>
  ),
};

export const Flowchart: Story = {
  name: 'Flowchart',
  parameters: { docs: { source: { code: FLOWCHART_SOURCE } } },
  render: (_args, context) => (
    <div style={frame(800)}>
      <FlowchartGraph theme={String(context.globals.theme ?? 'light')} />
    </div>
  ),
};
