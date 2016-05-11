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