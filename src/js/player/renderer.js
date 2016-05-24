/* global window, document, THREE */
"use strict";
require('../hack');
var variables = require('../variables');
var util = require('../util');
var html = require('../html');

var namespace = variables.namespace;
var dom = html.dom;

var name = 'renderer-';
var meta = {
	className: {
		container: 'renderer',
		canvas: name+'canvas'
	}
};

var definitionType = {
	low: 1,
	hight: 2
};

var defaultOptions = {
	outContainer: document.body,
	useTouch: true,
	useDeviceMotion: false,
	useFullMotion: true,
	useVirtualReality: false,
	
	needEnoughData: false,
	definition: definitionType.low,
	textureType: 'video'
};

var isInit = true;

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

var VideoCanvasTexture = function ( video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {
	var scope = this;
	
	var videoImage = document.createElement( 'canvas' );
	var	videoWidth = video.videoWidth||0;
	var	videoHeight = video.videoHeight||0;
	videoImage.width = videoWidth;
	videoImage.height = videoHeight;
	
	THREE.Texture.call( scope, videoImage, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );
	videoImage = scope.image;
	var ctx = videoImage.getContext('2d');
	
	function update() {
		window.requestAnimFrame( update );
		ctx.drawImage(video, 0, 0, ctx.canvas.width,ctx.canvas.height);
		scope.needsUpdate = true;
	}
	update();
	
	scope.videoImageCtx = ctx;
};
VideoCanvasTexture.prototype = Object.create( THREE.Texture.prototype );
VideoCanvasTexture.prototype.constructor = VideoCanvasTexture;

function Renderer(){
	
}
Renderer.prototype.loadVideo = function(video){
	var self = this;
	
	self.createTexture(video);
	// durationchange loadedmetadata
	//video.addEventListener('durationchange', handleloadedmetadata, false);
	//function handleloadedmetadata(){
	//	
	//}
	//video.removeEventListener('durationchange', handleloadedmetadata);
};
Renderer.prototype.createTexture = function(video){
	var self = this;
	var material = self.material;
	var texture;
	
	//create video texture 
	if(self.textureType==='canvas'){
		texture = new VideoCanvasTexture( video );
	}else{
		texture = new VideoTexture( video );
	}
	
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
	options = util.extend({}, defaultOptions, options);
	var outContainer = options.container;
	var video = options.video;
	var useTouch = options.useTouch;
	var useDeviceMotion = options.useDeviceMotion;
	var useFullMotion =options.useFullMotion;
	var useVirtualReality =options.useVirtualReality;
	var needEnoughData = options.needEnoughData;
	var definition = options.definition;
	self.textureType = options.textureType;
	
	var container = dom.createElement({
		className: namespace+meta.className.container
	});
	outContainer.appendChild(container);
	
	var defaultFov = 75;
	
	var scene, sceneLeft, sceneRight;
	var camera;
	var renderer;
	var vrEffect;
	var canvas;
	
	var i;
	//var j;

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
	var orientation;
	updateSize();
	
	scene = new THREE.Scene();
	var geometry;
	if(definition === definitionType.high){
		geometry = new THREE.SphereGeometry( 500, 32, 32 ); //  500, 60, 40
	}else{
		//geometry = new THREE.BoxGeometry( 500, 500, 500 ); //  500, 60, 40
		geometry = new THREE.SphereGeometry( 500, 16, 16 );
	}
	geometry.scale( -1, 1, 1 );
	geometry.rotateY( -Math.PI/2 );
	
	var material = new THREE.MeshBasicMaterial( { overdraw: 0.5, side:THREE.DoubleSide } );
	var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	
	//var uvs;
	sceneLeft = new THREE.Scene();
	//var geometryLeft = geometry.clone();
	//uvs = geometryLeft.faceVertexUvs[ 0 ];
	//for (  i = 0; i < uvs.length; i ++ ) {
	//	for (  j = 0; j < 3; j ++ ) {
	//		uvs[ i ][ j ].x *= 0.5;
	//	}
	//}
	var meshLeft = new THREE.Mesh( geometry, material );
	sceneLeft.add(meshLeft);
	
	sceneRight = new THREE.Scene();
	//var geometryRight = geometry.clone();
	//uvs = geometryRight.faceVertexUvs[ 0 ];
	//for (  i = 0; i < uvs.length; i ++ ) {
	//	for (  j = 0; j < 3; j ++ ) {
	//		uvs[ i ][ j ].x *= 0.5;
	//		uvs[ i ][ j ].x += 0.5;
	//	}
	//}
	var meshRight = new THREE.Mesh( geometry, material );
	sceneRight.add(meshRight);
	
	//
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x101010 );
	renderer.setPixelRatio( devicePixelRatio );
	renderer.setSize( canvasWidth, canvasHeight );
	
	if(THREE.VREffect){
		vrEffect = new THREE.VREffect(renderer);
	}
	
	canvas = renderer.domElement;
	container.appendChild( renderer.domElement );
	//document.body.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( defaultFov, canvasWidth / canvasHeight, 1, 10000 );
	
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
		vrEffect: vrEffect,
		camera: camera,
		mesh: mesh
	};
	
	for(i in g){
		self[i] = g[i];
	}
	self.keyframe = options.keyframe;
	self.start = start;
	self.pause = pause;
	self.stop = stop;
	self.nextframe = nextframe;
	
	self.container = container;
	self.video = video;
	self.useTouch = useTouch;
	self.useDeviceMotion = useDeviceMotion;
	self.useFullMotion = useFullMotion;
	self.useVirtualReality = useVirtualReality;
	self.needEnoughData = needEnoughData;
	self.material = material;
	
	self.swipeAnimCoefX = 4;
	self.swipeAnimCoefY = 2;
	
	self.getCoordinates = function(){
		return {lon:lon, lat:lat};
	};
	self.getDeviceStatus = function(){
		return {
			motion: motionParam,
			orientation: orientationParam
		};
	};
	
	self.createTexture(video);
	
	var isStop = false;
	var isPause = false;
	var isLandscape = false;
	var motionParam, orientationParam;
	
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
		//return; //阻止横竖屏幕切换
		
		//motionParam = motionParam||{};
		//motionParam.interval = event.interval;
		//motionParam.acc = event.acceleration;
		//motionParam.accGravity = event.accelerationIncludingGravity;
		//motionParam.rotationRate = event.rotationRate;
		//document.getElementById("interval").innerHTML = event.interval;  
		//var acc = event.acceleration;  
		//document.getElementById("x").innerHTML = acc.x;  //x轴加快度
		//document.getElementById("y").innerHTML = acc.y;  //y轴加快度
		//document.getElementById("z").innerHTML = acc.z;  //z轴加快度
		//var accGravity = event.accelerationIncludingGravity;  
		//document.getElementById("xg").innerHTML = accGravity.x;  //x轴加快度(推敲重力加快度)
		//document.getElementById("yg").innerHTML = accGravity.y;  //y轴加快度(推敲重力加快度)
		//document.getElementById("zg").innerHTML = accGravity.z;  //z轴加快度(推敲重力加快度)
		//var rotationRate = event.rotationRate;  
		//document.getElementById("Ralpha").innerHTML = rotationRate.alpha; //上下扭转速度
		//document.getElementById("Rbeta").innerHTML = rotationRate.beta;   //前后扭转速度
		//document.getElementById("Rgamma").innerHTML = rotationRate.gamma; //扭转速度
	}
	
	var compassHeading;
	function orientationHandler(event){
		orientationParam = orientationParam||{};
		orientationParam.alpha = event.alpha; //上下
		orientationParam.beta = event.beta; //前后
		orientationParam.gamma = event.gamma; //左右
		orientationParam.compassHeading = event.webkitCompassHeading; //指北针指向
		orientationParam.compassAccuracy = event.webkitCompassAccuracy; //指北针精度
		if ( !self.useDeviceMotion ){
			compassHeading = undefined;
			return;
		}
		
		var beta = event.beta;
		var gamma = event.gamma;
		if(isLandscape){
			
			if( Math.abs(beta)>90 && Math.abs(gamma)<45 ){
				gamma = Math.abs(gamma);
				if(orientation===-90){
					gamma = -Math.abs(gamma);
				}else{
					gamma = Math.abs(gamma);
				}
			}else if(Math.abs(beta)<90 && Math.abs(gamma)<45){
				if(orientation===-90){
					gamma = Math.abs(gamma);
				}else{
					gamma = -Math.abs(gamma);
				}
			}
			lat = gamma>=0?( 90 - gamma):( -90 - gamma);
			if(orientation===-90){
				lat = -lat;
			}
		}else{
			lat = (beta - 80);
		}
		lat = - lat;
		
		var currentCompassHeading = event.webkitCompassHeading;
		var deltaLon = 0;
		if(compassHeading===undefined){
			compassHeading = currentCompassHeading;
		}else{
			deltaLon = currentCompassHeading-compassHeading;
		}
		lon -= deltaLon;
		compassHeading = currentCompassHeading;
		
		finger.lon = finger.targetLon = lon;
		finger.lat = finger.targetLat = lat;
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
			var deltaLon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1;
			var deltaLat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1;
			lon = deltaLon + onPointerDownLon;
			lat = deltaLat + onPointerDownLat;
			
			finger.targetLon = deltaLon + onPointerDownLon;
			finger.targetLat = deltaLat + onPointerDownLat;
			finger.lon = lon;
			finger.lat = lat;
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
	
	var finger = {
		lon: lon,
		lat: lat,
		targetLon: lon,
		targetLat: lat
	};   //for touch one
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
			var deltaLon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.5;
			var deltaLat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.5;
			
			finger.targetLon = deltaLon + onPointerDownLon;
			finger.targetLat = deltaLat + onPointerDownLat;
			finger.lon = lon;
			finger.lat = lat;
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
	}
	
	function setLonLat(pLon, pLat, targetLon){
		var precision = 1000;
		pLon = pLon||0;
		pLat = pLat||0;
		pLon = Math.floor(pLon*precision)/precision;
		pLat = Math.floor(pLat*precision)/precision;
		
		lon = pLon;
		if(targetLon){
			targetLon = Math.floor(targetLon*precision)/precision;
			if ( Math.abs(targetLon - pLon) < 0.002 ){ lon = ( pLon % 360 + 360 + 180 ) % 360 - 180; }
		}
		lat = Math.max( - 85, Math.min( 85, pLat ) );
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
		orientation = window.orientation;
		var width, height;
		if(orientation!==undefined){ //for   
			if(orientation===0||orientation===180){ //when Portrait  0, 180
				isLandscape = false;
				width = Math.min(window.innerWidth, window.screen.width);
				height = Math.min(window.innerHeight, window.screen.height);
			}else{ //when Landscape  90, -90
				isLandscape = true;
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
			if( needEnoughData ){
				if(!isPause && self.video.readyState===video.HAVE_ENOUGH_DATA){
					self.video.play();
				}else{
					self.video.pause();
				}
			}
			
			if(isInit)render();
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
		var left,bottom,width,height;
		left = canvasWidth * 0;
		bottom = canvasHeight * 0;
		height = canvasHeight * 1;
		//if(self.useVirtualReality&&vrEffect){ //useVirtualReality
		if(self.useVirtualReality){ //useVirtualReality
			//renderer.render( [ sceneLeft, sceneRight ], camera );
			//vrEffect.render( scene, camera );
			renderer.enableScissorTest( true );
			renderer.clear();
			
			width = canvasWidth * 0.5;
			camera.aspect = width/height;
			camera.updateProjectionMatrix();
			
			renderer.setViewport(left,bottom,width,height);
			renderer.setScissor(left,bottom,width,height);
			renderer.render( sceneLeft, camera );
			
			left = canvasWidth * 0.5;
			renderer.setViewport(left,bottom,width,height);
			renderer.setScissor(left,bottom,width,height);
			renderer.render( sceneRight, camera );
			
			renderer.enableScissorTest( false );
			
		}else{ //useFullMotion
			width = canvasWidth * 1;
			camera.aspect = width/height;
			camera.updateProjectionMatrix();
			renderer.setViewport(left,bottom,width,height);
			renderer.render( scene, camera );
		}
        
		//renderer.context.flush();
		function cameraLookAt(){
			var a = 300;
			if ( isUserInteracting === false ) {
				//lon += 0.1;
			}
			
			finger.lon += (finger.targetLon - finger.lon)*0.05;
			finger.lat += (finger.targetLat - finger.lat)*0.05;
			
			setLonLat(finger.lon, finger.lat, finger.targetLon);
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