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