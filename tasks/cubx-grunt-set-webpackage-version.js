'use strict';
var inquirer = require('inquirer');
var WebpackageVersionSetter = require('cubx-set-webpackage-version');

module.exports = function (grunt) {
  grunt.registerTask('_setWebpackageVersion', 'Set the version of a webpackage', function () {
    var webpackagePath = grunt.config.get('param.src');

    if (!webpackagePath) {
      webpackagePath = grunt.config.get('webpackagepath');
    }
    if (!webpackagePath) {
      throw new Error('webpackagePath missed. Please defined the option webpackagePath.');
    }
    var pattern = /^(\d+)(\.[\d]+)*(-SNAPSHOT)?$/;
    var options = {
      questions: [
        {
          name: 'version',
          type: 'input',
          message: 'Please type the version to be set to the webpackage (e.g. \'1.0.0\' or \'1.0.0-SNAPSHOT\'):',
          validate: function (input) {
            if (!pattern.test(input)) {
              throw new Error('Invalid version. Please provide a valid version ' +
                'e.g. \'1.0.0\' or \'1.0.0-SNAPSHOT\'.');
            }
            return true;
          }
        }
      ]
    };
    var done = this.async();
    inquirer.prompt(options.questions).then(function (result) {
      // set version
      var wpVersionSetter = new WebpackageVersionSetter(webpackagePath, result.version);
      wpVersionSetter.setManifestVersion();
      done();
    });
  });
};
