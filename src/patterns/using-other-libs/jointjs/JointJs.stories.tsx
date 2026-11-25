import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { dia, shapes } from '@joint/core';

const meta: Meta = {
  title: 'Patterns/Using other libs/jointjs',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компактные примеры на JointJS (@joint/core): модель данных с таблицами и org chart по мотивам официального примера Organization chart. Библиотека подключена напрямую, без обёрток; вместо платного JointJS+ — стандартные прямоугольники и связи. Названия таблиц и колонок переведены на русский, цвета, шрифт и радиус читаются из токенов контейнера, тема контейнера задаётся через data-theme, поэтому граф пересобирается при смене темы.',
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
  | '--tb-bg'
  | '--tb-bg-secondary'
  | '--tb-surface'
  | '--tb-text-primary'
  | '--tb-text-secondary'
  | '--tb-border'
  | '--tb-border-control'
  | '--tb-font-text'
  | '--tb-radius-control';

const tokenReader = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  return (name: ThemeToken) => style.getPropertyValue(name).trim();
};

const TABLE_WIDTH = 200;
const HEADER_HEIGHT = 36;
const ROW_HEIGHT = 22;

type Column = [name: string, type: string];

const TABLES: Array<{ id: string; x: number; y: number; title: string; columns: Column[] }> = [
  {
    id: 'users',
    x: 32,
    y: 120,
    title: 'сотрудники',
    columns: [
      ['код', 'UUID'],
      ['почта', 'текст'],
      ['имя', 'текст'],
    ],
  },
  {
    id: 'orders',
    x: 336,
    y: 40,
    title: 'заказы',
    columns: [
      ['код', 'UUID'],
      ['код_сотрудника', 'UUID'],
    ],
  },
  {
    id: 'products',
    x: 336,
    y: 228,
    title: 'товары',
    columns: [
      ['код', 'UUID'],
      ['название', 'текст'],
      ['цена', 'число'],
    ],
  },
];

const RELATIONS: Array<{
  source: string;
  target: string;
  from: AnchorSide;
  to: AnchorSide;
  label: string;
}> = [
  { source: 'users', target: 'orders', from: 'right', to: 'left', label: '1:N' },
  { source: 'users', target: 'products', from: 'right', to: 'left', label: 'N:M' },
];

type AnchorSide = 'left' | 'right' | 'top' | 'bottom';

const ORG_NODES: Array<{ id: string; x: number; y: number; label: string; role: string }> = [
  { id: 'director', x: 290, y: 30, label: 'Директор', role: 'Правление' },
  { id: 'dev', x: 150, y: 150, label: 'Разработка', role: 'Отдел' },
  { id: 'sales', x: 430, y: 150, label: 'Продажи', role: 'Отдел' },
  { id: 'platform', x: 40, y: 270, label: 'Платформа', role: 'Команда' },
  { id: 'mobile', x: 220, y: 270, label: 'Мобильные', role: 'Команда' },
  { id: 'support', x: 430, y: 270, label: 'Поддержка', role: 'Команда' },
];

const ORG_LINKS: Array<{ source: string; target: string }> = [
  { source: 'director', target: 'dev' },
  { source: 'director', target: 'sales' },
  { source: 'dev', target: 'platform' },
  { source: 'dev', target: 'mobile' },
  { source: 'sales', target: 'support' },
];

const ORG_WIDTH = 160;
const ORG_HEIGHT = 54;

