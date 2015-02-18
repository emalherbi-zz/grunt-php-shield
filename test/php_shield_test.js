'use strict';

var grunt = require('grunt');
var fs = require('fs');

exports.php_shield = {

  base64 : function(test) {
    test.expect(1);

    var actual = fs.readdirSync('tmp/app').sort();
    var expected = fs.readdirSync('test/expected/app').sort();
    test.deepEqual(expected, actual, 'should copy several files');

    test.done();
  },
  shield : function(test) {
    test.expect(1);

    var actual = fs.readdirSync('tmp/app').sort();
    var expected = fs.readdirSync('test/expected/app').sort();
    test.deepEqual(expected, actual, 'should copy several files');

    test.done();
  }
};
