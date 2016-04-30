/**
* player
*/
"use strict";
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
		
		var renderer = new Renderer({
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