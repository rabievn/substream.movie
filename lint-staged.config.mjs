const lintStagedConfig = {
  "*.{ts,tsx,mjs,js}": ["eslint --fix", "prettier --write"],
  "*.scss": ["stylelint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"],
};

export default lintStagedConfig;
