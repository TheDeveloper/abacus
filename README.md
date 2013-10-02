# Abacus

A simple node.js module to count, report, and plot application metrics.

# Install
````sh
npm install abacus
````

## Usage

````javascript
var Abacus = require('abacus');

var config = {
  statsD: {
    connection:{
      host: 'localhost',
      port: 5007
    },
    // This is the prefix for all metric names sent to statsD / graphite
    metricPrefix: 'apps.abacus.'
  },
  flushFrequency: 60000,
  printFrequency: 10000,
  resetOnFlush: true,
  debug: false
};

var metrics = new Abacus(config);

// increment by 1
metrics.increment('metricName');

// increment by 5
metrics.increment('metricName', 5);

// set value of metric
metrics.set('metricName', 153)

// Get value of metric
metrics.get('metricName');

// Print a summary of counters to STDOUT every 10 seconds. This is automatically setup if config.printFrequency is set.
metrics.printPeriodically(10000);

// Periodically flush counters to statsD. This is opposed to sending the counter each time it is changed
// If config.resetOnFlush is false, the counters will be cumulative. Otherwise, they're reset to 0 on each flush.
// This is automatically setup if config.flushFrequency is set.
metrics.flushPeriodically(60000); // in milliseconds. Flush every 60 seconds
````

### Configuration

You can pass a configuration object directly to abacus on instantiation: `new Abacus(config);`. See usage example.

### StatsD
Abacus can be configured to send its counters to an instance of [StatsD](https://github.com/etsy/statsd/). You can configure the StatsD connection as shown in the example.

### Logging
This module uses [debug](https://github.com/visionmedia/debug/), and therefore obeys the same output control scheme. You can see all output from abacus by setting the environment variable DEBUG=*

Sub-sections of debug output can be controlled by setting for e.g. DEBUG=abacus:abacus. Read debug's documentation for more on output control.
