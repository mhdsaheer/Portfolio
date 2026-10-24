import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

/** Next.js's own rules - React, hooks, accessibility and Core Web Vitals - plus its TypeScript set. */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The vendored UnicornStudio library: minified third-party code, not ours to lint
    "public/**",
  ]),
])
