var express = require('express');
var logger = require('./logger');
var dynamicLoader = require('./loader');

var LoaderApplication = function() {
  var app = express();

  var modules = {};

  var moduleResult = dynamicLoader.load('loader-module');

  moduleResult.when(function(err, module) {
    if (err) {
      // Failed to download the module.  You can try again or give up like a sissi.
      logger.error('err-when: ', err);
      return;
    }

    modules['loader-module'] = module;
  });

  app.get('/:name', function(req, res) {
    modules[req.params.name].get('1');

    res.sendStatus(200);
  });

  app.get('/v2/:name', function(req, res) {
    modules[req.params.name].get('1', function(err, body) {
      if (err) {
        logger.error(`Request error: ${err}`);
        res.statusStatus(500);
      } else {
        logger.info(`Request success: ${body}`);
        res.status(200).send(body);
      }
    });
  });

  app.listen(5000, function() {
    logger.info('App listening on port 5000!');
  });
};

module.exports = new LoaderApplication();
