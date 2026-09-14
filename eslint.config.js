'use strict';

const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        ignores: ['node_modules/**']
    },
    js.configs.recommended,
    {
        files: ['eslint.config.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            globals: {
                ...globals.node
            }
        }
    },
    {
        files: ['www/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            globals: {
                ...globals.browser,
                cordova: 'readonly'
            }
        }
    },
    {
        files: ['test/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...globals.jest,
                window: 'writable'
            }
        }
    }
];
