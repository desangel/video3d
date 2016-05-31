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

function addClass(element, className){
	element.classList.add(className);
}

function removeClass(element, className){
	element.classList.remove(className);
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

function getParentElements(container, elem){
	var result = [];
	for(var i = elem.parentNode; i!==container; i=i.parentNode){
		result.push(i);
	}
}

function isVisible(elem){
	return elem.style.display !== 'none'&&elem.style.visibility !== 'hidden'&&elem.style.opacity !== '0';
}

function isHidden(elem){
	return !isVisible(elem) ||
		isVisible(elem) &&
		(function(){
			var elements = getParentElements( elem.ownerDocument, elem );
			var result = false;
			for(var i in elements){
				if(!isVisible(elements[i])){
					result = true;
					break;
				}
			}
			return result;
		}());
}

module.exports = {
	addClass: addClass,
	removeClass: removeClass,
	addAttribute: addAttribute,
	attrToStyle: attrToStyle,
	createElement: createElement,
	elementToStr: elementToStr,
	setAttribute: setAttribute,
	
	getParentElements: getParentElements,
	isHidden: isHidden
};