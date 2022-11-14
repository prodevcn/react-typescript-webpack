# react-typescript-webpack

## Summary

Create React App - abstracts away the project setup process.
Abstraction is not something we always want.
How to setup form scratch, a complete react project with a few tools that will greatly improve your experience.

## Course Structure

1. Setup a basic React app with TypeScript and Webpack5
2. Configure webpack and TypeScript to allow rendering of images and SVGs.
3. Setup webpack config for multiple environments like dev and prod.
4. Add react refresh
5. Linting with ESLint
6. Code formatting with Prettier
7. Husky
8. Next Step

## Process

### 1. Setup a basic React app with TypeScript and Webpack

- Make a empty directory for react project and move into it then type follow

  ```code
    git init
  ```
- Add `.gitignore` file and add follows
  ```
    # dependencies
    /node_modules
    /.pnp
    .pnp.js

    # testing
    /coverage

    # production
    /build

    # misc
    .DS_Store
    .env.local
    .env.development.local
    .env.test.local
    .env.production.local

    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
  ```
- Initialize project with `npm`

  ```
  npm init --y
  ```
- Create `src` directory then create `index.html` in the `src` directory

  ```
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
  </html>
  ```

- Install `React` modules

  ```
  npm install react react-dom
  ```

- Install `TypeScript` modules

  ```
  npm install --save-dev typescript @types/react @types/react-dom
  ```
  - Configure typescript (Create tsconfig.json file in the root directory and then edit it)

    ```
    {
      "compilerOptions": {
        "target": "ES5",
        "module": "ESNext",
        "moduleResolution": "node",
        "lib": ["DOM", "ESNext"],
        "jsx": "react-jsx",
        "noEmit": true,
        "isolatedModules": true,
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true
      },
      "include": ["src/**/*"]
    }
    ```
- Create `index.tsx`, `App.tsx` file in the `src` directory
  - index.tsx
    ```
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App'

    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    ```
  - App.tsx
    ```
    import React from 'react'
    const App = () => {
      return <h1>Basic react application with TypeScript and Webpack.</h1>
    }
    export default App
    ```
- Install `babel` modules
  ```
  npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader
  ```
  - Add `.babelrc` in the `root` directory
    ```
    {
      "presets": [
        "@babel/preset-env",
        [
          "@babel/preset-react",
          {
            "runtime": "automatic"
          }
        ],
        "@babel/preset-typescript"
      ],
    }
    ```
- Install `webpack` modules
  ```
  npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin
  ```
  - Create `webpack` directory in the `root` directory (same level with `src` directory)
    - Add `webpack.config.js`
      ```
      const path = require('path')
      const HtmlWebpackPlugin = require('html-webpack-plugin')

      module.exports = {
        entry: path.resolve(__dirname, '..', './src/index.tsx'),
        resolve: {
          extensions: ['.tsx', '.ts', '.js'],
        },
        module: {
          rules: [
            {
              test: /\.(ts|js)x?$/,
              exclude: /node_modules/,
              use: [{ loader: 'babel-loader' }],
            },
          ],
        },
        output: {
          path: path.resolve(__dirname, '..', './build'),
          filename: 'bundle.js',
        },
        mode: 'development',
        plugins: [
          new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '..', './src/index.html'),
          }),
        ],
      }
      ```
