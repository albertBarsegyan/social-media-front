import fsd from "@feature-sliced/steiger-plugin"
import { defineConfig } from "steiger"

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Next.js reserves `app` and `pages`, so the FSD layers are prefixed with `_`.
    // Steiger's layer detection accepts the prefix; only this rule doesn't.
    files: ["./src/_app/**", "./src/_pages/**"],
    rules: { "fsd/typo-in-layer-name": "off" },
  },
  {
    // Single-use widgets were merged into their pages (FSD v2.1 pages-first).
    // Features and entities stay sliced on purpose: they name business actions
    // and objects that are expected to gain more consumers.
    files: ["./src/features/**", "./src/entities/**"],
    rules: { "fsd/insignificant-slice": "off" },
  },
])
