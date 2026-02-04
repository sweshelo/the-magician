import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  globalIgnores(["src/submodule/**/*"]),
  {
    rules: {
      // `as unknown as` パターンを禁止
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSAsExpression > TSUnknownKeyword",
          message: "`as unknown as` is prohibited. Use proper type guards or generics instead.",
        },
      ],
    },
  },
]);

export default eslintConfig;
