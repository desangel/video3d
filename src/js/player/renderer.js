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