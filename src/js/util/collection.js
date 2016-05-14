"use strict";
function is(arr, element){
	for(var i = 0; i<arr.length; i++){
		if(typeof element === 'function'){
			if(element(i, arr[i])){return true;}
		}else{
			if(arr[i]===element){return true;}
		}
	}
	return false;
}

function objToStr(obj){
	var result;
	if(obj instanceof Array){
		result = arrayToStr(obj);
	}else if(typeof obj === 'object'){
		result = objectToStr(obj);
	}else{
		result = obj.toString();
	}
	return result;
}

function objectToStr(obj, indent){
	indent = indent||0;
	var result = '{\n';
	for(var i in obj){
		result += indentToStr(' ', indent+2)+ i + ' : ';
		var item = obj[i];
		if((item instanceof Array)){
			result += arrayToStr(item, indent+2) ;
		}else if(typeof item === 'object'){
			result+= objectToStr(item, indent+2);
		}else{
			result+= item;
		}
		result+= ',\n';
	}
	if(result.length===result.lastIndexOf(',')+2)result = result.substr(0, result.length-2)+'\n';
	result += indentToStr(' ', indent) + '}';
	return result;
}

function arrayToStr(obj, indent){
	indent = indent||0;
	var result = '[\n';
	for(var i in obj){
		var item = obj[i];
		result += indentToStr(' ', indent+2);
		if((item instanceof Array)){
			result += arrayToStr(item, indent+2) ;
		}else if(typeof item === 'object'){
			result+= objectToStr(item, indent+2);
		}else{
			result+= item ;
		}
		result+= ',\n';
	}
	if(result.length===result.lastIndexOf(',')+2)result = result.substr(0, result.length-2)+'\n';
	result += indentToStr(' ', indent) + ']';
	return result;
}

function indentToStr(ch, indent){
	var result = '';
	for(var i = 0; i< indent; i++){
		result+=ch;
	}
	return result;
}

module.exports = {
	is: is,
	
	objToStr: objToStr,
	objectToStr: objectToStr,
	arrayToStr: arrayToStr,
	indentToStr: indentToStr
};