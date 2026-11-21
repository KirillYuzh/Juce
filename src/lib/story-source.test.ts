import { describe, expect, it } from 'vitest';
import { storySource } from './story-source';

const flat = (value: string) => value.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
const same = (source: string, expected: string) =>
  expect(flat(storySource(source))).toBe(flat(expected));

describe('storySource', () => {
  it('keeps generated args snippets untouched', () => {
    const source = '<Button variant="secondary">\n  Как это работает?\n</Button>';
    expect(storySource(source)).toBe(source);
  });

  it('drops the story envelope and layout wrapper', () => {
    same(
      `{
  name: 'Inset radius',
  render: () => <div style={{
    '--tb-radius-parent': 'var(--tb-radius-l)',
    width: 400
  }}>
      <Input size="s" radius="inset" placeholder="Радиус" />
    </div>
}`,
      '<Input size="s" radius="inset" placeholder="Радиус" />'
    );
  });

  it('unwraps a top-level fragment', () => {
    same(
      `{
  render: () => <>
      <Badge>Neutral</Badge>
      <Badge tone="accent">Premium</Badge>
    </>
}`,
      '<Badge>Neutral</Badge><Badge tone="accent">Premium</Badge>'
    );
  });

  it('cuts parameters that follow the render', () => {
    same(
      `{
  render: () => <HomePage />,
  parameters: { viewport: { defaultViewport: 'responsive' } }
}`,
      '<HomePage />'
    );
  });

  it('keeps wrappers that carry a class name', () => {
    same(
      `{
  render: () => <div className="tb-scroll-fade-x" style={{ width: 420 }}>
      <Card />
    </div>
}`,
      '<div className="tb-scroll-fade-x"><Card /></div>'
    );
  });

  it('unwraps layout divs whose children are elements', () => {
    same(
      `{
  render: () => <div style={{ width: 360 }}>
      <p>До раздела</p>
      <Divider />
    </div>
}`,
      '<p>До раздела</p><Divider />'
    );
  });

  it('keeps a div that has its own text', () => {
    same(
      `{
  render: () => <div style={{ width: 360 }}>Просто текст</div>
}`,
      '<div>Просто текст</div>'
    );
  });

  it('keeps markup but drops the style inside a form', () => {
    same(
      `{
  render: () => <form style={{ gap: 12 }} onSubmit={save}>
      <Input value="a > b" />
    </form>
}`,
      '<form onSubmit={save}><Input value="a > b" /></form>'
    );
  });

  it('unwraps nested layout divs', () => {
    same(
      `{
  render: () => <div style={{ width: 560 }}>
      <div style={{ padding: 8 }}>
        <BarChart data={data} />
      </div>
    </div>
}`,
      '<BarChart data={data} />'
    );
  });

  it('leaves block bodies alone', () => {
    const source = `{
  render: () => {
    return <Card />;
  }
}`;
    expect(storySource(source)).toBe(source);
  });
});
