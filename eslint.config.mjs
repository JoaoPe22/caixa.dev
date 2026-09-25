import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const eslintConfig = defineConfig([
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['src/tools/*/**/*.{ts,tsx}'],
    ignores: ['src/tools/_core/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/tools/*',
                '@/tools/*/**',
                '!@/tools/_core',
                '!@/tools/_core/**',
              ],
              message:
                'Uma ferramenta nao pode importar outra. Codigo compartilhado vai para @/tools/_core; dentro da propria ferramenta, use caminho relativo.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/tools/*', '@/tools/*/**', '@/components/*'],
              message:
                'shared/ guarda dados e utilidades de dominio puros: nao pode depender de ferramentas nem de componentes.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/lib/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/tools/*',
                '@/tools/*/**',
                '!@/tools/_core',
                '!@/tools/_core/**',
              ],
              message:
                'components/ e lib/ nao conhecem ferramentas: a dependencia e sempre no sentido oposto. Receba os dados por props a partir de src/app/.',
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  eslintConfigPrettier,
])

export default eslintConfig
