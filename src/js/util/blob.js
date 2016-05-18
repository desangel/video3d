/* global window */
"use strict";

/**
* blob
*/
var atob = window.atob;
var Blob = window.Blob;
var File = window.File;
var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

var defaultMineType = 'application/octet-stream';
var blobUtil = {};

blobUtil.XBlob = (function(){
	var blobConstruct = !!(function () { try { return new Blob(); } catch (e) {}})();
    return blobConstruct ? Blob : function (parts, opts) {
    	var bb = new BlobBuilder();
    	parts.forEach(function (p) { bb.append(p); });
    	//bb.append(parts);
    	return bb.getBlob(opts ? opts.type : undefined);
    };
})();
	
blobUtil.uint8ToString = function(u8a){
	var CHUNK_SZ = 0x8000;
	var c = [];
	for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
		c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
	}
	return c.join("");
};

blobUtil.dataURLtoBlob = function(dataurl) {
	var arr = dataurl.split(',');
	var mime = arr[0].match(/:(.*?);/)[1]||defaultMineType;
	var bstr = atob(arr[1]);
	var length = bstr.length;
	var buffer = new ArrayBuffer(length);
	var u8arr = getBlobArray();
	var blob;
	try{
		blob = new Blob([u8arr], {type:mime});	
	}catch(e){
		try{
			//var str = xhr.uint8ToString(u8arr);
			//blob = new Blob([u8arr.buffer], {type:mime});
			if(e.name === 'TypeError'){
				u8arr = getBlobArray();
				var bb = new BlobBuilder();
				bb.append(buffer);
				blob = bb.getBlob(mime);
			}else if(e.name === "InvalidStateError"){
				// InvalidStateError (tested on FF13 WinXP)
				blob = new Blob( [u8arr.buffer], {type : mime});
			}else{
				// We're screwed, blob constructor unsupported entirely
				return;
			}
		}catch(e2){
			console.error(e2);
		}
	}
	return blob;
	
	function getBlobArray(){
		var n = bstr.length;
		var u8arr = new Uint8Array(buffer);
		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}
		return u8arr;
	}
};
	
blobUtil.dataURLtoFile = function(dataurl) {
	var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1]||defaultMineType,
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], {type:mime});
};

module.exports = blobUtil;