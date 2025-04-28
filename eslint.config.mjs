import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,{
        rules: {
            'comma-dangle': ['error', 'never'],
            'indent-legacy': ['error', 4],
            'max-len': ['error', { 'code': 160 }],
            'no-var': 'error',
            'object-curly-spacing': ['error', 'always'],
            'prefer-const': ['error', { 'ignoreReadBeforeAssign': true }],
            'quotes': ['error', 'single', { 'avoidEscape': true }],
            'semi': ['error', 'always'],
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'no-trailing-spaces': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off'
        }
    }
];