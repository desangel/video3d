/* jshint node: true */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* //global document  */
/* jshint node: true */
"use strict";

var dom = require('./dom');

function createElement(options){
	options = options||{};
	var id = options.id;
	var className = options.className;
	var type = options.type||'button';
	var name = options.name;
	var value = options.value;
	var html = options.html||'';
	
	var disabled = options.disabled;
	var autofocus = options.autofocus;
	
	var element = dom.createElement({
		id:id,
		className:className,
		elementType: 'button'
	});
	dom.setAttribute(element, 'type', type);
	dom.setAttribute(element, 'name', name);
	dom.setAttribute(element, 'value', value);
	dom.addAttribute(element, 'disabled', disabled);
	dom.addAttribute(element, 'autofocus', autofocus);
	element.innerHTML = html;
	return element;
}

module.exports = {
	createElement: createElement
};
},{"./dom":2}],2:[function(require,module,exports){
/* global document  */
/* jshint node: true */

"use strict";

function createElement(options){
	options = options||{};
	var elementType = options.elementType||'div';
	var id = options.id;
	var className = options.className;
	var element = document.createElement(elementType);
	setAttribute(element, 'id', id);
	setAttribute(element, 'class', className);
	return element;
}

function addAttribute(element, attr, value){
	if(value===true){
		setAttribute(element, attr, '');
	}
}
function setAttribute(element, attr, value){
	if(value!==undefined){
		element.setAttribute(attr, value);
	}
}

function attrToStyle(element, names){
	var style = element.getAttribute('style')||'';
	for(var i in names){
		var name = names[i];
		var value = element.getAttribute(name);
		style += name + ':' + value +';';
	}
	setAttribute(element, 'style', style);
	return style;
}
	
function elementToStr(element){
	return element.outerHTML||(function(){
		var container = document.createElement('div');
		container.appendChild(element);
		return container.innerHTML||'';
	})();
}

module.exports = {
	addAttribute: addAttribute,
	attrToStyle: attrToStyle,
	createElement: createElement,
	elementToStr: elementToStr,
	setAttribute: setAttribute
};
},{}],3:[function(require,module,exports){

"use strict";
var dom = require('./dom');
var button = require('./button');
var video = require('./video');

module.exports = {
	dom: dom,
	button: button,
	video: video
};
},{"./button":1,"./dom":2,"./video":5}],4:[function(require,module,exports){
/* jshint node: true */

"use strict";
var dom = require('./dom');
function createElement(options){
	options = options||{};
	var src = options.src;
	var type = options.type;
	var element = dom.createElement({
		elementType: 'source'
	});
	dom.setAttribute(element, 'src', src);
	dom.setAttribute(element, 'type', type);
	return element;
}

module.exports = {
	createElement: createElement
};
},{"./dom":2}],5:[function(require,module,exports){
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
},{"./dom":2,"./source":4}],6:[function(require,module,exports){
(function (global){
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./html":3,"./player":8,"./variables":22}],7:[function(require,module,exports){
/* global window, document */
"use strict";
require('./requestFullScreen');
var variables = require('../variables');
var html = require('../html');
var util = require('../util');
var dom = html.dom;
var buttonDom = html.button;

var namespace = variables.namespace;
var displayHidden = variables.displayHidden;
var dateHelper = util.date;

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
		btnVolume: name+'btn-volume',
		btnSwipe: name+'btn-swipe',
		btnFullScreen: name+'btn-fullscreen',
		txtTime: name+'txt-time'
	},
	error: {
		'notSupportFullScreen': { msg: '您的浏览器不支持全屏!' }
	}
};

var defaultControlOptions = {
	autoplay: false,
	loop: false,
	scroll: true,
	btnPlay: true,
	btnVolume: true,
	btnSwipe: true,
	btnFullScreen: true,
	txtTime: true,
	dragFile: true
};

function Control(options){
	this.init(options);
}
Control.prototype = {
	constructor: Control,
	init: function(options){
		var self = this;
		var container = options.container;
		var video = options.video;
		var renderer = options.renderer;
		var controlOptions = util.extend({}, defaultControlOptions, options.control);
		var autoplay = controlOptions.autoplay;
		var loop = controlOptions.loop;
		var dragFile = controlOptions.dragFile;
		
		video.setAttribute('webkit-playsinline','');  //行内播放
		video.setAttribute('preload','');  //行内播放
		
		renderer.keyframe = function(){
			self.keyframe();
		};
		if(dragFile){
			var canvas = renderer.renderer.domElement;
			canvas.addEventListener( 'dragover', handleDragFile, false );
			canvas.addEventListener( 'drop', handleDropFile, false );
		}
		
		var controlContainer = dom.createElement({ className: namespace+meta.className.container });
		var scroll = dom.createElement({ className: namespace+meta.className.scroll });
		var scrollTouch = dom.createElement({ className: namespace+meta.className.scrollTouch });
		var scrollPointer = dom.createElement({ className: namespace+meta.className.scrollPointer });
		var scrollBg = dom.createElement({ className: namespace+meta.className.scrollBg });
		var scrollBg1 = dom.createElement({ className: namespace+meta.className.scrollBg1 });
		var scrollBg2 = dom.createElement({ className: namespace+meta.className.scrollBg2 });
		var btnPlay = buttonDom.createElement({ className: namespace+meta.className.btnPlay });
		var btnVolume = buttonDom.createElement({ className: namespace+meta.className.btnVolume });
		var btnSwipe = buttonDom.createElement({ className: namespace+meta.className.btnSwipe });
		var btnFullScreen = buttonDom.createElement({ className: namespace+meta.className.btnFullScreen });
		var txtTime = dom.createElement({ className: namespace+meta.className.txtTime });
		
		var controlComponents = {
			scroll: scroll,
			btnPlay: btnPlay,
			btnVolume: btnVolume,
			btnSwipe: btnSwipe,
			btnFullScreen: btnFullScreen,
			txtTime: txtTime
		};
		for(var i in controlComponents){
			var component = controlComponents[i];
			var componentOption = controlOptions[i];
			if(!componentOption){
				component.classList.add(displayHidden);
			}
		}
		
		scroll.appendChild(scrollTouch);
		scroll.appendChild(scrollPointer);
		scroll.appendChild(scrollBg);
		scroll.appendChild(scrollBg1);
		scroll.appendChild(scrollBg2);
		controlContainer.appendChild(scroll);
		controlContainer.appendChild(btnPlay);
		controlContainer.appendChild(txtTime);
		controlContainer.appendChild(btnFullScreen);
		controlContainer.appendChild(btnSwipe);
		controlContainer.appendChild(btnVolume);
		
		container.appendChild(controlContainer);
		
		self.container = container;
		self.video = video;
		self.renderer = renderer;
		self.scroll = scroll;
		self.scrollPointer = scrollPointer;
		self.scrollBg1 = scrollBg1;
		self.scrollBg2 = scrollBg2;
		self.btnPlay = btnPlay;
		self.btnVolume = btnVolume;
		self.btnSwipe = btnSwipe;
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
		
		self.renderVolume();
		self.useTouch();
		
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
		
		video.addEventListener('volumechange', function(){
			//no validate in mobile to set volume
			self.renderVolume();
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
		btnVolume.addEventListener('click', handleBtnVolume);
		btnSwipe.addEventListener('click', handleBtnSwipe);
		btnFullScreen.addEventListener('click', handleBtnFullScreen);
		
		
		function handleBtnPlay(e){
			var target = e.target||e.srcElement;
			self.togglePlay(target);
		}
		
		function handleBtnVolume(){
			self.toggleVolume();
		}
		
		function handleBtnSwipe(){
			self.toggleSwipe();
		}
		
		function handleBtnFullScreen(){
			var isFullScreen = container.hasAttribute('fullscreen');
			if(isFullScreen){
				self.cancelFullScreen();
			}else{
				self.requestFullScreen();
			}
		}
		
		function handleDragFile(e){
			e.stopPropagation();
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
		}
		
		function handleDropFile(e){
			e.stopPropagation();
			e.preventDefault();
			var files = e.dataTransfer.files;
			var file = files[0];
			var src = window.URL.createObjectURL(file);
			loadVideo(src);
		}
		
		function loadVideo(src){
			self.stop();
			video.src = src;
			video.load();
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
	toggleVolume: function(){  //set muted
		var self = this;
		var video = self.video;
		if(video.muted){
			video.muted = false;
		}else{
			video.muted = true;
		}
		self.renderVolume();
	},
	renderVolume: function(){
		var self = this;
		var video = self.video;
		var target = self.btnVolume;
		var volume = video.volume;
		var muted = video.muted;
		if(muted){
			target.setAttribute('volume', 0);
		}else{
			if(volume<0.333){
				target.setAttribute('volume', 1);
			}else if(volume>=0.333&&volume<0.667){
				target.setAttribute('volume', 2);
			}else{
				target.setAttribute('volume', 3);
			}
		}
	},
	setVolume: function(volume){  //0.0 - 1.0
		var self = this;
		var video = self.video;
		var target = self.btnVolume;
		if(volume<0.333){
			target.setAttribute('volume', 1);
		}else if(volume>=0.333&&volume<0.667){
			target.setAttribute('volume', 2);
		}else{
			target.setAttribute('volume', 3);
		}
		video.volume = volume;
	},
	toggleSwipe: function(){
		var self = this;
		var target = self.btnSwipe;
		var type = target.getAttribute('swipe_type');
		if(type==='motion'){
			self.useTouch();
		}else if(window.DeviceMotionEvent){
			self.useDeviceMotion();
		}
	},
	useTouch: function(){
		var self = this;
		var target = self.btnSwipe;
		var renderer = self.renderer;
		renderer.useTouch = true;
		renderer.useDeviceMotion = false;
		target.setAttribute('swipe_type', 'touch');
	},
	useDeviceMotion: function(){
		if(window.DeviceOrientationEvent){
			var self = this;
			var target = self.btnSwipe;
			var renderer = self.renderer;
			renderer.useTouch = false;
			renderer.useDeviceMotion = true;
			target.setAttribute('swipe_type', 'motion');
		}
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
},{"../html":3,"../util":19,"../variables":22,"./requestFullScreen":11}],8:[function(require,module,exports){
/**
* player
*/
"use strict";
var Support = require('./support');
var Renderer = require('./renderer');
var Control = require('./control');

function Player(options){
	this.init(options);
}
Player.prototype = {
	constructor: Player,
	init: function(options){
		var self = this;
		var container = options.container;
		
		if(!Support.isSupport()){
			Support.createMessage({
				container: container
			});
			return;
		}
		
		var renderer = new Renderer();
		renderer.init(options);
		
		options.renderer = renderer;
		var control = new Control(options);
		
		self.control = control;
		self.renderer = renderer;
	}
};

module.exports = Player;
},{"./control":7,"./renderer":9,"./support":12}],9:[function(require,module,exports){
/* global window, document, THREE */
"use strict";
require('./requestAnimFrame');
var variables = require('../variables');
var html = require('../html');
var createjs = require('tween').createjs;

var namespace = variables.namespace;
var dom = html.dom;

var name = 'renderer-';
var meta = {
	className: {
		container: 'renderer',
		canvas: name+'canvas'
	}
};

var VideoTexture = function ( video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {
	THREE.Texture.call( this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );
	this.generateMipmaps = false;
	var scope = this;
	function update() {
		window.requestAnimFrame( update );
		scope.needsUpdate = true;
	}
	update();
};

VideoTexture.prototype = Object.create( THREE.Texture.prototype );
VideoTexture.prototype.constructor = VideoTexture;

function Renderer(){
	
}
Renderer.prototype.loadVideo = function(video){
	var self = this;
	self.createTexture(video);
};
Renderer.prototype.createTexture = function(video){
	var self = this;
	var material = self.material;
	var texture;
	
	//create video texture 
	
	texture = new VideoTexture( video );
	
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.format = THREE.RGBFormat;
	//texture.generateMipmaps = false;
	
	material.map = texture;
	material.needsUpdate = true;
	
	self.texture = texture;
	self.video = video;
};
Renderer.prototype.updateTexture = function(){
	var self = this;
	var texture = self.texture;
	var video = self.video;
	var videoImageContext = self.videoImageContext;
	
	if(videoImageContext&&texture){
		videoImageContext.drawImage( video, 0, 0 );
		texture.needsUpdate = true;
	}
};
Renderer.prototype.init = function(options){
	var self = this;
	options = options||{};
	var outContainer = options.container||document.body;
	var video = options.video;
	var useTouch = options.useTouch!==undefined?options.useTouch:true;
	var useDeviceMotion = options.useDeviceMotion!==undefined?options.useDeviceMotion:false;
	
	var finger = {};   //for touch one
	
	var container = dom.createElement({
		className: namespace+meta.className.container
	});
	outContainer.appendChild(container);
	
	var defaultFov = 75;
	
	var scene;
	var camera, renderer;
	var canvas;

	//var controls;
	//var INTERSECTED;
	var mouse = new THREE.Vector2(-1, 1);
	var isUserInteracting = false;
	var onPointerDownPointerX, onPointerDownPointerY,
		onPointerDownLon,onPointerDownLat,
		lon = 0, lat = 0, 
		phi = 0, theta = 0;
	var target = new THREE.Vector3();
	
	var canvasWidth;
	var canvasHeight;
	var devicePixelRatio = window.devicePixelRatio||1;
	updateSize();
	
	scene = new THREE.Scene();
	var geometry = new THREE.SphereGeometry( 500, 32, 15 ); //  500, 60, 40
	geometry.scale( -1, 1, 1 );
	
	var material = new THREE.MeshBasicMaterial( { overdraw: 0.5, side:THREE.DoubleSide } );
	var mesh = new THREE.Mesh( geometry, material );
	//mesh.rotation.y = - Math.PI / 2;
	scene.add( mesh );
	
	//
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x101010 );
	renderer.setPixelRatio( devicePixelRatio );
	renderer.setSize( canvasWidth, canvasHeight );
	
	canvas = renderer.domElement;
	container.appendChild( renderer.domElement );
	//document.body.appendChild( renderer.domElement );
	
	//
	camera = new THREE.PerspectiveCamera( defaultFov, canvasWidth / canvasHeight, 1, 10000 );
	
	//
	canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
	canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
	canvas.addEventListener( 'mouseup', onDocumentMouseUp, false );
	canvas.addEventListener( 'touchstart', onDocumentTouchStart, false );
	canvas.addEventListener( 'touchmove', onDocumentTouchMove, false );
	canvas.addEventListener( 'touchend', onDocumentTouchEnd, false );
	canvas.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
	canvas.addEventListener( 'MozMousePixelScroll', onDocumentMouseWheel, false);
	window.addEventListener( "onorientationchange" in window ? "orientationchange" : "resize", onWindowResize, false ); 
	if (window.DeviceMotionEvent){  
		window.addEventListener("devicemotion", motionHandler, false);  
	}
	if(window.DeviceOrientationEvent){
		window.addEventListener("deviceorientation", orientationHandler, false);  
	}
	//setRendererSize();
	
	var g = {
		renderer: renderer,
		camera: camera,
		mesh: mesh
	};
	
	for(var i in g){
		self[i] = g[i];
	}
	self.keyframe = options.keyframe;
	self.start = start;
	self.pause = pause;
	self.stop = stop;
	self.nextframe = nextframe;
	
	self.video = video;
	self.useTouch = useTouch;
	self.useDeviceMotion = useDeviceMotion;
	self.material = material;
	
	self.swipeAnimCoefX = 4;
	self.swipeAnimCoefY = 2;
	
	self.getCoordinates = function(){
		return {lon:lon, lat:lat};
	};
	
	self.createTexture(video);
	
	var isStop = false;
	var isPause = false;
	function start(){
		if(isStop||isPause){
			isPause = false;
			isStop = false;
			tick();
		}
	}
	function pause(){
		isPause = true;
	}
	function stop(){
		isStop = true;
	}
	var callNextframeCount = 0;
	function nextframe(callback){
		if(typeof callback==='function'){ callNextframeCount++; callback(self);  }
	}
	
	function motionHandler(){
		//document.getElementById("interval").innerHTML = event.interval;  
		//var acc = event.acceleration;  
		//document.getElementById("x").innerHTML = acc.x;  
		//document.getElementById("y").innerHTML = acc.y;  
		//document.getElementById("z").innerHTML = acc.z;  
		//var accGravity = event.accelerationIncludingGravity;  
		//document.getElementById("xg").innerHTML = accGravity.x;  
		//document.getElementById("yg").innerHTML = accGravity.y;  
		//document.getElementById("zg").innerHTML = accGravity.z;  
		//var rotationRate = event.rotationRate;  
		//document.getElementById("Ralpha").innerHTML = rotationRate.alpha;  
		//document.getElementById("Rbeta").innerHTML = rotationRate.beta;  
		//document.getElementById("Rgamma").innerHTML = rotationRate.gamma;  
	}
	
	function orientationHandler(event){
		if ( !self.useDeviceMotion )return;
		var beta = event.beta; //前后
		var gamma = event.gamma; // 左右
		if(beta<30){
			lat = beta;
		}else if(beta>60){
			lat = beta;
		}
		lat = beta;
		
		if(gamma > 20){ 
			lon = gamma;
		}else if(gamma < 20){
			lon = gamma;
		}
		lon = gamma;
	}
	
	function onDocumentMouseDown( event ) {
		if ( !self.useTouch )return;
		event.preventDefault();
		isUserInteracting = true;

		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;
	}

	function onDocumentMouseMove( event ) {
		if ( !self.useTouch )return;
		if ( isUserInteracting === true ) {
			lon = - ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
			lat = - ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
		}
		//intersect
		var clientX = event.clientX;
		var clientY = event.clientY;
		mouse.x = (clientX - canvas.offsetLeft)/canvas.offsetWidth * 2 - 1;
		mouse.y = (clientY - canvas.offsetTop)/canvas.offsetHeight * 2 - 1;
	}

	function onDocumentMouseUp() {
		isUserInteracting = false;
	}
	
	var touchesLength;
	var touchesStart = [];
	function onDocumentTouchStart( event ) {
		if ( !self.useTouch )return;
		touchesLength = event.touches.length;
		if ( event.touches.length === 1 ) {
			//event.preventDefault();

			onPointerDownPointerX = event.touches[ 0 ].pageX;
			onPointerDownPointerY = event.touches[ 0 ].pageY;

			onPointerDownLon = lon;
			onPointerDownLat = lat;
			
			//intersect
			var clientX = event.touches[0].pageX;
			var clientY = event.touches[0].pageY;
			mouse.x = (clientX - canvas.offsetLeft)/canvas.offsetWidth * 2 - 1;
			mouse.y = (clientY - canvas.offsetTop)/canvas.offsetHeight * 2 - 1;
		}else{
			touchesStart = [];
			for( var i = 0; i<event.touches.length; i++){
				touchesStart.push(new THREE.Vector2(
					event.touches[i].pageX,
					event.touches[i].pageY
				));
			}
		}
	}

	function onDocumentTouchMove( event ) {
		event.preventDefault();
		if ( !self.useTouch )return;
		if ( event.touches.length === 1 ) {
			var deltaLon = - ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1;
			var deltaLat = - ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1;
			
			lon = deltaLon + onPointerDownLon;
			lat = deltaLat + onPointerDownLat;
			setLonLat(lon, lat);
			
			finger.deltaLon = deltaLon;
			finger.deltaLat = deltaLat;
		}else if( event.touches.length === touchesStart.length){
			var delta = 0;
			var distanceStart = 0, distanceMove = 0;
			for( var i = 0; i<event.touches.length; i++){
				var currentTouch = new THREE.Vector2(
					event.touches[i].pageX,
					event.touches[i].pageY
				);
				
				distanceStart += touchesStart[i].length();
				distanceMove += currentTouch.length();
			}
			delta = distanceMove - distanceStart;
			setScale(delta);
		}
	}
	
	function onDocumentTouchEnd(){
		if ( !self.useTouch )return;
		//if ( event.changedTouches.length === 1 ) {
		if ( touchesLength === 1 ) {
			var deltaX = finger.deltaLon;
			var deltaY = finger.deltaLat;
			
			var x = deltaX * self.swipeAnimCoefX;
			var y = deltaY * self.swipeAnimCoefY;
			
			var checkDeltaX = Math.abs(lon - onPointerDownLon);
			var checkDeltaY = Math.abs(lat - onPointerDownLat);
			//console.log(checkDeltaX+':'+checkDeltaY);
			if(checkDeltaX<5&&checkDeltaY<2.5){
				createjs.Tween.removeTweens(finger);
			}else{
				finger.lon = finger.lat = 0;
				var originLon = lon;
				var originLat = lat;
				createjs.Tween.get(finger, {override: true})
				.to({ lon: x, lat: y }, 500, createjs.Ease.quadOut)
				.addEventListener("change", function(e){
					//console.log(e);
					lon = originLon + e.target.target.lon;
					lat = originLat + e.target.target.lat;
					setLonLat(lon, lat);
				});
			}
			finger.deltaLon = finger.deltaLat = 0;
			
			return createjs;
		}
	}
	
	function setLonLat(pLon, pLat){
		pLon = pLon||0;
		pLat = pLat||0;
		lon = ( pLon % 360 + 360 + 180 ) % 360 - 180;
		lat = Math.max( - 85, Math.min( 85, pLat ) );
		
		//var tLat = 90 - pLat;
		//tLat = ( tLat % 360 + 360 ) % 360 ;
		//if(tLat >= 0 && tLat < 180){
		//	lat = 90 - tLat;
		//}else{
		//	lat = tLat - 270;
		//	//lon = -lon;
		//}
		
	}
	
	function onDocumentMouseWheel(event){
		var delta = 1;
		if ( event.wheelDeltaY ) { // WebKit
			delta = event.wheelDeltaY;
		} else if ( event.wheelDelta ) { // Opera / Explorer 9
			delta = event.wheelDelta;
		} else if ( event.detail ) { // Firefox
			delta = event.detail;
		}
		setScale(delta);
		//setCameraFov(delta);
	}
	
	function setScale(delta){
		var scale = self.scale||1;
		var maxY = 100;
		if(delta>0){
			delta = delta/maxY + 1;
		}else{
			delta = maxY / (-delta + maxY);
		}
		var newScale = scale*delta;
		newScale = Math.max(1, Math.min(newScale, 15));
		delta = newScale / scale;
		geometry.scale(delta, delta, delta);
		self.scale = newScale;
	}
	
	//function setCameraFov(delta){
	//	var coefficient = 0.1; //0.05
	//	var fov = camera.fov;
	//	
	//	fov -= delta * coefficient;
	//	fov = Math.max(defaultFov, Math.min(fov, 1000));
	//	camera.fov = fov;
	//	camera.updateProjectionMatrix();  //camera.fov
	//}

	function onWindowResize() {
		updateSize();
		setRendererSize();
	}
	
	function updateSize(){
		var canvasSize = getRendererSize();
		canvasWidth = canvasSize.width;
		canvasHeight = canvasSize.height;
	}

	function getRendererSize(){  //for ios & wechat
		var orientation = window.orientation;
		var width, height;
		if(orientation!==undefined){ //for   
			if(orientation===0||orientation===180){ //when Portrait  0, 180
				width = Math.min(window.innerWidth, window.screen.width);
				height = Math.min(window.innerHeight, window.screen.height);
			}else{ //when Landscape  90, -90
				width = Math.min(window.innerWidth, window.screen.height);
				height = Math.min(window.innerHeight, window.screen.width);
			}
		}else{
			width = window.innerWidth;  //innerWidth screen.width
			height = window.innerHeight;  //innerHeight screen.height
		}
		width = container.offsetWidth;
		height = container.offsetHeight;
		return { width: width, height: height};
	}
	
	function setRendererSize(){
		camera.aspect = canvasWidth / canvasHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( canvasWidth, canvasHeight );
	}
	
	function testResize(){
		var canvasSize = getRendererSize();
		var width = canvasSize.width;
		var height = canvasSize.height;
		if(canvasWidth===width&&canvasHeight===height){}
		else{
			canvasWidth = width;
			canvasHeight = height;
			setRendererSize();
		}
	}

	function tick() {
		if(!isStop){
			if(!isPause && self.video.readyState===video.HAVE_ENOUGH_DATA){
				//self.video.play();
			}else{
				//self.video.pause();
			}
			
			render();
			window.requestAnimFrame( tick );
			
			if(typeof self.keyframe === 'function'){ self.keyframe(self); }
			if(callNextframeCount>0){
				nextframe();
				callNextframeCount--;
			}
		}else{
			self.video.pause();
		}
	}

	function render(){
		testResize();
		
		self.updateTexture();
		
		cameraLookAt();
		
		renderer.setClearColor(0,0,0,0);
        renderer.render( scene, camera );
		//renderer.context.flush();
		function cameraLookAt(){
			var a = 300;
			if ( isUserInteracting === false ) {
				//lon += 0.1;
			}
			
			//lat = Math.max( - 85, Math.min( 85, lat ) );
			phi = THREE.Math.degToRad( lat );
			theta = THREE.Math.degToRad( lon );
			
			target.x = a * Math.cos( phi ) * Math.sin( theta );
			target.y = a * Math.sin( phi );
			target.z = a * Math.cos( phi ) * Math.cos( theta );
			
			var t = target;
			camera.position.copy( t );
			camera.lookAt( t.negate() );
			//camera.updateMatrixWorld();
		}
	}
};


module.exports = Renderer;
},{"../html":3,"../variables":22,"./requestAnimFrame":10,"tween":"tween"}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
	
	
	function hackCancelFullScreen(){
		document.cancelFullScreen = document.exitFullscreen||document.webkitExitFullscreen;
		for(var x = 0; x < vendors.length && !document.cancelFullScreen; ++x) {
			document.cancelFullScreen = document[vendors[x]+'CancelFullScreen'];
		}
	}
}
initRequestFullScreen();

},{}],12:[function(require,module,exports){

"use strict";
//var browser = require('../util/browser');
var html = require('../html');

var dom = html.dom;

var name = 'support-';
var meta = {
	className: {
		container: 'support',
		message: name+'message'
	}
};

function isSupport(){
	//return (browser.versions.ios&&(browser.versions.weixin||browser.versions.vendor.indexOf('Google')>-1))||browser.versions.windows;//||browser.versions.chrome;
	return true;
}

function createMessage(options){
	options = options||{};
	var namespace = options.namespace;
	var outContainer = options.container;
	var message = options.message!==undefined?options.message: 'Your browser does not support the player. please use iphone weichat browser!';
	
	var supportContainer = dom.createElement({ className: namespace+meta.className.container});
	var supportMessage = dom.createElement({ className: namespace+meta.className.message});
	supportMessage.innerHTML = message;
	
	supportContainer.appendChild(supportMessage);
	outContainer.appendChild(supportContainer);
}


module.exports = {
	isSupport: isSupport,
	createMessage: createMessage
};
},{"../html":3}],13:[function(require,module,exports){
/* global xyz */
"use strict";
//inheritance
function classExtend(ChildClass, ParentClass){
	var initializing = false, fnTest = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;
	var _super = ParentClass.prototype;
	var prop = ChildClass.prototype;
	var prototype = typeof Object.create === "function" ? Object.create(ParentClass.prototype):new ParentClass();
	for (var name in prop) {
		// Check if we're overwriting an existing function
		prototype[name] = typeof prop[name] === "function" &&
			typeof _super[name] === "function" && fnTest.test(prop[name]) ?
			createCallSuperFunction(name, prop[name]) : prop[name];
	}
	initializing = true;
	ChildClass.prototype = prototype;
	ChildClass.prototype.constructor = ChildClass;
	
	function createCallSuperFunction(name, fn){
		return function() {
			var tmp = this._super;
		
			// Add a new ._super() method that is the same method
			// but on the super-class
			this._super = _super[name];
		
			// The method only need to be bound temporarily, so we
			// remove it when we're done executing
			var ret = fn.apply(this, arguments);
			this._super = tmp;
		
			return ret;
		};
	}
}

module.exports = classExtend;
},{}],14:[function(require,module,exports){
"use strict";
function is(arr, element){
	for(var i = 0; i<arr.length; i++){
		if(typeof element === 'function'){
			if(element(i, arr[i])){return true;}
		}else{
			if(arr[i]===element){return true;}
		}
	}
	return false;
}

module.exports = {
	is: is
};
},{}],15:[function(require,module,exports){
/* global document, window  */
"use strict";
function addCookie(name, value, attr){
	var str = "";
	if(attr){
		for(var prop in attr){
			str+=";"+prop+"="+attr[prop];
		}
	}
	document.cookie = name + "=" + window.escape(value) + str;
}
function deleteCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null){
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
}
function getCookie(name){
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null){
		return (arr[2]);
	}
	return null;
}
function getDocumentCookie(){
	return document.cookie;
}

module.exports = {
	addCookie: addCookie,
	deleteCookie: deleteCookie,
	getCookie: getCookie,
	getDocumentCookie: getDocumentCookie
};
},{}],16:[function(require,module,exports){
/* //global document, window  */
"use strict";

var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;

function isFunction( obj ) {
	return type(obj) === "function";
}
function isArray( obj ) {
	return type(obj) === "array";
}
function isWindow( obj ) {
	return obj != null && obj === obj.window;
}
function isNumeric( obj ) {
	// parseFloat NaNs numeric-cast false positives (null|true|false|"")
	// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
	// subtraction forces infinities to NaN
	// adding 1 corrects loss of precision from parseFloat (#15100)
	return !isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
}
function isEmptyObject( obj ) {
	var name;
	for ( name in obj ) {
		return false;
	}
	return true;
}
function isPlainObject( obj ) {
	var key;
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if ( !obj || type(obj) !== "object" || obj.nodeType || isWindow( obj ) ) {
		return false;
	}
	try {
		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
	} catch ( e ) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}
	// Support: IE<9
	// Handle iteration over inherited properties before own properties.
	//if ( support.ownLast ) {
	//	for ( key in obj ) {
	//		return hasOwn.call( obj, key );
	//	}
	//}
	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	for ( key in obj ) {}
	return key === undefined || hasOwn.call( obj, key );
}
function type( obj ) {
	if ( obj == null ) {
		return obj + "";
	}
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call(obj) ] || "object" :
		typeof obj;
}
function extend(){
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;
		// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}
	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target)) {
		target = {};
	}
	// extend itself if only one argument is passed
	if ( i === length ) {
		target = {}; //this
		i--;
	}
	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];
				// do not copy prototype function
				if ( !options.hasOwnProperty(name)){
					continue;
				}
				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}
				// Recurse if we're merging plain objects or arrays

				if ( name!== 'parent' && deep && copy && !isPlainObject(copy) &&  typeof  copy.clone === "function" ){
					//remove parent for no dead loop
					//clone is for classType object
					target[ name ] = copy.clone();
					if(target[ name ] ===undefined){ target[ name ]  = copy; }
				} else if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}
					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );
				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}
	// Return the modified object
	return target;
}

