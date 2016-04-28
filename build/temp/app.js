/* jshint node: true */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global document  */
/* jshint node: true */

"use strict";

function createElement(options){
	options = options||{};
	var elementType = options.elementType;
	var id = options.id;
	var className = options.className;
	var element = document.createElement(elementType);
	setAttribute(element, 'id', id);
	setAttribute(element, 'class', className);
	return element;
}

function addAttribute(element, attr, value){
	if(value===true){
		setAttribute(element, attr, '');
	}
}
function setAttribute(element, attr, value){
	if(value!==undefined){
		element.setAttribute(attr, value);
	}
}

function attrToStyle(element, names){
	var style = element.getAttribute('style')||'';
	for(var i in names){
		var name = names[i];
		var value = element.getAttribute(name);
		style += name + ':' + value +';';
	}
	setAttribute(element, 'style', style);
	return style;
}
	
function elementToStr(element){
	return element.outerHTML||(function(){
		var container = document.createElement('div');
		container.appendChild(element);
		return container.innerHTML||'';
	})();
}

module.exports = {
	addAttribute: addAttribute,
	attrToStyle: attrToStyle,
	createElement: createElement,
	elementToStr: elementToStr,
	setAttribute: setAttribute
};
},{}],2:[function(require,module,exports){

"use strict";
var dom = require('./dom');
var video = require('./video');

module.exports = {
	dom: dom,
	video: video
};
},{"./dom":1,"./video":4}],3:[function(require,module,exports){
/* jshint node: true */

"use strict";
var dom = require('./dom');
function createElement(options){
	options = options||{};
	var src = options.src;
	var type = options.type;
	var element = dom.createElement({
		elementType: 'source'
	});
	dom.setAttribute(element, 'src', src);
	dom.setAttribute(element, 'type', type);
	return element;
}

module.exports = {
	createElement: createElement
};
},{"./dom":1}],4:[function(require,module,exports){
/* //global document  */
/* jshint node: true */
"use strict";

var dom = require('./dom');
var source = require('./source');

function createElement(options){
	options = options||{};
	var id = options.id;
	var className = options.className;
	var autoplay = options.autoplay;
	var controls = options.controls;
	var height = options.height;
	var loop = options.loop;
	var preload = options.preload;
	var src = options.src;
	var width = options.width;
	var sources = options.sources||[];
	var element = dom.createElement({
		id:id,
		className:className,
		elementType: 'video'
	});
	dom.setAttribute(element, 'width', width);
	dom.setAttribute(element, 'height', height);
	dom.setAttribute(element, 'src', src);
	
	dom.addAttribute(element, 'autoplay', autoplay);
	dom.addAttribute(element, 'controls', controls);
	dom.addAttribute(element, 'loop', loop);
	dom.addAttribute(element, 'preload', preload);
	
	for(var i in sources){
		var sourceElement = source.createElement(sources[i]);
		element.appendChild(sourceElement);
	}
	return element;
}

module.exports = {
	createElement: createElement
};
},{"./dom":1,"./source":3}],5:[function(require,module,exports){
(function (global){
/* global window, document */
/* jshint node: true */
"use strict";

var variables = require('./variables');
var util = require('./util');
var dom = require('./html');
var THREE = require('three');

var namespace = variables.namespace;
var meta = {
	container: {
		id: namespace+'container',
		className: namespace+'container',
	},
	video: {
		id: namespace+'video',
		className: namespace+'video',
	}
};


var domVideo = dom.video;




function Video3d(options){
	var self = this;
	self.init(options);
	window.console.log(util);
	window.console.log(THREE);
}
Video3d.prototype = {
	constructor: Video3d,
	init: function(options){
		var self = this;
		options = options||{};
		var container = options.container;
		//var fullScreenMode = options.fullScreenMode||false; //全屏模式
		var videoSources = options.videoSources;
		var callbacks = options.callbacks||{};
		
		//video texture
		var videoElement = domVideo.createElement({
			id: meta.video.id,
			className: meta.video.className,
			controls: true,
			sources: videoSources
		});
		
		//canvas
		
		
		
		
		//player
		if(typeof container === 'string'){
			container = document.getElementById(container);
		}else if(container == null){
			container = document.createElement('div');
			container.id = meta.container.id;
			container.className = meta.container.className;
			document.body.appendChild(container);
		}
		
		container.appendChild(videoElement);
		
		self.container = container;
		self.videoElement = videoElement;
		
		if(typeof callbacks.init === 'function'){
			callbacks.init(self);
		}
	}
};


module.exports = Video3d;
global.video3d = Video3d;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./html":2,"./util":10,"./variables":13,"three":"three"}],6:[function(require,module,exports){
/* global xyz */
"use strict";
//inheritance
function classExtend(ChildClass, ParentClass){
	var initializing = false, fnTest = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;
	var _super = ParentClass.prototype;
	var prop = ChildClass.prototype;
	var prototype = typeof Object.create === "function" ? Object.create(ParentClass.prototype):new ParentClass();
	for (var name in prop) {
		// Check if we're overwriting an existing function
		prototype[name] = typeof prop[name] === "function" &&
			typeof _super[name] === "function" && fnTest.test(prop[name]) ?
			createCallSuperFunction(name, prop[name]) : prop[name];
	}
	initializing = true;
	ChildClass.prototype = prototype;
	ChildClass.prototype.constructor = ChildClass;
	
	function createCallSuperFunction(name, fn){
		return function() {
			var tmp = this._super;
		
			// Add a new ._super() method that is the same method
			// but on the super-class
			this._super = _super[name];
		
			// The method only need to be bound temporarily, so we
			// remove it when we're done executing
			var ret = fn.apply(this, arguments);
			this._super = tmp;
		
			return ret;
		};
	}
}

module.exports = classExtend;
},{}],7:[function(require,module,exports){
"use strict";
function is(arr, element){
	for(var i = 0; i<arr.length; i++){
		if(typeof element === 'function'){
			if(element(i, arr[i])){return true;}
		}else{
			if(arr[i]===element){return true;}
		}
	}
	return false;
}

module.exports = {
	is: is
};
},{}],8:[function(require,module,exports){
/* global document, window  */
"use strict";
function addCookie(name, value, attr){
	var str = "";
	if(attr){
		for(var prop in attr){
			str+=";"+prop+"="+attr[prop];
		}
	}
	document.cookie = name + "=" + window.escape(value) + str;
}
function deleteCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null){
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
}
function getCookie(name){
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null){
		return (arr[2]);
	}
	return null;
}
function getDocumentCookie(){
	return document.cookie;
}

module.exports = {
	addCookie: addCookie,
	deleteCookie: deleteCookie,
	getCookie: getCookie,
	getDocumentCookie: getDocumentCookie
};
},{}],9:[function(require,module,exports){
/* //global document, window  */
"use strict";

var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;

function isFunction( obj ) {
	return type(obj) === "function";
}
function isArray( obj ) {
	return type(obj) === "array";
}
function isWindow( obj ) {
	return obj != null && obj === obj.window;
}
function isNumeric( obj ) {
	// parseFloat NaNs numeric-cast false positives (null|true|false|"")
	// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
	// subtraction forces infinities to NaN
	// adding 1 corrects loss of precision from parseFloat (#15100)
	return !isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
}
function isEmptyObject( obj ) {
	var name;
	for ( name in obj ) {
		return false;
	}
	return true;
}
function isPlainObject( obj ) {
	var key;
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if ( !obj || type(obj) !== "object" || obj.nodeType || isWindow( obj ) ) {
		return false;
	}
	try {
		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
	} catch ( e ) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}
	// Support: IE<9
	// Handle iteration over inherited properties before own properties.
	//if ( support.ownLast ) {
	//	for ( key in obj ) {
	//		return hasOwn.call( obj, key );
	//	}
	//}
	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	for ( key in obj ) {}
	return key === undefined || hasOwn.call( obj, key );
}
function type( obj ) {
	if ( obj == null ) {
		return obj + "";
	}
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call(obj) ] || "object" :
		typeof obj;
}
function extend(){
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;
		// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}
	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target)) {
		target = {};
	}
	// extend itself if only one argument is passed
	if ( i === length ) {
		target = {}; //this
		i--;
	}
	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];
				// do not copy prototype function
				if ( !options.hasOwnProperty(name)){
					continue;
				}
				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}
				// Recurse if we're merging plain objects or arrays

				if ( name!== 'parent' && deep && copy && !isPlainObject(copy) &&  typeof  copy.clone === "function" ){
					//remove parent for no dead loop
					//clone is for classType object
					target[ name ] = copy.clone();
					if(target[ name ] ===undefined){ target[ name ]  = copy; }
				} else if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}
					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );
				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}
	// Return the modified object
	return target;
}

