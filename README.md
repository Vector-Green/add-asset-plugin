# Add Asset Plugin for Webpack 5

## emits assets at some compilations stages

### Example

#### Vue 3 cli

```javascript
//vue.config.js
const webpack = require("webpack");

const AddAssetPlugin = require("add-asset-plugin");
const addAssetPlugin = new AddAssetPlugin();

const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  addAssetPlugin.addBeforeCompression("fileName", "fileContent"); //anywhere
  configureWebpack: (config) => {
    config.plugins.push(addAssetPlugin);
  },
});
```

#### React

```javascript
//webpack.config.js
const webpack = require("webpack");

const AddAssetPlugin = require("add-asset-plugin");
const addAssetPlugin = new AddAssetPlugin();

module.exports = function () {
  return {
    mode: process.env.NODE_ENV,
    addAssetPlugin.addBeforeCompression("fileName", "fileContent"); //anywhere
    plugins: [addAssetPlugin],
  };
};
```
