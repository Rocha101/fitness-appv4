import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  // TypeScript override
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          "./tsconfig.json",
          "./apps/*/tsconfig.json",
          "./packages/*/tsconfig.json",
        ],
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },
    plugins: { "@typescript-eslint": typescript },
    rules: {
      ...prettier.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreParameterProperties: true },
      ],
    },
  },
  // Ignore config / CJS files
  {
    files: ["*.config.cjs", "*.config.js", "*.cjs", "eslint.config.mjs"],
    languageOptions: {
      parser: null,
    },
  },
];
