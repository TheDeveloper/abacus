var debug = require('debug')('abacus:config');

// Check for config module. If not existent, export an empty config
try{
  var config = require('config');
  debug('Loading config from node-config');
  module.exports = config.setModuleDefaults('abacus', require('./config/default'));
}
catch(e){
  debug('Setting config to empty object');
  module.exports = {};
}
