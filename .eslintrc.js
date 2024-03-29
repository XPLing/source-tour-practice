module.exports = {
  extends: '@antfu',
  rules: {
    'no-console': process.env.NODE_ENV !== 'production' ? 0 : 2,
    'no-useless-escape': 0,
    'no-empty': 0,
    '@typescript-eslint/comma-dangle': 0,
    'antfu/if-newline': 0,
    'arrow-parens': 0
  }
}
