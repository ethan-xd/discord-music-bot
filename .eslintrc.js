/** @type {import('eslint').Linter.ParserOptions} */
const parserOptions = {
    ecmaVersion: 'latest',
    project: './src/tsconfig.json',
}

/** @type {import('eslint').Linter.Config} */
const config = {
    extends: ['@detachhead/eslint-config'],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
    overrides: [
        {
            files: require('./.app-config.meta.json').generate.map((file) => file.file),
            rules: {
                '@typescript-eslint/no-empty-interface': 'off',
            },
            parserOptions,
        },
        {
            files: ['src/**/*.ts'],
            parserOptions: {
                ecmaVersion: 'latest',
                project: './src/tsconfig.json',
            },
        },
        {
            files: ['tests/**/*.ts'],
            parserOptions: {
                ecmaVersion: 'latest',
                project: './tests/tsconfig.json',
            },
        },
    ],
}

module.exports = config
