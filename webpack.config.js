const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
//const Nunjucks = require('nunjucks'); // used when the preprocessor is a function

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  const config = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'inline-source-map' : 'source-map',
    stats: 'minimal',

    output: {
      path: path.join(__dirname, 'dist'),
    },

    resolve: {
      // use aliases used in sources instead of relative paths like ../../
      alias: {
        '@views': path.join(__dirname, 'src/views/'),
        '@images': path.join(__dirname, 'src/assets/images/'),
        '@fonts': path.join(__dirname, 'src/assets/fonts/'),
        '@styles': path.join(__dirname, 'src/assets/styles/'),
        '@scripts': path.join(__dirname, 'src/assets/scripts/'),
      },
    },

    plugins: [
      new HtmlBundlerPlugin({
        // verbose: 'auto', // output information about the process to console in development mode only

        entry: {
          // define HTML templates here
          index: 'src/views/pages/home/index.html', // => dist/index.html
          demo: {
            import: 'src/views/pages/demo/index.html', // => dist/demo.html
            data: {
              // pass data into template
              myVar: 'The string passed as the `myVar` variable from Webpack configuration.',
            },
          },
          about: 'src/views/pages/about/index.html', // => dist/about.html
          404: './src/views/pages/404/index.html', // => dist/404.html
        },

        js: {
          // output filename of extracted JS from source script loaded in HTML via `<script>` tag
          filename: 'assets/js/[name].[contenthash:8].js',
        },

        css: {
          // output filename of extracted CSS from source style loaded in HTML via `<link>` tag
          filename: 'assets/css/[name].[contenthash:8].css',
        },

        // you can define all loader options here to avoid explicitly defining the template loader in module rules
        loaderOptions: {
          // render template with the Nunjucks template engine
          preprocessor: 'nunjucks',
          // or you can use any template engine as a function like following:
          //preprocessor: (content, { data }) => Nunjucks.renderString(content, data),
        },
      }),
    ],

    module: {
      rules: [
        // styles
        {
          test: /\.(css|sass|scss)$/,
          use: ['css-loader', 'sass-loader'],
        },

        // fonts (load from `fonts` or `node_modules` directory only)
        {
          test: /[\\/]fonts|node_modules[\\/].+(woff(2)?|ttf|otf|eot|svg)$/,
          type: 'asset/resource',
          generator: {
            // group fonts by name
            filename: (pathData) => `assets/fonts/${path.basename(path.dirname(pathData.filename))}/[name][ext][query]`,
          },
        },

        // images (load from `images` directory only)
        {
          test: /[\\/]images[\\/].+(png|jpe?g|svg|webp|ico)$/,
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
              generator: {
                filename: 'assets/img/[name].[hash:8][ext]',
              },
            },
          ],
        },
      ],
    },

    performance: {
      hints: false, // don't show the size limit warning when a bundle is bigger than 250 KB
    },
  };

  if (isDev) {
    config.devServer = {
      //open: true,
      compress: true,

      static: {
        directory: path.join(__dirname, './dist'),
      },

      // enable HMR
      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: true,
        },
      },

      // rewrite rules
      historyApiFallback: {
        rewrites: [
          { from: /^\/$/, to: '/index.html' },
          { from: /./, to: '/404.html' },
        ],
      },
    };
  }

  return config;
};
