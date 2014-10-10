/*
 * grunt-php-shield
 * https://github.com/emalherbi/grunt-php-shield
 *
 * Copyright (c) 2014 Eduardo Malherbi Martins
 * Licensed under the MIT license.
 */

'use strict';

var path  = require("path");
var cmd = require("cmd-exec").init();

var getBase64 = require('atob');
var setBase64 = require('btoa');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('php_shield', 'Build automatic php shield', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      /* Base64 */
      base64 : false,
      randomI : 2,
      randomF : 3,

      /* PhpShield */
      path_exe : '',
      log : true,
      V4 : true,
      V5_0 : true,
      V5_2 : true,
      V5_3 : true,
      stop_on_error : true,
      strict_errors : true
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      // Create a cmd var even if not used to reduce errors
      var cwd = '';
      if (f.cwd) {
        cwd = f.cwd;
      }

      // log grunt
      function writeln(str) {
        grunt.log.writeln(str);
      }

      // encode files
      function encode(str) {
        return setBase64( str );
      }

      // decode files
      function decode(str) {
        return getBase64( str );
      }

      // Function to get the extension a filename
      function getExtension(filename) {
        var ext = path.extname(filename || '').split('.');
        return ext[ext.length - 1];
      }

      writeln('-----------------------------');
      writeln('--                         --');
      writeln('-- Start Module PhpShield! --');
      writeln('--                         --');
      writeln('-----------------------------');

      // return if phpShieldExe not defined
      if ( options.path_exe === '' ) {
        grunt.log.warn('Path phpShield exe not defined!');
        return false;
      }

      // Concat specified files.
      var separator = '/';
      var php_list_encoder = [];
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(cwd + separator + filepath)) {
          grunt.log.warn('Source file "' + cwd + separator + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filename) {
        if (!grunt.file.isDir(cwd + separator + filename) && ('php' === getExtension(cwd + separator + filename))) {
          php_list_encoder.push( f.dest + separator + filename );

          var file = grunt.file.read(f.dest + separator + filename);

          file = file.replace('/^\<\?(php)*/', '');
          file = file.replace('/\?\>$/', '');
          file = file.replace(['\"','$','"'], ['\\\"','\$','\"']);
          file = file.trim();
          file = encode(file);
          file = "<?php $code = base64_decode('" + file + "'); eval(\"return eval(\"$code\");\") ?>\n";

          grunt.file.write(f.dest + separator + filename, file);
        }

        if ( options.log ) {
          // writeln( f.dest + separator + filename );
        }
      });

      /*
      // only windows
      grunt.file.write(options.path_exe + separator + 'encodeShield', php_list_encoder.join('\n'));

      var V4   = (options.V4  ) ? '-V4'   : '';
      var V5_0 = (options.V5_0) ? '-V5.0' : '';
      var V5_2 = (options.V5_2) ? '-V5.2' : '';
      var V5_3 = (options.V5_3) ? '-V5.3' : '';

      var stop_on_error = (options.stop_on_error) ? '--stop-on-error' : '';
      var strict_errors = (options.strict_errors) ? '--strict-errors' : '';

      // exec cmd command phpShield
      var command = options.path_exe+separator+'phpshield.exe '+strict_errors+' '+stop_on_error+' '+V4+' '+V5_0+' '+V5_2+' '+V5_3+' -b- @"'+options.path_exe+separator+'encodeShield"';

      if ( options.log ) {
        writeln( command );
      }

      cmd.exec(command, function(err, res) {
        if (err) {
          grunt.log.warn('Error: ' + err.message);
        } else {
          writeln(res.message);
        }
      });
      */

      // Write the destination file.
      grunt.file.write(f.dest+separator+'default', true);

      // Print a success message.
      grunt.log.writeln('Build Successful!');
    });
  });

};