module.exports = {
	isFunction: isFunction,
	isArray: Array.isArray || isArray,
	isWindow: isWindow,
	isNumeric: isNumeric,
	isEmptyObject: isEmptyObject,
	isPlainObject: isPlainObject,
	type: type,
	extend: extend
};
},{}],17:[function(require,module,exports){

/**
 * 
 */
 "use strict";
var getDateHelper = function(){
	return {
		date : getDate(),
		duration : getDurationHelper(),
		dateDiff : dateDiff,
		dateDiffResult : dateDiffResult,
		dateDiffResultFull : dateDiffResultFull,
		dateToStr : dateToStr,
		datetimeToStr : datetimeToStr,
		getOffsetDate : getOffsetDate,
		paramToDate : paramToDate,
		strToDate : strToDate,
		timeToStr : timeToStr,
		durationToStr : durationToStr,
		durationToObj : durationToObj,
		typeToStr : typeToStr,
		weekdayToStr : weekdayToStr,
		zhDateToStr : zhDateToStr,
		zhDatetimeToStr : zhDatetimeToStr,
		fillZero : fillZero
	};
	
	function getDate(){
		return {
			monthFirstDay : monthFirstDay,
			monthLastDay : monthLastDay
		};
		
		function monthFirstDay(date){
			return paramToDate(date.getFullYear(), date.getMonth());
		}
		function monthLastDay(date){
			var result = monthFirstDay(date);
			result = getOffsetDate('month', result, 1);
			result = getOffsetDate('date', result, -1);
			return result;
		}
	}

	function getDurationHelper() {
		return {
			today : today,
			yestoday : yestoday,
			date: date,
			currentWeek : currentWeek,
			lastWeek : lastWeek,
			currentMonth : currentMonth,
			currentYear : currentYear,
			calendarMonth : calendarMonth,
			month : month,
			year : year
		};

		function today() {
			return getDurationStr('date', new Date());
		}
		function yestoday() {
			return getDurationStr('date', getOffsetDate('date', new Date(), -1));
		}
		function date(date){
			return getDurationStr('date', date);
		}
		function currentWeek(){
			return getDurationStr('day', new Date());
		}
		function lastWeek(){
			return getDurationStr('day', getOffsetDate('date', new Date(), -7));
		}
		function currentMonth(){
			return getDurationStr('month', new Date());
		}
		function currentYear(){
			return getDurationStr('year', new Date());
		}
		function calendarMonth(year, month){
			var now = new Date();
			year = year || now.getFullYear();
			month = month || now.getMonth()+1;
			return getDurationStr('calendarMonth', paramToDate(year, month-1));
		}
		function month(year, month){
			var now = new Date();
			year = year || now.getFullYear();
			month = month || now.getMonth()+1;
			return getDurationStr('month', paramToDate(year, month-1));
		}
		function year(year){
			return getDurationStr('year', paramToDate(year));
		}
	}
	
	function getDurationStr(type, startTime) {
		var result = getDuration(type, startTime);
		return {
			startTime : datetimeToStr(result['startTime']),
			endTime : datetimeToStr(result['endTime'])
		};
	}
	
	function getDuration(type, startTime) {
		var year, month, date, hour, minute, second;
		var day;
		var startTimeDate, endTimeDate;
		switch (type) {
		case 'calendarMonth':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate('month', startTimeDate, 1);
			var startTimeWeekDay = startTimeDate.getDay();
			var endTimeWeekDay = endTimeDate.getDay();
			startTimeDate = getOffsetDate('date', startTimeDate, - startTimeWeekDay%7);
			endTimeDate = getOffsetDate('date', endTimeDate, (7-endTimeWeekDay)%7);
			break;
		case 'year':
			year = startTime.getFullYear();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate(type, startTimeDate, 1);
			break;
		case 'month':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate(type, startTimeDate, 1);
			break;
		case 'date':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			date = startTime.getDate();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate(type, startTimeDate, 1);
			break;
		case 'day':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			date = startTime.getDate();
			day = startTime.getDay();
			date = date - (day+6)%7;
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate('date', startTimeDate, 7);
			break;
		}
	
		return {
			startTime : startTimeDate,
			endTime : endTimeDate
		};
	}
	
	function dateDiff(type, date1, date2){
		var result = 0;
		switch (type) {
		case 'year':
			result = Math.floor(((date1.getFullYear() - date2.getFullYear())*12+ date1.getMonth() - date2.getMonth())/12);break;
		case 'month':
			result = (date1.getFullYear() - date2.getFullYear())*12 + date1.getMonth() - date2.getMonth() + (((date1.getDate()-date2.getDate())>=0?1:-1) +  (date1>=date2?-1: 1))/2;break;
		case 'date':
			result = Math.floor(date1.getTime()/(1000*60*60*24))-Math.floor(date2.getTime()/(1000*60*60*24)); break;
		case 'hour':
			result = Math.floor(date1.getTime()/(1000*60*60))-Math.floor(date2.getTime()/(1000*60*60)); break;
		case 'minute':
			result = Math.floor(date1.getTime()/(1000*60))-Math.floor(date2.getTime()/(1000*60)); break;
		case 'second':
			result = Math.floor(date1.getTime()/(1000))-Math.floor(date2.getTime()/(1000)); break;
		default:
			result = (date1.getTime()-date2.getTime());
		}
		return result;
	}
	
	function dateDiffResult(date1, date2){
		var offset, type;
		type = 'year';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'month';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'date';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'hour';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'minute';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'second';
		offset = dateDiff(type, date1, date2);
		return {offset: offset, type: type};
	}
	
	function dateDiffResultFull(type, date1, date2){
		var result = {};
		var delta = date1.getTime()-date2.getTime();
		var rest = delta;
		switch(type){
		case 'year': 
			result['year'] = dateDiff('year', date1, date2);
			break;
		case 'date': 
			result['date'] = Math.floor(rest / (1000*60*60*24) );
			rest = rest % (1000*60*60*24);
			result['hour'] = Math.floor(rest / (1000*60*60) );
			rest = rest % (1000*60*60);
			result['minute'] = Math.floor(rest / (1000*60) );
			rest = rest % (1000*60);
			result['second'] = Math.floor(rest / (1000) );
			rest = rest % (1000);
			break;
		}
		return result;
	}
	
	function getOffsetDate(type, date, offset) {
		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		switch (type) {
		case 'year':year+=offset;break;
		case 'month':month+=offset;break;
		case 'date':day+=offset;break;
		case 'hour':hour+=offset;break;
		case 'minute':minute+=offset;break;
		case 'second':second+=offset;break;
		}
		return paramToDate(year, month, day, hour, minute, second);
	}

	function fillZero(input, num) {
		var result = '' + input;
		for (var i = 0; i < (num - result.length); i++) {
			result = '0' + result;
		}
		return result;
	}
	
	function datetimeToStr(date, fmt) {
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'yyyy-MM-dd hh:mm:ss';
		var year = date.getFullYear();
		var month = fillZero(date.getMonth() + 1, 2);
		var dateString = fillZero(date.getDate(), 2);
		var hour = fillZero(date.getHours() ,2);
		var minute = fillZero(date.getMinutes(), 2);
		var second = fillZero(date.getSeconds(), 2);
		return fmt.replace('yyyy',year).replace('MM',month).replace('dd', dateString).replace('hh',hour).replace('mm',minute).replace('ss', second);
	}
	
	function dateToStr(date, fmt) {
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'yyyy-MM-dd';
		var year = date.getFullYear();
		var month = fillZero(date.getMonth() + 1, 2);
		var dateString = fillZero(date.getDate(), 2);
		return fmt.replace('yyyy',year).replace('MM',month).replace('dd', dateString);
	}
	
	function timeToStr(date, fmt){
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'hh:mm:ss';
		var hour = fillZero(date.getHours() ,2);
		var minute = fillZero(date.getMinutes(), 2);
		var second = fillZero(date.getSeconds(), 2);
		return fmt.replace('hh',hour).replace('mm',minute).replace('ss', second);
	}
	
	function durationToStr(millisecond, fmt, fillType){
		fmt = fmt||'hh:mm:ss.ms';
		fillType = fillType||'hh';
		var obj = durationToObj(millisecond);
		var hour = fillZero(obj['hour'] ,2);
		var minute = fillZero(obj['minute'], 2);
		var second = fillZero(obj['second'], 2);
		if(fillType==='hh'||fillType==='mm'&&obj['hour']===0){
			fmt = fmt.replace('hh:', '');
			if(fillType==='mm'&&obj['minute']===0){
				fmt = fmt.replace('mm:', '');
			}
		}
		return fmt.replace('hh', hour).replace('mm', minute).replace('ss', second).replace('ms', obj['millisecond']);
	}
	
	function durationToObj(millisecond){
		var result = {};
		var rest = millisecond;
		result['hour'] = Math.floor(rest / (1000*60*60) );
		rest = rest % (1000*60*60);
		result['minute'] = Math.floor(rest / (1000*60) );
		rest = rest % (1000*60);
		result['second'] = Math.floor(rest / (1000) );
		rest = rest % (1000);
		result['millisecond'] = rest;
		return result;
	}

	function zhDateToStr(date, fmt){
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'yyyyMMdd';
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dateString = date.getDate();
		return fmt.replace('yyyy',year+'年').replace('MM',month+'月').replace('dd', dateString+'日');
	}
	function zhDatetimeToStr(date){
		var now = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dateString = date.getDate();
		var hour = fillZero(date.getHours() ,2);
		var minute = fillZero(date.getMinutes(), 2);
		var result = '';
		if(now.getFullYear()===year&&now.getMonth()+1===month){
			if(now.getDate()-dateString===0){
				
			}else if(now.getDate()-dateString===1){
				result += '昨天';
			}else if(now.getDate()-dateString===2){
				result += '前天';
			}else{
				result += zhDateToStr(date);
			}
			if(now.getDate()-dateString!==0)result += ' ';
		}
		result += hour+':'+minute;
		return result;
	}
	
	// 微信客户端不支持new Date("2015-07-04 12:00:00")
	function strToDate(dateTimeStr) {
		if(!dateTimeStr)return null;
		var date = new Date(0);
		var dateTimeArray = dateTimeStr.split(' ');
		var dateStr = dateTimeArray[0];
		var dateArray = dateStr.split('-');
		date.setFullYear(parseInt(dateArray[0]));
		date.setMonth(parseInt(dateArray[1]) - 1);
		date.setDate(parseInt(dateArray[2]));
		if (dateTimeArray.length > 1) {
			var timeStr = dateTimeArray[1];
			var timeArray = timeStr.split(':');
			date.setHours(parseInt(timeArray[0]));
			date.setMinutes(parseInt(timeArray[1]));
			date.setSeconds(parseInt(timeArray[2]));
		}
		return date;
	}

	function paramToDate(year, month, date, hour, minute, second) {
		month =month || 0;
		date = date!==undefined? date : 1;
		hour = hour || 0;
		minute = minute || 0;
		second = second || 0;
		var result = new Date(0);
		result.setFullYear(year);
		result.setMonth(month);
		result.setDate(date);
		result.setHours(hour);
		result.setMinutes(minute);
		result.setSeconds(second);
		return result;
	}
	
	function weekdayToStr(weekday){
		var result = '';
		switch(weekday){
		case 0:result='日';break;
		case 1:result='一';break;
		case 2:result='二';break;
		case 3:result='三';break;
		case 4:result='四';break;
		case 5:result='五';break;
		case 6:result='六';break;
		}
		return result;
	}
	
	function typeToStr(type){
		var result = '';
		switch(type){
		case 'year':result='年';break;
		case 'month':result='月';break;
		case 'day':
		case 'date':result='天';break;
		case 'hour':result='小时';break;
		case 'minute':result='分钟';break;
		case 'second':result='秒';break;
		}
		return result;
	}
};

module.exports = getDateHelper();
},{}],18:[function(require,module,exports){
/* global window */
"use strict";

if(!window){
	return;
}
window.URL = window.URL||window.webkitURL;
},{}],19:[function(require,module,exports){

"use strict";
require('./hack');
var classExtend = require('./classExtend');
var core = require('./core');
var object = require('./object');

var collection = require('./collection');
var cookie = require('./cookie');
var date = require('./date');
var path = require('./path');

var util = {
	collection: collection,
	cookie: cookie,
	date: date,
	path: path
};
util = core.extend(true, util, core, classExtend, object);


module.exports = util;
},{"./classExtend":13,"./collection":14,"./cookie":15,"./core":16,"./date":17,"./hack":18,"./object":20,"./path":21}],20:[function(require,module,exports){
"use strict";
//ECMA SCRIPT 5
function defineProperty(obj, name, prop){
	if(typeof Object.defineProperty ==='function'){
		Object.defineProperty(obj, name, prop);
	}
	else{
		obj[name] = prop['value'];
	}
}

function defineProperties(obj, props){
	if(typeof Object.defineProperties ==='function'){
		Object.defineProperties(obj, props);
	}
	else{
		for(var i in props){
			var prop = props[i];
			obj[i] = prop['value'];
		}
	}
}
module.exports = {
	defineProperty: defineProperty,
	defineProperties: defineProperties
};
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){

"use strict";
var namespace = 'video3d-';
var displayHidden = namespace+'hidden';

module.exports = {
	namespace: namespace,
	displayHidden: displayHidden
};
},{}]},{},[6,22]);
