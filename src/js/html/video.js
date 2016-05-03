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
	var playInline = options.playInline;
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
	dom.addAttribute(element, 'webkit-playsinline', playInline);
	
	for(var i in sources){
		var sourceElement = source.createElement(sources[i]);
		element.appendChild(sourceElement);
	}
	if(checkVideoType(element)==null){
		console.error('video type not supported. please use mp4/webm/ogg.');
		return;
	}
	return element;
}

function checkVideoType(video){
	if(video.canPlayType('video/mp4') === 'maybe'){
		return 'mp4';
	}else if(video.canPlayType('video/webm') === 'maybe'){
		return 'webm';
	}else if(video.canPlayType('video/ogg') === 'maybe'){
		return 'ogg';
	}else{
		return null;
	}
}

module.exports = {
	createElement: createElement,
	checkVideoType: checkVideoType
};