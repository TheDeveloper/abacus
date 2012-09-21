### Abacus
A simple node.js module to count, report, and plot application metrics.

#### Install
    npm install abacus
    
#### Usage
````
var abacus = require('abacus');
var config = {
  statsD: {
    connection:{
      host: 'localhost',
      port: 5007
    },
    // This is the prefix for all metric names sent to statsD / graphite
    metricPrefix: 'apps.abacus.'
  }
}

var metrics = new abacus(config);

// increment by 1
metrics.increment('metricName');

// increment by 5
metrics.increment('metricName', 5);

// set value of metric
metrics.set('metricName',153)

// Get value of metric
metrics.get('metricName');

// Print a summary of counters to STDOUT every 10 seconds. Remember to set DEBUG environment variable
metrics.printPeriodically(10)
````

#### Configuration
Abacus supports 2 configuration methods. It's compatable with [node-config](http://lorenwest.github.com/node-config/latest/), so if you're using node-config in your parent project you can set an abacus property in your configuration object and abacus will pick it up automatically.

Alternatively, you can pass a configuration object directly to abacus on instantiation: `new abacus(config);`. See usage example.

#### StatsD
Abacus can be configured to send its counters to an instance of [StatsD](https://github.com/etsy/statsd/). You can configure the StatsD connection as shown in the example.

#### Logging
This module uses [debug](https://github.com/visionmedia/debug/), and therefore obeys the same output control scheme. You can see all output from abacus by setting the environment variable DEBUG=*

Sub-sections of debug output can be controlled by setting for e.g. DEBUG=abacus:abacus. Read debug's documentation for more on output control.