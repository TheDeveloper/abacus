var vows = require('vows');
var abacus = require('../lib/abacus');
var assert = require('assert');

vows
  .describe('Now we are going to find out if we can count')
  .addBatch({
    "Abacus": {
      topic: new abacus(),
      "When incrementing some counters": {
        topic: function(abacus){
          abacus.increment('test');
          abacus.increment('testCustomIncrement', 7);
          return abacus;
        },
        "Counter values should be set and the value should be as incremented": function(abacus){
          assert.equal(abacus.get('test'), 1);
          assert.equal(abacus.get('testCustomIncrement'), 7);
        }
      }
    }
}).export(module);
