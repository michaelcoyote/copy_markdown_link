// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        // WebExtension API — available as both 'browser' (Firefox) and 'chrome'
        ...globals.browser,
        browser: "readonly",
        chrome: "readonly",
      },
    },

    rules: {
      // --- Possible errors ---
      // "no-console": ["warn", { allow: ["error", "warn", "debug"] }],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",

      // --- Async / Promise hygiene ---
      // Catches the exact bugs in the original: clipboard writes not awaited,
      // and Promise-returning functions called without await or .catch()
      "no-floating-promises": "off",          // needs @typescript-eslint; noted below
      "require-await": "error",               // async fns must actually await something
      "no-async-promise-executor": "error",

      // --- Best practices ---
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-var": "error",
      "prefer-const": "error",
      "prefer-template": "error",             // enforce template literals (already used)
      "object-shorthand": ["error", "always"],
      "no-implicit-globals": "error",         // catches accidental globals like the `tabs` bug
      "no-shadow": "error",                   // prevents inner `tab` shadowing outer `tab`

      // --- Style (non-opinionated, just consistency) ---
      "semi": ["error", "always"],
      "quotes": ["error", "double", { avoidEscape: true }],
      "indent": ["error", 2, { SwitchCase: 1 }],
      "comma-dangle": ["error", "always-multiline"],
      "eol-last": ["error", "always"],
      "no-trailing-spaces": "error",
      "space-before-function-paren": ["error", { anonymous: "never", named: "never", asyncArrow: "always" }],
    },
  },

  // --- Test files ---
  {
    files: ["test/**/*.js", "**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
        // jest-webextension-mock injects these
        chrome: "readonly",
        browser: "readonly",
      },
    },
    rules: {
      // Relax for tests
      "no-console": "off",
    },
  },
];

