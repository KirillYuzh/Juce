const RENDER = /(^|\n)\s*render:\s*\(\)\s*=>\s*/;

export function storySource(source: string): string {
  const match = RENDER.exec(source);
  if (!match) return source;
  const body = source.slice(match.index + match[0].length);
  const end = jsxEnd(body);
  if (end < 0) return source;
  const jsx = body
    .slice(0, end)
    .trim()
    .replace(/^\(\s*/, '');
  return tidy(clean(jsx));
}

function jsxEnd(text: string): number {
  let index = 0;
  while (index < text.length && /\s/.test(text[index])) index += 1;
  if (text[index] !== '<' && !(text[index] === '(' && text[index + 1] === '<')) return -1;
  let depth = 0;
  while (index < text.length) {
    if (text[index] === '<' && /[A-Za-z/>]/.test(text[index + 1] ?? '')) {
      const end = tagEnd(text, index);
      if (end < 0) return -1;
      const tag = text.slice(index, end);
      if (/^<\s*\//.test(tag)) depth -= 1;
      else if (!/\/\s*>$/.test(tag)) depth += 1;
      index = end;
      if (depth === 0) return index;
    } else if (text[index] === '{') {
      const end = braceEnd(text, index);
      if (end < 0) return -1;
      index = end;
    } else {
      index += 1;
    }
  }
  return -1;
}

function tagEnd(text: string, from: number): number {
  let index = from + 1;
  while (index < text.length) {
    const char = text[index];
    if (char === '"' || char === "'" || char === '`') {
      const end = stringEnd(text, index);
      if (end < 0) return -1;
      index = end;
    } else if (char === '{') {
      const end = braceEnd(text, index);
      if (end < 0) return -1;
      index = end;
    } else if (char === '>') {
      return index + 1;
    } else {
      index += 1;
    }
  }
  return -1;
}

function braceEnd(text: string, from: number): number {
  let depth = 0;
  let index = from;
  while (index < text.length) {
    const char = text[index];
    if (char === '"' || char === "'" || char === '`') {
      const end = stringEnd(text, index);
      if (end < 0) return -1;
      index = end;
    } else if (char === '{') {
      depth += 1;
      index += 1;
    } else if (char === '}') {
      depth -= 1;
      index += 1;
      if (depth === 0) return index;
    } else {
      index += 1;
    }
  }
  return -1;
}

function stringEnd(text: string, from: number): number {
  const quote = text[from];
  let index = from + 1;
  while (index < text.length) {
    if (text[index] === '\\') {
      index += 2;
      continue;
    }
    if (text[index] === quote) return index + 1;
    index += 1;
  }
  return -1;
}

interface Tag {
  start: number;
  end: number;
  closing: boolean;
  selfClosing: boolean;
}

function tags(text: string): Tag[] {
  const result: Tag[] = [];
  let index = 0;
  while (index < text.length) {
    if (text[index] === '<' && /[A-Za-z/>]/.test(text[index + 1] ?? '')) {
      const end = tagEnd(text, index);
      if (end < 0) break;
      const tag = text.slice(index, end);
      result.push({
        start: index,
        end,
        closing: /^<\s*\//.test(tag),
        selfClosing: /\/\s*>$/.test(tag),
      });
      index = end;
    } else if (text[index] === '{') {
      const end = braceEnd(text, index);
      if (end < 0) break;
      index = end;
    } else {
      index += 1;
    }
  }
  return result;
}

function clean(jsx: string): string {
  let current = unwrapFragment(jsx);
  for (let pass = 0; pass < 32; pass += 1) {
    const next = unwrapLayoutDiv(stripStyles(current));
    if (next === current) return current;
    current = next;
  }
  return current;
}

function unwrapFragment(jsx: string): string {
  const trimmed = jsx.trim();
  if (!trimmed.startsWith('<>')) return trimmed;
  const open = tagEnd(trimmed, 0);
  const close = trimmed.lastIndexOf('</>');
  if (open < 0 || close < 0) return trimmed;
  return dedent(trimmed.slice(open, close));
}

function dedent(text: string): string {
  const lines = text.split('\n');
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => (/^ */.exec(line) ?? [''])[0].length);
  const pad = indents.length > 0 ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(pad)).join('\n');
}

function tidy(text: string): string {
  const lines = text.replace(/[ \t]+$/gm, '').split('\n');
  while (lines.length > 0 && !lines[0].trim()) lines.shift();
  while (lines.length > 0 && !lines[lines.length - 1].trim()) lines.pop();
  return dedent(lines.join('\n')).trim();
}

function stripStyles(jsx: string): string {
  const edits: Array<[number, number]> = [];
  for (const tag of tags(jsx)) {
    const text = jsx.slice(tag.start, tag.end);
    const match = /\sstyle\s*=\s*\{/.exec(text);
    if (!match) continue;
    const valueStart = tag.start + match.index + match[0].lastIndexOf('{');
    const valueEnd = braceEnd(jsx, valueStart);
    if (valueEnd < 0) continue;
    edits.push([tag.start + match.index, valueEnd]);
  }
  let result = jsx;
  for (const [start, end] of edits.reverse()) {
    result = result.slice(0, start) + result.slice(end);
  }
  return result;
}

function unwrapLayoutDiv(jsx: string): string {
  const stack: Array<{ name: string; start: number; end: number }> = [];
  for (const tag of tags(jsx)) {
    const text = jsx.slice(tag.start, tag.end);
    if (tag.closing) {
      const open = stack.pop();
      if (!open || open.name !== 'div') continue;
      if (!/^<\/\s*div\s*>$/.test(text)) continue;
      const attrs = jsx
        .slice(open.start, open.end)
        .replace(/^<\s*div/, '')
        .replace(/>$/, '')
        .trim();
      if (attrs !== '') continue;
      const inner = jsx.slice(open.end, tag.start);
      if (hasText(inner)) continue;
      return jsx.slice(0, open.start) + inner + jsx.slice(tag.end);
    } else if (!tag.selfClosing) {
      const name = (/^<\s*([A-Za-z][\w.-]*)/.exec(text) ?? [])[1] ?? '';
      stack.push({ name, start: tag.start, end: tag.end });
    }
  }
  return jsx;
}

function hasText(content: string): boolean {
  let index = 0;
  while (index < content.length) {
    if (content[index] === '<' && /[A-Za-z/>]/.test(content[index + 1] ?? '')) {
      const end = elementEnd(content, index);
      if (end < 0) return true;
      index = end;
    } else if (content[index] === '{') {
      const end = braceEnd(content, index);
      if (end < 0) return true;
      index = end;
    } else if (/\s/.test(content[index])) {
      index += 1;
    } else {
      return true;
    }
  }
  return false;
}

function elementEnd(text: string, from: number): number {
  let depth = 0;
  let index = from;
  while (index < text.length) {
    if (text[index] === '<' && /[A-Za-z/>]/.test(text[index + 1] ?? '')) {
      const end = tagEnd(text, index);
      if (end < 0) return -1;
      const tag = text.slice(index, end);
      if (/^<\s*\//.test(tag)) {
        depth -= 1;
        index = end;
        if (depth === 0) return index;
      } else if (/\/\s*>$/.test(tag)) {
        index = end;
        if (depth === 0) return index;
      } else {
        depth += 1;
        index = end;
      }
    } else if (text[index] === '{') {
      const end = braceEnd(text, index);
      if (end < 0) return -1;
      index = end;
    } else {
      index += 1;
    }
  }
  return -1;
}
