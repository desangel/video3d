/* global window, document */
"use strict";
require('./requestFullScreen');
var html = require('../html');
var dateHelper = require('../util/date');
var dom = html.dom;
var buttonDom = html.button;

var name = 'control-';
var meta = {
	className: {
		container: 'control',
		scroll: name+'scroll',
		scrollPointer: name+'scroll-pointer',
		scrollTouch: name+'scroll-touch',
		scrollBg: name+'scroll-bg',
		scrollBg1: name+'scroll-bg1',
		scrollBg2: name+'scroll-bg2',
		btnPlay: name+'btn-play',
		btnVolumn: name+'btn-volume',
		btnFullScreen: name+'btn-fullscreen',
		txtTime: name+'txt-time'
	},
	error: {
		'notSupportFullScreen': { msg: '您的浏览器不支持全屏!' }
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
		var scrollTouch = dom.createElement({ className: namespace+meta.className.scrollTouch });
		var scrollPointer = dom.createElement({ className: namespace+meta.className.scrollPointer });
		var scrollBg = dom.createElement({ className: namespace+meta.className.scrollBg });
		var scrollBg1 = dom.createElement({ className: namespace+meta.className.scrollBg1 });
		var scrollBg2 = dom.createElement({ className: namespace+meta.className.scrollBg2 });
		var btnPlay = buttonDom.createElement({ className: namespace+meta.className.btnPlay });
		var btnVolumn = buttonDom.createElement({ className: namespace+meta.className.btnVolumn });
		var btnFullScreen = buttonDom.createElement({ className: namespace+meta.className.btnFullScreen });
		var txtTime = dom.createElement({ className: namespace+meta.className.txtTime });
		scroll.appendChild(scrollTouch);
		scroll.appendChild(scrollPointer);
		scroll.appendChild(scrollBg);
		scroll.appendChild(scrollBg1);
		scroll.appendChild(scrollBg2);
		controlContainer.appendChild(scroll);
		controlContainer.appendChild(btnPlay);
		controlContainer.appendChild(txtTime);
		controlContainer.appendChild(btnFullScreen);
		controlContainer.appendChild(btnVolumn);
		
		container.appendChild(controlContainer);
		
		self.container = container;
		self.video = video;
		self.renderer = renderer;
		self.scroll = scroll;
		self.scrollPointer = scrollPointer;
		self.scrollBg1 = scrollBg1;
		self.scrollBg2 = scrollBg2;
		self.btnPlay = btnPlay;
		self.btnVolumn = btnVolumn;
		self.btnFullScreen = btnFullScreen;
		self.txtTime = txtTime;
		
		dom.addAttribute(video,'loop', loop);
		dom.addAttribute(video,'autoplay', autoplay);
		video.load(); // must call after setting/changing source
		
		self.play();
		self.pause();
		if(autoplay){
			self.play();
		}
		
		//bind event
		var isInit = false;
		var isPlaying = false;
		video.addEventListener('canplay', function(){ //canplaythrough ios not support. 2b event
			renderer.loadVideo(video);
			
			if(self.isPlaying())isPlaying=true;
			self.play();
			if(!isPlaying)self.pause();
			isPlaying=false;
			
			self.keyframe();
			if(!isInit){
				//self.initPlay();  //will loop this
				isInit = true;
			}
		});
		
		video.addEventListener('ended', function(){
			self.initPlay();
		});
		
		var progress = 0;
		var isTouchPointer = false;
		scroll.addEventListener('click', function(e){
			if(isTouchPointer)return;
			//var x = e.x||e.pageX;
			//var width = x - scroll.offsetLeft;
			var width = e.offsetX;
			var total = scroll.offsetWidth||1;
			progress = width/total;
			progress = Math.min(Math.max(0, progress), 1);
			self.playProcess(progress);
		});
		scrollPointer.addEventListener('touchstart', function(){
			if(self.isPlaying())isPlaying=true;
			isTouchPointer = true;
			self.stop();
		});
		scrollPointer.addEventListener('touchmove', function(e){
			if(isTouchPointer){
				var x = e.touches[0].pageX;
				var rect = scroll.getBoundingClientRect();
				var width = x - rect.left;
				var total = scroll.offsetWidth||1;
				progress = width/total;
				progress = Math.min(Math.max(0, progress), 1);
				scrollPointer.style.left = progress*100 + '%';
				scrollBg2.style.width = progress*100 + '%';
			}
		});
		scrollPointer.addEventListener('touchend', function(){
			if(isTouchPointer){
				self.playProcess(progress);
				
				self.play();
				if(isPlaying){
					isPlaying = false;
				}else{
					self.pause();
				}
			}
			isTouchPointer = false;
		});
		
		btnPlay.addEventListener('click', handleBtnPlay);
		btnFullScreen.addEventListener('click', handleBtnFullScreen);
		
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
	load: function(){
		
		
	},
	keyframe: function(){  //param: renderer
		var self = this;
		var video = self.video;
		var scrollPointer = self.scrollPointer;
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
		scrollPointer.style.left = progress+'%';
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
	isPlaying: function(){
		var self = this;
		var target = self.btnPlay;
		var isPause = target.hasAttribute('pause');
		return !isPause;
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
		this.renderer.pause();
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
		if(!window.requestFullScreen(target)){
			window.alert(meta.error.notSupportFullScreen.msg);
		}
	},
	cancelFullScreen: function(){
		var self = this;
		var target = self.container;
		target.removeAttribute('fullscreen');
		document.cancelFullScreen();
	}
};


module.exports = Control;