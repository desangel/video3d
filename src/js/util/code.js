/* global document */
"use strict";
function htmlEncode(value){
	var temp = document.createElement('div');
	(temp.textContent!=null)?(temp.textContent=value) : (temp.innerText=value);
	var result = temp.html.innerHTML;
	temp = null;
	return result;
}
	
function htmlDecode(value){
	var temp = document.createElement('div');
	temp.innerHTML = value;
	var result = temp.innerText || temp.textContent;
	temp = null;
	return result;
}
module.exports = {
	htmlEncode: htmlEncode,
	htmlDecode: htmlDecode
};