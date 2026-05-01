const baseRules = {
  eqeqeq: ['error', 'always'],
  curly: ['error', 'all'],
  indent: ['error', 2, { SwitchCase: 1 }],
  'no-tabs': ['error', { allowIndentationTabs: false }],
  'padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: '*', next: ['return', 'throw'] },
    { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
    { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
    { blankLine: 'always', prev: ['if', 'for', 'while', 'switch', 'try'], next: '*' }
  ],
  'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
  'prefer-const': 'warn',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
};

module.exports = { baseRules };
