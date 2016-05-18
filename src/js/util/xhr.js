/* jshint evil: true */
/* global window */
"use strict";

/**
* xhr
*/
var blob = require('./blob');

var Blob = window.Blob;
var FormData = window.FormData;
var XMLHttpRequest = window.XMLHttpRequest;
var ActiveXObject = window.ActiveXObject;
var FileReader = window.FileReader;

var xhr = {};

xhr.ajax = function(param){
	param = param||{};
	param.type = param.type||'get';  //'get' 'post'
	param.async = param.async||true;
	param.contentType = param.contentType; //'application/x-www-form-urlencoded'  'multipart/form-data'
	param.dataType = param.dataType||'text'; //'text' 'json'
	param.responseType = param.responseType;  //'blob' 'arraybuffer'
	param.data = param.data||{}; 
	param.timeout = param.timeout; 
	//var self = this;
	var xhr;
	if (XMLHttpRequest) {//in JavaScript, if it exists(not null and undifine), it is true.
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xhr = new XMLHttpRequest();
	} else if (ActiveXObject) {
		// code for IE6, IE5
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		//very rare browsers, can be ignored.
	}
	if (!xhr) return;
	
	var fd;
	if(typeof param.appendFormData==='function'){
		if( typeof param.beforeFormData === 'function')param.beforeFormData(xhr);
		fd = new FormDataShim(xhr);
		param.appendFormData(fd);
	}else if(typeof param.formData ==='object' && param.formData instanceof FormData){
		fd = param.formData;
	}else{
		fd = new FormData();
		//fd.append("image", self.toBlob(), "image.png");
		for(var i in param.data){
			fd.append(i, param.data[i]);
		}
	}
	
	xhr.open(param.type, param.url, param.async);
	xhr.onreadystatechange = function(){
		if (4 === xhr.readyState ) {
			if( 200 === xhr.status ){
				var result;
				if( xhr.responseType === 'blob' ){
					//@example
					//var blob = new Blob([xhr.response], {type: 'image/png'});
					result = xhr.response;
				}else if( xhr.responseType === 'arraybuffer' ){
					//@example
					//var byteArray = new Uint8Array(arrayBuffer);
					//for (var i = 0; i < byteArray.byteLength; i++) {
					//}
					result = xhr.response;
				}else{
					var responseText = xhr.responseText;
					if( param.dataType === 'jsonp1' ){
						result = responseText;
					}
					else if( param.dataType === 'text'){
						result = responseText;
					}
					else {
						result = eval("(" + responseText + ")");
					}
				}
				if( typeof param.success === 'function')param.success(result);
				
			}
			else{
				if( typeof param.error === 'function')param.error(xhr);
			}
		}else {
			//if( typeof param.progress === 'function')param.progress(xhr);
		}
		if( typeof param.complete === 'function')param.complete(xhr);
	};
	if( typeof param.beforeSend === 'function')param.beforeSend(xhr);
	if( param.contentType !== undefined )xhr.setRequestHeader("Content-Type", param.contentType);
	if( typeof param.timeout === 'number' ){
		xhr.timeout = param.timeout;
		if( typeof param.ontimeout === 'function' ) xhr.ontimeout = param.ontimeout;
	}
	if( typeof param.progress === 'function')xhr.upload.onprogress = param.progress;
	if( typeof param.responseType !== undefined )xhr.responseType = param.responseType;
	xhr.send(fd);
	return xhr;
	
	function FormDataShim(xhr){
		var o = this;
		var parts = [];// Data to be sent
        var boundary = new Array(5).join('-') + (+new Date() * (1e16*Math.random())).toString(32);
		var oldSend = XMLHttpRequest.prototype.send;
		
		this.append = function (name, value, filename) {
			parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');
			if (value instanceof Blob) {
				parts.push('; filename="'+ (filename || 'blob') +'"\r\nContent-Type: ' + value.type + '\r\n\r\n');
				parts.push(value);
			} else {
				parts.push('\r\n\r\n' + value);
			}
			parts.push('\r\n');
	    };
 
	    // Override XHR send()
	    xhr.send = function (val) {
	        var fr,data,oXHR = this;
	        if (val === o) {
	            //注意不能漏最后的\r\n ,否则有可能服务器解析不到参数.
	            parts.push('--' + boundary + '--\r\n');
	            data = new blob.XBlob(parts);
	            fr = new FileReader();
	            fr.onload = function () { oldSend.call(oXHR, fr.result); };
	            fr.onerror = function (err) { throw err; };
	            fr.readAsArrayBuffer(data);
	 
	            this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
	            XMLHttpRequest.prototype.send = oldSend;
	        }
	        else {
	        	oldSend.call(this, val);
	        }
	    };
	}
};


module.exports = xhr;