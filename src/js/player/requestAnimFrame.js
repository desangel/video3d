/* global window */
"use strict";
function initRequestAnimationFrame(){
	var lastTime = 0;
	var vendors = ['webkit', 'moz','o','ms'];
	window.requestAnimFrame = window.requestAnimationFrame;
	window.cancelAnimFrame = window.cancelAnimationFrame;
	for(var x = 0; x < vendors.length && !window.requestAnimFrame; ++x) {
		window.requestAnimFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimFrame){
		window.requestAnimFrame = function(callback) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
			timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimFrame){
		window.cancelAnimFrame = function(id) {
			clearTimeout(id);
		};
	}
}
initRequestAnimationFrame();