- Add command line for running project in the `packages.json`
  ```
  ...
  "scripts": {
    "start": "webpack serve --config webpack/webpack.config.js --open"
  }
  ...
- Then run project
  ```
  npm start
  ```

### 2. Configure webpack and TypeScript to allow rendering of styles, images and SVGs.

- Allow to render styles (`*.css`)
  - Add `styles.css` in the `src` directory
    ```
    h1 {
      color: orange;
    }
    ```
  - Import `styles.css` in the `App.tsx`

    ```
    import './styles.css'
    ```
    - Install `style` modules
      ```
      npm install --save-dev css-loader style-loader
      ```
    - Add `rule` into the `webpack.config.js` file
      ```
      rules: [
        ...
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        ...
      ]
      ```

- Allow to render Image file (`*.png`, `*.svg`)
  - Add `react.png`, `logo.svg` file in the `src` directory
    - Import `react.png`, `logo.svg` file in the `App.tsx` file
      ```
      import ReactLogo from './react.png'
      import Logo from './logo.svg'
      ...
      <img src={ReactLogo} alt="React Logo" width={200} height={200} />
      <img src={Logo} alt="Logo" width={200} height={200} />
      ...
      ```
  - Add `rule` into the `webpack.config.js` file
    ```
    rules: [
      ...
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ]
    ```
  - Add `declarations.d.ts` in the `src` directory
    ```
    declare module '*.png'
    declare module '*.svg'
    ```

### 3. Setup webpack config for multiple environments like dev and prod

- Add `webpack-merge` module
  ```
  npm install --save-dev webpack-merge
  ```
- Change name of `webpack.config.js` to `webpack.common.js`
- Add `webpack.config.js`, `webpack.dev.js`, `webpack.prod.js` in the `webpack` directory
  - `webpack.config.js`
    ```
    const { merge } = require('webpack-merge')
    const commonConfig = require('./webpack.common')

    module.exports = (envVars) => {
      const { env } = envVars
      const envConfig = require(`./webpack.${env}.js`)
      const config = merge(commonConfig, envConfig)
      return config
    }
    ```
  
  - `webpack.prod.js`
    ```
    const webpack = require('webpack')

    module.exports = {
      mode: 'production',
      devtool: 'source-map',
      plugins: [
        new webpack.DefinePlugin({
          'process.env.name': JSON.stringify('PROD Ninja'),
        }),
      ],
    }
    ```
  - `webpack.dev.js`
    ```
    const webpack = require('webpack')

    module.exports = {
      mode: 'development',
      devtool: 'cheap-module-source-map',
      plugins: [
        new webpack.DefinePlugin({
          'process.env.name': JSON.stringify('DEV Ninja'),
        }),
      ],
    }
    ```
  - `webpack.common.js` remove `mode: 'development'`
    ```
    const path = require('path')
      const HtmlWebpackPlugin = require('html-webpack-plugin')

      module.exports = {
        entry: path.resolve(__dirname, '..', './src/index.tsx'),
        resolve: {
          extensions: ['.tsx', '.ts', '.js'],
        },
        module: {
          rules: [
            {
              test: /\.(ts|js)x?$/,
              exclude: /node_modules/,
              use: [{ loader: 'babel-loader' }],
            },
          ],
        },
        output: {
          path: path.resolve(__dirname, '..', './build'),
          filename: 'bundle.js',
        },
        mode: 'development' <!-- Remote this line-->
        plugins: [
          new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '..', './src/index.html'),
          }),
        ],
      }
    ```
- Change `command lines` in the `packages.json` file
  ```
  ...
  "scripts": {
    "start": "webpack serve --config webpack/webpack.config.js --env env=dev --open",
    "build": "webpack --config webpack/webpack.config.js --env env=prod",
  }
  ...
  ```

### 4. Add react refresh

- Add `react-refresh` modules

  ```
  npm install --save-dev @pmmmwh/react-refresh-webpack-plugin react-refresh
  ```
  - Add refresh module into the `webpack.dev.js`
    ```
    const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
    ...
    mode: 'development'
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true, // this is very important for preventing react router no working when refresh page
    } 
    ...
    plugins: [
      ...
      new ReactRefreshWebpackPlugin(),
      ...
    ]
    ```

### 5. Linting with ESLint

- Install `eslint` modules
  ```
  npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin
  ```

- Add `.eslintrc.js` in the `root` directory
  ```
  module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    extends: [
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:jsx-a11y/recommended',
      'prettier',
      'plugin:prettier/recommended',
    ],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-var-requires': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }

  ```

- Install additional `eslint` modules
  ```
  npm install --save-dev eslint-plugin-import eslint-plugin-jsx-a11y
  ```

- Add `lint` script into the `packages.json`
  ```
  "scripts": {
    ...
    "lint": "eslint --fix \"./src/**/*.{js,jsx,ts,tsx,json}\"",
    ...
  }
  ```

### 6. Code formatting with Prettier

- Install `prettier` modules
  ```
  npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
  ```

- Add `.prettierrc.js` in the `root` directory
  ```
  module.exports = {
    semi: false,
    trailingComma: 'es5',
    singleQuote: true,
    jsxSingleQuote: false,
    printWidth: 80,
    tabWidth: 2,
    endOfLine: 'auto',
  }
- Add `format` in the `package.json`
  ```
  "format": "prettier --write \"./src/**/*.{js,jsx,ts,tsx,json,css,scss,md}\""
  ```
### 7. Husky

- Install `husky` modules
  ```
  npm install --save-dev husky@4 lint-staged
  ```
- Add `lint-staged` in the `package.json`
  ```
  ...
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx,json}": [
      "eslint --fix"
    ],
    "src/**/**.{js,jsx,ts,tsx,json,css,scss,md}": [
      "prettier --write"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
  ...
  ```

  ```
  #### move to VScode settings and check `format on save` option ###
  ```

### 8. Next Step
- Install additional `babel` modules
  ```
  npm install --save-dev @babel/runtime @babel/plugin-transform-runtime
  ```

- Add `babel` module in the `.babelrc` file
  ```
  ...
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ]
  ...
  ```
  - Install additional `webpack` modules
    ```
    npm install --save-dev copy-webpack-plugin webpack-bundle-analyzer
    ```
  - Add `bundle-analyzer` in the `webpack.prod.js` file
    ```
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      ...
      plugins: [
        ...
        new BundleAnalyzerPlugin(),
      ]
    ```
