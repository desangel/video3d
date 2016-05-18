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
		var container = options.renderer.container = options.control.container = options.container;
		options.renderer.video = options.control.video = options.video;
		
		if(!Support.isSupport()){
			Support.createMessage({
				container: container
			});
			return;
		}
		
		var renderer = new Renderer();
		renderer.init(options.renderer);
		
		options.control.renderer = renderer;
		var control = new Control(options.control);
		
		self.control = control;
		self.renderer = renderer;
	}
};

module.exports = Player;