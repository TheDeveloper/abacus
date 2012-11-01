var util = require('util');
var statsD = require('node-statsd').StatsD;

var counters = function(opts){
  var self = this;
  self.opts = opts || {debug: false, resetOnFlush: true};
  self.counters = {};
  self.statsD = false;
  self.flushPeriod = false;

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
  if(self.statsD && !self.flushPeriod)
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
  if(!this.period)
    return;

  clearInterval(this.period);
};

counters.prototype.flush = function(){
  for(var counter in this.counters){
    var value = this.counters[counter];
    this.statsD.update_stats(this.opts.statsD.metricPrefix+counter, value);
    if(this.opts.resetOnFlush)
      this.counters[counter] = 0;
  }
};

counters.prototype.flushPeriodically = function(interval){ // interval in ms
  if(!interval || !this.opts.statsD) return;
  var self = this;
  self.flushPeriod = setInterval(self.flush.bind(self), interval);
};

counters.prototype.stopFlushing = function(){
  if(!this.flushPeriod)
    return;

  clearInterval(this.flushPeriod);
  this.flushPeriod = false;
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
  if(!this.opts.debug)
    return;

  if("function" == typeof this.opts.debug){
    return this.opts.debug.apply(this, arguments);
  }

  console.log.apply(this, arguments);
};

module.exports = counters;
