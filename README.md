# express-ts-boilerplate

## Tech stack used as follows

- [ExpressJS](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [SCSS](https://sass-lang.com/) - [PicoCss](https://picocss.com/)
- [PugJS](https://pugjs.org/api/getting-started.html)

### ExpressJS

As the name already says, this boilerplate uses [Express](https://expressjs.com/) as the goto server framework.

### Typescript

[Typescript](https://www.typescriptlang.org/) setup is kept fairly simple by using only a few selected flags that I personally find useful

```json
{
    "compilerOptions": {
        "module": "CommonJS",
        "target": "ES2022",
        "lib": [
            "ES2022",
        ],
        "outDir": "dist",
        "moduleResolution": "node",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "removeComments": true
    },
    "ts-node": {
        "files": true
    },
    "include": [
        "src/**/*.ts"
    ],
    "exclude": [
        "node_modules",
        "dist",
    ]
}
```
Since the engine and `.nvmrc` file are set to at least Node version 18 we can make use of ES2022 both as target and library version.

### Eslint

The [Eslint](https://eslint.org/) config if pretty much only the recommended stuff from `eslint:recommended` and `@typescript-eslint/recommended` with a few custom rules and plugins applied to it.

```json
{
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "sourceType": "module",
        "project": "./tsconfig.eslint.json"
    },
    "plugins": [
        "prettier",
        "@typescript-eslint",
        "unicorn",
        "import",
        "unused-imports"
    ],
    "rules": {
        "prettier/prettier": [
            "error",
            {
                "endOfLine": "auto"
            }
        ],
        
        "class-methods-use-this": "error",
        "curly": [
            "error",
            "all"
        ],
        "dot-notation": "error",
        "no-console": "error",
        "no-debugger": "error",
        "no-lonely-if": "error",
        "no-param-reassign": "warn",
        "no-restricted-syntax": [
            "error",
            "ForInStatement",
            "LabeledStatement",
            "WithStatement"
        ],
        "no-throw-literal": "error",
        "no-underscore-dangle": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "prefer-const": [
            "error",
            {
                "destructuring": "any",
                "ignoreReadBeforeAssign": false
            }
        ],
        "prefer-object-spread": "error",
        "require-atomic-updates": "error",
        
        "@typescript-eslint/explicit-member-accessibility": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "argsIgnorePattern": "^_"
            }
        ],
        "@typescript-eslint/no-useless-constructor": "error",
        "@typescript-eslint/parameter-properties": "error",
        
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                "js": "never",
                "mjs": "never",
                "jsx": "never",
                "ts": "never",
                "tsx": "never"
            }
        ],
        "import/first": "error",
        "import/no-mutable-exports": "error",
        "import/no-unresolved": [
            2,
            {
                "caseSensitive": true
            }
        ],
        "import/order": [
            "error",
            {
                "newlines-between": "always",
                "alphabetize": {
                    "order": "asc",
                    "caseInsensitive": true
                }
            }
        ],
        
        "unicorn/error-message": "error",
        "unicorn/escape-case": "error",
        "unicorn/no-instanceof-array": "error",
        "unicorn/no-new-buffer": "error",
        "unicorn/no-unsafe-regex": "error",
        "unicorn/number-literal-case": "error",
        "unicorn/prefer-includes": "error",
        "unicorn/prefer-string-starts-ends-with": "error",
        "unicorn/prefer-type-error": "error",
        "unicorn/throw-new-error": "error",
        
        "unused-imports/no-unused-imports": "error"
    },
    "env": {
        "jest": false,
        "mocha": true,
        "browser": false,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [
                    ".js",
                    ".jsx",
                    ".ts",
                    ".tsx"
                ]
            }
        },
        "import/ignore": [
            "node_modules",
            "\\.(coffee|scss|css|less|hbs|svg|json)$"
        ]
    }
}
```

### Prettier

The [Prettier](https://prettier.io/) plugin is included in eslint and additionally runs as commit hook on every file in the [js](/js/) directory and formats the client side Javascript.

```json
{
    "printWidth": 100,
    "singleQuote": true,
    "useTabs": true,
    "tabWidth": 4,
    "endOfLine": "lf",
    "trailingComma": "all"
}
```

### SCSS

SCSS (or SASS) is included since we make use of [PicoCss](https://picocss.com/).
The build pipeline automatically spits out a `app.min.css` file with [Pico's](https://picocss.com/) styles and the custom ones specified in the [design](/design/) folder.
There's also a [style-lint](.stylelintrc.json) config that is applied as commit hook.

### PugJS

[Pug](https://pugjs.org/api/getting-started.html) as a template engine is used because I like the semantic touch it applies to the html files (and it reduces clutter in those as well).
This can be replaced by any other template engine tho. Or omitted completely if you only want to build an API.

### Building assets

To generate our minified assets we make use of a fairly simple [Gulp](https://gulpjs.com/) pipeline. It can be found [here](/gulpfile.js).

You can either build the assets on demand of have a watcher running which compiles your files if it detects changes in SCSS/js files.

## Available commands

```json
"scripts": {
    "build:all": "npm run build:ts && npm run build:assets",
    "build:assets": "gulp",
    "build:ts": "tsc",
    "clean": "rimraf ./dist ./coverage ./node_modules",
    "dev": "nodemon",
    "lint": "eslint --cache --ext .ts --ignore-path .eslintignore src/",
    "lint:scss": "stylelint ./design/**/*.scss",
    "start": "node dist/app.js",
    "prepare": "test -d node_modules/husky && husky install || echo \"husky is not installed\"",
    "test": "mocha",
    "watch:assets": "gulp watch"
  },
```

This project makes use of [Husky](https://typicode.github.io/husky/#/) as the commit hook runner to lint and format staged files.

---

If you think that this readme can be extended or is missing some features feel free to open a pull request with your adaptions. You can reach me via a new [issue](https://github.com/Enubia/express-ts-boilerplate/issues/new) or on discord Enubia#1385.