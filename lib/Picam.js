"use strict";

var
  Q = require('q'),
  exec = require('child_process').exec,
  path = require('path'),
  fs = require('fs'),
  moment = require('moment');

class Picam {
  constructor(options) {

    options = options || {};

    this.options = {
      path: options.path || path.join(__dirname, '../pics'),
      reverse: options.reverse || false,
      dateFormat: options.dateFormat || 'YYYY-MM-DD_hh:mm:ss.SS',
      dests: options.dests || [{
        postfix: '1full'
      }, {
        postfix: '2hd',
        width: 1280
      }, {
        postfix: '3md',
        width: 640
      }, {
        postfix: '4sd',
        width: 320
      }, ]
    }
  }

  _shootRaw(path, reverse) {
    var revPram = reverse ? '-vf -hf' : '';
    return Q.nfcall(exec, `raspistill ${revPram} -o ${path}`);
  }

  _resizePicture(source, destination, width, height) {

    width = width || -1;
    height = height || -1;

    return Q.nfcall(exec, `nice avconv -i ${source} -vf scale=${width}:${height} ${destination}`);
  }

  _rm(path) {
    return Q.nfcall(fs.unlink, path);
  }

  shoot() {

    var date = moment().format(this.options.dateFormat);
    console.log('shoot', date);
    var rawPath = path.join(this.options.path, `${date}_0raw.jpg`);

    var reverse = this.options.reverse;

    this._shootRaw(rawPath, reverse)
      .then((res) => {
        console.info('picture shooted', res);
        return Q.all(this.options.dests.map((options) => {

          var destPath = path.join(this.options.path, `${date}_${options.postfix}.jpg`);
          console.log('resize', destPath, options.width, options.height);
          return this._resizePicture(rawPath, destPath, options.width, options.height);
        }))
      })
      .then((res) => {
        console.log('all resize good, removing raw file');
        return this._rm(rawPath);
      })
      .then(() => {
        console.log('all good');
      })
      .catch((err) => {
        console.error('error', err);
      })

  }
}

module.exports = Picam;
