var ROOT_PATH = process.cwd();
var path = require('path');
var express = require('express');
var logger = require('./logger');
var dynamicLoader = require('./loader');
var rimraf = require('rimraf');
var async = require('async');
var request = require('request');

var LoaderApplication = function() {
  var app = express();

  var modules = {};

  function loadModules(moduleName, callback) {
    var moduleCache = modules[moduleName];

    if (moduleCache) {
      callback(null, moduleCache);
    } else {
      var moduleResult = dynamicLoader.load(moduleName, '.zip', 'https://codeload.github.com/pedromotta/loader-module/zip/master');
      moduleResult.when(function(err, module) {
        if (err) {
          // Failed to download the module.  You can try again or give up like a sissi.
          logger.error('err-when: ', err);
          callback(err);
        } else {
          logger.debug('module "loader module master" loaded');
          modules[moduleName] = module;
          callback(null, module);
        }
      });
    }
  }

  app.get('/:name', function(req, res) {
    loadModules(req.params.name, function(err, module) {
      var hello = module.helloWorld();

      if (err) {
        res.sendStatus(500);
      } else {
        res.status(200).send(hello);
      }
    });
  });

  app.get('/v2/:name', function(req, res) {
    loadModules(req.params.name, function(errLoad, module) {
      module.get('1', function(err, body) {
        if (err) {
          logger.error(`Request error: ${err}`);
          res.statusStatus(500);
        } else {
          logger.info(`Request success: ${body}`);
          res.status(200).send(body);
        }
      });
    });
  });

  app.get('/v3/:port', function(req, res) {
    request('http://localhost:' + req.params.port, function(error) {
      if (error) {
        logger.error(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });

  app.put('/modules/:name', function(req, res) {
    var name = req.params.name;
    var modulePath = path.join(ROOT_PATH, '/modules/installed/' + name);
    rimraf(modulePath, function(err) {
      if (err) {
        res.sendStatus(500);
      } else {
        dynamicLoader.evict(name);
        loadModules(function(err) {
          if (err) {
            res.sendStatus(500);
          } else {
            res.sendStatus(204);
          }
        });
      }
    });
  });

  app.delete('/modules/:name', function(req, res) {
    var name = req.params.name;
    var moduleInstallPath = path.join(ROOT_PATH, '/modules/installed/' + name);
    var moduleDownloadPath = path.join(ROOT_PATH, `/modules/downloads/${name}.zip`);

    async.parallel([
      function(callback) {
        rimraf(moduleInstallPath, callback);
      },
      function(callback) {
        rimraf(moduleDownloadPath, callback);
      }
    ], function(err) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(204);
      }
    });
  });

  app.listen(5000, function() {
    logger.info('App listening on port 5000!');
  });
};

module.exports = new LoaderApplication();
