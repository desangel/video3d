
"use strict";
var util = require('../util');
var Stream = require('./stream');
var mp4 = require('./mp4-generator');
var ExpGolomb = require('./exp-golomb');
var Transmuxer = require('./transmuxer');

//var zencoderHaze = require('./zencoder-haze');  //hazeVideo

var media = util.extend(true, {}, Stream, mp4, ExpGolomb, Transmuxer);

module.exports = media;