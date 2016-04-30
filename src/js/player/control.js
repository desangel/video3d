/* global window, document */
"use strict";
require('./requestFullScreen');
var html = require('../html');
var dateHelper = require('../util/date');

var dom = html.dom;

var name = 'control-';
var meta = {
	className: {
		container: 'control',
		scroll: name+'scroll',
		scrollBg: name+'scroll-bg',
		scrollBg1: name+'scroll-bg1',
		scrollBg2: name+'scroll-bg2',
		btnPlay: name+'btn-play',
		btnVolumn: name+'btn-volume',
		btnFullScreen: name+'btn-fullscreen',
		txtTime: name+'txt-time'
	}
};

function Control(options){
	this.init(options);
}
Control.prototype = {
	constructor: Control,
	init: function(options){
		var self = this;
		var namespace = options.namespace;
		var container = options.container;
		var video = options.video;
		var renderer = options.renderer;
		var autoplay = options.autoplay;
		var loop = options.loop;
		
		video.setAttribute('webkit-playsinline','');  //行内播放
		video.setAttribute('preload','');  //行内播放
		
		renderer.keyframe = function(){
			self.keyframe();
		};
		
		var controlContainer = dom.createElement({ className: namespace+meta.className.container});
		var scroll = dom.createElement({ className: namespace+meta.className.scroll });
		var scrollBg = dom.createElement({ className: namespace+meta.className.scrollBg });
		var scrollBg1 = dom.createElement({ className: namespace+meta.className.scrollBg1 });
		var scrollBg2 = dom.createElement({ className: namespace+meta.className.scrollBg2 });
		var btnPlay = dom.createElement({ className: namespace+meta.className.btnPlay });
		var btnVolumn = dom.createElement({ className: namespace+meta.className.btnVolumn });
		var btnFullScreen = dom.createElement({ className: namespace+meta.className.btnFullScreen });
		var txtTime = dom.createElement({ className: namespace+meta.className.txtTime });
		scroll.appendChild(scrollBg);
		scroll.appendChild(scrollBg1);
		scroll.appendChild(scrollBg2);
		controlContainer.appendChild(scroll);
		controlContainer.appendChild(btnPlay);
		controlContainer.appendChild(txtTime);
		
		controlContainer.appendChild(btnFullScreen);
		controlContainer.appendChild(btnVolumn);
		
		container.appendChild(controlContainer);
		
		btnPlay.addEventListener('click', handleBtnPlay);
		btnFullScreen.addEventListener('click', handleBtnFullScreen);
		
		self.container = container;
		self.video = video;
		self.renderer = renderer;
		self.scroll = scroll;
		self.scrollBg1 = scrollBg1;
		self.scrollBg2 = scrollBg2;
		self.btnPlay = btnPlay;
		self.btnVolumn = btnVolumn;
		self.btnFullScreen = btnFullScreen;
		self.txtTime = txtTime;
		
		dom.addAttribute(video,'loop', loop);
		dom.addAttribute(video,'autoplay', autoplay);
		//video.load();
		
		self.play();
		self.pause();
		if(autoplay){
			self.play();
		}
		
		var isInit = false;
		video.addEventListener('canplay', function(){ //canplaythrough ios not support. 2b event
			self.keyframe();
			if(!isInit){
				//self.initPlay();  //will loop this
				isInit = true;
			}
		});
		
		video.addEventListener('ended', function(){
			self.initPlay();
		});
		
		scroll.addEventListener('click', function(e){
			var x = e.x||e.pageX;
			var width = scroll.offsetWidth||1;
			self.playProcess(x/width);
		});
		
		function handleBtnPlay(e){
			var target = e.target||e.srcElement;
			self.togglePlay(target);
		}
		
		function handleBtnFullScreen(){
			var isFullScreen = container.hasAttribute('fullscreen');
			if(isFullScreen){
				self.cancelFullScreen();
			}else{
				self.requestFullScreen();
			}
		}
	},
	keyframe: function(){  //param: renderer
		var self = this;
		var video = self.video;
		var scrollBg1 = self.scrollBg1;
		var scrollBg2 = self.scrollBg2;
		var txtTime = self.txtTime;
		var currentTime = video.currentTime||0;
		var duration = video.duration||1;
		var buffered = video.buffered;
		var bufferedSize = buffered.length;
		var currentBuffer = bufferedSize===0?0:buffered.end(bufferedSize-1);
		
		var loadProgress = Math.floor( currentBuffer/duration*10000 )/100;
		scrollBg1.style.width = loadProgress+'%';
		
		var progress = Math.floor( currentTime/duration*10000 )/100;
		scrollBg2.style.width = progress+'%';
		
		var currentStr = dateHelper.durationToStr(currentTime*1000, 'hh:mm:ss', 'hh');
		var durationStr = dateHelper.durationToStr(duration*1000, 'hh:mm:ss', 'hh');
		txtTime.innerHTML = currentStr + '/' + durationStr;
	},
	initPlay: function(){
		var self = this;
		self.playProcess(0);
		self.keyframe();
		self.pause();
	},
	togglePlay: function(){
		var self = this;
		var target = self.btnPlay;
		var isPause = target.hasAttribute('pause');
		if(isPause){
			self.play();
		}else{
			self.pause();
		}
	},
	play: function(){
		var self = this;
		var target = self.btnPlay;
		target.removeAttribute('pause');
		self.renderer.start();
		self.video.play();
	},
	pause: function(){
		var self = this;
		var target = self.btnPlay;
		target.setAttribute('pause', '');
		self.video.pause();
	},
	stop: function(){
		this.renderer.stop();
		this.pause();
	},
	playProcess: function(progress){  //0 - 1
		var self = this;
		var video = self.video;
		
		var duration = video.duration;
		var currentTime = Math.floor(duration*progress);
		video.currentTime = currentTime;
	},
	requestFullScreen: function(){
		var self = this;
		var target = self.container;
		target.setAttribute('fullscreen', '');
		window.requestFullScreen(target);
	},
	cancelFullScreen: function(){
		var self = this;
		var target = self.container;
		target.removeAttribute('fullscreen');
		document.cancelFullScreen();
	}
};


module.exports = Control;