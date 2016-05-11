/* global document */
/* jshint node: true */
"use strict";

var variables = require('./variables');
var dom = require('./html');
var Player = require('./player');

var namespace = variables.namespace;
var meta = {
	className:{
		container: namespace+'container',
		video: namespace+'video'
	}
};

var domVideo = dom.video;

function Video3d(options){
	var self = this;
	self.init(options);
}
Video3d.prototype = {
	constructor: Video3d,
	init: function(options){
		var self = this;
		options = options||{};
		var container = options.container;
		var control = options.control||{};
		var videoSources = options.videoSources;
		var callbacks = options.callbacks||{};
		//var fullScreenMode = options.fullScreenMode||false; //全屏模式
		
		//video texture
		var video = domVideo.createElement({
			className: meta.className.video,
			sources: videoSources
		});
		
		//container
		if(typeof container === 'string'){
			container = document.getElementById(container);
		}else if(container == null){
			container = document.createElement('div');
			document.body.appendChild(container);
		}
		container.classList.add(meta.className.container);
		
		//player
		var player = new Player({
			container: container,
			video: video,
			control: control
		});
		
		self.container = container;
		self.video = video;
		self.player = player;
		if(typeof callbacks.init === 'function'){
			callbacks.init(self);
		}
	},
	play: function(){
		this.player.control.play();
	},
	pause: function(){
		this.player.control.pause();
	},
	stop: function(){
		this.player.control.stop();
	},
	togglePlay: function(){
		this.player.control.togglePlay();
	}
};


module.exports = Video3d;
global.video3d = Video3d;