const DATA_MODEL_SOURCE = `import { useEffect, useRef } from 'react';
import { dia, shapes } from '@joint/core';

const TABLES = [
  { id: 'users', x: 32, y: 120, title: 'сотрудники', columns: [['код', 'UUID'], ['почта', 'текст'], ['имя', 'текст']] },
  { id: 'orders', x: 336, y: 40, title: 'заказы', columns: [['код', 'UUID'], ['код_сотрудника', 'UUID']] },
  { id: 'products', x: 336, y: 228, title: 'товары', columns: [['код', 'UUID'], ['название', 'текст'], ['цена', 'число']] },
];

const RELATIONS = [
  { source: 'users', target: 'orders', from: 'right', to: 'left', label: '1:N' },
  { source: 'users', target: 'products', from: 'right', to: 'left', label: 'N:M' },
];

function DataModel({ theme }) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.dataset.theme = theme;
    const token = (name) => getComputedStyle(container).getPropertyValue(name).trim();
    const font = token('--tb-font-text');

    const graph = new dia.Graph({}, { cellNamespace: shapes });
    const paper = new dia.Paper({
      el: container,
      model: graph,
      width: '100%',
      height: 400,
      gridSize: 1,
      background: { color: token('--tb-surface') },
      cellViewNamespace: shapes,
    });

    const table = ({ id, x, y, title, columns }) =>
      new shapes.standard.Rectangle({
        id,
        position: { x, y },
        size: { width: 200, height: 36 + columns.length * 22 + 10 },
        markup: [
          { tagName: 'rect', selector: 'body' },
          { tagName: 'line', selector: 'rule' },
          { tagName: 'text', selector: 'title' },
          ...columns.flatMap((_, index) => [
            { tagName: 'text', selector: 'name-' + index },
            { tagName: 'text', selector: 'type-' + index },
          ]),
        ],
        attrs: {
          body: {
            rx: token('--tb-radius-control'),
            fill: token('--tb-bg-secondary'),
            stroke: token('--tb-border-control'),
          },
          rule: { x1: 0, y1: 36, x2: 200, y2: 36, stroke: token('--tb-border') },
          title: {
            text: title,
            ref: 'body',
            refX: 12,
            refY: 18,
            textVerticalAnchor: 'middle',
            fill: token('--tb-text-primary'),
            fontFamily: font,
            fontSize: 13,
            fontWeight: 600,
          },
          ...Object.fromEntries(
            columns.flatMap(([name, type], index) => {
              const rowY = 36 + 22 * index + 12;

              return [
                [
                  'name-' + index,
                  {
                    text: name,
                    ref: 'body',
                    refX: 12,
                    refY: rowY,
                    textVerticalAnchor: 'middle',
                    fill: token('--tb-text-primary'),
                    fontFamily: font,
                    fontSize: 12,
                  },
                ],
                [
                  'type-' + index,
                  {
                    text: type,
                    ref: 'body',
                    refX: '100%',
                    x: -12,
                    refY: rowY,
                    textAnchor: 'end',
                    textVerticalAnchor: 'middle',
                    fill: token('--tb-text-secondary'),
                    fontFamily: font,
                    fontSize: 12,
                  },
                ],
              ];
            })
          ),
        },
      });

    const link = ({ source, target, from, to, label }) =>
      new shapes.standard.Link({
        source: {
          id: source,
          anchor: { name: from },
          connectionPoint: { name: 'anchor' },
        },
        target: {
          id: target,
          anchor: { name: to },
          connectionPoint: { name: 'anchor' },
        },
        router: {
          name: 'manhattan',
          args: { padding: 12, startDirections: [from], endDirections: [to] },
        },
        connector: { name: 'rounded', args: { radius: 8 } },
        attrs: {
          line: {
            stroke: token('--tb-border-control'),
            strokeWidth: 1.5,
            targetMarker: {
              type: 'path',
              d: 'M 0 0 L 10 -5 L 7.5 0 L 10 5 Z',
              fill: token('--tb-text-primary'),
              stroke: 'none',
            },
          },
        },
        labels: [
          {
            position: 0.5,
            attrs: {
              rect: { fill: token('--tb-surface') },
              text: {
                text: label,
                fill: token('--tb-text-secondary'),
                fontFamily: font,
                fontSize: 11,
              },
            },
          },
        ],
      });

    graph.resetCells([...RELATIONS.map(link), ...TABLES.map(table)]);

    return () => {
      paper.remove();
    };
  }, [theme]);

  return <div ref={ref} style={{ height: 400 }} />;
}`;

