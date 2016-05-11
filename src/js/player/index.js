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