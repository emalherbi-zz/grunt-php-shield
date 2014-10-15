/*
 * grunt-php-shield
 * https://github.com/emalherbi/grunt-php-shield
 *
 * Copyright (c) 2014 Eduardo Malherbi Martins
 * Licensed under the MIT license.
 */

'use strict';

var path = require("path");
var cmd = require("cmd-exec").init();
var setBase64 = require('btoa');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('php_shield', 'Build automatic php shield', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      log : true,

      /* Base64 */
      base64 : false,
      encodingLevelStart : 0,
      encodingLevelEnd : 0,

      /* PhpShield */
      path_exe : '',
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
      function write(str) {
        grunt.log.write(str);
      }

      // encode files
      function encode(str, levelStart, levelEnd) {
        var level = 0;
        if ( levelStart === 0 || levelEnd === 0 ) {
          level = Math.floor((Math.random() * 10) + 1);
        } else {
          level = Math.floor(Math.random() * (levelEnd - levelStart)) + levelStart;
        }

        if ( options.log ) {
          writeln( "Random: " + level + "x");
        }

        if ( options.log ) {
          write( '[' );
        }

        for (var i=0; i<level; i++) {
            str = setBase64(str);
            str = 'eval(base64_decode("' + str + '"));';

            if ( options.log ) {
              write( '=' );
            }
        }

        if ( options.log ) {
          writeln( ']' );
        }

        return str;
      }

      // Function to get the extension a filename
      function getExtension(filename) {
        var ext = path.extname(filename || '').split('.');
        return ext[ext.length - 1];
      }

      function phpShield() {
        var php_list_encoder = [];
        src.map(function (filename) {
          if (!grunt.file.isDir(cwd + separator + filename) && ('php' === getExtension(cwd + separator + filename))) {
            php_list_encoder.push( f.dest + separator + filename );
          }

          if ( options.log ) {
            writeln( f.dest + separator + filename );
          }
        });

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
      }

      function phpBase64() {
        src.map(function (filename) {
          if (!grunt.file.isDir(cwd + separator + filename) && ('php' === getExtension(cwd + separator + filename))) {
            //var file = grunt.file.read(f.dest + separator + filename);
            //file = encode(file);

            //var tmp = "";
            //tmp += "<?php \n";
            //tmp += "$tmp=base64_decode('" + file + "'); \n";
            //tmp += "$tmp=preg_replace('/[\\n\\t\\s]+/',' ',$tmp); \n";
            //tmp += "$tmp=preg_replace('/^\\<\\?(php)*/','',$tmp); \n";
            //tmp += "$tmp=preg_replace('/\\?\\>$/','',$tmp); \n";
            //tmp += "$tmp=str_replace(array('\\\"','$','\"'),array('\\\\\\\"','\\$','\\\"'),$tmp); \n";
            //tmp += "$tmp=trim($tmp); \n";
            //tmp += "@eval(@eval($tmp)); \n";

            var tmp = grunt.file.read(f.dest + separator + filename);
            tmp = tmp.replace("<?php", "");
            tmp = tmp.replace("<?", "");
            tmp = tmp.replace("?>", "");
            tmp = encode(tmp, options.encodingLevelStart, options.encodingLevelEnd);

            var file = "<?php";
            file += "\r\n";
            file += tmp;
            file += "\r\n";
            file += "?>";

            grunt.file.write(f.dest + separator + filename, file);
          }

          if ( options.log ) {
            writeln( f.dest + separator + filename );
          }
        });
      }

      // return not defined
      if ( options.path_exe === '' && options.base64 === false ) {
        grunt.log.warn('The path_exe or base64 are not defined! Please defined one option.');
        return false;
      }

      writeln('-----------------------------');
      writeln('--                         --');
      writeln('-- Start Module PhpShield! --');
      writeln('--                         --');
      writeln('-----------------------------');

      // Concat specified files.
      var separator = '/';
      var src = f.src.filter(function(filepath) {
        if (!grunt.file.exists(cwd + separator + filepath)) {
          grunt.log.warn('Source file "' + cwd + separator + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      if ( options.base64 ) {
        phpBase64();
      }
      else {
        phpShield();
      }

      // Write the destination file.
      grunt.file.write(f.dest+separator+'default', true);

      // Print a success message.
      grunt.log.writeln('Build Successful!');
    });
  });

};
