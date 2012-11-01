var abacus = require('../lib/abacus');
var should = require('should');
var dgram = require('dgram');

describe('When counting metrics', function(){
  var metrics = new abacus();

  it('should increment the metric by 1 when no increment value given', function(done){
    metrics.increment('myBankBalance');
    metrics.get('myBankBalance').should.equal(1);
    metrics.increment('myBankBalance');
    metrics.getCounters().myBankBalance.should.equal(2);
    done();
  });

  it('should increment the metric by given value when given', function(done){
    metrics.increment('twitterFollowers', 50);
    metrics.get('twitterFollowers').should.equal(50);
    metrics.increment('twitterFollowers', 12);
    metrics.get('twitterFollowers').should.equal(62);
    done();
  });
});

describe('When persisting to statsD', function(){
  var statsDConfig = {
    connection: {
      host: 'localhost',
      port: 8623
    }
  };

  var socket;

  before(function(done){
    socket = dgram.createSocket('udp4');
    socket.bind(statsDConfig.connection.port);
    done();
  });
  var metrics = new abacus({statsD: statsDConfig, debug:true});

  it('Flushes counters to statsD server', function(done){
    metrics.increment('persistMePlease');
    socket.on('message', function(){
      done();
    });
  });
});