const ORG_SOURCE = `import { useEffect, useRef } from 'react';
import { dia, shapes } from '@joint/core';

const ORG_NODES = [
  { id: 'director', x: 290, y: 30, label: 'Директор', role: 'Правление' },
  { id: 'dev', x: 150, y: 150, label: 'Разработка', role: 'Отдел' },
  { id: 'sales', x: 430, y: 150, label: 'Продажи', role: 'Отдел' },
  { id: 'platform', x: 40, y: 270, label: 'Платформа', role: 'Команда' },
  { id: 'mobile', x: 220, y: 270, label: 'Мобильные', role: 'Команда' },
  { id: 'support', x: 430, y: 270, label: 'Поддержка', role: 'Команда' },
];

const ORG_LINKS = [
  { source: 'director', target: 'dev' },
  { source: 'director', target: 'sales' },
  { source: 'dev', target: 'platform' },
  { source: 'dev', target: 'mobile' },
  { source: 'sales', target: 'support' },
];

function OrgChart({ theme }) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.dataset.theme = theme;
    const token = (name) => getComputedStyle(container).getPropertyValue(name).trim();
    const font = token('--tb-font-text');

    const graph = new dia.Graph({}, { cellNamespace: shapes });
    const paper = new dia.Paper({
      el: container,
      model: graph,
      width: '100%',
      height: 360,
      gridSize: 1,
      background: { color: token('--tb-surface') },
      cellViewNamespace: shapes,
    });

    const nodes = ORG_NODES.map(
      (node) =>
        new shapes.standard.Rectangle({
          id: node.id,
          position: { x: node.x, y: node.y },
          size: { width: 160, height: 54 },
          markup: [
            { tagName: 'rect', selector: 'body' },
            { tagName: 'text', selector: 'name' },
            { tagName: 'text', selector: 'role' },
          ],
          attrs: {
            body: {
              rx: token('--tb-radius-control'),
              ry: token('--tb-radius-control'),
              fill: token('--tb-bg-secondary'),
              stroke: token('--tb-border-control'),
              strokeWidth: 1,
            },
            name: {
              text: node.label,
              ref: 'body',
              refX: '50%',
              refY: 20,
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
              fill: token('--tb-text-primary'),
              fontFamily: font,
              fontSize: 13,
              fontWeight: 600,
            },
            role: {
              text: node.role,
              ref: 'body',
              refX: '50%',
              refY: 38,
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
              fill: token('--tb-text-secondary'),
              fontFamily: font,
              fontSize: 11,
            },
          },
        })
    );

    const links = ORG_LINKS.map(
      (link) =>
        new shapes.standard.Link({
          source: {
            id: link.source,
            anchor: { name: 'bottom' },
            connectionPoint: { name: 'anchor' },
          },
          target: {
            id: link.target,
            anchor: { name: 'top' },
            connectionPoint: { name: 'anchor' },
          },
          router: {
            name: 'manhattan',
            args: { padding: 12, startDirections: ['bottom'], endDirections: ['top'] },
          },
          connector: { name: 'rounded', args: { radius: 6 } },
          attrs: {
            line: {
              stroke: token('--tb-border-control'),
              strokeWidth: 1.5,
              targetMarker: {
                type: 'path',
                d: 'M 0 0 L 10 -5 L 7.5 0 L 10 5 Z',
                fill: token('--tb-text-primary'),
                stroke: 'none',
              },
            },
          },
        })
    );

    graph.resetCells([...links, ...nodes]);

    return () => {
      paper.remove();
    };
  }, [theme]);

  return <div ref={ref} style={{ height: 360 }} />;
}`;

