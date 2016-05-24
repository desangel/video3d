/* global window, document */
"use strict";

require('./EventTarget');

var vendors = ['webkit', 'moz','o','ms'];
var Element = window.Element;

initURL();
initMediaSource();
initRequestAnimationFrame();
initRequestFullScreen();

function initURL(){
	window.URL = window.URL||window.webkitURL;
}

function initMediaSource(){
	window.MediaSource = window.MediaSource||window.WebKitMediaSource;
}

function initRequestAnimationFrame(){
	var lastTime = 0;
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

function initRequestFullScreen(){
	if(!window.requestFullScreen){
		window.requestFullScreen = requestFullScreen;
		hackRequestFullScreen();
		hackCancelFullScreen();
	}
	
	function requestFullScreen(element){
		element.requestFullScreen = element.requestFullScreen;
		for(var x = 0; x < vendors.length && !element.requestFullScreen; ++x) {
			element.requestFullScreen = element[vendors[x]+'RequestFullScreen'];
		}
		if(element.requestFullScreen){
			if(arguments.length<=1){
				element.requestFullScreen.call(element);
			}else{
				element.requestFullScreen.apply(element, arguments.slice(1));
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	function hackRequestFullScreen(){
		for(var x = 0; x < vendors.length && !Element.prototype.requestFullScreen; ++x) {
			Element.prototype.requestFullScreen = Element.prototype[vendors[x]+'RequestFullScreen'];
		}
	}
	
	function hackCancelFullScreen(){
		document.cancelFullScreen = document.exitFullscreen||document.webkitExitFullscreen;
		for(var x = 0; x < vendors.length && !document.cancelFullScreen; ++x) {
			document.cancelFullScreen = document[vendors[x]+'CancelFullScreen'];
		}
	}
}