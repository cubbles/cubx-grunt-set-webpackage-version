/**
 * Created by Edwin Gamboa on 11/05/2017.
 */

(function () {
  'use strict';

  var fs = require('fs-extra');
  var path = require('path');

  /**
   * The WebpackageVersionSetter can be used to set the version of a webpackage
   * @class WebpackageVersionSetter
   * @global
   * @constructor
   * @param {string} webpackagePath - path of the webpackage to release
   * @param {string} version - Version options provided by the user
   */
  var WebpackageVersionSetter = function (webpackagePath, version) {
    if (!webpackagePath) {
      console.error('WebpackageVersionSetter: webpackagePath parameter is missing.');
      throw new Error('Missed webpackagePath parameter');
    }
    if (!path.isAbsolute(webpackagePath)) {
      this._webpackagePath = path.join(process.cwd(), webpackagePath);
    } else {
      this._webpackagePath = webpackagePath;
    }
    if (!version) {
      console.error('WebpackageVersionSetter: version parameter is missing.');
      throw new Error('Missed version parameter');
    }
    this.manifestPath = path.resolve(this._webpackagePath, 'manifest.webpackage');
    this.version = version;
  };

  /**
   * Update (write) the manifest with the version new
   */
  WebpackageVersionSetter.prototype.setManifestVersion = function () {
    this.manifest = this._loadManifest();
    if (!this._isValidVersion(this.version)) {
      console.error(
        'WebpackageVersionSetter: The provided version (' + this.version + ') is not valid. ' +
        'Note that it can only contain numbers or dot separated numbers. It may finish with' +
        ' \'-SNAPSHOT\' (e.g. 1.0, 1.3.1-SNAPSHOT, 1).'
      );
      throw new Error('Invalid version');
    }
    this.manifest.version = this.version;
    this._writeManifest(this.manifest);
  };

  /**
   * Write the manifest in a file in this.manifestPath
   * @param {object} manifest - Manifest to be written
   * @private
   */
  WebpackageVersionSetter.prototype._writeManifest = function (manifest) {
    fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  };

  /**
   * Load the manifest from this.manifestPath
   * @returns {object} - Loaded manifest
   * @private
   */
  WebpackageVersionSetter.prototype._loadManifest = function () {
    if (!fs.pathExistsSync(this.manifestPath)) {
      console.error(
        'WebpackageVersionSetter: No manifest could be found using the provided webpackage path ' +
        '(' + this._webpackagePath + '). Please provide a webpackage existing path.'
      );
      throw new Error('Webpackage manifest not found');
    }
    var manifest = fs.readFileSync(this.manifestPath, 'utf8');
    return typeof manifest === 'string' ? JSON.parse(manifest) : manifest;
  };

  /**
   * Determines whether a version is a valid version (e.g. 1, 2.3-SNAPSHOT, 1.0.0)
   * @param {string} version - Version to be validated.
   * @returns {boolean}
   * @private
   */
  WebpackageVersionSetter.prototype._isValidVersion = function (version) {
    var pattern = /^(\d+)(\.[\d]+)*(-SNAPSHOT)?$/;
    return pattern.test(version);
  };

  exports = module.exports = WebpackageVersionSetter;
}());
