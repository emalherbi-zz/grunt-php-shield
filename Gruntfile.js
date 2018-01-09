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
    // Configuration to be run (and then tested).
    phpShield: {
      shield: {
        options: {
          path_exe: 'D:\\PHPShield\\encoder',
          V4: false,
          V5_0: true,
          V5_2: true,
          V5_3: true,
          stop_on_error: false,
          strict_errors: true
        },
        files: [{
          src: ['**'],
          dest: 'tmp/app',
          cwd: 'test/fixtures/app'
        }]
      },
      base64: {
        options: {
          log: true,
          base64: true,
          encodingLevelStart: 2,
          encodingLevelEnd: 5,
          notEncode: ['css', 'js', 'img', 'view', 'config', 'index.php'],
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
    },
    /* commit on gh-pages github */
    'gh-pages': {
      options: {
        base: 'docs/',
        message: 'auto-generated commit'
      },
      src: ['**/*']
    }
  });
  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-gh-pages');
  // Publish to GitHub Pages with Grunt
  grunt.registerTask('ghpages', ['gh-pages']);
  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('testShield', ['phpShield:shield', 'nodeunit']);
  grunt.registerTask('testBase64', ['phpShield:base64', 'nodeunit']);
  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'testBase64']);
};