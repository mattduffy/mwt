module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'never'],
    'import/extensions': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    'max-len': 'off',
    'object-curly-newline': 'off',
  },
}