module.exports = {
	isFunction: isFunction,
	isArray: Array.isArray || isArray,
	isWindow: isWindow,
	isNumeric: isNumeric,
	isEmptyObject: isEmptyObject,
	isPlainObject: isPlainObject,
	type: type,
	extend: extend
};
},{}],10:[function(require,module,exports){

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
},{"./classExtend":6,"./collection":7,"./cookie":8,"./core":9,"./object":11,"./path":12}],11:[function(require,module,exports){
"use strict";
//ECMA SCRIPT 5
function defineProperty(obj, name, prop){
	if(typeof Object.defineProperty ==='function'){
		Object.defineProperty(obj, name, prop);
	}
	else{
		obj[name] = prop['value'];
	}
}

function defineProperties(obj, props){
	if(typeof Object.defineProperties ==='function'){
		Object.defineProperties(obj, props);
	}
	else{
		for(var i in props){
			var prop = props[i];
			obj[i] = prop['value'];
		}
	}
}
module.exports = {
	defineProperty: defineProperty,
	defineProperties: defineProperties
};
},{}],12:[function(require,module,exports){
/* global document */
"use strict";
function findCurrentPath(){
	return document.currentScript&&document.currentScript.src||(function(){
		//for IE10+ Safari Opera9
		var a = {}, stack;
		try{
			a.b();
		}catch(e){
			stack = e.stack || e.sourceURL || e.stacktrace;
		}
		var rExtractUri = /(?:http|https|file):\/\/.*?\/.+?.js/, 
        absPath = rExtractUri.exec(stack);
		return absPath[0] || '';
	})()||(function(){
		// IE5.5 - 9
		var scripts = document.scripts;
	    var isLt8 = ('' + document.querySelector).indexOf('[native code]') === -1;
	    for (var i = scripts.length - 1, script; script = scripts[i--];){
	       if (script.readyState === 'interative'){
	          return isLt8 ? script.getAttribute('src', 4) : script.src;   
	       }
	    }
	})();
}
module.exports = {
	findCurrentPath: findCurrentPath
};
},{}],13:[function(require,module,exports){

"use strict";
module.exports = {
	namespace: 'video3d-'
};
},{}]},{},[5,13]);
