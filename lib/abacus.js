var debug = require('debug')('abacus');
var util = require('util');
var statsD = require('node-statsd').StatsD;
var config = require('../config');

var counters = function(conf){
  var self = this;
  self.config = conf || config;
  self.counters = {};
  self.statsD = false;

  // Start a statsD connection if configured
  if(self.config.statsD){
    var statsDConfig = self.config.statsD;
    self.statsD = new statsD(statsDConfig.connection.host, statsDConfig.connection.port);
  }
}

counters.prototype.increment = function(counter, increment){
  var self = this;
  if(!increment) increment = 1;
  if(!self.counters[counter]) self.counters[counter] = 0;
  self.counters[counter] += increment;
  if(self.statsD)
    self.statsD.increment(self.config.statsD.metricPrefix+counter);
}

counters.prototype.print = function(){
  var self = this;
  debug(util.inspect(self.counters));
}

counters.prototype.printPeriodically = function(interval){ // interval in seconds
  if(!interval) return;
  var self = this;
  self.period = setInterval(self.print.bind(self), interval * 1000);
}

counters.prototype.stopPeriod = function(){
  clearInterval(this.period);
}

counters.prototype.get = function(counter){
  return this.counters[counter] || 0;
}

module.exports = counters;
