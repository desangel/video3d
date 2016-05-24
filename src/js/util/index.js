
"use strict";
var classExtend = require('./classExtend');
var core = require('./core');
var object = require('./object');

var blob = require('./blob');
var browser = require('./browser');
var code = require('./code');
var collection = require('./collection');
var cookie = require('./cookie');
var date = require('./date');
var path = require('./path');
var xhr = require('./xhr');

var util = {
	blob: blob,
	browser: browser,
	code: code,
	collection: collection,
	cookie: cookie,
	date: date,
	path: path,
	xhr: xhr
};
util = core.extend(true, util, core, classExtend, object);

module.exports = util;