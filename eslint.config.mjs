import nextConfig from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  {
    ignores: [
      'coverage/**',
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'public/sw.js',
      'public/swe-worker-*.js',
    ],
  },
  ...nextConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    rules: {
      curly: ['error', 'all'],
      // React Compiler ESLint rule: disabled because the React Compiler is not enabled in this project
      'react-hooks/incompatible-library': 'off',
    },
  },
];

export default eslintConfig;
