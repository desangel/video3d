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