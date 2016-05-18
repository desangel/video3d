/* global document */
/* jshint node: true */
"use strict";

var variables = require('./variables');
var util = require('./util');
var dom = require('./html');
var media = require('./media');
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
		var video = options.video;
		var control = options.control||{};
		var renderer = options.renderer||{};
		var videoSources = options.videoSources;
		var callbacks = options.callbacks||{};
		var appendVideo = options.appendVideo||false;
		//var fullScreenMode = options.fullScreenMode||false; //全屏模式
		
		//container
		if(typeof container === 'string'){
			container = document.querySelector(container);
		}else if(container == null){
			container = document.createElement('div');
			document.body.appendChild(container);
		}
		container.classList.add(meta.className.container);
		
		//video texture
		if(typeof video === 'string'){
			video = document.querySelector(video);
		}else if(video == null){
			video = domVideo.createElement({
				className: meta.className.video,
				sources: videoSources
			});
			if(appendVideo)container.appendChild(video);
		}
		
		//player
		var player = new Player({
			container: container,
			video: video,
			control: control,
			renderer: renderer
		});
		
		self.container = container;
		self.video = video;
		self.player = player;
		self.util = util;
		self.media = media;
		if(typeof callbacks.init === 'function'){
			callbacks.init(self);
		}
	},
	load: function(){
		this.player.control.load.apply(this.player.control, arguments);
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