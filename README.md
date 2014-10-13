# grunt-php-shield

> Build automatic phpShield or encrypt your files in base 64!

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
        base64: false, // change here if you use encryption base64

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
        dest: 'tmp/app',
        cwd: 'test/fixtures/app'
      }]
    }
  },  
});
```

### Options

#### options.base64
Type: `Boolean` <br/>
Default value: `false`

A Boolean value that is used to especific if it is base64 encryption.

#### options.path_exe
Type: `String` <br/>
Default value: ``

A string value that is used to especific path .exe.

#### options.log
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to enabled log.

#### options.V4
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to enabled compiling php version 4.

#### options.V5_0
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to enabled compiling php version 5.0.

#### options.V5_2
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to enabled compiling php version 5.2.

#### options.V5_3
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to enabled compiling php version 5.3.

#### options.stop_on_error
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to stop on script compiling errors.

#### options.strict_errors
Type: `Boolean` <br/>
Default value: `true`

A Boolean value that is used to report E_STRICT compiling errors.

### Usage Examples

##### If you have installed [phpSHIELD](http://www.phpshield.com/) <br />

[1] - Sometimes is necessary to use a real path on your destination for phpShield. <br/>
[2] - This package only encryption files not copy. So use [grunt-contrib-copy](https://www.npmjs.org/package/grunt-contrib-copy) to copy all files to encrypt.

```js
grunt.initConfig({

    // [2]
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

    php_shield: {
      crypto: {
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

##### If you prefer to use base64 encryption of files <br />

[2] - This package only encryption files not copy. So use [grunt-contrib-copy](https://www.npmjs.org/package/grunt-contrib-copy) to copy all files to encrypt.

```js
grunt.initConfig({

    // [2]
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

    php_shield: {
      crypto: {
        options: {
          base64: true
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

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
2014-10-06   v0.1.1   Update readme. <br/>
2014-10-06   v0.1.2   Update readme, add break line. <br/>
2014-10-06   v0.1.3   Update readme. <br/>
2014-10-07   v0.1.4   Add dependencies. <br/>
2014-10-07   v0.1.5   Update devDependencies. <br/>
2014-10-07   v0.1.6   Update dependencies. <br/>
2014-10-07   v0.1.7   Update readme, add usage. <br/>
2014-10-07   v0.1.8   Add usage, grunt-contrib-copy. <br/>
2014-10-13   v0.1.9   Add base64 encryption. <br/>
