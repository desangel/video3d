
"use strict";
var classExtend = require('./classExtend');
var core = require('./core');
var object = require('./object');

var collection = require('./collection');
var cookie = require('./cookie');
var path = require('./path');

"use strict";

var util = {
	collection: collection,
	cookie: cookie,
	path: path,
};
util = core.extend(true, util, core, classExtend, object);


module.exports = util;