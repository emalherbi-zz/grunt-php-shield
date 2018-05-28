/*
 * grunt-php-shield
 * https://github.com/emalherbi/grunt-php-shield
 *
 * Copyright (c) 2014 Eduardo Malherbi Martins
 * Licensed under the MIT license.
 */
'use strict';
module.exports = function(grunt) {
  // Please see the Grunt documentation for more information regarding task creation: http://gruntjs.com/creating-tasks
  var task = function() {
    // ***************************************
    var path = require('path');
    var btoa = require('btoa');
    var querystring = require('querystring');
    var chalk = require('chalk');
    var exec = require('child_process').execSync;
    // ***************************************
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      log: false,
      // base64
      base64: false,
      encodingLevelStart: 0,
      encodingLevelEnd: 0,
      notEncode: null,
      // phpShield
      path_exe: '',
      V4_0: false,
      V5_0: false,
      V5_2: false,
      V5_3: false,
      V5_4: false,
      V5_5: false,
      V5_6: false,
      V7_0: false,
      V7_1: false,
      V7_2: false,
      stop_on_error: false,
      strict_errors: false,
      is_source_guardian: false
    });
    // ***************************************
    var Utils = {
      // create a dir
      createDir: function(src, dest) {
        if (grunt.file.isDir(src)) {
          grunt.file.mkdir(dest);
          if (options.log) {
            Utils.writeln(chalk.gray.bold('  create dir => ' + dest));
          }
          return true;
        }
        return false;
      },
      // move files
      copyFiles: function(src, dest) {
        grunt.file.copy(src, dest);
        if (options.log) {
          Utils.writeln(chalk.gray('  copy files => ' + dest));
        }
        return true;
      },
      // function to get the extension a filename
      getExtension: function(filename) {
        var ext = path.extname(filename || '').split('.');
        return ext[ext.length - 1];
      },
      // grunt log
      writeln: function(str) {
        grunt.log.writeln(str);
        return true;
      }
    };
    // ***************************************
    var base64 = {
      init: function(src, cwd, dest, separator) {
        src.map(function(filename) {
          var pathSrc = cwd + separator + filename;
          var pathDest = dest + separator + filename;
          //
          if (Utils.createDir(pathSrc, pathDest)) {
            return;
          }
          //
          if ('php' === Utils.getExtension(pathSrc)) {
            if (pathSrc.match('(' + options.notEncode.join('|') + ')')) {
              base64.notEncode(pathSrc, pathDest);
            } else {
              base64.encode(pathSrc, pathDest);
            }
            return;
          }
          //
          if (Utils.copyFiles(pathSrc, pathDest)) {
            return;
          }
        });
        return true;
      },
      encode: function(pathSrc, pathDest) {
        if (options.log) {
          Utils.writeln(chalk.bold.green('  encode => ' + pathSrc));
        }
        var tmp = grunt.file.read(pathSrc);
        tmp = tmp.replace('<?php', '');
        tmp = tmp.replace('<?', '');
        tmp = tmp.replace('?>', '');
        //
        var level = (options.encodingLevelStart === 0 || options.encodingLevelEnd === 0) ?
          Math.floor((Math.random() * 10) + 1) :
          Math.floor(Math.random() * (options.encodingLevelEnd - options.encodingLevelStart)) + options.encodingLevelStart;
        if (options.log) {
          Utils.writeln(chalk.bold.green('             => random: ' + level + 'x' + ' '));
        }
        //
        for (var i = 0; i < level; i++) {
          tmp = btoa(querystring.escape(tmp.replace(/\\>\s+\\</g, '')));
          tmp = 'eval(urldecode(base64_decode("' + tmp + '")));';
        }
        //
        var file = '<?php';
        file += '\r\n';
        file += tmp;
        file += '\r\n';
        file += '?>';
        grunt.file.write(pathDest, file);
        return true;
      },
      notEncode: function(pathSrc, pathDest) {
        var result = Utils.copyFiles(pathSrc, pathDest);
        if (options.log && result) {
          Utils.writeln(chalk.bold.white('  not encode => ' + pathDest));
        }
        return result;
      }
    };
    var shield = {
      init: function(src, cwd, dest, separator) {
        var php_list_encoder = [];
        src.map(function(filename) {
          var pathSrc = cwd + separator + filename;
          var pathDest = dest + separator + filename;
          //
          if (Utils.createDir(pathSrc, pathDest)) {
            return;
          }
          //
          Utils.copyFiles(pathSrc, pathDest);
          //
          if ('php' === Utils.getExtension(pathSrc)) {
            if (filename.match('(' + options.notEncode.join('|') + ')')) {
              if (options.log) {
                Utils.writeln(chalk.bold.white('  not encode => ' + pathDest));
              }
            } else {
              if (options.log) {
                Utils.writeln(chalk.bold.green('  encode => ' + pathDest));
              }
              php_list_encoder.push(pathDest);
            }
          } else {
            if (options.log) {
              Utils.writeln(chalk.bold.white('  copy => ' + pathDest));
            }
          }
        });
        // only windows
        grunt.file.write(options.path_exe + separator + 'encodeShield', php_list_encoder.join('\n'));
        //
        var V4_0 = (options.V4_0) ? '-V4' : '';
        var V5_0 = (options.V5_0) ? '-V5.0' : '';
        var V5_2 = (options.V5_2) ? '-V5.2' : '';
        var V5_3 = (options.V5_3) ? '-V5.3' : '';
        var V5_4 = (options.V5_4) ? '-V5.4' : '';
        var V5_5 = (options.V5_4) ? '-V5.5' : '';
        var V5_6 = (options.V5_4) ? '-V5.6' : '';
        var V7_0 = (options.V7_0) ? '-V7.0' : '';
        var V7_1 = (options.V7_1) ? '-V7.1' : '';
        var V7_2 = (options.V7_2) ? '-V7.2' : '';
        //
        var stop_on_error = (options.stop_on_error) ? '--stop-on-error' : '';
        var strict_errors = (options.strict_errors) ? '--strict-errors' : '';
        //
        // exec cmd command phpShield
        var command = '';
        if (options.is_source_guardian) {
          command += '"' + options.path_exe + separator + 'sgencoder.exe" ';
        } else {
          command += '"' + options.path_exe + separator + 'phpshield.exe" ';
        }
        command += strict_errors + ' ' + stop_on_error + ' ';
        command += V4_0 + ' ' + V5_0 + ' ' + V5_2 + ' ' + V5_3 + ' ';
        command += V5_4 + ' ' + V5_5 + ' ' + V5_6 + ' ' + V7_0 + ' ' + V7_1 + ' ' + V7_2 + ' ';
        command += ' -b- @"' + options.path_exe + separator + 'encodeShield"';
        //
        if (options.log) {
          Utils.writeln(command);
        }
        //
        exec(command, function(error, stdout, stderr) {
          if (error) {
            grunt.log.warn('phpShield exec error: ' + error);
          }
          Utils.writeln('stdout: ' + stdout);
          Utils.writeln('stderr: ' + stderr);
        });
        //
        return true;
      }
    };
    // ***************************************
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      //
      Utils.writeln(chalk.blue.bold('--------------------'));
      Utils.writeln(chalk.blue.bold('- Start PhpShield! -'));
      Utils.writeln(chalk.blue.bold('--------------------'));
      //
      var separator = '/';
      var src = null;
      var cwd = '.' + separator;
      var dest = '.' + separator;
      //
      if (f.cwd) {
        cwd += f.cwd;
      }
      if (f.dest) {
        dest += f.dest;
      }
      // validate if one option is defined.
      if (options.path_exe.trim() === '' && options.base64 === false) {
        grunt.log.warn('The path_exe or base64 are not defined! Please defined one option.');
        return false;
      }
      // validate if files exist.
      src = f.src.filter(function(filename) {
        if (!grunt.file.exists(cwd + separator + filename)) {
          grunt.log.warn('Source file "' + cwd + separator + filename + '" not found.');
          return false;
        }
        return true;
      });
      if (src === null) {
        return false;
      }
      // crypto files
      var result = false;
      if (options.base64) {
        result = base64.init(src, cwd, dest, separator);
      } else {
        result = shield.init(src, cwd, dest, separator);
      }
      // print a success message.
      if (result) {
        grunt.log.ok('Build Successful!');
      }
    });
  };
  grunt.registerMultiTask('phpShield',
    'Build automatic phpShield or Encrypt your files in base 64!',
    task);
  grunt.registerMultiTask('phpshield',
    'Build automatic phpShield or Encrypt your files in base 64!',
    task);
  grunt.registerMultiTask('php_shield',
    'Build automatic phpShield or Encrypt your files in base 64!',
    task);
  grunt.registerMultiTask('php_Shield',
    'Build automatic phpShield or Encrypt your files in base 64!',
    task);
};