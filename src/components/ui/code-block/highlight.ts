import { useMemo } from 'react';

// Regex tokenizer, no dependencies. Demo-grade: enough to make the block read
// like code, not a parser. Unknown language renders as plain text.

export type CodeLanguage =
  | 'js'
  | 'ts'
  | 'jsx'
  | 'tsx'
  | 'json'
  | 'css'
  | 'html'
  | 'bash'
  | 'ansi'
  | 'text';

export type CodeTokenKind =
  | 'plain'
  | 'keyword'
  | 'string'
  | 'comment'
  | 'number'
  | 'function'
  | 'tag'
  | 'attr'
  | 'property'
  | 'key';

export interface CodeToken {
  text: string;
  kind: CodeTokenKind;
}

export type CodeLine = CodeToken[];

type Rule = readonly [CodeTokenKind, RegExp];

const r = (kind: CodeTokenKind, pattern: RegExp): Rule => [kind, new RegExp(pattern.source, 'y')];

const KEYWORDS =
  'as|async|await|abstract|break|case|catch|class|const|continue|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|if|implements|import|in|infer|instanceof|interface|keyof|let|namespace|new|of|private|protected|public|readonly|return|satisfies|static|super|switch|this|throw|try|type|typeof|var|void|while|yield';

const jsRules: Rule[] = [
  r('comment', /\/\*[\s\S]*?\*\//),
  r('comment', /\/\/[^\n]*/),
  r('string', /'(?:\\[\s\S]|[^'\\\n])*'/),
  r('string', /"(?:\\[\s\S]|[^"\\\n])*"/),
  r('string', /`(?:\\[\s\S]|[^`\\])*`/),
  r('keyword', new RegExp(`\\b(?:${KEYWORDS})\\b`)),
  r('number', /\b(?:0[xXbBoO][\da-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/),
  r('number', /\b(?:true|false|null|undefined|NaN)\b/),
  r('function', /\b[A-Za-z_$][\w$]*(?=\s*\()/),
];

// JSX tags/attributes on top of the JS rules; generics may false-positive, which
// is an acceptable trade for a demo tokenizer.
const jsxRules: Rule[] = [
  r('tag', /<\/?[A-Za-z][\w.:-]*/),
  r('attr', /[A-Za-z_][\w:-]*(?=\s*=)/),
];

const jsonRules: Rule[] = [
  r('key', /"(?:\\[\s\S]|[^"\\\n])*"(?=\s*:)/),
  r('string', /"(?:\\[\s\S]|[^"\\\n])*"/),
  r('number', /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/),
  r('number', /\b(?:true|false|null)\b/),
];

const cssRules: Rule[] = [
  r('comment', /\/\*[\s\S]*?\*\//),
  r('keyword', /@[\w-]+/),
  r('string', /"[^"\n]*"|'[^'\n]*'/),
  r('number', /#[\da-fA-F]{3,8}\b/),
  r('property', /-{0,2}[A-Za-z][\w-]*(?=\s*:)/),
  r('function', /[A-Za-z-]+(?=\()/),
  r('number', /\b\d+(?:\.\d+)?(?:%|px|rem|em|vh|vw|vmin|vmax|s|ms|deg|fr|ch|ex)?\b/),
];

const htmlRules: Rule[] = [
  r('comment', /<!--[\s\S]*?-->/),
  r('keyword', /<![^>]*>/),
  r('tag', /<\/?[A-Za-z][\w:-]*/),
  r('attr', /[A-Za-z_:][\w:.-]*(?=\s*=)/),
  r('string', /"[^"\n]*"|'[^'\n]*'/),
];

const bashRules: Rule[] = [
  r('comment', /#[^\n]*/),
  r('string', /'[^'\n]*'/),
  r('string', /"(?:\\[\s\S]|[^"\\])*"/),
  r('property', /\$\{[^}]*\}|\$[A-Za-z_]\w*/),
  r(
    'keyword',
    /\b(?:if|then|else|elif|fi|for|while|do|done|case|esac|function|in|export|local|return|exit|source|echo|cd|sudo|git|npm|npx|pnpm|yarn|node|docker|curl|vite)\b/,
  ),
  r('number', /\b\d+(?:\.\d+)?\b/),
];

const aliases: Record<string, CodeLanguage> = {
  javascript: 'js',
  jsx: 'jsx',
  typescript: 'ts',
  tsx: 'tsx',
  jsonc: 'json',
  scss: 'css',
  less: 'css',
  htm: 'html',
  xml: 'html',
  svg: 'html',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  console: 'ansi',
  terminal: 'ansi',
  plaintext: 'text',
  txt: 'text',
};

function normalizeLanguage(language: string): CodeLanguage {
  const value = language.toLowerCase();
  return (aliases[value] ?? value) as CodeLanguage;
}

function rulesFor(language: CodeLanguage): Rule[] {
  switch (language) {
    case 'ts':
    case 'js':
      return jsRules;
    case 'tsx':
    case 'jsx':
      return [...jsRules, ...jsxRules];
    case 'json':
      return jsonRules;
    case 'css':
      return cssRules;
    case 'html':
      return htmlRules;
    case 'bash':
      return bashRules;
    default:
      return [];
  }
}

function tokenizeWith(code: string, rules: Rule[]): CodeToken[] {
  const tokens: CodeToken[] = [];
  let plain = '';
  let position = 0;

  const flush = () => {
    if (plain) {
      tokens.push({ text: plain, kind: 'plain' });
      plain = '';
    }
  };

  while (position < code.length) {
    let matched = false;
    for (const [kind, pattern] of rules) {
      pattern.lastIndex = position;
      const match = pattern.exec(code);
      if (match && match[0].length > 0) {
        if (kind === 'plain') {
          plain += match[0];
        } else {
          flush();
          tokens.push({ text: match[0], kind });
        }
        position += match[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      plain += code[position];
      position += 1;
    }
  }

  flush();
  return tokens;
}

// Basic SGR support: 30-37 / 90-97 foreground, everything else ignored.
function ansiKind(codes: string): CodeTokenKind {
  let kind: CodeTokenKind = 'plain';
  for (const part of codes.split(';')) {
    switch (Number(part)) {
      case 0:
        kind = 'plain';
        break;
      case 31:
      case 35:
      case 91:
      case 95:
        kind = 'keyword';
        break;
      case 32:
      case 92:
        kind = 'string';
        break;
      case 33:
      case 93:
        kind = 'number';
        break;
      case 34:
      case 94:
        kind = 'property';
        break;
      case 36:
      case 96:
        kind = 'attr';
        break;
      case 30:
      case 90:
        kind = 'comment';
        break;
      default:
        break;
    }
  }
  return kind;
}

function tokenizeAnsi(code: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  const escape = /\x1b\[([0-9;]*)m/g;
  let kind: CodeTokenKind = 'plain';
  let index = 0;

  const push = (text: string, tokenKind: CodeTokenKind) => {
    if (text) tokens.push({ text, kind: tokenKind });
  };

  for (let match = escape.exec(code); match; match = escape.exec(code)) {
    push(code.slice(index, match.index), kind);
    kind = ansiKind(match[1]);
    index = match.index + match[0].length;
  }
  push(code.slice(index), kind);

  return tokens;
}

export function tokenizeCode(code: string, language: string = 'text'): CodeLine[] {
  const source = code.replace(/\r\n?/g, '\n');
  const lang = normalizeLanguage(language);
  const tokens = lang === 'ansi' ? tokenizeAnsi(source) : tokenizeWith(source, rulesFor(lang));

  const lines: CodeLine[] = [[]];
  for (const token of tokens) {
    const parts = token.text.split('\n');
    for (let i = 0; i < parts.length; i += 1) {
      if (i > 0) lines.push([]);
      if (parts[i]) lines[lines.length - 1].push({ text: parts[i], kind: token.kind });
    }
  }

  // A trailing newline should not render as an extra blank line.
  if (lines.length > 1 && lines[lines.length - 1].length === 0) lines.pop();
  return lines;
}

export function useHighlightedCode(code: string, language: string = 'text'): CodeLine[] {
  return useMemo(() => tokenizeCode(code, language), [code, language]);
}
