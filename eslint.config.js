const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const { includeIgnoreFile } = require("@eslint/compat");
const { resolve } = require("path");

module.exports = [
  includeIgnoreFile(resolve(__dirname, ".gitignore")),
  ...tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
    rules: {
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-useless-constructor": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "func-style": ["error", "declaration"],
      "lines-between-class-members": ["error", "always"],
      "no-useless-constructor": "off",
      "no-unused-vars": "off",
    },
    ignores: ["**/.prettierrc.js", "**/cli.js", "**/jest.config.js"],
  }),
];
