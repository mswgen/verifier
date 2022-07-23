module.exports = {
  'env': {
    'browser': true,
    'es2022': true,
    'node': true,
    'mongo': true,
    'serviceworker': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  },
  'reportUnusedDisableDirectives': true
}
