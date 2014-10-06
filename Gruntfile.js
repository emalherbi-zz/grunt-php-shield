/*
 * grunt-php-shield
 * https://github.com/emalherbi/grunt-php-shield
 *
 * Copyright (c) 2014 Eduardo Malherbi Martins
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    /* put files not handled in other tasks here */
    copy: {
      main: {
        files: [{
          expand: true,
          dot: true,
          dest: 'tmp/app',
          cwd: 'test/fixtures/app',
          src: ['**']
        }]
      }
    },

    // Configuration to be run (and then tested).
    php_shield: {
      crypto: {
        options: {
          path_exe: 'D:\\PHPShield\\encoder',
          log : true,
          V4 : false,
          V5_0 : true,
          V5_2 : true,
          V5_3 : true,
          stop_on_error : true,
          strict_errors : true
        },
        files: [{
          src: ['**'],
          dest: 'tmp/app',
          cwd: 'test/fixtures/app'
        }]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'php_shield', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