function DataModelCanvas({ theme }: { theme: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.dataset.theme = theme;
    const token = tokenReader(container);
    const font = token('--tb-font-text');

    const graph = new dia.Graph({}, { cellNamespace: shapes });
    const paper = new dia.Paper({
      el: container,
      model: graph,
      width: '100%',
      height: 400,
      gridSize: 1,
      background: { color: token('--tb-surface') },
      cellViewNamespace: shapes,
    });

    const tableCell = (table: (typeof TABLES)[number]) => {
      const height = HEADER_HEIGHT + table.columns.length * ROW_HEIGHT + 10;

      const rowMarkup = table.columns.flatMap((_, index) => [
        { tagName: 'text', selector: `name-${index}` },
        { tagName: 'text', selector: `type-${index}` },
      ]);

      const rowAttrs = Object.fromEntries(
        table.columns.flatMap(([name, type], index) => {
          const y = HEADER_HEIGHT + ROW_HEIGHT * index + 12;

          return [
            [
              `name-${index}`,
              {
                text: name,
                ref: 'body',
                refX: 12,
                refY: y,
                textAnchor: 'start',
                textVerticalAnchor: 'middle',
                fill: token('--tb-text-primary'),
                fontFamily: font,
                fontSize: 12,
              },
            ],
            [
              `type-${index}`,
              {
                text: type,
                ref: 'body',
                refX: '100%',
                x: -12,
                refY: y,
                textAnchor: 'end',
                textVerticalAnchor: 'middle',
                fill: token('--tb-text-secondary'),
                fontFamily: font,
                fontSize: 12,
              },
            ],
          ];
        })
      );

      return new shapes.standard.Rectangle({
        id: table.id,
        position: { x: table.x, y: table.y },
        size: { width: TABLE_WIDTH, height },
        markup: [
          { tagName: 'rect', selector: 'body' },
          { tagName: 'line', selector: 'rule' },
          { tagName: 'text', selector: 'title' },
          ...rowMarkup,
        ],
        attrs: {
          body: {
            rx: token('--tb-radius-control'),
            ry: token('--tb-radius-control'),
            fill: token('--tb-bg-secondary'),
            stroke: token('--tb-border-control'),
            strokeWidth: 1,
          },
          rule: {
            x1: 0,
            y1: HEADER_HEIGHT,
            x2: TABLE_WIDTH,
            y2: HEADER_HEIGHT,
            stroke: token('--tb-border'),
          },
          title: {
            text: table.title,
            ref: 'body',
            refX: 12,
            refY: 18,
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            fill: token('--tb-text-primary'),
            fontFamily: font,
            fontSize: 13,
            fontWeight: 600,
          },
          ...rowAttrs,
        },
      });
    };

    const links = RELATIONS.map(
      (relation) =>
        new shapes.standard.Link({
          source: {
            id: relation.source,
            anchor: { name: relation.from },
            connectionPoint: { name: 'anchor' },
          },
          target: {
            id: relation.target,
            anchor: { name: relation.to },
            connectionPoint: { name: 'anchor' },
          },
          attrs: {
            line: {
              stroke: token('--tb-border-control'),
              strokeWidth: 1.5,
              targetMarker: {
                type: 'path',
                d: 'M 0 0 L 10 -5 L 7.5 0 L 10 5 Z',
                fill: token('--tb-text-primary'),
                stroke: 'none',
              },
            },
          },
          router: {
            name: 'manhattan',
            args: { padding: 12, startDirections: [relation.from], endDirections: [relation.to] },
          },
          connector: { name: 'rounded', args: { radius: 8 } },
          labels: [
            {
              position: 0.5,
              attrs: {
                rect: { fill: token('--tb-surface') },
                text: {
                  text: relation.label,
                  fill: token('--tb-text-secondary'),
                  fontFamily: font,
                  fontSize: 11,
                },
              },
            },
          ],
        })
    );

    graph.resetCells([...links, ...TABLES.map(tableCell)]);

    return () => {
      paper.remove();
    };
  }, [theme]);

  return <div ref={ref} style={{ height: 400 }} />;
}

