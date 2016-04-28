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