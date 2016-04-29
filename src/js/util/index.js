
"use strict";
var classExtend = require('./classExtend');
var core = require('./core');
var object = require('./object');

var collection = require('./collection');
var cookie = require('./cookie');
var date = require('./date');
var path = require('./path');

var util = {
	collection: collection,
	cookie: cookie,
	date: date,
	path: path
};
util = core.extend(true, util, core, classExtend, object);


module.exports = util;