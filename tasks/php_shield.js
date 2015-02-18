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

    /***************************************/

    // Grunt log ln
    var writeln = function(str) {
      grunt.log.writeln(str);
    };

    // Grunt log
    var write = function(str) {
      grunt.log.write(str);
    };

    /***************************************/

    var Utils = {

      // Create a dir
      createDir : function(src, dest) {
        if (grunt.file.isDir(src)) {
          grunt.file.mkdir(dest);
          return true;
        }
        return false;
      },

      // Move files
      copyFiles : function(src, dest) {
        grunt.file.copy(src, dest);
        return true;
      },

      // Function to get the extension a filename
      getExtension : function(filename) {
        var ext = path.extname(filename || '').split('.');
        return ext[ext.length - 1];
      }
    };

    /***************************************/

    var base64 = {

      createDir : function(pathSrc, pathDest) {
        var result = Utils.createDir(pathSrc, pathDest);
        if (options.log && result) {
          writeln(chalk.gray.bold('  Create Dir => ' + pathDest));
        }
        return result;
      },
      copyFiles : function(pathSrc, pathDest) {
        var result = Utils.copyFiles(pathSrc, pathDest);

        if (options.log && result) {
          writeln(chalk.gray('  Copy Files => ' + pathDest));
        }

        return result;
      },
      encode : function(pathSrc, pathDest) {
        if ( options.log ) {
          writeln(chalk.bold.green('      Encode => ' + pathSrc));
        }

        var tmp = grunt.file.read( pathSrc );
        tmp = tmp.replace("<?php", "");
        tmp = tmp.replace("<?", "");
        tmp = tmp.replace("?>", "");
        tmp = encrypto(tmp, options.encodingLevelStart, options.encodingLevelEnd);

        var file = "<?php";
        file += "\r\n";
        file += tmp;
        file += "\r\n";
        file += "?>";

        grunt.file.write(pathDest, file);
        return true;
      },
      notEncode : function(pathSrc, pathDest) {
        var result = Utils.copyFiles(pathSrc, pathDest);
        if (options.log && result) {
          writeln(chalk.bold.red('  Not Encode => ' + pathDest));
        }
        return result;
      }
    };

    /***************************************/

    // Encrypto Php Files
    var encrypto = function(str, levelStart, levelEnd) {
      var level = (levelStart === 0 || levelEnd === 0) ?
        Math.floor((Math.random() * 10) + 1)
        : level = Math.floor(Math.random() * (levelEnd - levelStart)) + levelStart;

      if (options.log) {
        writeln(chalk.bold.green("             => Random: " + level + "x" + " "));
      }

      for (var i=0; i<level; i++) {
        str = btoa(querystring.escape(str.replace(/\\>\s+\\</g,'')));
        str = 'eval(urldecode(base64_decode("' + str + '")));';
      }

      return str;
    };

    /***************************************/

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      /********************************/
      /***   PHP SHIELD             ***/
      /********************************/

      var phpShield = function() {
        var php_list_encoder = [];
        src.map(function (filename) {
          if (grunt.file.isDir(cwd + separator + filename)) {
            grunt.file.mkdir( f.dest + separator + filename );
          } else {
            grunt.file.copy(cwd + separator + filename, f.dest + separator + filename);

            if ('php' === Utils.getExtension(cwd + separator + filename)) {
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
      };

      /********************************/
      /***   PHP BASE64             ***/
      /********************************/

      var phpBase64 = function() {
        src.map(function (filename) {
          var pathSrc  = cwd    + separator + filename;
          var pathDest = f.dest + separator + filename;

          if (base64.createDir(pathSrc, pathDest)) {
            return;
          }

          if ('php' === Utils.getExtension(pathSrc)) {
            if (pathSrc.match('(' + options.notEncode.join('|') + ')')) {
              base64.notEncode(pathSrc, pathDest);
            } else {
              base64.encode(pathSrc, pathDest);
            }
            return;
          }

          if (base64.copyFiles(pathSrc, pathDest)) {
            return;
          }
        });
      };

      writeln(chalk.blue.bold('---------------------------'));
      writeln(chalk.blue.bold('- Start Module PhpShield! -'));
      writeln(chalk.blue.bold('---------------------------'));

      var separator = '/';
      var src = null;

      // create a cmd var even if not used to reduce errors
      var cwd = '';
      if (f.cwd) {
        cwd = f.cwd;
      }

      // validate if one option is defined.
      if (options.path_exe.trim() === '' && options.base64 === false) {
        grunt.log.warn('The path_exe or base64 are not defined! Please defined one option.'); return false;
      }

      // validate if files exist.
      src = f.src.filter(function(filename) {
        if (!grunt.file.exists(cwd + separator + filename)) {
          grunt.log.warn('Source file "' + cwd + separator + filename + '" not found.'); return false;
        }
        return true;
      });

      if (src === null) {
        return false;
      }

      // clear dist
      try {
        rimraf.sync( f.dest );
      } catch (e) {
        grunt.log.error();
        grunt.fail.warn('Unable to delete: "' + f.dest + '" file (' + e.message + ').', e);
      }

      // encrypto files
      if (options.base64) {
        phpBase64();
      }
      else {
        phpShield();
      }

      // Print a success message.
      grunt.log.writeln('Build Successful!');
    });
  });

};
