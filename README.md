# grunt-php-shield

> Build automatic phpShield

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-php-shield --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-php-shield');
```

## The "php_shield" task

### Overview
In your project's Gruntfile, add a section named `php_shield` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
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
});
```

### Options

#### options.path_exe
Type: `String` <br/>
Default value: ``

A string value that is used to especific path .exe.

#### options.log
Type: `Boolean` <br/>
Default value: `true`

A string value that is used to enabled log.

#### options.V4
Type: `Boolean` <br/>
Default value: `true`

A string value that is used to enabled compiling php version 4.

#### options.V5_0
Type: `Boolean` <br/>
Default value: `true`

A string value that is used to enabled compiling php version 5.0.

#### options.V5_2
Type: `Boolean` <br/>
Default value: `true`

A string value that is used to enabled compiling php version 5.2.

#### options.V5_3
Type: `Boolean` <br/>
Default value: `true`

A string value that is used to enabled compiling php version 5.3.

#### options.stop_on_error
Type: `Boolean` <br/>
Default value: `true`

A string value that is used to stop on script compiling errors.

#### options.strict_errors
Type: `Boolean` <br/>
Default value: `true`

A string value that is used to report E_STRICT compiling errors.

<!--
### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  php_shield: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```
-->

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
2014-10-06   v0.1.1   Update readme.
2014-10-06   v0.1.2   Update readme, add break line.
