/*
 * grunt-php-shield
 * https://github.com/emalherbi/grunt-php-shield
 *
 * Copyright (c) 2014 Eduardo Malherbi Martins
 * Licensed under the MIT license.
 */

'use strict';

var path = require("path");
var rimraf = require('rimraf');
var btoa = require('btoa');
var cmd = require("cmd-exec").init();
var querystring = require('querystring');
var chalk = require('chalk');

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
      notEncode : null,

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

      // Validate if one option is defined.
      function validateOptionDefined() {
        if ( options.log ) {
          writeln('--> VALIDATE IF ONE OPTION IS DEFINED!');
        }

        if ( options.path_exe === '' && options.base64 === false ) {
          grunt.log.warn('The path_exe or base64 are not defined! Please defined one option.');
          return false;
        }

        return true;
      }

      // Validate if files exist.
      function validateFilesExist() {
        if ( options.log ) {
          writeln('--> VALIDATE IF FILES EXIST!');
        }

        return src = f.src.filter(function(filename) {
          if (!grunt.file.exists(cwd + separator + filename)) {
            grunt.log.warn('Source file "' + cwd + separator + filename + '" not found.');
            return false;
          }

          return true;
        });
      }

      // clear dest
      function clear() {
        try {
          writeln('--> CLEAR DEST -> ' + f.dest);

          rimraf.sync( f.dest );
        } catch (e) {
          grunt.log.error();
          grunt.fail.warn('Unable to delete: "' + f.dest + '" file (' + e.message + ').', e);
        }
      }

      // Function to get the extension a filename
      function getExtension(filename) {
        var ext = path.extname(filename || '').split('.');
        return ext[ext.length - 1];
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
          write(chalk.bold.green("           => Random: " + level + "x" + " "));
        }

        if ( options.log ) {
          write(chalk.bold.green('['));
        }

        for (var i=0; i<level; i++) {
            //** window.btoa(encodeURIComponent(escape( str )));
            //** str = btoa(encodeURIComponent(querystring.escape(str)));
            str = btoa(querystring.escape(str));

            //** unescape(decodeURIComponent(window.atob( str )));
            //** str = 'eval(extract(addslashes(urldecode(base64_decode("' + str + '")))), EXTR_SKIP);';
            str = 'eval(urldecode(base64_decode("' + str + '")));';

            if ( options.log ) {
              write(chalk.bold.green('='));
            }
        }

        if ( options.log ) {
          writeln(chalk.bold.green(']'));
        }

        return str;
      }

      function phpShield() {
        var php_list_encoder = [];
        src.map(function (filename) {
          if (grunt.file.isDir(cwd + separator + filename)) {
            grunt.file.mkdir( f.dest + separator + filename );
          } else {
            // grunt.file.write(f.dest + separator + filename, grunt.file.read(cwd + separator + filename));
            grunt.file.copy(cwd + separator + filename, f.dest + separator + filename);

            if ('php' === getExtension(cwd + separator + filename)) {
              php_list_encoder.push( f.dest + separator + filename );
            }
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
          if (grunt.file.isDir(cwd + separator + filename)) {
            grunt.file.mkdir( f.dest + separator + filename );
          } else {
            if ('php' === getExtension(cwd + separator + filename)) {
              var dir = cwd + separator + filename;
              if ( dir.match( '(' + options.notEncode.join('|') + ')' ) ) {
                if ( options.log ) {
                  writeln(chalk.bold.red('Not Encode => ' + dir));
                }

                grunt.file.copy(dir, f.dest + separator + filename);
              } else {
                if ( options.log ) {
                  writeln(chalk.bold.green('    Encode => ' + dir));
                }

                var tmp = grunt.file.read( dir );
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
            } else {
              grunt.file.copy(cwd + separator + filename, f.dest + separator + filename);
              // grunt.file.write(f.dest + separator + filename, grunt.file.read(cwd + separator + filename));
            }

            if ( options.log ) {
              writeln(chalk.white('      Copy => ' + f.dest + separator + filename));
            }
          }
        });
      }

      writeln('-----------------------------');
      writeln('--                         --');
      writeln('-- Start Module PhpShield! --');
      writeln('--                         --');
      writeln('-----------------------------');

      var separator = '/';
      var src = null;

      if (!validateOptionDefined()) {
        return false;
      }
      if (!validateFilesExist()) {
        return false;
      }

      clear();
      if ( options.base64 ) {
        phpBase64();
      }
      else {
        phpShield();
      }

      var license = "Copyright (c) 2014 Eduardo Malherbi Martins\r\n\r\n";

      license += "Permission is hereby granted, free of charge, to any person\r\n";
      license += "obtaining a copy of this software and associated documentation\r\n";
      license += "files (the \"Software\"), to deal in the Software without\r\n";
      license += "restriction, including without limitation the rights to use,\r\n";
      license += "copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n";
      license += "copies of the Software, and to permit persons to whom the\r\n";
      license += "Software is furnished to do so, subject to the following\r\n";
      license += "conditions:\r\n\r\n";

      license += "The above copyright notice and this permission notice shall be\r\n";
      license += "included in all copies or substantial portions of the Software.\r\n\r\n";

      license += "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,\r\n";
      license += "EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES\r\n";
      license += "OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND\r\n";
      license += "NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT\r\n";
      license += "HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,\r\n";
      license += "WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\r\n";
      license += "FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR\r\n";
      license += "OTHER DEALINGS IN THE SOFTWARE.\r\n";

      // Write the destination file.
      grunt.file.write(f.dest+separator+'LICENSE-MIT', license);

      // Print a success message.
      grunt.log.writeln('Build Successful!');
    });
  });

};
