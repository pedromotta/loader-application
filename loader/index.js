// Require all of the needful.
var ROOT_PATH = process.cwd();
var path = require('path');
var LockManager = require('hurt-locker').LockManager;
var DynamicModuleLoader = require('dynamic-module-loader').DynamicModuleLoader;

var Loader = function(dir) {
  lockManager = new LockManager({
    lockDir: path.join(ROOT_PATH, '/modules/locks')
  });

  var config = {
    lockManager: lockManager,
    downloadDir: path.join(ROOT_PATH, '/modules/downloads'),
    moduleInstallationDir: path.join(ROOT_PATH, '/modules/installed'),
    modulePackageServerUrl: 'https://s3-sa-east-1.amazonaws.com/delapaca/modules',
    npmSkipInstall: false
  };

  // Create our loader.
  var dynamicModuleLoader = new DynamicModuleLoader(config);

  return dynamicModuleLoader;
};

module.exports = new Loader();
