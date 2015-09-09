Abacus
===

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
  resetOnFlush: true, // set all values to 0 on flush
  deleteOnFlush: false, // delete all values on flush (will not send 0's)
  printEmpty: true, // whether or not to print empty objects (default false)
  printOnFlush: false, // print the metrics just before flushing them (default false)
  printLabel: 'myMetrics: ', // prefix printed counters with this string (default '')
  debug: console.log // Function to log messages from abacus (default none)
};

var metrics = new Abacus(config);

// increment by 1
metrics.increment('metricName');

// increment by 5
metrics.increment('metricName', 5);

// set value of metric
metrics.set('metricName', 153);

// Get value of metric
metrics.get('metricName');

// Print a summary of counters to STDOUT every 10 seconds. This is automatically setup if config.printFrequency is set.
metrics.printPeriodically(10000);

// Periodically flush counters to statsD. This is opposed to sending the counter each time it is changed
// If `config.resetOnFlush` and `config.deleteOnFlush` are false, the counters will be cumulative. Otherwise, they're reset to 0 or cleared on each flush.
// This is automatically setup if config.flushFrequency is set.
metrics.flushPeriodically(60000); // in milliseconds. Flush every 60 seconds

// Immediately flush all metrics and close the statsD connection
metrics.stop();
````

### Configuration

You can pass a configuration object directly to abacus on instantiation: `new Abacus(config);`. See usage example.

### StatsD
Abacus can be configured to send its counters to an instance of [StatsD](https://github.com/etsy/statsd/). You can configure the StatsD connection as shown in the example.

### Logging
The `debug` option allows you to pass in a function that will be invoked each time abacus logs something. If not set, the log will be silently discarded.
