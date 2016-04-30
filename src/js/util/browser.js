/* global window */
"use strict";

/**
* check browser
*/
var navigator = window.navigator;
var browser={
    versions: (function(){
        var u = navigator.userAgent, app = navigator.appVersion;
		var vendor = navigator.vendor;
        return {
        	u: u,
        	app: app,
			vendor: vendor,
            windows: u.indexOf('Windows') > -1, //windows
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,//火狐内核
            chrome: u.indexOf('Chrome') > -1 ,//chrome内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') === -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            weibo: u.indexOf('Weibo') > -1, //是否微博
            qq: u.match(/\sQQ/i) === " qq" //是否QQ
        };
    })(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase(),
};

module.exports = browser;