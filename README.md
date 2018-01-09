# grunt-php-shield

# Build automatic phpShield or Encrypt your files in Base 64!

[![NPM](https://nodei.co/npm/grunt-php-shield.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/grunt-php-shield/)

Example: [grunt-php-shield](http://emalherbi.github.io/grunt-php-shield/)

# Getting Started

This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-php-shield --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-php-shield');
```

# The "phpShield" task

## Overview

In your project's Gruntfile, add a section named `phpShield` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  phpShield: {
    base64: {
      options: {
        ...
      },
      files: [{
        src: ['**'],
        dest: 'tmp/app',
        cwd: 'test/fixtures/app'
      }]
    }
  },
});
```

# Usage Examples

## Encryption your files in base64 <br />

```js
grunt.initConfig({
  phpShield: {
    base64: {
      options: {
        log : true,
        base64 : true,
        encodingLevelStart : 2,
        encodingLevelEnd : 5,
        notEncode: [ 'css', 'js', 'img', 'view', 'config', 'index.php' ]
      },
      files: [{
        src: ['**'],
        dest: 'tmp/app',
        cwd: 'test/fixtures/app'
      }]
    }
  }
});
```

## Or use [phpSHIELD](http://www.phpshield.com/) (Only windows) <br />

[1] - Sometimes is necessary to use a real path on your destination for phpShield. <br/>

```js
grunt.initConfig({
  phpShield: {
    shield: {
      options: {
        path_exe: 'D:\\PHPShield\\encoder',
        log : true,
        V4 : false,
        V5_0 : true,
        V5_2 : true,
        V5_3 : true,
        stop_on_error : false,
        strict_errors : false
      },
      files: [{
        src: ['**'],
        dest: 'D:\\www\\tmp\\app', // [1]
        cwd: 'test/fixtures/app'
      }]
    }
  }
});
```

# Options

## options.log
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to enabled log.

# Options (Base64)

## options.base64
Type: `Boolean` <br/>
Default value: `false`

A Boolean value that is used to especific if it is base64 encryption.

## options.encodingLevelStart
Type: `Number` <br/>
Default value: 0

A Number value that is used to especific how often the encryption will be made.

## options.encodingLevelEnd
Type: `Number` <br/>
Default value: 0

A Number value that is used to especific how often the encryption will be made.

## options.notEncode
Type: `Array` <br/>
Default value: null

A Array value that is used to especific what's files/folders not encode.

# Options (PhpShield)

## options.path_exe
Type: `String` <br/>
Default value: ``

A string value that is used to especific path .exe.

## options.V4
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to enabled compiling php version 4.

## options.V5_0
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to enabled compiling php version 5.0.

## options.V5_2
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to enabled compiling php version 5.2.

## options.V5_3
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to enabled compiling php version 5.3.

## options.stop_on_error
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to stop on script compiling errors.

## options.strict_errors
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to report E_STRICT compiling errors.

# Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
