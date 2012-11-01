var util = require('util');
var statsD = require('node-statsd').StatsD;

var counters = function(opts){
  var self = this;
  self.opts = opts || {debug: false};
  self.counters = {};
  self.statsD = false;

  // Start a statsD connection if configured
  if(self.opts.statsD){
    var statsDConfig = self.opts.statsD;
    self.statsD = new statsD(statsDConfig.connection.host, statsDConfig.connection.port);
    self.statsD.socket.on('error', function(e){
      return self.debug('Error on statsD socket: %s', e);
    });
  }
};

counters.prototype.increment = function(counter, increment){
  var self = this;
  if(!increment) increment = 1;
  if(!self.counters[counter]) self.counters[counter] = 0;
  self.counters[counter] += increment;
  if(self.statsD)
    self.statsD.increment(self.opts.statsD.metricPrefix+counter);
};

counters.prototype.print = function(){
  var self = this;
  console.log(util.inspect(self.counters));
};

counters.prototype.printPeriodically = function(interval){ // interval in seconds
  if(!interval) return;
  var self = this;
  self.period = setInterval(self.print.bind(self), interval * 1000);
};

counters.prototype.stopPeriod = function(){
  clearInterval(this.period);
};

counters.prototype.get = function(counter){
  return this.counters[counter] || 0;
};

counters.prototype.getCounters = function(){
  return this.counters;
};

counters.prototype.set = function(counter,value) {
  var self = this;
  if(value === null) return;
  self.counters[counter] = value;
};

counters.prototype.debug = function(){
  if(this.opts.debug)
    console.log.apply(this, arguments);
};

module.exports = counters;
