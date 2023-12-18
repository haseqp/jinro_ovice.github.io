module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended",
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
      "react",
      "import", 
      "unused-imports"
    ],
    "rules": {
      "semi": ["error", "always"],
      "semi-spacing": ["error", {"after": true, "before": false}],
      "semi-style": ["error", "last"],
      "no-extra-semi": "error",
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      "@typescript-eslint/no-unused-vars": "off",
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'unused-imports/no-unused-imports-ts': 2,
      'import/no-extraneous-dependencies': 'error',
      'no-restricted-imports': [
        'error',
        {
          name: 'lodash',
          message:
            'Use lodash/**** instead. Because the bundle size is unnecessarily large.'
        }
      ]
    }
}
