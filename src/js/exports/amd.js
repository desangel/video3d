/* global window, module, define */
/*!
 * ===========================
 * AMD Export
 * ===========================
 */
if (typeof module !== 'undefined'){
    module.exports = window.video3d;
}else if (typeof define === 'function' && define.amd) {
    define([], function () {
		return window.video3d;
    });
}