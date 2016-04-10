'use strict';
var path = require('path');
var ejs = require('ejs');
var htmlWiring = require('html-wiring');
var mkdirp = require('mkdirp');
var camelCase = require('camel-case');
var yeoman = require('yeoman-generator');

var jqueryWidgetGenerator = yeoman.Base.extend({
    constructor: function() {
        yeoman.Base.apply(this, arguments);

        this.argument('appname', { type: String, required: false });
        var appName = this.appname || "myWidget";
        
        this.appName = camelCase(appName);

        this.env.options.appPath = this.appName || this.options.appPath;

        this.indexFile = htmlWiring.readFileAsString(this.templatePath('demo/index.html'));

        this.resolvePath = function(str) { return path.join(this.env.options.appPath || "", str) };
    },

    writing: {
        git: function() {
            this.fs.copyTpl(
                this.templatePath('gitignore'),
                this.destinationPath(this.resolvePath('.gitignore')),
                {
                    appPath: this.env.options.appPath
                }
            );
        },

        bower: function() {
            this.fs.copyTpl(
                this.templatePath('_bower.json'),
                this.destinationPath(this.resolvePath('bower.json')),
                {
                    appCamelCaseName: camelCase(this.appName)
                }
            );
        },

        writeIndex: function() {
            this.indexFile = htmlWiring.readFileAsString(this.templatePath('demo/index.html'));

            this.indexFile = ejs.render(
                this.indexFile,
                {
                    appName: camelCase(this.appName)
                }
            );

            var vendorJS = [
                '../bower_components/jquery/dist/jquery.js',
                '../bower_components/jquery-ui/jquery-ui.js',
            ];

            this.indexFile = htmlWiring.appendScripts(this.indexFile, 'scripts/vendor.js', vendorJS);

            this.indexFile = htmlWiring.appendScripts(this.indexFile, 'scripts/widget', ["../src/" + this.appName + ".js"]);
        },


        setupEnv: function() {
            mkdirp.sync(
                this.templatePath()
            );

            mkdirp.sync(
                this.destinationPath('/src')
            );

            this.fs.write(
                this.destinationPath(path.join(this.env.options.appPath, '/demo/index.html')),
                this.indexFile
            );
        }
    },

    createJsFile: function() {
        this._writeTemplate(
            ".js",
            'src/js',
            "src/" + this.appName,
            {
                appCamelCaseName: camelCase(this.appName)
            }
        );
    },

    createCssFile: function() {
        this._writeTemplate(
            ".css",
            'src/style',
            "src/" + this.appName,
            {
                appCamelCaseName: camelCase(this.appName)
            }
        );
    },

    _writeTemplate: function(ext, source, destination, data) {
        if (typeof source === 'undefined' || typeof destination === 'undefined') {
            return;
        }

        this.fs.copyTpl(
            this.templatePath(source + ext),
            this.destinationPath(this.resolvePath(destination + ext)),
            data
        );
    },

    install: function() {
        this.bowerInstall('', {
            'config.cwd': this.destinationPath(this.resolvePath(".")),
            'config.directory': "bower_components"
        });
    }
});

module.exports = jqueryWidgetGenerator;