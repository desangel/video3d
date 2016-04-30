
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