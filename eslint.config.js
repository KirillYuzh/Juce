import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import boundaries from 'eslint-plugin-boundaries';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'dist-demo/**',
      'storybook-static/**',
      'node_modules/**',
      '.research/**',
      'artifacts/**',
      'tools/rules/fixtures/**',
      'tools/fixtures/**',
    ],
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
        { type: 'prebuilt', pattern: 'src/components/prebuilt' },
        { type: 'blocks', pattern: 'src/components/blocks' },
        { type: 'patterns', pattern: 'src/patterns' },
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
              from: { element: { type: 'prebuilt' } },
              allow: { to: { element: { types: ['lib', 'ui', 'prebuilt'] } } },
            },
            {
              from: { element: { type: 'blocks' } },
              allow: { to: { element: { types: ['lib', 'data', 'ui', 'prebuilt', 'blocks'] } } },
            },
            {
              from: { element: { type: 'patterns' } },
              allow: { to: { element: { types: ['lib', 'ui', 'prebuilt'] } } },
            },
            {
              from: { element: { type: 'pages' } },
              allow: {
                to: {
                  element: {
                    types: ['lib', 'data', 'ui', 'prebuilt', 'ai', 'blocks', 'patterns', 'pages'],
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@antv/*', '@joint/*'],
              message:
                'Сторонняя библиотека живёт только в src/patterns/using-other-libs: там её и показываем, без обёртки в компонентах кита.',
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
          selector:
            "CallExpression[callee.object.name=/^(it|test|describe)$/][callee.property.name='skip']",
          message:
            'Не отключай тест через skip: это маскирует регрессию. Исправь причину или удали тест вместе с кодом.',
        },
        {
          selector:
            "CallExpression[callee.object.name=/^(it|test|describe)$/][callee.property.name='only']",
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
