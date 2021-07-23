const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require('path');

const config = {
    entry: './public/index.js',
    output: {
        path: __dirname + '/public' +'/dist',
        filename: 'bundle.js'
    },
    mode: 'development',
    plugins: [ // generates a manifest with icons for each size in the array
        new WebpackPwaManifest({
          filename: 'manifest.json',
          // fingerprints: false,
          // inject: false,
          name: "Progressive Budget",
          short_name: "Progressive Budget",
          description: "A budget tracker to keep track of your personal finances.",
          background_color: "#01579b",
          theme_color: "#ffffff",
          start_url: "/",
          icons: [
            {
                src: path.resolve("./public/icons/icon-192x192.png"),
                size: [72, 96, 128, 144, 152, 192, 384, 512],
                destination: '/icons'
            }
          ]
        }) 
      ],
      module: { // transforms from es6 to vanilla js
        rules: [
          {
            test: /\.m?js$/, // only js files
            exclude: /(node_modules)/, // exclude m=node modules
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"] 
              }
            }
          }
        ]
    }
}
module.exports = config;
