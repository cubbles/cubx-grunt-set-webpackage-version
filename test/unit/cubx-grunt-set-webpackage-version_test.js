/**
 * Created by Edwin Gamboa on 16/05/2017.
 */
/* globals describe,beforeEach,it,afterEach, before */
(function () {
  // function (manifestConverter, manifest831, convertedManifest910) {
  'use strict';
  var grunt;
  var fs;
  var path;
  var testRootPath;
  var manifestPath;
  var testPath;
  var initialVersion;
  var stdin;
  before(function () {
    stdin = require('mock-stdin').stdin();
    initialVersion = '0.1.0-SNAPSHOT';
  });
  beforeEach(function () {
    var webpackageName = 'my-webpackage';
    path = require('path');
    fs = require('fs-extra');
    testRootPath = path.join(process.cwd(), 'test');
    testPath = path.resolve(testRootPath, 'resources', webpackageName);
    manifestPath = path.resolve(testPath, 'manifest.webpackage');

    grunt = require('grunt');
    grunt.task.init = function () {};

    var taskPath = path.resolve(process.cwd(), 'tasks');
    grunt.task.loadTasks(taskPath);
  });

  afterEach(function () {
    var manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.version = initialVersion;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  });
  describe('run grunt task "_setWebpackageVersion", webpackage path configured in param.src', function () {
    var expectedVersion;
    beforeEach(function () {
      // Init config
      grunt.initConfig({
        param: {
          src: testPath
        }
      });
      expectedVersion = '1.2.3';
    });
    afterEach(function () {
      grunt.initConfig({});
    });
    it('should change the webpackage version', function (done) {
      process.nextTick(function () {
        stdin.send(expectedVersion + '\n');
      });
      grunt.tasks([ '_setWebpackageVersion' ], {}, function () {
        fs.readFile(manifestPath, 'utf8', function (err, data) {
          if (err) {
            throw new Error(err);
          } else {
            var manifest = JSON.parse(data);
            manifest.should.have.property('version', expectedVersion);
          }
          done();
        });
      });
    });
  });
  describe('run grunt task "_setWebpackageVersion", webpackage path configured in webpackagepath', function () {
    var expectedVersion;
    beforeEach(function () {
      // Init config
      grunt.initConfig({
        webpackagepath: testPath
      });
      expectedVersion = '1.2.3';
    });
    afterEach(function () {
      grunt.initConfig({});
    });
    it('should change the webpackage version', function (done) {
      process.nextTick(function () {
        stdin.send(expectedVersion + '\n');
      });
      grunt.tasks([ '_setWebpackageVersion' ], {}, function () {
        fs.readFile(manifestPath, 'utf8', function (err, data) {
          if (err) {
            throw new Error(err);
          } else {
            var manifest = JSON.parse(data);
            manifest.should.have.property('version', expectedVersion);
          }
          done();
        });
      });
    });
  });
})();
