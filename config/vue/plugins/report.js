const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');
function createReport(config) {
  config.when(process.env.REPORT, (config) => {
    config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin.BundleAnalyzerPlugin, [
      {
        analyzerPort: 8888,
        generateStatsFile: false,
      },
    ]);
  });
}
module.exports = {
  createReport,
};
