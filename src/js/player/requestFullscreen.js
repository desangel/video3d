/* global window, document */
"use strict";
function initRequestFullScreen(){
	var vendors = ['webkit', 'moz','o','ms'];
	if(!window.requestFullScreen){
		window.requestFullScreen = requestFullScreen;
		hackCancelFullScreen();
	}
	
	function requestFullScreen(element){
		element.requestFullScreen = element.requestFullScreen;
		for(var x = 0; x < vendors.length && !element.requestFullScreen; ++x) {
			element.requestFullScreen = element[vendors[x]+'RequestFullScreen'];
		}
		if(arguments.length<=1){
			element.requestFullScreen.call(element);
		}else{
			element.requestFullScreen.apply(element, arguments.slice(1));
		}
	}
	
	
	function hackCancelFullScreen(){
		document.cancelFullScreen = document.exitFullscreen||document.webkitExitFullscreen;
		for(var x = 0; x < vendors.length && !document.cancelFullScreen; ++x) {
			document.cancelFullScreen = document[vendors[x]+'CancelFullScreen'];
		}
	}
}
initRequestFullScreen();
