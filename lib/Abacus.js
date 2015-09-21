'use strict';
var util = require('util');
var StatsD = require('statsd-client');

var Abacus = module.exports = function(opts) {
  this.opts = opts || {};
  this.counters = {};
  this.statsD = false;
  this.flushPeriod = false;

  // Start a statsD connection if configured
  if (this.opts.statsD) {
    var statsDConfig = this.opts.statsD;
    this.statsD = new StatsD(statsDConfig.connection);
  }

  if (this.opts.flushFrequency) {
    this.flushPeriodically(this.opts.flushFrequency);
  }

  if (this.opts.printFrequency) {
    this.printPeriodically(this.opts.printFrequency);
  }
};

Abacus.prototype.increment = function(counter, increment) {
  if (typeof increment === 'undefined') increment = 1;
  if (!this.counters[counter]) this.counters[counter] = 0;

  this.counters[counter] += increment;

  if (this.statsD && !this.flushPeriod) {
    this.statsD.increment(this.opts.statsD.metricPrefix + counter);
  }
};

Abacus.prototype.print = function() {
  // check for an empty object, stop if it's empty and printEmpty isn't truthy
  if (!this.opts.printEmpty && Object.keys(this.counters).length === 0) return;
  console.log((this.opts.printLabel || '') + util.inspect(this.counters));
};

Abacus.prototype.printPeriodically = function(interval) { // interval in ms
  if (!interval) return;
  if (this.period) clearInterval(this.period);
  this.period = setInterval(this.print.bind(this), interval);
};

Abacus.prototype.stopPeriod = function() {
  if (!this.period) return;
  clearInterval(this.period);
  this.period = false;
};

Abacus.prototype.flush = function() {
  var q = [];

  this.debug('flushing counters');

  if (this.opts.printOnFlush) this.print();

  for (var counter in this.counters) {
    if (!this.counters.hasOwnProperty(counter)) continue;
    q.push(this.statsD.counter.bind(this.statsD, this.opts.statsD.metricPrefix + counter, this.counters[counter]));
    if (this.opts.resetOnFlush) this.counters[counter] = 0;
  }

  if (this.opts.deleteOnFlush) this.counters = {};

  for (var i = 0; i < q.length; i++) {
    q[i]();
  }
};

Abacus.prototype.flushPeriodically = function(interval) { // interval in ms
  if (!interval || !this.opts.statsD) return;
  if (this.flushPeriod) clearInterval(this.flushPeriod);
  this.flushPeriod = setInterval(this.flush.bind(this), interval);
};

Abacus.prototype.stopFlushing = function() {
  if (!this.flushPeriod) return;
  clearInterval(this.flushPeriod);
  this.flushPeriod = false;
};

Abacus.prototype.get = function(counter) {
  return this.counters[counter] || 0;
};

Abacus.prototype.getCounters = function() {
  return this.counters;
};

Abacus.prototype.set = function(counter, value) {
  if (value === null) return;
  this.counters[counter] = value;
};

Abacus.prototype.debug = function() {
  if (typeof this.opts.debug !== 'function') return;

  var log = this.opts.debug;
  log.apply(log, arguments);
};

Abacus.prototype.stop = function() {
  this.flush();
  this.stopFlushing();
  this.stopPeriod();
  if (this.statsD) this.statsD.close();
};
