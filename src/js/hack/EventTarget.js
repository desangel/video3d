/* global window, document */
"use strict";
(function(global, undefined){
	if(global.touch)return;
	
	var canTouch = function(){
		var result;
		try{
			result = document.createEvent("TouchEvent");
		}catch(e){
			result = false;
		}
		return !!result;
	};
	
	var EventTarget = window.EventTarget||window.Node;  //for ios
	EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
	//var _removeEventListener = EventTarget.prototype.removeEventListener;
	
	EventTarget.prototype.trigger = function(eventName, data){
		var self = this;
		var event;
		data = data||{};
		var view = data['view']||window;
		var detail = data['detail'];
		var screenX = data['screenX'];
		var screenY = data['screenY'];
		var clientX = data['clientX'];
		var clientY = data['clientY'];
		var ctrlKey = !!data['ctrlKey'];
		var altKey = !!data['altKey'];
		var shiftKey = !!data['shiftKey'];
		var metaKey = !!data['metaKey'];
		var button = data['button']||0;
		var relatedTarget = data['relatedTarget']||null;
		
		if(typeof eventName === 'string'){
			if(document.createEvent){
				switch(eventName){
				case 'tap':
				case 'tapend':
					event = document.createEvent("CustomEvent");
					event.initCustomEvent(eventName, true, true, detail); //type bubbles cancelable detail
					for(var i in data){
						if(i!=='detail')event[i] = data[i];
					}
					break;
				case 'touchstart':
				case 'touchmove':
				case 'touchend':
				case 'touchcancel':
					event = document.createEvent("TouchEvent");
					event.initTouchEvent(eventName, true, true, view, detail);
					break;
				case 'click':
				case 'mousedown':
				case 'mouseenter':
				case 'mouseleave':
				case 'mousemove':
				case 'mouseout':
				case 'mouseover':
				case 'mousewheel':
					event = document.createEvent("MouseEvents");
					event.initMouseEvent(eventName, true, true, view, detail, 
						screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
					break;
				default:
					event = document.createEvent("HTMLEvents");
					event.initEvent(eventName, true, true);
				}
			}else{
				event = document.createEventObject();
				event.eventType = eventName;
			}
			event.eventName = eventName;
		}else if(typeof eventName === 'object'){
			event = eventName;
		}
		//event.detail===undefined&&(event.detail = data);
		event.data===undefined&&(event.data = data);
		//console.log(event)
		if(document.createEvent){
			self.dispatchEvent(event);
		}else{
			self.fireEvent("on"+event.eventType, event);
		}
	};
	
	EventTarget.prototype.addEventListener = function(event, callback, useCapture){
		var self = this;
		var result;
		result = self._addEventListener(event, callback, useCapture);
		
		var touchFn = function(e){
			var data = {};
			var touch = e.touches[0];
			data.screenX = touch.screenX;
			data.screenY = touch.screenY;
			data.clientX = touch.clientX;
			data.clientY = touch.clientY;
			
			data.force = touch.force;
			data.identifier = touch.identifier;
			data.radiusX = touch.radiusX;
			data.radiusY = touch.radiusY;
			data.rotationAngle = touch.rotationAngle;
			
			data.ctrlKey = e.ctrlKey;
			data.altKey = e.altKey;
			data.shiftKey = e.shiftKey;
			data.metaKey = e.metaKey;
			
			data.offsetX = getOffsetX(e, data.clientX);
			data.offsetY = getOffsetY(e, data.clientY);
			
			data.touches = e.touches;
			data.changedTouches = e.changedTouches;
			data.view = e.view;
			
			this.trigger(event, data);
		};
		
		var mouseFn = function(e){
			var data = {};
			data.screenX = e.screenX;
			data.screenY = e.screenY;
			data.clientX = e.clientX;
			data.clientY = e.clientY;
			data.ctrlKey = e.ctrlKey;
			data.altKey = e.altKey;
			data.shiftKey = e.shiftKey;
			data.metaKey = e.metaKey;
			data.button = e.button;
			data.relatedTarget = e.relatedTarget;
			
			data.x = e.x;
			data.y = e.y;
			data.offsetX = getOffsetX(e, data.clientX);
			data.offsetY = getOffsetY(e, data.clientY);
			data.pageX = e.pageX;
			data.pageY = e.pageY;
			data.layerX = e.layerX;
			data.layerY = e.layerY;
			data.view = e.view;
			
			this.trigger(event, data);
		};
		
		switch(event){
		case 'tap':
			if(canTouch()){
				self._addEventListener('touchstart', touchFn, useCapture);	
			}else{
				self._addEventListener('mousedown', mouseFn, useCapture);	
			}
			break;
		case 'tapend':
			if(canTouch()){
				self._addEventListener('touchend', touchFn, useCapture);	
			}else{
				self._addEventListener('mouseup', mouseFn, useCapture);	
			}
			break;
		}
		return result;
	};
	
	function getOffsetX(e, clientX){
		var evt =e||window.event;
		var result;
		var srcObj = evt.target || evt.srcElement;
		if (evt.offsetX){
			result = evt.offsetX;
		}else{
			var rect = srcObj.getBoundingClientRect();
			clientX = clientX!==undefined?clientX:evt.clientX;
			result = clientX - rect.left;
		}
		return result;
	}
	
	function getOffsetY(e, clientY){
		var evt =e||window.event;
		var result;
		var srcObj = evt.target || evt.srcElement;
		if (evt.offsetX){
			result= evt.offsetY;
		}else{
			var rect = srcObj.getBoundingClientRect();
			clientY =  clientY!==undefined?clientY:evt.clientY;
			result = clientY - rect.left;
		}
		return result;
	}
}(window));

