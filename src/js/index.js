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