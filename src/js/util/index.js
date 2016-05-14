
"use strict";
require('./hack');
var classExtend = require('./classExtend');
var core = require('./core');
var object = require('./object');

var browser = require('./browser');
var code = require('./code');
var collection = require('./collection');
var cookie = require('./cookie');
var date = require('./date');
var path = require('./path');

var util = {
	browser: browser,
	code: code,
	collection: collection,
	cookie: cookie,
	date: date,
	path: path
};
util = core.extend(true, util, core, classExtend, object);

module.exports = util;