// Generated by CoffeeScript 1.11.1
var Konnector, async, handleNotification, localization, log, path;

async = require('async');

handleNotification = require('./notification_handler');

log = require('printit')({
  prefix: null,
  date: true
});

path = require('path');

Konnector = require('../models/konnector');

localization = require('./localization_manager');

module.exports = function(konnector, callback) {
  var model, ref;
  if (((ref = konnector.accounts) != null ? ref.length : void 0) > 0 && konnector.isImporting === false) {
    log.info("Run import for " + konnector.slug + ".");
    model = require(path.join('..', 'konnectors', konnector.slug));
    if (model["default"] != null) {
      model = model["default"];
    }
    return konnector["import"](function(err, notifContents) {
      var data, localizationKey;
      if ((err != null) && ((typeof err === 'object' && Object.keys(err).length > 0) || typeof err === String)) {
        log.error(err);
        localizationKey = 'notification import error';
        notifContents = [
          localization.t(localizationKey), {
            name: model.name
          }
        ];
      }
      handleNotification(konnector, notifContents);
      data = {
        lastAutoImport: new Date()
      };
      return konnector.updateAttributes(data, function(err) {
        if (err != null) {
          log.error(err);
        }
        return typeof callback === "function" ? callback() : void 0;
      });
    });
  } else {
    log.info("Connector " + konnector.slug + " is already importing.");
    return typeof callback === "function" ? callback() : void 0;
  }
};
