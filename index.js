const webpack = require("webpack");

class AddAssetPlugin {
  assets = [];

  constructor(data = []) {
    this.assets.concat(data);
  }

  //? Todo: [unsafe undocumented api] allow user to push asset at any compiler hook
  //? Todo: [unsafe undocumented api] allow user to push asset at any compilation hook
  //? Todo: [unsafe undocumented api] allow use to push asset at any stage

  //Todo: Allow user to push asset at all documented stages

  //Lite Api
  addBeforeCompression(fileName, content) {
    this.assets.push({
      compilerHook: "thisCompilation",
      compilationHook: "processAssets",
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
      fileName: fileName,
      content: content,
    });
  }

  apply(compiler) {
    function replacePlaceholdersInFilename(filename, fileContent, compilation) {
      if (/\[\\*([\w:]+)\\*\]/i.test(filename) === false) {
        return { path: filename, info: {} };
      }
      const hash = compiler.webpack.util.createHash(
        compilation.outputOptions.hashFunction
      );
      hash.update(fileContent);
      if (compilation.outputOptions.hashSalt) {
        hash.update(compilation.outputOptions.hashSalt);
      }
      const contentHash = hash
        .digest(compilation.outputOptions.hashDigest)
        .slice(0, compilation.outputOptions.hashDigestLength);
      return compilation.getPathWithInfo(filename, {
        contentHash,
        chunk: {
          hash: contentHash,
          contentHash,
        },
      });
    }
    compiler.hooks.thisCompilation.tap("AddAssetPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "AddAssetPlugin",
          //stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        () => {
          this.assets.forEach((asset) => {
            asset.fileName = replacePlaceholdersInFilename(
              asset.fileName,
              asset.content,
              compilation
            ).path;
            compilation.emitAsset(
              asset.fileName,
              new webpack.sources.RawSource(asset.content)
            );
          });
        }
      );
    });
  }
}

module.exports = AddAssetPlugin;
