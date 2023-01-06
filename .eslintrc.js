module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'react': {
      'version': 'detect'
    }
  },
  plugins: [
    'react-hooks',
    '@typescript-eslint',
    'sort-destructure-keys',
    'jsx-a11y',
    'prettier',
  ],
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'import/extensions': 'off',
    'import/extensions': 0,
    'import/no-cycle': [0, { ignoreExternal: true }],
    'import/no-unresolved': 0,
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
        pathGroups: [
          { group: 'builtin', pattern: 'react', position: 'before' },
          {
            group: 'external',
            pattern:
              '{styled-components,polished,next,next/*,react-dom,sanitize.css}',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'no-use-before-define': 'off',
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react/jsx-label-has-associated-control': 0,
    'react/jsx-sort-props': 2,
    "react/react-in-jsx-scope": "off",
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: false, variables: true },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    "no-constant-binary-expression": "error"
  },
  globals: {
    "React": "writable"
  }
}