function OrgChartCanvas({ theme }: { theme: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.dataset.theme = theme;
    const token = tokenReader(container);
    const font = token('--tb-font-text');

    const graph = new dia.Graph({}, { cellNamespace: shapes });
    const paper = new dia.Paper({
      el: container,
      model: graph,
      width: '100%',
      height: 360,
      gridSize: 1,
      background: { color: token('--tb-surface') },
      cellViewNamespace: shapes,
    });

    const nodes = ORG_NODES.map(
      (node) =>
        new shapes.standard.Rectangle({
          id: node.id,
          position: { x: node.x, y: node.y },
          size: { width: ORG_WIDTH, height: ORG_HEIGHT },
          markup: [
            { tagName: 'rect', selector: 'body' },
            { tagName: 'text', selector: 'name' },
            { tagName: 'text', selector: 'role' },
          ],
          attrs: {
            body: {
              rx: token('--tb-radius-control'),
              ry: token('--tb-radius-control'),
              fill: token('--tb-bg-secondary'),
              stroke: token('--tb-border-control'),
              strokeWidth: 1,
            },
            name: {
              text: node.label,
              ref: 'body',
              refX: '50%',
              refY: 20,
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
              fill: token('--tb-text-primary'),
              fontFamily: font,
              fontSize: 13,
              fontWeight: 600,
            },
            role: {
              text: node.role,
              ref: 'body',
              refX: '50%',
              refY: 38,
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
              fill: token('--tb-text-secondary'),
              fontFamily: font,
              fontSize: 11,
            },
          },
        })
    );

    const links = ORG_LINKS.map(
      (link) =>
        new shapes.standard.Link({
          source: {
            id: link.source,
            anchor: { name: 'bottom' },
            connectionPoint: { name: 'anchor' },
          },
          target: {
            id: link.target,
            anchor: { name: 'top' },
            connectionPoint: { name: 'anchor' },
          },
          router: {
            name: 'manhattan',
            args: { padding: 12, startDirections: ['bottom'], endDirections: ['top'] },
          },
          connector: { name: 'rounded', args: { radius: 6 } },
          attrs: {
            line: {
              stroke: token('--tb-border-control'),
              strokeWidth: 1.5,
              targetMarker: {
                type: 'path',
                d: 'M 0 0 L 10 -5 L 7.5 0 L 10 5 Z',
                fill: token('--tb-text-primary'),
                stroke: 'none',
              },
            },
          },
        })
    );

    graph.resetCells([...links, ...nodes]);

    return () => {
      paper.remove();
    };
  }, [theme]);

  return <div ref={ref} style={{ height: 360 }} />;
}

export const DataModel: Story = {
  name: 'Data model',
  parameters: {
    docs: {
      description: {
        story:
          'Схема сущностей и связей: таблицы с типизированными колонками и подписями кардинальности. Связи идут от середины правой стороны сотрудников к середине левой стороны заказов и товаров; наконечники непрозрачные, плашки подписей залиты токеном поверхности.',
      },
      source: { code: DATA_MODEL_SOURCE },
    },
  },
  render: (_args, context) => (
    <div style={frame(720)}>
      <DataModelCanvas theme={String(context.globals.theme ?? 'light')} />
    </div>
  ),
};

export const OrgChart: Story = {
  name: 'Org chart',
  parameters: {
    docs: {
      description: {
        story:
          'Компактная реплика официального примера Organization chart: иерархия из шести узлов, связи идут от середины нижней стороны к середине верхней. JointJS+ содержит готовый shapes.org, в открытом @joint/core его нет, поэтому узлы собраны из standard.Rectangle.',
      },
      source: { code: ORG_SOURCE },
    },
  },
  render: (_args, context) => (
    <div style={frame(680)}>
      <OrgChartCanvas theme={String(context.globals.theme ?? 'light')} />
    </div>
  ),
};
