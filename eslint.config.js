import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import boundaries from 'eslint-plugin-boundaries';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', 'storybook-static/**', 'node_modules/**', '.research/**', 'artifacts/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { boundaries, 'react-hooks': reactHooks },
    settings: {
      'boundaries/elements': [
        { type: 'lib', pattern: 'src/lib' },
        { type: 'data', pattern: 'src/data' },
        { type: 'ui', pattern: 'src/components/ui' },
        { type: 'ai', pattern: 'src/components/ai' },
        { type: 'blocks', pattern: 'src/components/blocks' },
        { type: 'sections', pattern: 'src/sections' },
        { type: 'pages', pattern: 'src/pages' },
      ],
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            { from: { element: { type: 'lib' } }, allow: { to: { element: { type: 'lib' } } } },
            {
              from: { element: { type: 'data' } },
              allow: { to: { element: { types: ['lib', 'data'] } } },
            },
            {
              from: { element: { type: 'ui' } },
              allow: { to: { element: { types: ['lib', 'ui'] } } },
            },
            {
              from: { element: { type: 'ai' } },
              allow: { to: { element: { types: ['lib', 'ui', 'ai'] } } },
            },
            {
              from: { element: { type: 'blocks' } },
              allow: { to: { element: { types: ['lib', 'data', 'ui', 'blocks'] } } },
            },
            {
              from: { element: { type: 'sections' } },
              allow: { to: { element: { types: ['lib', 'data', 'ui', 'blocks', 'sections'] } } },
            },
            {
              from: { element: { type: 'pages' } },
              allow: {
                to: {
                  element: { types: ['lib', 'data', 'ui', 'ai', 'blocks', 'sections', 'pages'] },
                },
              },
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/ui/code-block/highlight.ts'],
    rules: { 'no-control-regex': 'off' },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'tools/**'],
    rules: {
      'boundaries/dependencies': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[property.name='skip']",
          message:
            'Не отключай тест через skip: это маскирует регрессию. Исправь причину или удали тест вместе с кодом.',
        },
        {
          selector: "MemberExpression[property.name='only']",
          message:
            'Не оставляй only: остальные тесты перестанут запускаться в CI. Убери only перед коммитом.',
        },
        {
          selector: 'Identifier[name=/^(xit|fit|xtest|ftest|xdescribe|fdescribe)$/]',
          message: 'Отключённый или сфокусированный тест ослабляет проверку. Исправь причину.',
        },
      ],
    },
  }
);
