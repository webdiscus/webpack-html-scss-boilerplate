# Webpack boilerplate
A simple multipage Webpack boilerplate using HTML, SCSS, JS.
See the [demo site](https://webdiscus.github.io/webpack-html-scss-boilerplate/index.html).

## Installation

```
git clone https://github.com/webdiscus/webpack-html-scss-boilerplate.git
cd webpack-html-scss-boilerplate
npm i
```

## Usage

### Start local development
```
npm start
```

### Build production files
```
npm run build
```

### Preview the production in browser 
```
npm run preview
```

## How it works

To build static pages is used the powerful [html-bundler-webpack-plugin](https://github.com/webdiscus/html-bundler-webpack-plugin).

Add the new HTML page in Webpack `entry`:
```js
module.exports = {
  output: {
    path: path.join(__dirname, 'dist/'),
  },
  
  entry: {
    // define HTML files here
    'index': './src/views/home/index.html',  // output dist/index.html
    'route/to/page': './src/views/home/index.html',  // output dist/route/to/page.html
  },
  // ...
};
```

> **Note**
> 
> Using the `html-bundler-webpack-plugin` the entrypoint is an HTML file.\
> All source files of styles, scripts, images can be loaded directly in HTML.\
> This Plugin automatically extracts all used source resources into separate output file.

Add source files of styles, scripts, images directly in HTML:
```html
<!DOCTYPE html>
<html>
<head>
  <!-- load source file of style -->
  <link href="./style.scss" rel="stylesheet">
  <!-- load source file of script -->
  <script src="./main.js" defer="defer"></script>
</head>
<body>
  <h1>Homepage</h1>
  <!-- load source file of image -->
  <img src="./homepage.png">
</body>
</html>
```

Specify output filenames of script and styles using `js` and `css` options of the Plugin:
```js
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
module.exports = {
  plugins: [
    new HtmlBundlerPlugin({
      js: {
        // output filename of extracted JS from source script loaded in HTML via `<script>` tag
        filename: 'assets/js/[name].[contenthash:8].js', // output into dist/assets/js/ directory
      },
      css: {
        // output filename of extracted CSS from source style loaded in HTML via `<link>` tag
        filename: 'assets/css/[name].[contenthash:8].css', // output into dist/assets/css/ directory
      },
    }),
  ],
  // ...
};
```

To extract images form HTML into separate files add the simple rule to Webpack config:
```js
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg|webp|ico)$/i,
        // output filename of extracted image
        generator: {
          filename: 'assets/img/[name].[hash:8][ext]', // output into dist/assets/img/ directory
        },
      },
    ],
  },
  // ...
};
```

To extract images into separate files and `inline images` add the advanced rule to Webpack config:
```js
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg|webp|ico)$/i,
        include: /images/, // load images from `images` directory only
        oneOf: [
          // inline image using `?inline` query
          {
            resourceQuery: /inline/,
            type: 'asset/inline',
          },
          // auto inline by image size
          {
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 1024,
              },
            },
            // output filename of extracted image
            generator: {
              filename: 'assets/img/[name].[hash:8][ext]', // output into dist/assets/img/ directory
            },
          },
        ],
      },
    ],
  },
  // ...
};
```

> **Note**
>
> Use the `include: /images/` option when you have `SVG` files for fonts and images to restrict this rule to images only.


## Also See

- [ansis][ansis] - The Node.js library for ANSI color styling of text in terminal.
- [pug-plugin][pug-plugin] - Webpack plugin for Pug.
- [pug-loader][pug-loader] - Webpack loader for Pug.

## License

[ISC](https://github.com/webdiscus/pug-loader/blob/master/LICENSE)

[ansis]: https://github.com/webdiscus/ansis
[pug-plugin]: https://github.com/webdiscus/pug-plugin
[pug-loader]: https://github.com/webdiscus/pug-loader
[pug-filter-highlight]: https://webdiscus.github.io/pug-loader/pug-filters/highlight.html
[pug-filter-markdown]: https://webdiscus.github.io/pug-loader/pug-filters/markdown.html
