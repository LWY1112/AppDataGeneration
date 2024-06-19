import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    rules: {
      // Example rules: customize according to your project's needs
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'indent': ['error', 2],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      // Add more rules as per requirements
    },
    languageOptions: {
      globals: {
        // Define global variables here if needed
      },
    },
  },
];




