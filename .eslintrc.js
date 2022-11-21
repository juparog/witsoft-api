module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  'settings': {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      'typescript': {
        'alwaysTryTypes': true,
      }
    }
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/lines-between-class-members': ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-unresolved': 'error',
    'import/order': [
      'error',
      {
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
				groups: [
					'builtin',
          'external',
          'internal',
          ['sibling', 'parent'],
          'index',
          'unknown',s
        ],
        newlinesBetween: 'always',
				pathGroups: [
					{
						'pattern': '@witsoft/**',
						'group': 'external',
						'position': 'after'
					}
				],
      },
    ],
    'prettier/prettier': 'error',
  }
};
