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
		var autoplay = options.autoplay||false;
		var loop = options.loop||false;
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
			namespace: namespace,
			container: container,
			video: video,
			autoplay: autoplay,
			loop: loop,
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
},{"./html":3,"./player":8,"./variables":15}],7:[function(require,module,exports){
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
},{"../html":3,"../util/date":14,"./requestFullScreen":11}],8:[function(require,module,exports){
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
		var namespace = options.namespace;
		var container = options.container;
		var video = options.video;
		
		if(!Support.isSupport()){
			Support.createMessage({
				namespace: namespace,
				container: container
			});
			return;
		}
		
		var renderer = new Renderer();
		renderer.init({
			namespace: namespace,
			container: container,
			video: video
		});
		
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
var html = require('../html');
//var THREE = require('three');

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
	/*
	var texture = self.texture;
	var videoImage = self.videoImage;
	var videoImageContext = self.videoImageContext;
	
	self.video = video;
	
	videoImage.width = video.videoWidth;
	videoImage.height = video.videoHeight;
	videoImageContext.fillRect( 0, 0, video.videoWidth, video.videoHeight );
	texture.needsUpdate = true;
	*/
};
Renderer.prototype.createTexture = function(video){
	var self = this;
	var material = self.material;
	var texture;
	
	//create video texture 
	
	texture = new VideoTexture( video );  //not play well in iphone
	/*var videoImage = document.createElement( 'canvas' );
	videoImage.width = video.videoWidth;
	videoImage.height = video.videoHeight;
	
	var videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, video.videoWidth, video.videoHeight );
	texture = new THREE.Texture( videoImage );
	
	self.videoImage = videoImage;
	self.videoImageContext = videoImageContext;
	*/
	
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
	var namespace = options.namespace;
	var outContainer = options.container||document.body;
	var video = options.video;
	
	var container = dom.createElement({
		className: namespace+meta.className.container
	});
	outContainer.appendChild(container);
	
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
	var geometry = new THREE.SphereGeometry( 500, 60, 40 );
	geometry.scale( - 1, 1, 1 );
	
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
	camera = new THREE.PerspectiveCamera( 75, canvasWidth / canvasHeight, 1, 2000 );
	
	//
	canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
	canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
	canvas.addEventListener( 'mouseup', onDocumentMouseUp, false );
	canvas.addEventListener( 'touchstart', onDocumentTouchStart, false );
	canvas.addEventListener( 'touchmove', onDocumentTouchMove, false );
	window.addEventListener( "onorientationchange" in window ? "orientationchange" : "resize", onWindowResize, false ); 
	//setRendererSize();
	
	var g = {
		renderer: renderer,
		camera: camera
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
	self.material = material;
	
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
	
	function onDocumentMouseDown( event ) {
		event.preventDefault();
		isUserInteracting = true;

		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;
	}

	function onDocumentMouseMove( event ) {
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
	
	function onDocumentTouchStart( event ) {
		if ( event.touches.length === 1 ) {
			event.preventDefault();

			onPointerDownPointerX = event.touches[ 0 ].pageX;
			onPointerDownPointerY = event.touches[ 0 ].pageY;

			onPointerDownLon = lon;
			onPointerDownLat = lat;
		}
		//intersect
		var clientX = event.touches[0].pageX;
		var clientY = event.touches[0].pageY;
		mouse.x = (clientX - canvas.offsetLeft)/canvas.offsetWidth * 2 - 1;
		mouse.y = (clientY - canvas.offsetTop)/canvas.offsetHeight * 2 - 1;
	}

	function onDocumentTouchMove( event ) {
		if ( event.touches.length === 1 ) {
			event.preventDefault();

			lon = - ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
			lat = - ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
		}
	}

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
			//window.setTimeout(tick, 20);
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
			
			lat = Math.max( - 85, Math.min( 85, lat ) );
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
},{"../html":3,"./requestAnimFrame":10}],10:[function(require,module,exports){
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
var browser = require('../util/browser');
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
	return (browser.versions.ios&&(browser.versions.weixin||browser.versions.vendor.indexOf('Google')>-1))||browser.versions.windows;//||browser.versions.chrome;
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
},{"../html":3,"../util/browser":13}],13:[function(require,module,exports){
/* global window */
"use strict";

/**
* check browser
*/
var navigator = window.navigator;
var browser={
    versions: (function(){
        var u = navigator.userAgent, app = navigator.appVersion;
		var vendor = navigator.vendor;
        return {
        	u: u,
        	app: app,
			vendor: vendor,
            windows: u.indexOf('Windows') > -1, //windows
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,//火狐内核
            chrome: u.indexOf('Chrome') > -1 ,//chrome内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') === -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            weibo: u.indexOf('Weibo') > -1, //是否微博
            qq: u.match(/\sQQ/i) === " qq" //是否QQ
        };
    })(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase(),
};

module.exports = browser;
},{}],14:[function(require,module,exports){

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
},{}],15:[function(require,module,exports){

"use strict";
module.exports = {
	namespace: 'video3d-'
};
},{}]},{},[6,15]);
