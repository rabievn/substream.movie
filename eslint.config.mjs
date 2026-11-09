import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*", "!@/features/*/server"],
              message:
                "Import a feature only through its public API: @/features/<name> (or @/features/<name>/server).",
            },
          ],
        },
      ],
    },
  },
  {
    // Inside a feature, relative imports of its own internals are fine;
    // the store composes reducers/APIs from feature public APIs.
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {},
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "src/generated/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
