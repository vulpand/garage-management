module.exports = {
  env: {
    browser: true, // Environment: browser global variables
    node: true, // Environment: Node.js global variables
    es2021: true // Enables ES2021 features (compatible with Node.js 16)
  },
  extends: [
    'eslint:recommended', // Use recommended ESLint rules
    'plugin:prettier/recommended' // Integrate Prettier with ESLint for code formatting
  ],
  parserOptions: {
    ecmaVersion: 12, // Supports ECMAScript 2021 features (ES12)
    sourceType: 'module' // Enables ECMAScript modules (import/export)
  },
  rules: {
    indent: ['error', 2], // Enforce 2-space indentation
    'linebreak-style': ['error', 'unix'], // Enforce Unix-style line endings (LF)
    quotes: ['error', 'single'], // Enforce single quotes for strings
    semi: ['error', 'always'], // Enforce semicolons at the end of statements
    'no-console': 'warn', // Warn when using console.log (for cleaner production code)
    'no-debugger': 'warn', // Warn when using the debugger statement
    'no-var': 'error', // Disallow var, encourage let/const usage
    'prefer-const': 'error', // Prefer const for variables that are not reassigned
    'prefer-arrow-callback': 'error' // Prefer arrow functions as callbacks
  }
};
