### Abacus
A simple tool to count, report, and plot application metrics.

#### Install
    npm install abacus
    
#### Usage
````
var metrics = require('abacus');
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

metrics.increment('metricName');
metrics.increment('incrementByFive', 5);

// Get value of metric
metrics.get('metricName');

// Print a summary of counters to STDOUT every 10 seconds. Remember to set DEBUG environment variable
metrics.printPeriodically(10)
````

#### Configuration
Abacus supports 2 configuration methods. It's compatable with [node-config](http://lorenwest.github.com/node-config/latest/), so if you're using node-config in your parent project you can set an abacus property in your configuration object and abacus will pick it up automatically.

Alternatively, you can pass a configuration object directly to abacuse on instantiation: `new abacus(config);`. See usage example.

#### StatsD
Abacus can be configured to send its counters to an instance of [StatsD](https://github.com/etsy/statsd/). You can configure the StatsD connection as shown in the example.