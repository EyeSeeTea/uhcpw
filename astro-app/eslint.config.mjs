import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import astroPlugin from "eslint-plugin-astro";

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...astroPlugin.configs.recommended,
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
    },
    {
        ignores: ["dist/", "node_modules/", ".astro/"],
    },
];
