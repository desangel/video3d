/*!
 * =====================================================
 * video3d v1.0.0 (http://desangel.github.io/video3d/)
 * =====================================================
 */
/* jshint node: true */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({},{},[]);

/* jshint node: true */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./dom":2}],2:[function(require,module,exports){
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

module.exports = {
	addAttribute: addAttribute,
	attrToStyle: attrToStyle,
	createElement: createElement,
	elementToStr: elementToStr,
	setAttribute: setAttribute
};
},{}],3:[function(require,module,exports){

"use strict";
var dom = require('./dom');
var button = require('./button');
var video = require('./video');

module.exports = {
	dom: dom,
	button: button,
	video: video
};
},{"./button":1,"./dom":2,"./video":5}],4:[function(require,module,exports){
/* jshint node: true */

"use strict";
var dom = require('./dom');
function createElement(options){
	options = options||{};
	var src = options.src;
	var type = options.type;
	var element = dom.createElement({
		elementType: 'source'
	});
	dom.setAttribute(element, 'src', src);
	dom.setAttribute(element, 'type', type);
	return element;
}

module.exports = {
	createElement: createElement
};
},{"./dom":2}],5:[function(require,module,exports){
/* //global document  */
/* jshint node: true */
"use strict";

var dom = require('./dom');
var source = require('./source');

function createElement(options){
	options = options||{};
	var id = options.id;
	var className = options.className;
	var autoplay = options.autoplay;
	var controls = options.controls;
	var height = options.height;
	var loop = options.loop;
	var preload = options.preload;
	var playInline = options.playInline;
	var src = options.src;
	var width = options.width;
	var sources = options.sources||[];
	var element = dom.createElement({
		id:id,
		className:className,
		elementType: 'video'
	});
	dom.setAttribute(element, 'width', width);
	dom.setAttribute(element, 'height', height);
	dom.setAttribute(element, 'src', src);
	
	dom.addAttribute(element, 'autoplay', autoplay);
	dom.addAttribute(element, 'controls', controls);
	dom.addAttribute(element, 'loop', loop);
	dom.addAttribute(element, 'preload', preload);
	dom.addAttribute(element, 'webkit-playsinline', playInline);
	
	for(var i in sources){
		var sourceElement = source.createElement(sources[i]);
		element.appendChild(sourceElement);
	}
	if(checkVideoType(element)==null){
		console.error('video type not supported. please use mp4/webm/ogg.');
		return;
	}
	return element;
}

function checkVideoType(video){
	if(video.canPlayType('video/mp4') === 'maybe'){
		return 'mp4';
	}else if(video.canPlayType('video/webm') === 'maybe'){
		return 'webm';
	}else if(video.canPlayType('video/ogg') === 'maybe'){
		return 'ogg';
	}else{
		return null;
	}
}

module.exports = {
	createElement: createElement,
	checkVideoType: checkVideoType
};
},{"./dom":2,"./source":4}],6:[function(require,module,exports){
(function (global){
/* global document */
/* jshint node: true */
"use strict";

var variables = require('./variables');
var util = require('./util');
var dom = require('./html');
var media = require('./media');
var Player = require('./player');

var namespace = variables.namespace;
var meta = {
	className:{
		container: namespace+'container',
		video: namespace+'video'
	}
};

var domVideo = dom.video;

function Video3d(options){
	var self = this;
	self.init(options);
}
Video3d.prototype = {
	constructor: Video3d,
	init: function(options){
		var self = this;
		options = options||{};
		var container = options.container;
		var video = options.video;
		var control = options.control||{};
		var renderer = options.renderer||{};
		var videoSources = options.videoSources;
		var callbacks = options.callbacks||{};
		var appendVideo = options.appendVideo||false;
		//var fullScreenMode = options.fullScreenMode||false; //全屏模式
		
		//container
		if(typeof container === 'string'){
			container = document.querySelector(container);
		}else if(container == null){
			container = document.createElement('div');
			document.body.appendChild(container);
		}
		container.classList.add(meta.className.container);
		
		//video texture
		if(typeof video === 'string'){
			video = document.querySelector(video);
		}else if(video == null){
			video = domVideo.createElement({
				className: meta.className.video,
				sources: videoSources
			});
			if(appendVideo)container.appendChild(video);
		}
		
		//player
		var player = new Player({
			container: container,
			video: video,
			control: control,
			renderer: renderer
		});
		
		self.container = container;
		self.video = video;
		self.player = player;
		self.util = util;
		self.media = media;
		if(typeof callbacks.init === 'function'){
			callbacks.init(self);
		}
	},
	load: function(){
		this.player.control.load.apply(this.player.control, arguments);
	},
	play: function(){
		this.player.control.play();
	},
	pause: function(){
		this.player.control.pause();
	},
	stop: function(){
		this.player.control.stop();
	},
	togglePlay: function(){
		this.player.control.togglePlay();
	}
};


module.exports = Video3d;
global.video3d = Video3d;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./html":3,"./media":8,"./player":13,"./util":27,"./variables":31}],7:[function(require,module,exports){


/**
 * Parser for exponential Golomb codes, a variable-bitwidth number encoding
 * scheme used by h264.
 */
var ExpGolomb = function(workingData) {
  var
    // the number of bytes left to examine in workingData
    workingBytesAvailable = workingData.byteLength,

    // the current word being examined
    workingWord = 0, // :uint

    // the number of bits left to examine in the current word
    workingBitsAvailable = 0; // :uint;

  // ():uint
  this.length = function() {
    return (8 * workingBytesAvailable);
  };

  // ():uint
  this.bitsAvailable = function() {
    return (8 * workingBytesAvailable) + workingBitsAvailable;
  };

  // ():void
  this.loadWord = function() {
    var
      position = workingData.byteLength - workingBytesAvailable,
      workingBytes = new Uint8Array(4),
      availableBytes = Math.min(4, workingBytesAvailable);

    if (availableBytes === 0) {
      throw new Error('no bytes available');
    }

    workingBytes.set(workingData.subarray(position,
                                          position + availableBytes));
    workingWord = new DataView(workingBytes.buffer).getUint32(0);

    // track the amount of workingData that has been processed
    workingBitsAvailable = availableBytes * 8;
    workingBytesAvailable -= availableBytes;
  };

  // (count:int):void
  this.skipBits = function(count) {
    var skipBytes; // :int
    if (workingBitsAvailable > count) {
      workingWord          <<= count;
      workingBitsAvailable -= count;
    } else {
      count -= workingBitsAvailable;
      skipBytes = count / 8;

      count -= (skipBytes * 8);
      workingBytesAvailable -= skipBytes;

      this.loadWord();

      workingWord <<= count;
      workingBitsAvailable -= count;
    }
  };

  // (size:int):uint
  this.readBits = function(size) {
    var
      bits = Math.min(workingBitsAvailable, size), // :uint
      valu = workingWord >>> (32 - bits); // :uint

    console.assert(size < 32, 'Cannot read more than 32 bits at a time');

    workingBitsAvailable -= bits;
    if (workingBitsAvailable > 0) {
      workingWord <<= bits;
    } else if (workingBytesAvailable > 0) {
      this.loadWord();
    }

    bits = size - bits;
    if (bits > 0) {
      return valu << bits | this.readBits(bits);
    } else {
      return valu;
    }
  };

  // ():uint
  this.skipLeadingZeros = function() {
    var leadingZeroCount; // :uint
    for (leadingZeroCount = 0 ; leadingZeroCount < workingBitsAvailable ; ++leadingZeroCount) {
      if (0 !== (workingWord & (0x80000000 >>> leadingZeroCount))) {
        // the first bit of working word is 1
        workingWord <<= leadingZeroCount;
        workingBitsAvailable -= leadingZeroCount;
        return leadingZeroCount;
      }
    }

    // we exhausted workingWord and still have not found a 1
    this.loadWord();
    return leadingZeroCount + this.skipLeadingZeros();
  };

  // ():void
  this.skipUnsignedExpGolomb = function() {
    this.skipBits(1 + this.skipLeadingZeros());
  };

  // ():void
  this.skipExpGolomb = function() {
    this.skipBits(1 + this.skipLeadingZeros());
  };

  // ():uint
  this.readUnsignedExpGolomb = function() {
    var clz = this.skipLeadingZeros(); // :uint
    return this.readBits(clz + 1) - 1;
  };

  // ():int
  this.readExpGolomb = function() {
    var valu = this.readUnsignedExpGolomb(); // :int
    if (0x01 & valu) {
      // the number is odd if the low order bit is set
      return (1 + valu) >>> 1; // add 1 to make it even, and divide by 2
    } else {
      return -1 * (valu >>> 1); // divide by two then make it negative
    }
  };

  // Some convenience functions
  // :Boolean
  this.readBoolean = function() {
    return 1 === this.readBits(1);
  };

  // ():int
  this.readUnsignedByte = function() {
    return this.readBits(8);
  };

  this.loadWord();

};

module.exports = {
	ExpGolomb: ExpGolomb
};


},{}],8:[function(require,module,exports){

"use strict";
var util = require('../util');
var Stream = require('./stream');
var mp4 = require('./mp4-generator');
var ExpGolomb = require('./exp-golomb');
var Transmuxer = require('./transmuxer');

//var zencoderHaze = require('./zencoder-haze');  //hazeVideo

var media = util.extend(true, {}, Stream, mp4, ExpGolomb, Transmuxer);

module.exports = media;
},{"../util":27,"./exp-golomb":7,"./mp4-generator":9,"./stream":10,"./transmuxer":11}],9:[function(require,module,exports){

'use strict';

var box, dinf, ftyp, mdat, mfhd, minf, moof, moov, mvex, mvhd, trak,
    tkhd, mdia, mdhd, hdlr, sdtp, stbl, stsd, styp, traf, trex, trun,
    types, MAJOR_BRAND, MINOR_VERSION, AVC1_BRAND, VIDEO_HDLR,
    AUDIO_HDLR, HDLR_TYPES, ESDS, VMHD, SMHD, DREF, STCO, STSC, STSZ, STTS;
//    Uint8Array, DataView;

//var Uint8Array = window.Uint8Array;
//var DataView = window.DataView;

// pre-calculate constants
(function() {
  var i;
  types = {
    avc1: [], // codingname
    avcC: [],
    btrt: [],
    dinf: [],
    dref: [],
    esds: [],
    ftyp: [],
    hdlr: [],
    mdat: [],
    mdhd: [],
    mdia: [],
    mfhd: [],
    minf: [],
    moof: [],
    moov: [],
    mp4a: [], // codingname
    mvex: [],
    mvhd: [],
    sdtp: [],
    smhd: [],
    stbl: [],
    stco: [],
    stsc: [],
    stsd: [],
    stsz: [],
    stts: [],
    styp: [],
    tfdt: [],
    tfhd: [],
    traf: [],
    trak: [],
    trun: [],
    trex: [],
    tkhd: [],
    vmhd: []
  };

  for (i in types) {
    if (types.hasOwnProperty(i)) {
      types[i] = [
        i.charCodeAt(0),
        i.charCodeAt(1),
        i.charCodeAt(2),
        i.charCodeAt(3)
      ];
    }
  }

  MAJOR_BRAND = new Uint8Array([
    'i'.charCodeAt(0),
    's'.charCodeAt(0),
    'o'.charCodeAt(0),
    'm'.charCodeAt(0)
  ]);
  AVC1_BRAND = new Uint8Array([
    'a'.charCodeAt(0),
    'v'.charCodeAt(0),
    'c'.charCodeAt(0),
    '1'.charCodeAt(0)
  ]);
  MINOR_VERSION = new Uint8Array([0, 0, 0, 1]);
  VIDEO_HDLR = new Uint8Array([
    0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, // pre_defined
    0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x56, 0x69, 0x64, 0x65,
    0x6f, 0x48, 0x61, 0x6e,
    0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
  ]);
  AUDIO_HDLR = new Uint8Array([
    0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, // pre_defined
    0x73, 0x6f, 0x75, 0x6e, // handler_type: 'soun'
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x53, 0x6f, 0x75, 0x6e,
    0x64, 0x48, 0x61, 0x6e,
    0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'SoundHandler'
  ]);
  HDLR_TYPES = {
    "video":VIDEO_HDLR,
    "audio": AUDIO_HDLR
  };
  DREF = new Uint8Array([
    0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x01, // entry_count
    0x00, 0x00, 0x00, 0x0c, // entry_size
    0x75, 0x72, 0x6c, 0x20, // 'url' type
    0x00, // version 0
    0x00, 0x00, 0x01 // entry_flags
  ]);
  ESDS = new Uint8Array([
    0x00, // version
    0x00, 0x00, 0x00, // flags

    // ES_Descriptor
    0x03, // tag, ES_DescrTag
    0x19, // length
    0x00, 0x00, // ES_ID
    0x00, // streamDependenceFlag, URL_flag, reserved, streamPriority

    // DecoderConfigDescriptor
    0x04, // tag, DecoderConfigDescrTag
    0x11, // length
    0x40, // object type
    0x15,  // streamType
    0x00, 0x06, 0x00, // bufferSizeDB
    0x00, 0x00, 0xda, 0xc0, // maxBitrate
    0x00, 0x00, 0xda, 0xc0, // avgBitrate

    // DecoderSpecificInfo
    0x05, // tag, DecoderSpecificInfoTag
    0x02, // length
    // ISO/IEC 14496-3, AudioSpecificConfig
    0x11, // AudioObjectType, AAC LC.
    0x90, // samplingFrequencyIndex, 8 -> 16000. channelConfig, 2 -> stereo.
    0x06, 0x01, 0x02 // GASpecificConfig
  ]);
  SMHD = new Uint8Array([
    0x00,             // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00,       // balance, 0 means centered
    0x00, 0x00        // reserved
  ]);
  STCO = new Uint8Array([
    0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00 // entry_count
  ]);
  STSC = STCO;
  STSZ = new Uint8Array([
    0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, // sample_size
    0x00, 0x00, 0x00, 0x00, // sample_count
  ]);
  STTS = STCO;
  VMHD = new Uint8Array([
    0x00, // version
    0x00, 0x00, 0x01, // flags
    0x00, 0x00, // graphicsmode
    0x00, 0x00,
    0x00, 0x00,
    0x00, 0x00 // opcolor
  ]);
})();

box = function(type) {
  var
    payload = Array.prototype.slice.call(arguments, 1),
    size = 0,
    i = payload.length,
    result,
    view;

  // calculate the total size we need to allocate
  while (i--) {
    size += payload[i].byteLength;
  }
  result = new Uint8Array(size + 8);
  view = new DataView(result.buffer, result.byteOffset, result.byteLength);
  view.setUint32(0, result.byteLength);
  result.set(type, 4);

  // copy the payload into the result
  for (i = 0, size = 8; i < payload.length; i++) {
    result.set(payload[i], size);
    size += payload[i].byteLength;
  }
  return result;
};

dinf = function() {
  return box(types.dinf, box(types.dref, DREF));
};

ftyp = function() {
  return box(types.ftyp, MAJOR_BRAND, MINOR_VERSION, MAJOR_BRAND, AVC1_BRAND);
};

hdlr = function(type) {
  return box(types.hdlr, HDLR_TYPES[type]);
};
mdat = function(data) {
  return box(types.mdat, data);
};
mdhd = function(track) {
  var result = new Uint8Array([
    0x00,                   // version 0
    0x00, 0x00, 0x00,       // flags
    0x00, 0x00, 0x00, 0x02, // creation_time
    0x00, 0x00, 0x00, 0x03, // modification_time
    0x00, 0x01, 0x5f, 0x90, // timescale, 90,000 "ticks" per second

    (track.duration >>> 24),
    (track.duration >>> 16) & 0xFF,
    (track.duration >>>  8) & 0xFF,
    track.duration & 0xFF,  // duration
    0x55, 0xc4,             // 'und' language (undetermined)
    0x00, 0x00
  ]);

  // Use the sample rate from the track metadata, when it is
  // defined. The sample rate can be parsed out of an ADTS header, for
  // instance.
  if (track.samplerate) {
    result[12] = (track.samplerate >>> 24);
    result[13] = (track.samplerate >>> 16) & 0xFF;
    result[14] = (track.samplerate >>>  8) & 0xFF;
    result[15] = (track.samplerate)        & 0xFF;
  }
  return box(types.mdhd, result);
};
mdia = function(track) {
  return box(types.mdia, mdhd(track), hdlr(track.type), minf(track));
};
mfhd = function(sequenceNumber) {
  return box(types.mfhd, new Uint8Array([
    0x00,
    0x00, 0x00, 0x00, // flags
    (sequenceNumber & 0xFF000000) >> 24,
    (sequenceNumber & 0xFF0000) >> 16,
    (sequenceNumber & 0xFF00) >> 8,
    sequenceNumber & 0xFF, // sequence_number
  ]));
};
minf = function(track) {
  return box(types.minf,
             track.type === 'video' ? box(types.vmhd, VMHD) : box(types.smhd, SMHD),
             dinf(),
             stbl(track));
};
moof = function(sequenceNumber, tracks) {
  var
    trackFragments = [],
    i = tracks.length;
  // build traf boxes for each track fragment
  while (i--) {
    trackFragments[i] = traf(tracks[i]);
  }
  return box.apply(null, [
    types.moof,
    mfhd(sequenceNumber)
  ].concat(trackFragments));
};
/**
 * Returns a movie box.
 * @param tracks {array} the tracks associated with this movie
 * @see ISO/IEC 14496-12:2012(E), section 8.2.1
 */
moov = function(tracks) {
  var
    i = tracks.length,
    boxes = [];

  while (i--) {
    boxes[i] = trak(tracks[i]);
  }

  return box.apply(null, [types.moov, mvhd(0xffffffff)].concat(boxes).concat(mvex(tracks)));
};
mvex = function(tracks) {
  var
    i = tracks.length,
    boxes = [];

  while (i--) {
    boxes[i] = trex(tracks[i]);
  }
  return box.apply(null, [types.mvex].concat(boxes));
};
mvhd = function(duration) {
  var
    bytes = new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x01, // creation_time
      0x00, 0x00, 0x00, 0x02, // modification_time
      0x00, 0x01, 0x5f, 0x90, // timescale, 90,000 "ticks" per second
      (duration & 0xFF000000) >> 24,
      (duration & 0xFF0000) >> 16,
      (duration & 0xFF00) >> 8,
      duration & 0xFF, // duration
      0x00, 0x01, 0x00, 0x00, // 1.0 rate
      0x01, 0x00, // 1.0 volume
      0x00, 0x00, // reserved
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // pre_defined
      0xff, 0xff, 0xff, 0xff // next_track_ID
    ]);
  return box(types.mvhd, bytes);
};

sdtp = function(track) {
  var
    samples = track.samples || [],
    bytes = new Uint8Array(4 + samples.length),
    flags,
    i;

  // leave the full box header (4 bytes) all zero

  // write the sample table
  for (i = 0; i < samples.length; i++) {
    flags = samples[i].flags;

    bytes[i + 4] = (flags.dependsOn << 4) |
      (flags.isDependedOn << 2) |
      (flags.hasRedundancy);
  }

  return box(types.sdtp,
             bytes);
};

stbl = function(track) {
  return box(types.stbl,
             stsd(track),
             box(types.stts, STTS),
             box(types.stsc, STSC),
             box(types.stsz, STSZ),
             box(types.stco, STCO));
};

(function() {
  var videoSample, audioSample;

  stsd = function(track) {

    return box(types.stsd, new Uint8Array([
      0x00, // version 0
      0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x01
    ]), track.type === 'video' ? videoSample(track) : audioSample(track));
  };

  videoSample = function(track) {
    var sequenceParameterSets = [], pictureParameterSets = [], i;

    // assemble the SPSs
    for (i = 0; i < track.sps.length; i++) {
      sequenceParameterSets.push((track.sps[i].byteLength & 0xFF00) >>> 8);
      sequenceParameterSets.push((track.sps[i].byteLength & 0xFF)); // sequenceParameterSetLength
      sequenceParameterSets = sequenceParameterSets.concat(Array.prototype.slice.call(track.sps[i])); // SPS
    }

    // assemble the PPSs
    for (i = 0; i < track.pps.length; i++) {
      pictureParameterSets.push((track.pps[i].byteLength & 0xFF00) >>> 8);
      pictureParameterSets.push((track.pps[i].byteLength & 0xFF));
      pictureParameterSets = pictureParameterSets.concat(Array.prototype.slice.call(track.pps[i]));
    }

    return box(types.avc1, new Uint8Array([
      0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, // reserved
      0x00, 0x01, // data_reference_index
      0x00, 0x00, // pre_defined
      0x00, 0x00, // reserved
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // pre_defined
      (track.width & 0xff00) >> 8,
      track.width & 0xff, // width
      (track.height & 0xff00) >> 8,
      track.height & 0xff, // height
      0x00, 0x48, 0x00, 0x00, // horizresolution
      0x00, 0x48, 0x00, 0x00, // vertresolution
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x01, // frame_count
      0x13,
      0x76, 0x69, 0x64, 0x65,
      0x6f, 0x6a, 0x73, 0x2d,
      0x63, 0x6f, 0x6e, 0x74,
      0x72, 0x69, 0x62, 0x2d,
      0x68, 0x6c, 0x73, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, // compressorname
      0x00, 0x18, // depth = 24
      0x11, 0x11 // pre_defined = -1
    ]), box(types.avcC, new Uint8Array([
      0x01, // configurationVersion
      track.profileIdc, // AVCProfileIndication
      track.profileCompatibility, // profile_compatibility
      track.levelIdc, // AVCLevelIndication
      0xff // lengthSizeMinusOne, hard-coded to 4 bytes
    ].concat([
      track.sps.length // numOfSequenceParameterSets
    ]).concat(sequenceParameterSets).concat([
      track.pps.length // numOfPictureParameterSets
    ]).concat(pictureParameterSets))), // "PPS"
            box(types.btrt, new Uint8Array([
              0x00, 0x1c, 0x9c, 0x80, // bufferSizeDB
              0x00, 0x2d, 0xc6, 0xc0, // maxBitrate
              0x00, 0x2d, 0xc6, 0xc0
            ])) // avgBitrate
              );
  };

  audioSample = function(track) {
    return box(types.mp4a, new Uint8Array([

      // SampleEntry, ISO/IEC 14496-12
      0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, // reserved
      0x00, 0x01, // data_reference_index

      // AudioSampleEntry, ISO/IEC 14496-12
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x00, 0x00, 0x00, // reserved
      (track.channelcount & 0xff00) >> 8,
      (track.channelcount & 0xff), // channelcount

      (track.samplesize & 0xff00) >> 8,
      (track.samplesize & 0xff), // samplesize
      0x00, 0x00, // pre_defined
      0x00, 0x00, // reserved

      (track.samplerate & 0xff00) >> 8,
      (track.samplerate & 0xff),
      0x00, 0x00 // samplerate, 16.16

      // MP4AudioSampleEntry, ISO/IEC 14496-14
    ]), box(types.esds, ESDS));
  };
})();

styp = function() {
  return box(types.styp, MAJOR_BRAND, MINOR_VERSION, MAJOR_BRAND);
};

tkhd = function(track) {
  var result = new Uint8Array([
    0x00, // version 0
    0x00, 0x00, 0x07, // flags
    0x00, 0x00, 0x00, 0x00, // creation_time
    0x00, 0x00, 0x00, 0x00, // modification_time
    (track.id & 0xFF000000) >> 24,
    (track.id & 0xFF0000) >> 16,
    (track.id & 0xFF00) >> 8,
    track.id & 0xFF, // track_ID
    0x00, 0x00, 0x00, 0x00, // reserved
    (track.duration & 0xFF000000) >> 24,
    (track.duration & 0xFF0000) >> 16,
    (track.duration & 0xFF00) >> 8,
    track.duration & 0xFF, // duration
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, // layer
    0x00, 0x00, // alternate_group
    0x01, 0x00, // non-audio track volume
    0x00, 0x00, // reserved
    0x00, 0x01, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x01, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
    (track.width & 0xFF00) >> 8,
    track.width & 0xFF,
    0x00, 0x00, // width
    (track.height & 0xFF00) >> 8,
    track.height & 0xFF,
    0x00, 0x00 // height
  ]);

  return box(types.tkhd, result);
};

/**
 * Generate a track fragment (traf) box. A traf box collects metadata
 * about tracks in a movie fragment (moof) box.
 */
traf = function(track) {
  var trackFragmentHeader, trackFragmentDecodeTime,
      trackFragmentRun, sampleDependencyTable, dataOffset;

  trackFragmentHeader = box(types.tfhd, new Uint8Array([
    0x00, // version 0
    0x00, 0x00, 0x3a, // flags
    (track.id & 0xFF000000) >> 24,
    (track.id & 0xFF0000) >> 16,
    (track.id & 0xFF00) >> 8,
    (track.id & 0xFF), // track_ID
    0x00, 0x00, 0x00, 0x01, // sample_description_index
    0x00, 0x00, 0x00, 0x00, // default_sample_duration
    0x00, 0x00, 0x00, 0x00, // default_sample_size
    0x00, 0x00, 0x00, 0x00  // default_sample_flags
  ]));

  trackFragmentDecodeTime = box(types.tfdt, new Uint8Array([
    0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00 // baseMediaDecodeTime
  ]));

  // the data offset specifies the number of bytes from the start of
  // the containing moof to the first payload byte of the associated
  // mdat
  dataOffset = (32 + // tfhd
                16 + // tfdt
                8 +  // traf header
                16 + // mfhd
                8 +  // moof header
                8);  // mdat header

  // audio tracks require less metadata
  if (track.type === 'audio') {
    trackFragmentRun = trun(track, dataOffset);
    return box(types.traf,
               trackFragmentHeader,
               trackFragmentDecodeTime,
               trackFragmentRun);
  }

  // video tracks should contain an independent and disposable samples
  // box (sdtp)
  // generate one and adjust offsets to match
  sampleDependencyTable = sdtp(track);
  trackFragmentRun = trun(track,
                          sampleDependencyTable.length + dataOffset);
  return box(types.traf,
             trackFragmentHeader,
             trackFragmentDecodeTime,
             trackFragmentRun,
             sampleDependencyTable);
};

/**
 * Generate a track box.
 * @param track {object} a track definition
 * @return {Uint8Array} the track box
 */
trak = function(track) {
  track.duration = track.duration || 0xffffffff;
  return box(types.trak,
             tkhd(track),
             mdia(track));
};

trex = function(track) {
  var result = new Uint8Array([
    0x00, // version 0
    0x00, 0x00, 0x00, // flags
    (track.id & 0xFF000000) >> 24,
    (track.id & 0xFF0000) >> 16,
    (track.id & 0xFF00) >> 8,
    (track.id & 0xFF), // track_ID
    0x00, 0x00, 0x00, 0x01, // default_sample_description_index
    0x00, 0x00, 0x00, 0x00, // default_sample_duration
    0x00, 0x00, 0x00, 0x00, // default_sample_size
    0x00, 0x01, 0x00, 0x01 // default_sample_flags
  ]);
  // the last two bytes of default_sample_flags is the sample
  // degradation priority, a hint about the importance of this sample
  // relative to others. Lower the degradation priority for all sample
  // types other than video.
  if (track.type !== 'video') {
    result[result.length - 1] = 0x00;
  }

  return box(types.trex, result);
};

(function() {
  var audioTrun, videoTrun, trunHeader;

  // This method assumes all samples are uniform. That is, if a
  // duration is present for the first sample, it will be present for
  // all subsequent samples.
  // see ISO/IEC 14496-12:2012, Section 8.8.8.1
  trunHeader = function(samples, offset) {
    var durationPresent = 0, sizePresent = 0,
        flagsPresent = 0, compositionTimeOffset = 0;

    // trun flag constants
    if (samples.length) {
      if (samples[0].duration !== undefined) {
        durationPresent = 0x1;
      }
      if (samples[0].size !== undefined) {
        sizePresent = 0x2;
      }
      if (samples[0].flags !== undefined) {
        flagsPresent = 0x4;
      }
      if (samples[0].compositionTimeOffset !== undefined) {
        compositionTimeOffset = 0x8;
      }
    }

    return [
      0x00, // version 0
      0x00,
      durationPresent | sizePresent | flagsPresent | compositionTimeOffset,
      0x01, // flags
      (samples.length & 0xFF000000) >>> 24,
      (samples.length & 0xFF0000) >>> 16,
      (samples.length & 0xFF00) >>> 8,
      samples.length & 0xFF, // sample_count
      (offset & 0xFF000000) >>> 24,
      (offset & 0xFF0000) >>> 16,
      (offset & 0xFF00) >>> 8,
      offset & 0xFF // data_offset
    ];
  };

  videoTrun = function(track, offset) {
    var bytes, samples, sample, i;

    samples = track.samples || [];
    offset += 8 + 12 + (16 * samples.length);

    bytes = trunHeader(samples, offset);

    for (i = 0; i < samples.length; i++) {
      sample = samples[i];
      bytes = bytes.concat([
        (sample.duration & 0xFF000000) >>> 24,
        (sample.duration & 0xFF0000) >>> 16,
        (sample.duration & 0xFF00) >>> 8,
        sample.duration & 0xFF, // sample_duration
        (sample.size & 0xFF000000) >>> 24,
        (sample.size & 0xFF0000) >>> 16,
        (sample.size & 0xFF00) >>> 8,
        sample.size & 0xFF, // sample_size
        (sample.flags.isLeading << 2) | sample.flags.dependsOn,
        (sample.flags.isDependedOn << 6) |
          (sample.flags.hasRedundancy << 4) |
          (sample.flags.paddingValue << 1) |
          sample.flags.isNonSyncSample,
        sample.flags.degradationPriority & 0xF0 << 8,
        sample.flags.degradationPriority & 0x0F, // sample_flags
        (sample.compositionTimeOffset & 0xFF000000) >>> 24,
        (sample.compositionTimeOffset & 0xFF0000) >>> 16,
        (sample.compositionTimeOffset & 0xFF00) >>> 8,
        sample.compositionTimeOffset & 0xFF // sample_composition_time_offset
      ]);
    }
    return box(types.trun, new Uint8Array(bytes));
  };

  audioTrun = function(track, offset) {
    var bytes, samples, sample, i;

    samples = track.samples || [];
    offset += 8 + 12 + (8 * samples.length);

    bytes = trunHeader(samples, offset);

    for (i = 0; i < samples.length; i++) {
      sample = samples[i];
      bytes = bytes.concat([
        (sample.duration & 0xFF000000) >>> 24,
        (sample.duration & 0xFF0000) >>> 16,
        (sample.duration & 0xFF00) >>> 8,
        sample.duration & 0xFF, // sample_duration
        (sample.size & 0xFF000000) >>> 24,
        (sample.size & 0xFF0000) >>> 16,
        (sample.size & 0xFF00) >>> 8,
        sample.size & 0xFF]); // sample_size
    }

    return box(types.trun, new Uint8Array(bytes));
  };

  trun = function(track, offset) {
    if (track.type === 'audio') {
      return audioTrun(track, offset);
    } else {
      return videoTrun(track, offset);
    }
  };
})();

var mp4 = {
  ftyp: ftyp,
  mdat: mdat,
  moof: moof,
  moov: moov,
  initSegment: function(tracks) {
    var
      fileType = ftyp(),
      movie = moov(tracks),
      result;

    result = new Uint8Array(fileType.byteLength + movie.byteLength);
    result.set(fileType);
    result.set(movie, fileType.byteLength);
    return result;
  }
};

module.exports = {
	mp4: mp4
};

},{}],10:[function(require,module,exports){
/**
 * A lightweight readable stream implemention that handles event dispatching.
 * Objects that inherit from streams should call init in their constructors.
 */
'use strict';
var Stream = function() {
	
};
Stream.prototype = {
	constructor: Stream,
	init: function(){
		var listeners = {};
		/**
		* Add a listener for a specified event type.
		* @param type {string} the event name
		* @param listener {function} the callback to be invoked when an event of
		* the specified type occurs
		*/
		this.on = function(type, listener) {
			if (!listeners[type]) {
				listeners[type] = [];
			}
			listeners[type].push(listener);
		};
		/**
		* Remove a listener for a specified event type.
		* @param type {string} the event name
		* @param listener {function} a function previously registered for this
		* type of event through `on`
		*/
		this.off = function(type, listener) {
			var index;
			if (!listeners[type]) {
				return false;
			}
			index = listeners[type].indexOf(listener);
			listeners[type].splice(index, 1);
			return index > -1;
		};
		/**
		* Trigger an event of the specified type on this stream. Any additional
		* arguments to this function are passed as parameters to event listeners.
		* @param type {string} the event name
		*/
		this.trigger = function(type) {
			var callbacks, i, length, args;
			callbacks = listeners[type];
			if (!callbacks) {
				return;
			}
			// Slicing the arguments on every invocation of this method
			// can add a significant amount of overhead. Avoid the
			// intermediate object creation for the common case of a
			// single callback argument
			if (arguments.length === 2) {
				length = callbacks.length;
				for (i = 0; i < length; ++i) {
				callbacks[i].call(this, arguments[1]);
				}
			} else {
				args = Array.prototype.slice.call(arguments, 1);
				length = callbacks.length;
				for (i = 0; i < length; ++i) {
				callbacks[i].apply(this, args);
				}
			}
		};
		/**
		* Destroys the stream and cleans up.
		*/
		this.dispose = function() {
			listeners = {};
		};
	},
	/**
	* Forwards all `data` events on this stream to the destination stream. The
	* destination stream should provide a method `push` to receive the data
	* events as they arrive.
	* @param destination {stream} the stream that will receive all `data` events
	* @see http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
	*/
	pipe: function(destination){
		this.on('data', function(data) {
			destination.push(data);
		});
	}
};

module.exports = {
	Stream: Stream
};
},{}],11:[function(require,module,exports){

/**
 * A stream-based mp2t to mp4 converter. This utility is used to
 * deliver mp4s to a SourceBuffer on platforms that support native
 * Media Source Extensions. The equivalent process for Flash-based
 * platforms can be found in segment-parser.js
 */
'use strict';
var Stream = require('./stream').Stream;
var mp4 = require('./mp4-generator').mp4;
var ExpGolomb = require('./exp-golomb').ExpGolomb;

var
	TransportPacketStream, TransportParseStream, ElementaryStream, VideoSegmentStream,
	AudioSegmentStream, Transmuxer, AacStream, H264Stream, NalByteStream,
	MP2T_PACKET_LENGTH, H264_STREAM_TYPE, ADTS_STREAM_TYPE,
	ADTS_SAMPLING_FREQUENCIES, mp4;

MP2T_PACKET_LENGTH = 188; // bytes
H264_STREAM_TYPE = 0x1b;
ADTS_STREAM_TYPE = 0x0f;
ADTS_SAMPLING_FREQUENCIES = [
	96000,
	88200,
	64000,
	48000,
	44100,
	32000,
	24000,
	22050,
	16000,
	12000,
	11025,
	8000,
	7350
];


/**
 * Splits an incoming stream of binary data into MPEG-2 Transport
 * Stream packets.
 */
TransportPacketStream = function() {
	var buffer = new Uint8Array(MP2T_PACKET_LENGTH),
		end = 0;

	TransportPacketStream.prototype.init.call(this);
	
	/**
	* Deliver new bytes to the stream.
	*/
	this.push = function(bytes) {
		var remaining, i;
		
		// clear out any partial packets in the buffer
		if (end > 0) {
			remaining = MP2T_PACKET_LENGTH - end;
			buffer.set(bytes.subarray(0, remaining), end);
		
			// we still didn't write out a complete packet
			if (bytes.byteLength < remaining) {
			end += bytes.byteLength;
			return;
			}
		
			bytes = bytes.subarray(remaining);
			end = 0;
			this.trigger('data', buffer);
		}
		
		// if less than a single packet is available, buffer it up for later
		if (bytes.byteLength < MP2T_PACKET_LENGTH) {
			buffer.set(bytes.subarray(i), end);
			end += bytes.byteLength;
			return;
		}
		// parse out all the completed packets
		i = 0;
		do {
			this.trigger('data', bytes.subarray(i, i + MP2T_PACKET_LENGTH));
			i += MP2T_PACKET_LENGTH;
			remaining = bytes.byteLength - i;
		} while (i < bytes.byteLength && remaining >= MP2T_PACKET_LENGTH);
		// buffer any partial packets left over
		if (remaining > 0) {
			buffer.set(bytes.subarray(i));
			end = remaining;
		}
	};
};
TransportPacketStream.prototype = new Stream();

/**
 * Accepts an MP2T TransportPacketStream and emits data events with parsed
 * forms of the individual transport stream packets.
 */
TransportParseStream = function() {
	var parsePsi, parsePat, parsePmt, parsePes, self;
	TransportParseStream.prototype.init.call(this);
	self = this;
	
	this.programMapTable = {};
	
	parsePsi = function(payload, psi) {
	var offset = 0;
	
	// PSI packets may be split into multiple sections and those
	// sections may be split into multiple packets. If a PSI
	// section starts in this packet, the payload_unit_start_indicator
	// will be true and the first byte of the payload will indicate
	// the offset from the current position to the start of the
	// section.
	if (psi.payloadUnitStartIndicator) {
		offset += payload[offset] + 1;
	}
	
	if (psi.type === 'pat') {
		parsePat(payload.subarray(offset), psi);
	} else {
		parsePmt(payload.subarray(offset), psi);
	}
	};
	
	parsePat = function(payload, pat) {
	pat.section_number = payload[7];
	pat.last_section_number = payload[8];
	
	// skip the PSI header and parse the first PMT entry
	self.pmtPid = (payload[10] & 0x1F) << 8 | payload[11];
	pat.pmtPid = self.pmtPid;
	};
	
	/**
	* Parse out the relevant fields of a Program Map Table (PMT).
	* @param payload {Uint8Array} the PMT-specific portion of an MP2T
	* packet. The first byte in this array should be the table_id
	* field.
	* @param pmt {object} the object that should be decorated with
	* fields parsed from the PMT.
	*/
	parsePmt = function(payload, pmt) {
	var sectionLength, tableEnd, programInfoLength, offset;
	
	// PMTs can be sent ahead of the time when they should actually
	// take effect. We don't believe this should ever be the case
	// for HLS but we'll ignore "forward" PMT declarations if we see
	// them. Future PMT declarations have the current_next_indicator
	// set to zero.
	if (!(payload[5] & 0x01)) {
		return;
	}
	
	// overwrite any existing program map table
	self.programMapTable = {};
	
	// the mapping table ends at the end of the current section
	sectionLength = (payload[1] & 0x0f) << 8 | payload[2];
	tableEnd = 3 + sectionLength - 4;
	
	// to determine where the table is, we have to figure out how
	// long the program info descriptors are
	programInfoLength = (payload[10] & 0x0f) << 8 | payload[11];
	
	// advance the offset to the first entry in the mapping table
	offset = 12 + programInfoLength;
	while (offset < tableEnd) {
		// add an entry that maps the elementary_pid to the stream_type
		self.programMapTable[(payload[offset + 1] & 0x1F) << 8 | payload[offset + 2]] = payload[offset];
	
		// move to the next table entry
		// skip past the elementary stream descriptors, if present
		offset += ((payload[offset + 3] & 0x0F) << 8 | payload[offset + 4]) + 5;
	}
	
	// record the map on the packet as well
	pmt.programMapTable = self.programMapTable;
	};
	
	parsePes = function(payload, pes) {
	var ptsDtsFlags;
	
	if (!pes.payloadUnitStartIndicator) {
		pes.data = payload;
		return;
	}
	
	// find out if this packets starts a new keyframe
	pes.dataAlignmentIndicator = (payload[6] & 0x04) !== 0;
	// PES packets may be annotated with a PTS value, or a PTS value
	// and a DTS value. Determine what combination of values is
	// available to work with.
	ptsDtsFlags = payload[7];
	
	// PTS and DTS are normally stored as a 33-bit number.  Javascript
	// performs all bitwise operations on 32-bit integers but it's
	// convenient to convert from 90ns to 1ms time scale anyway. So
	// what we are going to do instead is drop the least significant
	// bit (in effect, dividing by two) then we can divide by 45 (45 *
	// 2 = 90) to get ms.
	if (ptsDtsFlags & 0xC0) {
		// the PTS and DTS are not written out directly. For information
		// on how they are encoded, see
		// http://dvd.sourceforge.net/dvdinfo/pes-hdr.html
		pes.pts = (payload[9] & 0x0E) << 28
		| (payload[10] & 0xFF) << 21
		| (payload[11] & 0xFE) << 13
		| (payload[12] & 0xFF) <<  6
		| (payload[13] & 0xFE) >>>  2;
		pes.pts /= 45;
		pes.dts = pes.pts;
		if (ptsDtsFlags & 0x40) {
		pes.dts = (payload[14] & 0x0E ) << 28
			| (payload[15] & 0xFF ) << 21
			| (payload[16] & 0xFE ) << 13
			| (payload[17] & 0xFF ) << 6
			| (payload[18] & 0xFE ) >>> 2;
		pes.dts /= 45;
		}
	}
	
	// the data section starts immediately after the PES header.
	// pes_header_data_length specifies the number of header bytes
	// that follow the last byte of the field.
	pes.data = payload.subarray(9 + payload[8]);
	};
	
	/**
	* Deliver a new MP2T packet to the stream.
	*/
	this.push = function(packet) {
	var
		result = {},
		offset = 4;
	// make sure packet is aligned on a sync byte
	if (packet[0] !== 0x47) {
		return this.trigger('error', 'mis-aligned packet');
	}
	result.payloadUnitStartIndicator = !!(packet[1] & 0x40);
	
	// pid is a 13-bit field starting at the last bit of packet[1]
	result.pid = packet[1] & 0x1f;
	result.pid <<= 8;
	result.pid |= packet[2];
	
	// if an adaption field is present, its length is specified by the
	// fifth byte of the TS packet header. The adaptation field is
	// used to add stuffing to PES packets that don't fill a complete
	// TS packet, and to specify some forms of timing and control data
	// that we do not currently use.
	if (((packet[3] & 0x30) >>> 4) > 0x01) {
		offset += packet[offset] + 1;
	}
	
	// parse the rest of the packet based on the type
	if (result.pid === 0) {
		result.type = 'pat';
		parsePsi(packet.subarray(offset), result);
	} else if (result.pid === this.pmtPid) {
		result.type = 'pmt';
		parsePsi(packet.subarray(offset), result);
	} else {
		result.streamType = this.programMapTable[result.pid];
		result.type = 'pes';
		parsePes(packet.subarray(offset), result);
	}
	
	this.trigger('data', result);
	};
};
TransportParseStream.prototype = new Stream();
TransportParseStream.STREAM_TYPES  = {
	h264: 0x1b,
	adts: 0x0f
};

/**
 * Reconsistutes program elementary stream (PES) packets from parsed
 * transport stream packets. That is, if you pipe an
 * mp2t.TransportParseStream into a mp2t.ElementaryStream, the output
 * events will be events which capture the bytes for individual PES
 * packets plus relevant metadata that has been extracted from the
 * container.
 */
ElementaryStream = function() {
	var
		// PES packet fragments
		video = {
			data: [],
			size: 0
		},
		audio = {
			data: [],
			size: 0
		},
		flushStream = function(stream, type) {
			var
			event = {
				type: type,
				data: new Uint8Array(stream.size),
			},
			i = 0,
			fragment;
		
			// do nothing if there is no buffered data
			if (!stream.data.length) {
			return;
			}
			event.trackId = stream.data[0].pid;
			event.pts = stream.data[0].pts;
			event.dts = stream.data[0].dts;
		
			// reassemble the packet
			while (stream.data.length) {
			fragment = stream.data.shift();
		
			event.data.set(fragment.data, i);
			i += fragment.data.byteLength;
			}
			stream.size = 0;
		
			self.trigger('data', event);
		},
		self;
	
	ElementaryStream.prototype.init.call(this);
	self = this;
	
	this.push = function(data) {
	({
		pat: function() {
		// we have to wait for the PMT to arrive as well before we
		// have any meaningful metadata
		},
		pes: function() {
		var stream, streamType;
	
		switch (data.streamType) {
		case H264_STREAM_TYPE:
			stream = video;
			streamType = 'video';
			break;
		case ADTS_STREAM_TYPE:
			stream = audio;
			streamType = 'audio';
			break;
		default:
			// ignore unknown stream types
			return;
		}
	
		// if a new packet is starting, we can flush the completed
		// packet
		if (data.payloadUnitStartIndicator) {
			flushStream(stream, streamType);
		}
	
		// buffer this fragment until we are sure we've received the
		// complete payload
		stream.data.push(data);
		stream.size += data.data.byteLength;
		},
		pmt: function() {
		var
			event = {
			type: 'metadata',
			tracks: []
			},
			programMapTable = data.programMapTable,
			k,
			track;
	
		// translate streams to tracks
		for (k in programMapTable) {
			if (programMapTable.hasOwnProperty(k)) {
			track = {};
			track.id = +k;
			if (programMapTable[k] === H264_STREAM_TYPE) {
				track.codec = 'avc';
				track.type = 'video';
			} else if (programMapTable[k] === ADTS_STREAM_TYPE) {
				track.codec = 'adts';
				track.type = 'audio';
			}
			event.tracks.push(track);
			}
		}
		self.trigger('data', event);
		}
	})[data.type]();
	};
	
	/**
	* Flush any remaining input. Video PES packets may be of variable
	* length. Normally, the start of a new video packet can trigger the
	* finalization of the previous packet. That is not possible if no
	* more video is forthcoming, however. In that case, some other
	* mechanism (like the end of the file) has to be employed. When it is
	* clear that no additional data is forthcoming, calling this method
	* will flush the buffered packets.
	*/
	this.end = function() {
		flushStream(video, 'video');
		flushStream(audio, 'audio');
	};
};
ElementaryStream.prototype = new Stream();

/*
 * Accepts a ElementaryStream and emits data events with parsed
 * AAC Audio Frames of the individual packets. Input audio in ADTS
 * format is unpacked and re-emitted as AAC frames.
 *
 * @see http://wiki.multimedia.cx/index.php?title=ADTS
 * @see http://wiki.multimedia.cx/?title=Understanding_AAC
 */
AacStream = function() {
	var i = 1, self, buffer;
	AacStream.prototype.init.call(this);
	self = this;
	
	this.push = function(packet) {
	var frameLength;
	
	if (packet.type !== 'audio') {
		// ignore non-audio data
		return;
	}
	
	buffer = packet.data;
	
	// unpack any ADTS frames which have been fully received
	while (i + 4 < buffer.length) {
		// frame length is a 13 bit integer starting 16 bits from the
		// end of the sync sequence
		frameLength = ((buffer[i + 2] & 0x03) << 11) |
		(buffer[i + 3] << 3) |
		((buffer[i + 4] & 0xe0) >> 5);
	
		// deliver the AAC frame
		this.trigger('data', {
		channelcount: ((buffer[i + 1] & 1) << 3) |
			((buffer[i + 2] & 0xc0) >> 6),
		samplerate: ADTS_SAMPLING_FREQUENCIES[(buffer[i + 1] & 0x3c) >> 2],
		// assume ISO/IEC 14496-12 AudioSampleEntry default of 16
		samplesize: 16,
		data: buffer.subarray(i + 6, i + frameLength - 1)
		});
	
		// flush the finished frame and try again
		buffer = buffer.subarray(i + frameLength - 1);
		i = 1;
	}
	};
};
AacStream.prototype = new Stream();

/**
 * Constructs a single-track, ISO BMFF media segment from AAC data
 * events. The output of this stream can be fed to a SourceBuffer
 * configured with a suitable initialization segment.
 */
// TODO: share common code with VideoSegmentStream
AudioSegmentStream = function(track) {
	var aacFrames = [], aacFramesLength = 0, sequenceNumber = 0;
	AudioSegmentStream.prototype.init.call(this);
	
	this.push = function(data) {
	// buffer audio data until end() is called
		aacFrames.push(data);
		aacFramesLength += data.data.byteLength;
	};
	
	this.end = function() {
		var boxes, currentFrame, data, sample, i, mdat, moof;
		// return early if no audio data has been observed
		if (aacFramesLength === 0) {
			return;
		}
	
		// concatenate the audio data to constuct the mdat
		data = new Uint8Array(aacFramesLength);
		track.samples = [];
		i = 0;
		while (aacFrames.length) {
			currentFrame = aacFrames[0];
			sample = {
			size: currentFrame.data.byteLength,
			duration: 1024 // FIXME calculate for realz
			};
			track.samples.push(sample);
		
			data.set(currentFrame.data, i);
			i += currentFrame.data.byteLength;
		
			aacFrames.shift();
		}
		aacFramesLength = 0;
		mdat = mp4.mdat(data);
		
		moof = mp4.moof(sequenceNumber, [track]);
		boxes = new Uint8Array(moof.byteLength + mdat.byteLength);
		
		// bump the sequence number for next time
		sequenceNumber++;
		
		boxes.set(moof);
		boxes.set(mdat, moof.byteLength);
		
		this.trigger('data', boxes);
	};
};
AudioSegmentStream.prototype = new Stream();

/**
 * Accepts a NAL unit byte stream and unpacks the embedded NAL units.
 */
NalByteStream = function() {
	var
		i = 6,
		syncPoint = 1,
		buffer;
		NalByteStream.prototype.init.call(this);
	
	this.push = function(data) {
		var swapBuffer;
		
		if (!buffer) {
			buffer = data.data;
		} else {
			swapBuffer = new Uint8Array(buffer.byteLength + data.data.byteLength);
			swapBuffer.set(buffer);
			swapBuffer.set(data.data, buffer.byteLength);
			buffer = swapBuffer;
		}
	
		// Rec. ITU-T H.264, Annex B
		// scan for NAL unit boundaries
		
		// a match looks like this:
		// 0 0 1 .. NAL .. 0 0 1
		// ^ sync point        ^ i
		// or this:
		// 0 0 1 .. NAL .. 0 0 0
		// ^ sync point        ^ i
		while (i < buffer.byteLength) {
			// look at the current byte to determine if we've hit the end of
			// a NAL unit boundary
			switch (buffer[i]) {
			case 0:
			// skip past non-sync sequences
			if (buffer[i - 1] !== 0) {
				i += 2;
				break;
			} else if (buffer[i - 2] !== 0) {
				i++;
				break;
			}
		
			// deliver the NAL unit
			this.trigger('data', buffer.subarray(syncPoint + 3, i - 2));
		
			// drop trailing zeroes
			do {
				i++;
			} while (buffer[i] !== 1);
			syncPoint = i - 2;
			i += 3;
			break;
			case 1:
			// skip past non-sync sequences
			if (buffer[i - 1] !== 0 ||
				buffer[i - 2] !== 0) {
				i += 3;
				break;
			}
		
			// deliver the NAL unit
			this.trigger('data', buffer.subarray(syncPoint + 3, i - 2));
			syncPoint = i - 2;
			i += 3;
			break;
			default:
			// the current byte isn't a one or zero, so it cannot be part
			// of a sync sequence
			i += 3;
			break;
			}
		}
		// filter out the NAL units that were delivered
		buffer = buffer.subarray(syncPoint);
		i -= syncPoint;
		syncPoint = 0;
	};
	
	this.end = function() {
		// deliver the last buffered NAL unit
		if (buffer && buffer.byteLength > 3) {
			this.trigger('data', buffer.subarray(syncPoint + 3));
		}
	};
};
NalByteStream.prototype = new Stream();

/**
 * Accepts input from a ElementaryStream and produces H.264 NAL unit data
 * events.
 */
H264Stream = function() {
	var
		nalByteStream = new NalByteStream(),
		self,
		trackId,
		currentPts,
		currentDts,
		
		readSequenceParameterSet,
		skipScalingList;
	
	H264Stream.prototype.init.call(this);
	self = this;
	
	this.push = function(packet) {
		if (packet.type !== 'video') {
			return;
		}
		trackId = packet.trackId;
		currentPts = packet.pts;
		currentDts = packet.dts;
		
		nalByteStream.push(packet);
		};
		
		nalByteStream.on('data', function(data) {
			var event = {
				trackId: trackId,
				pts: currentPts,
				dts: currentDts,
				data: data
			};
			switch (data[0] & 0x1f) {
			
			case 0x05:
				event.nalUnitType = 'slice_layer_without_partitioning_rbsp_idr';
				break;
			case 0x07:
				event.nalUnitType = 'seq_parameter_set_rbsp';
				event.config = readSequenceParameterSet(data.subarray(1));
				break;
			case 0x08:
				event.nalUnitType = 'pic_parameter_set_rbsp';
				break;
			case 0x09:
				event.nalUnitType = 'access_unit_delimiter_rbsp';
				break;
			
			default:
				break;
			}
			self.trigger('data', event);
		});
		
		this.end = function() {
		nalByteStream.end();
	};
	
	/**
	* Advance the ExpGolomb decoder past a scaling list. The scaling
	* list is optionally transmitted as part of a sequence parameter
	* set and is not relevant to transmuxing.
	* @param count {number} the number of entries in this scaling list
	* @param expGolombDecoder {object} an ExpGolomb pointed to the
	* start of a scaling list
	* @see Recommendation ITU-T H.264, Section 7.3.2.1.1.1
	*/
	skipScalingList = function(count, expGolombDecoder) {
		var
			lastScale = 8,
			nextScale = 8,
			j,
			deltaScale;
		
		for (j = 0; j < count; j++) {
			if (nextScale !== 0) {
			deltaScale = expGolombDecoder.readExpGolomb();
			nextScale = (lastScale + deltaScale + 256) % 256;
			}
		
			lastScale = (nextScale === 0) ? lastScale : nextScale;
		}
	};
	
	/**
	* Read a sequence parameter set and return some interesting video
	* properties. A sequence parameter set is the H264 metadata that
	* describes the properties of upcoming video frames.
	* @param data {Uint8Array} the bytes of a sequence parameter set
	* @return {object} an object with configuration parsed from the
	* sequence parameter set, including the dimensions of the
	* associated video frames.
	*/
	readSequenceParameterSet = function(data) {
		var
			frameCropLeftOffset = 0,
			frameCropRightOffset = 0,
			frameCropTopOffset = 0,
			frameCropBottomOffset = 0,
			expGolombDecoder, profileIdc, levelIdc, profileCompatibility,
			chromaFormatIdc, picOrderCntType,
			numRefFramesInPicOrderCntCycle, picWidthInMbsMinus1,
			picHeightInMapUnitsMinus1,
			frameMbsOnlyFlag,
			scalingListCount,
			i;
		
		expGolombDecoder = new ExpGolomb(data);
		profileIdc = expGolombDecoder.readUnsignedByte(); // profile_idc
		profileCompatibility = expGolombDecoder.readBits(5); // constraint_set[0-5]_flag
		expGolombDecoder.skipBits(3); //  u(1), reserved_zero_2bits u(2)
		levelIdc = expGolombDecoder.readUnsignedByte(); // level_idc u(8)
		expGolombDecoder.skipUnsignedExpGolomb(); // seq_parameter_set_id
		
		// some profiles have more optional data we don't need
		if (profileIdc === 100 ||
			profileIdc === 110 ||
			profileIdc === 122 ||
			profileIdc === 244 ||
			profileIdc === 44 ||
			profileIdc === 83 ||
			profileIdc === 86 ||
			profileIdc === 118 ||
			profileIdc === 128) 
		{
			chromaFormatIdc = expGolombDecoder.readUnsignedExpGolomb();
			if (chromaFormatIdc === 3) {
				expGolombDecoder.skipBits(1); // separate_colour_plane_flag
			}
			expGolombDecoder.skipUnsignedExpGolomb(); // bit_depth_luma_minus8
			expGolombDecoder.skipUnsignedExpGolomb(); // bit_depth_chroma_minus8
			expGolombDecoder.skipBits(1); // qpprime_y_zero_transform_bypass_flag
			if (expGolombDecoder.readBoolean()) { // seq_scaling_matrix_present_flag
				scalingListCount = (chromaFormatIdc !== 3) ? 8 : 12;
				for (i = 0; i < scalingListCount; i++) {
					if (expGolombDecoder.readBoolean()) { // seq_scaling_list_present_flag[ i ]
						if (i < 6) {
							skipScalingList(16, expGolombDecoder);
						} else {
							skipScalingList(64, expGolombDecoder);
						}
					}
				}
			}
		}
		
		expGolombDecoder.skipUnsignedExpGolomb(); // log2_max_frame_num_minus4
		picOrderCntType = expGolombDecoder.readUnsignedExpGolomb();
		
		if (picOrderCntType === 0) {
			expGolombDecoder.readUnsignedExpGolomb(); //log2_max_pic_order_cnt_lsb_minus4
		} else if (picOrderCntType === 1) {
			expGolombDecoder.skipBits(1); // delta_pic_order_always_zero_flag
			expGolombDecoder.skipExpGolomb(); // offset_for_non_ref_pic
			expGolombDecoder.skipExpGolomb(); // offset_for_top_to_bottom_field
			numRefFramesInPicOrderCntCycle = expGolombDecoder.readUnsignedExpGolomb();
			for(i = 0; i < numRefFramesInPicOrderCntCycle; i++) {
				expGolombDecoder.skipExpGolomb(); // offset_for_ref_frame[ i ]
			}
		}
		
		expGolombDecoder.skipUnsignedExpGolomb(); // max_num_ref_frames
		expGolombDecoder.skipBits(1); // gaps_in_frame_num_value_allowed_flag
		
		picWidthInMbsMinus1 = expGolombDecoder.readUnsignedExpGolomb();
		picHeightInMapUnitsMinus1 = expGolombDecoder.readUnsignedExpGolomb();
		
		frameMbsOnlyFlag = expGolombDecoder.readBits(1);
		if (frameMbsOnlyFlag === 0) {
			expGolombDecoder.skipBits(1); // mb_adaptive_frame_field_flag
		}
		
		expGolombDecoder.skipBits(1); // direct_8x8_inference_flag
		if (expGolombDecoder.readBoolean()) { // frame_cropping_flag
			frameCropLeftOffset = expGolombDecoder.readUnsignedExpGolomb();
			frameCropRightOffset = expGolombDecoder.readUnsignedExpGolomb();
			frameCropTopOffset = expGolombDecoder.readUnsignedExpGolomb();
			frameCropBottomOffset = expGolombDecoder.readUnsignedExpGolomb();
		}
		
		return {
			profileIdc: profileIdc,
			levelIdc: levelIdc,
			profileCompatibility: profileCompatibility,
			width: ((picWidthInMbsMinus1 + 1) * 16) - frameCropLeftOffset * 2 - frameCropRightOffset * 2,
			height: ((2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16) - (frameCropTopOffset * 2) - (frameCropBottomOffset * 2)
		};
	};
};
H264Stream.prototype = new Stream();

/**
 * Constructs a single-track, ISO BMFF media segment from H264 data
 * events. The output of this stream can be fed to a SourceBuffer
 * configured with a suitable initialization segment.
 * @param track {object} track metadata configuration
 */
VideoSegmentStream = function(track) {
	var
		sequenceNumber = 0,
		nalUnits = [],
		nalUnitsLength = 0;
		VideoSegmentStream.prototype.init.call(this);
	
	this.push = function(data) {
		// buffer video until end() is called
		nalUnits.push(data);
		nalUnitsLength += data.data.byteLength;
	};
	
	this.end = function() {
		var startUnit, currentNal, moof, mdat, boxes, i, data, view, sample;
		
		// return early if no video data has been observed
		if (nalUnitsLength === 0) {
			return;
		}
	
		// concatenate the video data and construct the mdat
		// first, we have to build the index from byte locations to
		// samples (that is, frames) in the video data
		data = new Uint8Array(nalUnitsLength + (4 * nalUnits.length));
		view = new DataView(data.buffer);
		track.samples = [];
		
		// see ISO/IEC 14496-12:2012, section 8.6.4.3
		sample = {
			size: 0,
			flags: {
			isLeading: 0,
			dependsOn: 1,
			isDependedOn: 0,
			hasRedundancy: 0,
			degradationPriority: 0
			}
		};
		i = 0;
		while (nalUnits.length) {
			currentNal = nalUnits[0];
			// flush the sample we've been building when a new sample is started
			if (currentNal.nalUnitType === 'access_unit_delimiter_rbsp') {
				if (startUnit) {
					// convert the duration to 90kHZ timescale to match the
					// timescales specified in the init segment
					sample.duration = (currentNal.dts - startUnit.dts) * 90;
					track.samples.push(sample);
				}
				sample = {
					size: 0,
					flags: {
					isLeading: 0,
					dependsOn: 1,
					isDependedOn: 0,
					hasRedundancy: 0,
					degradationPriority: 0
					},
					compositionTimeOffset: currentNal.pts - currentNal.dts
				};
				startUnit = currentNal;
			}
			if (currentNal.nalUnitType === 'slice_layer_without_partitioning_rbsp_idr') {
				// the current sample is a key frame
				sample.flags.dependsOn = 2;
			}
			sample.size += 4; // space for the NAL length
			sample.size += currentNal.data.byteLength;
		
			view.setUint32(i, currentNal.data.byteLength);
			i += 4;
			data.set(currentNal.data, i);
			i += currentNal.data.byteLength;
		
			nalUnits.shift();
		}
		// record the last sample
		if (track.samples.length) {
			sample.duration = track.samples[track.samples.length - 1].duration;
		}
		track.samples.push(sample);
		nalUnitsLength = 0;
		mdat = mp4.mdat(data);
		
		moof = mp4.moof(sequenceNumber, [track]);
		
		// it would be great to allocate this array up front instead of
		// throwing away hundreds of media segment fragments
		boxes = new Uint8Array(moof.byteLength + mdat.byteLength);
		
		// bump the sequence number for next time
		sequenceNumber++;
		
		boxes.set(moof);
		boxes.set(mdat, moof.byteLength);
		
		this.trigger('data', boxes);
	};
};
VideoSegmentStream.prototype = new Stream();

/**
 * A Stream that expects MP2T binary data as input and produces
 * corresponding media segments, suitable for use with Media Source
 * Extension (MSE) implementations that support the ISO BMFF byte
 * stream format, like Chrome.
 * @see test/muxer/mse-demo.html for sample usage of a Transmuxer with
 * MSE
 */
Transmuxer = function() {
	var
		self = this,
		videoTrack,
		audioTrack,
		config,
		pps,
		
		packetStream, parseStream, elementaryStream,
		aacStream, h264Stream,
		videoSegmentStream, audioSegmentStream;
	
	Transmuxer.prototype.init.call(this);
	
	// set up the parsing pipeline
	packetStream = new TransportPacketStream();
	parseStream = new TransportParseStream();
	elementaryStream = new ElementaryStream();
	aacStream = new AacStream();
	h264Stream = new H264Stream();
	
	packetStream.pipe(parseStream);
	parseStream.pipe(elementaryStream);
	elementaryStream.pipe(aacStream);
	elementaryStream.pipe(h264Stream);
	
	// handle incoming data events
	h264Stream.on('data', function(data) {
		// record the track config
		if (data.nalUnitType === 'seq_parameter_set_rbsp' &&
			!config) {
			config = data.config;
		
			videoTrack.width = config.width;
			videoTrack.height = config.height;
			videoTrack.sps = [data.data];
			videoTrack.profileIdc = config.profileIdc;
			videoTrack.levelIdc = config.levelIdc;
			videoTrack.profileCompatibility = config.profileCompatibility;
		
			// generate an init segment once all the metadata is available
			if (pps) {
				self.trigger('data', {
					type: 'video',
					data: mp4.initSegment([videoTrack])
				});
			}
		}
		if (data.nalUnitType === 'pic_parameter_set_rbsp' &&
			!pps) {
			pps = data.data;
			videoTrack.pps = [data.data];
		
			if (config) {
			self.trigger('data', {
				type: 'video',
				data: mp4.initSegment([videoTrack])
			});
			}
		}
	});
	// generate an init segment based on the first audio sample
	aacStream.on('data', function(data) {
		if (audioTrack && audioTrack.channelcount === undefined) {
			audioTrack.channelcount = data.channelcount;
			audioTrack.samplerate = data.samplerate;
			audioTrack.samplesize = data.samplesize;
			self.trigger('data', {
			type: 'audio',
			data: mp4.initSegment([audioTrack])
			});
		}
	});
	// hook up the segment streams once track metadata is delivered
	elementaryStream.on('data', function(data) {
		var i, triggerData = function(type) {
			return function(segment) {
				self.trigger('data', {
					type: type,
					data: segment
				});
			};
		};
		if (data.type === 'metadata') {
			i = data.tracks.length;
		
			// scan the tracks listed in the metadata
			while (i--) {
		
				// hook up the video segment stream to the first track with h264 data
				if (data.tracks[i].type === 'video' && !videoSegmentStream) {
					videoTrack = data.tracks[i];
					videoSegmentStream = new VideoSegmentStream(videoTrack);
					h264Stream.pipe(videoSegmentStream);
					videoSegmentStream.on('data', triggerData('video'));
					break;
				}
			
				// hook up the audio segment stream to the first track with aac data
				if (data.tracks[i].type === 'audio' && !audioSegmentStream) {
					audioTrack = data.tracks[i];
					audioSegmentStream = new AudioSegmentStream(audioTrack);
					aacStream.pipe(audioSegmentStream);
					audioSegmentStream.on('data', triggerData('audio'));
				}
			}
		}
	});
	
	// feed incoming data to the front of the parsing pipeline
	this.push = function(data) {
		packetStream.push(data);
	};
	// flush any buffered data
	this.end = function() {
		elementaryStream.end();
		h264Stream.end();
		if (videoSegmentStream) {
			videoSegmentStream.end();
		}
		if (audioSegmentStream) {
			audioSegmentStream.end();
		}
	};
};
Transmuxer.prototype = new Stream();

var mp2t = {
	PAT_PID: 0x0000,
	MP2T_PACKET_LENGTH: MP2T_PACKET_LENGTH,
	H264_STREAM_TYPE: H264_STREAM_TYPE,
	ADTS_STREAM_TYPE: ADTS_STREAM_TYPE,
	TransportPacketStream: TransportPacketStream,
	TransportParseStream: TransportParseStream,
	ElementaryStream: ElementaryStream,
	VideoSegmentStream: VideoSegmentStream,
	Transmuxer: Transmuxer,
	AacStream: AacStream,
	H264Stream: H264Stream
};

module.exports = {
	Transmuxer: Transmuxer,
	mp2t: mp2t
};
},{"./exp-golomb":7,"./mp4-generator":9,"./stream":10}],12:[function(require,module,exports){
/* global window, document */
"use strict";
require('./requestFullScreen');
var variables = require('../variables');
var html = require('../html');
var util = require('../util');
var media = require('../media');
var dom = html.dom;
var buttonDom = html.button;

var namespace = variables.namespace;
var displayHidden = variables.displayHidden;
var dateHelper = util.date;

var URL = window.URL;
var MediaSource = window.MediaSource;

var name = 'control-';
var meta = {
	className: {
		container: 'control',
		scroll: name+'scroll',
		scrollPointer: name+'scroll-pointer',
		scrollTouch: name+'scroll-touch',
		scrollBg: name+'scroll-bg',
		scrollBg1: name+'scroll-bg1',
		scrollBg2: name+'scroll-bg2',
		btnPlay: name+'btn-play',
		btnVolume: name+'btn-volume',
		btnSwipe: name+'btn-swipe',
		btnView: name+'btn-view',
		btnFullScreen: name+'btn-fullscreen',
		txtTime: name+'txt-time'
	},
	error: {
		'notSupportFullScreen': { msg: '您的浏览器不支持全屏!' }
	}
};

var defaultControlOptions = {
	autoplay: false,
	loop: false,
	scroll: true,
	btnPlay: true,
	btnVolume: true,
	btnSwipe: true,
	btnView: true,
	btnFullScreen: true,
	txtTime: true,
	dragFile: true
};

function Control(options){
	this.init(options);
}
Control.prototype = {
	constructor: Control,
	init: function(options){
		var self = this;
		var container = options.container;
		var video = options.video;
		var renderer = options.renderer;
		var controlOptions = util.extend({}, defaultControlOptions, options.control);
		var autoplay = controlOptions.autoplay;
		var loop = controlOptions.loop;
		var dragFile = controlOptions.dragFile;
		
		video.setAttribute('webkit-playsinline','');  //行内播放
		video.setAttribute('preload','');  //行内播放
		
		renderer.keyframe = function(){
			self.keyframe();
		};
		if(dragFile){
			var canvas = renderer.renderer.domElement;
			canvas.addEventListener( 'dragover', handleDragFile, false );
			canvas.addEventListener( 'drop', handleDropFile, false );
		}
		
		var controlContainer = dom.createElement({ className: namespace+meta.className.container });
		var scroll = dom.createElement({ className: namespace+meta.className.scroll });
		var scrollTouch = dom.createElement({ className: namespace+meta.className.scrollTouch });
		var scrollPointer = dom.createElement({ className: namespace+meta.className.scrollPointer });
		var scrollBg = dom.createElement({ className: namespace+meta.className.scrollBg });
		var scrollBg1 = dom.createElement({ className: namespace+meta.className.scrollBg1 });
		var scrollBg2 = dom.createElement({ className: namespace+meta.className.scrollBg2 });
		var btnPlay = buttonDom.createElement({ className: namespace+meta.className.btnPlay });
		var btnVolume = buttonDom.createElement({ className: namespace+meta.className.btnVolume });
		var btnSwipe = buttonDom.createElement({ className: namespace+meta.className.btnSwipe });
		var btnView = buttonDom.createElement({ className: namespace+meta.className.btnView });
		var btnFullScreen = buttonDom.createElement({ className: namespace+meta.className.btnFullScreen });
		var txtTime = dom.createElement({ className: namespace+meta.className.txtTime });
		
		var controlComponents = {
			scroll: scroll,
			btnPlay: btnPlay,
			btnVolume: btnVolume,
			btnSwipe: btnSwipe,
			btnView: btnView,
			btnFullScreen: btnFullScreen,
			txtTime: txtTime
		};
		for(var i in controlComponents){
			var component = controlComponents[i];
			var componentOption = controlOptions[i];
			if(!componentOption){
				component.classList.add(displayHidden);
			}
		}
		
		scroll.appendChild(scrollTouch);
		scroll.appendChild(scrollPointer);
		scroll.appendChild(scrollBg);
		scroll.appendChild(scrollBg1);
		scroll.appendChild(scrollBg2);
		controlContainer.appendChild(scroll);
		controlContainer.appendChild(btnPlay);
		controlContainer.appendChild(txtTime);
		controlContainer.appendChild(btnFullScreen);
		controlContainer.appendChild(btnView);
		controlContainer.appendChild(btnSwipe);
		controlContainer.appendChild(btnVolume);
		
		container.appendChild(controlContainer);
		
		self.container = container;
		self.video = video;
		self.renderer = renderer;
		self.scroll = scroll;
		self.scrollPointer = scrollPointer;
		self.scrollBg1 = scrollBg1;
		self.scrollBg2 = scrollBg2;
		self.btnPlay = btnPlay;
		self.btnVolume = btnVolume;
		self.btnSwipe = btnSwipe;
		self.btnView = btnView;
		self.btnFullScreen = btnFullScreen;
		self.txtTime = txtTime;
		
		dom.addAttribute(video,'loop', loop);
		dom.addAttribute(video,'autoplay', autoplay);
		video.load(); // must call after setting/changing source
		
		self.play();
		self.pause();
		if(autoplay){
			self.play();
		}
		
		self.renderVolume();
		self.useTouch();
		self.useFullMotion();
		
		//bind event
		var isInit = false;
		var isPlaying = false;
		video.addEventListener('canplay', function(){ //canplaythrough ios not support. 2b event
			renderer.loadVideo(video);
			
			if(self.isPlaying())isPlaying=true;
			self.play();
			if(!isPlaying)self.pause();
			isPlaying=false;
			
			self.keyframe();
			if(!isInit){
				//self.initPlay();  //will loop this
				isInit = true;
			}
		});
		
		video.addEventListener('ended', function(){
			self.initPlay();
		});
		
		video.addEventListener('volumechange', function(){
			//no validate in mobile to set volume
			self.renderVolume();
		});
		
		var progress = 0;
		var isTouchPointer = false;
		scroll.addEventListener('click', function(e){
			if(isTouchPointer)return;
			//var x = e.x||e.pageX;
			//var width = x - scroll.offsetLeft;
			var width = e.offsetX;
			var total = scroll.offsetWidth||1;
			progress = width/total;
			progress = Math.min(Math.max(0, progress), 1);
			self.playProcess(progress);
		});
		scrollPointer.addEventListener('touchstart', function(){
			if(self.isPlaying())isPlaying=true;
			isTouchPointer = true;
			self.stop();
		});
		scrollPointer.addEventListener('touchmove', function(e){
			if(isTouchPointer){
				var x = e.touches[0].pageX;
				var rect = scroll.getBoundingClientRect();
				var width = x - rect.left;
				var total = scroll.offsetWidth||1;
				progress = width/total;
				progress = Math.min(Math.max(0, progress), 1);
				scrollPointer.style.left = progress*100 + '%';
				scrollBg2.style.width = progress*100 + '%';
			}
		});
		scrollPointer.addEventListener('touchend', function(){
			if(isTouchPointer){
				self.playProcess(progress);
				
				self.play();
				if(isPlaying){
					isPlaying = false;
				}else{
					self.pause();
				}
			}
			isTouchPointer = false;
		});
		
		btnPlay.addEventListener('click', handleBtnPlay);
		btnVolume.addEventListener('click', handleBtnVolume);
		btnSwipe.addEventListener('click', handleBtnSwipe);
		btnView.addEventListener('click', handleBtnView);
		btnFullScreen.addEventListener('click', handleBtnFullScreen);
		
		
		function handleBtnPlay(e){
			var target = e.target||e.srcElement;
			self.togglePlay(target);
		}
		
		function handleBtnVolume(){
			self.toggleVolume();
		}
		
		function handleBtnSwipe(){
			self.toggleSwipe();
		}
		
		function handleBtnView(){
			self.toggleView();
		}
		
		function handleBtnFullScreen(){
			var isFullScreen = container.hasAttribute('fullscreen');
			if(isFullScreen){
				self.cancelFullScreen();
			}else{
				self.requestFullScreen();
			}
		}
		
		function handleDragFile(e){
			e.stopPropagation();
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
		}
		
		function handleDropFile(e){
			e.stopPropagation();
			e.preventDefault();
			var files = e.dataTransfer.files;
			var file = files[0];
			var src = window.URL.createObjectURL(file);
			loadVideo(src);
		}
		
		function loadVideo(src){
			self.stop();
			video.src = src;
			video.load();
		}
	},
	load: function(src){
		var self = this;
		var video = self.video;
		if(typeof src === 'string'){
			video.src = src;
		}else if(util.isArray(src)){
			var bytes = src;
			var mediaSource = new MediaSource();
				// setup the media source
			mediaSource.addEventListener('sourceopen', function() {
				var videoBuffer = mediaSource.addSourceBuffer('video/mp4;codecs=avc1.4d400d'),  //'video/mp4;codecs=avc1.4d400d'
					audioBuffer = mediaSource.addSourceBuffer('audio/mp4;codecs=mp4a.40.2'),  //'audio/mp4;codecs=mp4a.40.2'
					transmuxer = new media.mp2t.Transmuxer(),
					videoSegments = [],
					audioSegments = [];
				// expose the machinery for debugging
				
				// transmux the MPEG-TS data to BMFF segments
				transmuxer.on('data', function(segment) {
					if (segment.type === 'video') {
						videoSegments.push(segment);
					} else {
						audioSegments.push(segment);
					}
				});
				transmuxer.push(bytes);  //media.hazeVideo
				transmuxer.end();
				// buffer up the video data
				videoBuffer.appendBuffer(videoSegments.shift().data);
				videoBuffer.addEventListener('updateend', function() {
					if (videoSegments.length) {
						videoBuffer.appendBuffer(videoSegments.shift().data);
					}
				});
				// buffer up the audio data
				audioBuffer.appendBuffer(audioSegments.shift().data);
				audioBuffer.addEventListener('updateend', function() {
					if (audioSegments.length) {
						audioBuffer.appendBuffer(audioSegments.shift().data);
					}
				});
				
				self.sourceBuffer = videoBuffer;
			});
			
			video.src = URL.createObjectURL(mediaSource);
			self.mediaSource = mediaSource;
		}
		if(src){
			video.load();
			video.play();
			video.pause();
		}
	},
	keyframe: function(){  //param: renderer
		var self = this;
		var video = self.video;
		var scrollPointer = self.scrollPointer;
		var scrollBg1 = self.scrollBg1;
		var scrollBg2 = self.scrollBg2;
		var txtTime = self.txtTime;
		var currentTime = video.currentTime||0;
		var duration = video.duration||1;
		var buffered = video.buffered;
		var bufferedSize = buffered.length;
		var currentBuffer = bufferedSize===0?0:buffered.end(bufferedSize-1);
		
		var loadProgress = Math.floor( currentBuffer/duration*10000 )/100;
		scrollBg1.style.width = loadProgress+'%';
		
		var progress = Math.floor( currentTime/duration*10000 )/100;
		scrollPointer.style.left = progress+'%';
		scrollBg2.style.width = progress+'%';
		
		var currentStr = dateHelper.durationToStr(currentTime*1000, 'hh:mm:ss', 'hh');
		var durationStr = dateHelper.durationToStr(duration*1000, 'hh:mm:ss', 'hh');
		txtTime.innerHTML = currentStr + '/' + durationStr;
	},
	initPlay: function(){
		var self = this;
		self.playProcess(0);
		self.keyframe();
		self.pause();
	},
	togglePlay: function(){
		var self = this;
		var target = self.btnPlay;
		var isPause = target.hasAttribute('pause');
		if(isPause){
			self.play();
		}else{
			self.pause();
		}
	},
	isPlaying: function(){
		var self = this;
		var target = self.btnPlay;
		var isPause = target.hasAttribute('pause');
		return !isPause;
		//return !self.video.paused;
	},
	play: function(){
		var self = this;
		var target = self.btnPlay;
		target.removeAttribute('pause');
		self.renderer.start();
		self.video.play();
	},
	pause: function(){
		var self = this;
		var target = self.btnPlay;
		target.setAttribute('pause', '');
		this.renderer.pause();
		self.video.pause();
	},
	stop: function(){
		this.renderer.stop();
		this.pause();
	},
	playProcess: function(progress){  //0 - 1
		var self = this;
		var video = self.video;
		
		var duration = video.duration;
		var currentTime = Math.floor(duration*progress);
		video.currentTime = currentTime;
	},
	toggleVolume: function(){  //set muted
		var self = this;
		var video = self.video;
		if(video.muted){
			video.muted = false;
		}else{
			video.muted = true;
		}
		self.renderVolume();
	},
	renderVolume: function(){
		var self = this;
		var video = self.video;
		var target = self.btnVolume;
		var volume = video.volume;
		var muted = video.muted;
		if(muted){
			target.setAttribute('volume', 0);
		}else{
			if(volume<0.333){
				target.setAttribute('volume', 1);
			}else if(volume>=0.333&&volume<0.667){
				target.setAttribute('volume', 2);
			}else{
				target.setAttribute('volume', 3);
			}
		}
	},
	setVolume: function(volume){  //0.0 - 1.0
		var self = this;
		var video = self.video;
		var target = self.btnVolume;
		if(volume<0.333){
			target.setAttribute('volume', 1);
		}else if(volume>=0.333&&volume<0.667){
			target.setAttribute('volume', 2);
		}else{
			target.setAttribute('volume', 3);
		}
		video.volume = volume;
	},
	toggleSwipe: function(){
		var self = this;
		var target = self.btnSwipe;
		var type = target.getAttribute('swipe_type');
		if(type==='motion'){
			self.useTouch();
		}else if(window.DeviceMotionEvent){
			self.useDeviceMotion();
		}
	},
	useTouch: function(){
		var self = this;
		var target = self.btnSwipe;
		var renderer = self.renderer;
		renderer.useTouch = true;
		renderer.useDeviceMotion = false;
		target.setAttribute('swipe_type', 'touch');
	},
	useDeviceMotion: function(){
		if(window.DeviceOrientationEvent){
			var self = this;
			var target = self.btnSwipe;
			var renderer = self.renderer;
			renderer.useTouch = false;
			renderer.useDeviceMotion = true;
			target.setAttribute('swipe_type', 'motion');
		}
	},
	toggleView: function(){
		var self = this;
		var target = self.btnView;
		var type = target.getAttribute('view_type');
		if(type==='fm'){
			self.useVirtualReality();
		}else{
			self.useFullMotion();
		}
	},
	useFullMotion: function(){
		var self = this;
		var target = self.btnView;
		var renderer = self.renderer;
		renderer.useFullMotion = true;
		renderer.useVirtualReality = false;
		target.setAttribute('view_type', 'fm');
	},
	useVirtualReality: function(){
		var self = this;
		var target = self.btnView;
		var renderer = self.renderer;
		renderer.useFullMotion = false;
		renderer.useVirtualReality = true;
		target.setAttribute('view_type', 'vr');
	},
	requestFullScreen: function(){
		var self = this;
		var target = self.container;
		target.setAttribute('fullscreen', '');
		if(!window.requestFullScreen(target)){
			window.alert(meta.error.notSupportFullScreen.msg);
		}
	},
	cancelFullScreen: function(){
		var self = this;
		var target = self.container;
		target.removeAttribute('fullscreen');
		document.cancelFullScreen();
	}
};


module.exports = Control;
},{"../html":3,"../media":8,"../util":27,"../variables":31,"./requestFullScreen":16}],13:[function(require,module,exports){
/**
* player
*/
"use strict";
var Support = require('./support');
var Renderer = require('./renderer');
var Control = require('./control');

function Player(options){
	this.init(options);
}
Player.prototype = {
	constructor: Player,
	init: function(options){
		var self = this;
		var container = options.renderer.container = options.control.container = options.container;
		options.renderer.video = options.control.video = options.video;
		
		if(!Support.isSupport()){
			Support.createMessage({
				container: container
			});
			return;
		}
		
		var renderer = new Renderer();
		renderer.init(options.renderer);
		
		options.control.renderer = renderer;
		var control = new Control(options.control);
		
		self.control = control;
		self.renderer = renderer;
	}
};

module.exports = Player;
},{"./control":12,"./renderer":14,"./support":17}],14:[function(require,module,exports){
/* global window, document, THREE */
"use strict";
require('./requestAnimFrame');
var variables = require('../variables');
var util = require('../util');
var html = require('../html');

var namespace = variables.namespace;
var dom = html.dom;

var name = 'renderer-';
var meta = {
	className: {
		container: 'renderer',
		canvas: name+'canvas'
	}
};

var definitionType = {
	low: 1,
	hight: 2
};

var defaultOptions = {
	outContainer: document.body,
	useTouch: true,
	useDeviceMotion: false,
	useFullMotion: true,
	useVirtualReality: false,
	
	needEnoughData: true,
	definition: definitionType.low,
	
};

var VideoTexture = function ( video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {
	THREE.Texture.call( this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );
	this.generateMipmaps = false;
	var scope = this;
	function update() {
		window.requestAnimFrame( update );
		scope.needsUpdate = true;
	}
	update();
};

VideoTexture.prototype = Object.create( THREE.Texture.prototype );
VideoTexture.prototype.constructor = VideoTexture;

function Renderer(){
	
}
Renderer.prototype.loadVideo = function(video){
	var self = this;
	self.createTexture(video);
};
Renderer.prototype.createTexture = function(video){
	var self = this;
	var material = self.material;
	var texture;
	
	//create video texture 
	
	texture = new VideoTexture( video );
	
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.format = THREE.RGBFormat;
	//texture.generateMipmaps = false;
	
	material.map = texture;
	material.needsUpdate = true;
	
	self.texture = texture;
	self.video = video;
};
Renderer.prototype.updateTexture = function(){
	var self = this;
	var texture = self.texture;
	var video = self.video;
	var videoImageContext = self.videoImageContext;
	
	if(videoImageContext&&texture){
		videoImageContext.drawImage( video, 0, 0 );
		texture.needsUpdate = true;
	}
};
Renderer.prototype.init = function(options){
	var self = this;
	options = util.extend(options, defaultOptions);
	var outContainer = options.container;
	var video = options.video;
	var useTouch = options.useTouch;
	var useDeviceMotion = options.useDeviceMotion;
	var useFullMotion =options.useFullMotion;
	var useVirtualReality =options.useVirtualReality;
	var needEnoughData = options.needEnoughData;
	var definition = options.definition;
	
	var container = dom.createElement({
		className: namespace+meta.className.container
	});
	outContainer.appendChild(container);
	
	var defaultFov = 75;
	
	var scene, sceneLeft, sceneRight;
	var camera;
	var renderer;
	var vrEffect;
	var canvas;
	
	var i;
	//var j;

	//var controls;
	//var INTERSECTED;
	var mouse = new THREE.Vector2(-1, 1);
	var isUserInteracting = false;
	var onPointerDownPointerX, onPointerDownPointerY,
		onPointerDownLon,onPointerDownLat,
		lon = 0, lat = 0, 
		phi = 0, theta = 0;
	var target = new THREE.Vector3();
	
	var canvasWidth;
	var canvasHeight;
	var devicePixelRatio = window.devicePixelRatio||1;
	var orientation;
	updateSize();
	
	scene = new THREE.Scene();
	var geometry;
	if(definition === definitionType.high){
		geometry = new THREE.SphereGeometry( 500, 32, 32 ); //  500, 60, 40
	}else{
		//geometry = new THREE.BoxGeometry( 500, 500, 500 ); //  500, 60, 40
		geometry = new THREE.SphereGeometry( 500, 16, 16 );
	}
	geometry.scale( -1, 1, 1 );
	geometry.rotateY( -Math.PI/2 );
	
	var material = new THREE.MeshBasicMaterial( { overdraw: 0.5, side:THREE.DoubleSide } );
	var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	
	//var uvs;
	sceneLeft = new THREE.Scene();
	//var geometryLeft = geometry.clone();
	//uvs = geometryLeft.faceVertexUvs[ 0 ];
	//for (  i = 0; i < uvs.length; i ++ ) {
	//	for (  j = 0; j < 3; j ++ ) {
	//		uvs[ i ][ j ].x *= 0.5;
	//	}
	//}
	var meshLeft = new THREE.Mesh( geometry, material );
	sceneLeft.add(meshLeft);
	
	sceneRight = new THREE.Scene();
	//var geometryRight = geometry.clone();
	//uvs = geometryRight.faceVertexUvs[ 0 ];
	//for (  i = 0; i < uvs.length; i ++ ) {
	//	for (  j = 0; j < 3; j ++ ) {
	//		uvs[ i ][ j ].x *= 0.5;
	//		uvs[ i ][ j ].x += 0.5;
	//	}
	//}
	var meshRight = new THREE.Mesh( geometry, material );
	sceneRight.add(meshRight);
	
	//
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x101010 );
	renderer.setPixelRatio( devicePixelRatio );
	renderer.setSize( canvasWidth, canvasHeight );
	
	if(THREE.VREffect){
		vrEffect = new THREE.VREffect(renderer);
	}
	
	canvas = renderer.domElement;
	container.appendChild( renderer.domElement );
	//document.body.appendChild( renderer.domElement );

	//
	camera = new THREE.PerspectiveCamera( defaultFov, canvasWidth / canvasHeight, 1, 10000 );
	
	//
	canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
	canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
	canvas.addEventListener( 'mouseup', onDocumentMouseUp, false );
	canvas.addEventListener( 'touchstart', onDocumentTouchStart, false );
	canvas.addEventListener( 'touchmove', onDocumentTouchMove, false );
	canvas.addEventListener( 'touchend', onDocumentTouchEnd, false );
	canvas.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
	canvas.addEventListener( 'MozMousePixelScroll', onDocumentMouseWheel, false);
	window.addEventListener( "onorientationchange" in window ? "orientationchange" : "resize", onWindowResize, false ); 
	if (window.DeviceMotionEvent){  
		window.addEventListener("devicemotion", motionHandler, false);  
	}
	if(window.DeviceOrientationEvent){
		window.addEventListener("deviceorientation", orientationHandler, false);  
	}
	//setRendererSize();
	
	var g = {
		renderer: renderer,
		vrEffect: vrEffect,
		camera: camera,
		mesh: mesh
	};
	
	for(i in g){
		self[i] = g[i];
	}
	self.keyframe = options.keyframe;
	self.start = start;
	self.pause = pause;
	self.stop = stop;
	self.nextframe = nextframe;
	
	self.video = video;
	self.useTouch = useTouch;
	self.useDeviceMotion = useDeviceMotion;
	self.useFullMotion = useFullMotion;
	self.useVirtualReality = useVirtualReality;
	self.material = material;
	
	self.swipeAnimCoefX = 4;
	self.swipeAnimCoefY = 2;
	
	self.getCoordinates = function(){
		return {lon:lon, lat:lat};
	};
	self.getDeviceStatus = function(){
		return {
			motion: motionParam,
			orientation: orientationParam
		};
	};
	
	self.createTexture(video);
	
	var isStop = false;
	var isPause = false;
	var isLandscape = false;
	var motionParam, orientationParam;
	
	function start(){
		if(isStop||isPause){
			isPause = false;
			isStop = false;
			tick();
		}
	}
	function pause(){
		isPause = true;
	}
	function stop(){
		isStop = true;
	}
	var callNextframeCount = 0;
	function nextframe(callback){
		if(typeof callback==='function'){ callNextframeCount++; callback(self);  }
	}
	
	function motionHandler(){
		//return; //阻止横竖屏幕切换
		
		//motionParam = motionParam||{};
		//motionParam.interval = event.interval;
		//motionParam.acc = event.acceleration;
		//motionParam.accGravity = event.accelerationIncludingGravity;
		//motionParam.rotationRate = event.rotationRate;
		//document.getElementById("interval").innerHTML = event.interval;  
		//var acc = event.acceleration;  
		//document.getElementById("x").innerHTML = acc.x;  //x轴加快度
		//document.getElementById("y").innerHTML = acc.y;  //y轴加快度
		//document.getElementById("z").innerHTML = acc.z;  //z轴加快度
		//var accGravity = event.accelerationIncludingGravity;  
		//document.getElementById("xg").innerHTML = accGravity.x;  //x轴加快度(推敲重力加快度)
		//document.getElementById("yg").innerHTML = accGravity.y;  //y轴加快度(推敲重力加快度)
		//document.getElementById("zg").innerHTML = accGravity.z;  //z轴加快度(推敲重力加快度)
		//var rotationRate = event.rotationRate;  
		//document.getElementById("Ralpha").innerHTML = rotationRate.alpha; //上下扭转速度
		//document.getElementById("Rbeta").innerHTML = rotationRate.beta;   //前后扭转速度
		//document.getElementById("Rgamma").innerHTML = rotationRate.gamma; //扭转速度
	}
	
	var compassHeading;
	function orientationHandler(event){
		orientationParam = orientationParam||{};
		orientationParam.alpha = event.alpha; //上下
		orientationParam.beta = event.beta; //前后
		orientationParam.gamma = event.gamma; //左右
		orientationParam.compassHeading = event.webkitCompassHeading; //指北针指向
		orientationParam.compassAccuracy = event.webkitCompassAccuracy; //指北针精度
		if ( !self.useDeviceMotion ){
			compassHeading = undefined;
			return;
		}
		
		var beta = event.beta;
		var gamma = event.gamma;
		if(isLandscape){
			
			if( Math.abs(beta)>90 && Math.abs(gamma)<45 ){
				gamma = Math.abs(gamma);
				if(orientation===-90){
					gamma = -Math.abs(gamma);
				}else{
					gamma = Math.abs(gamma);
				}
			}else if(Math.abs(beta)<90 && Math.abs(gamma)<45){
				if(orientation===-90){
					gamma = Math.abs(gamma);
				}else{
					gamma = -Math.abs(gamma);
				}
			}
			lat = gamma>=0?( 90 - gamma):( -90 - gamma);
			if(orientation===-90){
				lat = -lat;
			}
		}else{
			lat = (beta - 80);
		}
		lat = - lat;
		
		var currentCompassHeading = event.webkitCompassHeading;
		var deltaLon = 0;
		if(compassHeading===undefined){
			compassHeading = currentCompassHeading;
		}else{
			deltaLon = currentCompassHeading-compassHeading;
		}
		lon -= deltaLon;
		compassHeading = currentCompassHeading;
		
		finger.lon = finger.targetLon = lon;
		finger.lat = finger.targetLat = lat;
	}
	
	function onDocumentMouseDown( event ) {
		if ( !self.useTouch )return;
		event.preventDefault();
		isUserInteracting = true;

		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;
	}

	function onDocumentMouseMove( event ) {
		if ( !self.useTouch )return;
		if ( isUserInteracting === true ) {
			var deltaLon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1;
			var deltaLat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1;
			lon = deltaLon + onPointerDownLon;
			lat = deltaLat + onPointerDownLat;
			
			finger.targetLon = deltaLon + onPointerDownLon;
			finger.targetLat = deltaLat + onPointerDownLat;
			finger.lon = lon;
			finger.lat = lat;
		}
		//intersect
		var clientX = event.clientX;
		var clientY = event.clientY;
		mouse.x = (clientX - canvas.offsetLeft)/canvas.offsetWidth * 2 - 1;
		mouse.y = (clientY - canvas.offsetTop)/canvas.offsetHeight * 2 - 1;
	}

	function onDocumentMouseUp() {
		isUserInteracting = false;
	}
	
	var finger = {
		lon: lon,
		lat: lat,
		targetLon: lon,
		targetLat: lat
	};   //for touch one
	var touchesLength;
	var touchesStart = [];
	function onDocumentTouchStart( event ) {
		if ( !self.useTouch )return;
		touchesLength = event.touches.length;
		if ( event.touches.length === 1 ) {
			//event.preventDefault();

			onPointerDownPointerX = event.touches[ 0 ].pageX;
			onPointerDownPointerY = event.touches[ 0 ].pageY;

			onPointerDownLon = lon;
			onPointerDownLat = lat;
		}else{
			touchesStart = [];
			for( var i = 0; i<event.touches.length; i++){
				touchesStart.push(new THREE.Vector2(
					event.touches[i].pageX,
					event.touches[i].pageY
				));
			}
		}
	}

	function onDocumentTouchMove( event ) {
		event.preventDefault();
		if ( !self.useTouch )return;
		if ( event.touches.length === 1 ) {
			var deltaLon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.5;
			var deltaLat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.5;
			
			finger.targetLon = deltaLon + onPointerDownLon;
			finger.targetLat = deltaLat + onPointerDownLat;
			finger.lon = lon;
			finger.lat = lat;
		}else if( event.touches.length === touchesStart.length){
			var delta = 0;
			var distanceStart = 0, distanceMove = 0;
			for( var i = 0; i<event.touches.length; i++){
				var currentTouch = new THREE.Vector2(
					event.touches[i].pageX,
					event.touches[i].pageY
				);
				
				distanceStart += touchesStart[i].length();
				distanceMove += currentTouch.length();
			}
			delta = distanceMove - distanceStart;
			setScale(delta);
		}
	}
	
	function onDocumentTouchEnd(){
		if ( !self.useTouch )return;
	}
	
	function setLonLat(pLon, pLat, targetLon){
		var precision = 1000;
		pLon = pLon||0;
		pLat = pLat||0;
		pLon = Math.floor(pLon*precision)/precision;
		pLat = Math.floor(pLat*precision)/precision;
		
		lon = pLon;
		if(targetLon){
			targetLon = Math.floor(targetLon*precision)/precision;
			if ( Math.abs(targetLon - pLon) < 0.002 ){ lon = ( pLon % 360 + 360 + 180 ) % 360 - 180; }
		}
		lat = Math.max( - 85, Math.min( 85, pLat ) );
	}
	
	function onDocumentMouseWheel(event){
		var delta = 1;
		if ( event.wheelDeltaY ) { // WebKit
			delta = event.wheelDeltaY;
		} else if ( event.wheelDelta ) { // Opera / Explorer 9
			delta = event.wheelDelta;
		} else if ( event.detail ) { // Firefox
			delta = event.detail;
		}
		setScale(delta);
		//setCameraFov(delta);
	}
	
	function setScale(delta){
		var scale = self.scale||1;
		var maxY = 100;
		if(delta>0){
			delta = delta/maxY + 1;
		}else{
			delta = maxY / (-delta + maxY);
		}
		var newScale = scale*delta;
		newScale = Math.max(1, Math.min(newScale, 15));
		delta = newScale / scale;
		geometry.scale(delta, delta, delta);
		self.scale = newScale;
	}
	
	//function setCameraFov(delta){
	//	var coefficient = 0.1; //0.05
	//	var fov = camera.fov;
	//	
	//	fov -= delta * coefficient;
	//	fov = Math.max(defaultFov, Math.min(fov, 1000));
	//	camera.fov = fov;
	//	camera.updateProjectionMatrix();  //camera.fov
	//}

	function onWindowResize() {
		updateSize();
		setRendererSize();
	}
	
	function updateSize(){
		var canvasSize = getRendererSize();
		canvasWidth = canvasSize.width;
		canvasHeight = canvasSize.height;
	}

	function getRendererSize(){  //for ios & wechat
		orientation = window.orientation;
		var width, height;
		if(orientation!==undefined){ //for   
			if(orientation===0||orientation===180){ //when Portrait  0, 180
				isLandscape = false;
				width = Math.min(window.innerWidth, window.screen.width);
				height = Math.min(window.innerHeight, window.screen.height);
			}else{ //when Landscape  90, -90
				isLandscape = true;
				width = Math.min(window.innerWidth, window.screen.height);
				height = Math.min(window.innerHeight, window.screen.width);
			}
		}else{
			width = window.innerWidth;  //innerWidth screen.width
			height = window.innerHeight;  //innerHeight screen.height
		}
		width = container.offsetWidth;
		height = container.offsetHeight;
		return { width: width, height: height};
	}
	
	function setRendererSize(){
		camera.aspect = canvasWidth / canvasHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( canvasWidth, canvasHeight );
	}
	
	function testResize(){
		var canvasSize = getRendererSize();
		var width = canvasSize.width;
		var height = canvasSize.height;
		if(canvasWidth===width&&canvasHeight===height){}
		else{
			canvasWidth = width;
			canvasHeight = height;
			setRendererSize();
		}
	}

	function tick() {
		if(!isStop){
			if(!isPause && needEnoughData && self.video.readyState===video.HAVE_ENOUGH_DATA){
				self.video.play();
			}else{
				self.video.pause();
			}
			
			render();
			window.requestAnimFrame( tick );
			
			if(typeof self.keyframe === 'function'){ self.keyframe(self); }
			if(callNextframeCount>0){
				nextframe();
				callNextframeCount--;
			}
		}else{
			self.video.pause();
		}
	}

	function render(){
		testResize();
		
		self.updateTexture();
		
		cameraLookAt();
		
		renderer.setClearColor(0,0,0,0);
		var left,bottom,width,height;
		left = canvasWidth * 0;
		bottom = canvasHeight * 0;
		height = canvasHeight * 1;
		//if(self.useVirtualReality&&vrEffect){ //useVirtualReality
		if(self.useVirtualReality){ //useVirtualReality
			//renderer.render( [ sceneLeft, sceneRight ], camera );
			//vrEffect.render( scene, camera );
			renderer.enableScissorTest( true );
			renderer.clear();
			
			width = canvasWidth * 0.5;
			camera.aspect = width/height;
			camera.updateProjectionMatrix();
			
			renderer.setViewport(left,bottom,width,height);
			renderer.setScissor(left,bottom,width,height);
			renderer.render( sceneLeft, camera );
			
			left = canvasWidth * 0.5;
			renderer.setViewport(left,bottom,width,height);
			renderer.setScissor(left,bottom,width,height);
			renderer.render( sceneRight, camera );
			
			renderer.enableScissorTest( false );
			
		}else{ //useFullMotion
			width = canvasWidth * 1;
			camera.aspect = width/height;
			camera.updateProjectionMatrix();
			renderer.setViewport(left,bottom,width,height);
			renderer.render( scene, camera );
		}
        
		//renderer.context.flush();
		function cameraLookAt(){
			var a = 300;
			if ( isUserInteracting === false ) {
				//lon += 0.1;
			}
			
			finger.lon += (finger.targetLon - finger.lon)*0.05;
			finger.lat += (finger.targetLat - finger.lat)*0.05;
			
			setLonLat(finger.lon, finger.lat, finger.targetLon);
			phi = THREE.Math.degToRad( lat );
			theta = THREE.Math.degToRad( lon );
			
			target.x = a * Math.cos( phi ) * Math.sin( theta );
			target.y = a * Math.sin( phi );
			target.z = a * Math.cos( phi ) * Math.cos( theta );
			
			var t = target;
			camera.position.copy( t );
			camera.lookAt( t.negate() );
			//camera.updateMatrixWorld();
		}
	}
};


module.exports = Renderer;
},{"../html":3,"../util":27,"../variables":31,"./requestAnimFrame":15}],15:[function(require,module,exports){
/* global window */
"use strict";
function initRequestAnimationFrame(){
	var lastTime = 0;
	var vendors = ['webkit', 'moz','o','ms'];
	window.requestAnimFrame = window.requestAnimationFrame;
	window.cancelAnimFrame = window.cancelAnimationFrame;
	for(var x = 0; x < vendors.length && !window.requestAnimFrame; ++x) {
		window.requestAnimFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimFrame){
		window.requestAnimFrame = function(callback) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
			timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimFrame){
		window.cancelAnimFrame = function(id) {
			clearTimeout(id);
		};
	}
}
initRequestAnimationFrame();
},{}],16:[function(require,module,exports){
/* global window, document */
"use strict";
function initRequestFullScreen(){
	var vendors = ['webkit', 'moz','o','ms'];
	if(!window.requestFullScreen){
		window.requestFullScreen = requestFullScreen;
		hackCancelFullScreen();
	}
	
	function requestFullScreen(element){
		element.requestFullScreen = element.requestFullScreen;
		for(var x = 0; x < vendors.length && !element.requestFullScreen; ++x) {
			element.requestFullScreen = element[vendors[x]+'RequestFullScreen'];
		}
		if(element.requestFullScreen){
			if(arguments.length<=1){
				element.requestFullScreen.call(element);
			}else{
				element.requestFullScreen.apply(element, arguments.slice(1));
			}
			return true;
		}
		else{
			return false;
		}
	}
	
	
	function hackCancelFullScreen(){
		document.cancelFullScreen = document.exitFullscreen||document.webkitExitFullscreen;
		for(var x = 0; x < vendors.length && !document.cancelFullScreen; ++x) {
			document.cancelFullScreen = document[vendors[x]+'CancelFullScreen'];
		}
	}
}
initRequestFullScreen();

},{}],17:[function(require,module,exports){

"use strict";
//var browser = require('../util/browser');
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
	//return (browser.versions.ios&&(browser.versions.weixin||browser.versions.vendor.indexOf('Google')>-1))||browser.versions.windows;//||browser.versions.chrome;
	return true;
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
},{"../html":3}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
/* global xyz */
"use strict";
//inheritance
function classExtend(ChildClass, ParentClass){
	var initializing = false, fnTest = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;
	var _super = ParentClass.prototype;
	var prop = ChildClass.prototype;
	var prototype = typeof Object.create === "function" ? Object.create(ParentClass.prototype):new ParentClass();
	for (var name in prop) {
		// Check if we're overwriting an existing function
		prototype[name] = typeof prop[name] === "function" &&
			typeof _super[name] === "function" && fnTest.test(prop[name]) ?
			createCallSuperFunction(name, prop[name]) : prop[name];
	}
	initializing = true;
	ChildClass.prototype = prototype;
	ChildClass.prototype.constructor = ChildClass;
	
	function createCallSuperFunction(name, fn){
		return function() {
			var tmp = this._super;
		
			// Add a new ._super() method that is the same method
			// but on the super-class
			this._super = _super[name];
		
			// The method only need to be bound temporarily, so we
			// remove it when we're done executing
			var ret = fn.apply(this, arguments);
			this._super = tmp;
		
			return ret;
		};
	}
}

module.exports = {
	classExtend: classExtend
};
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
/* global document, window  */
"use strict";
function addCookie(name, value, attr){
	var str = "";
	if(attr){
		for(var prop in attr){
			str+=";"+prop+"="+attr[prop];
		}
	}
	document.cookie = name + "=" + window.escape(value) + str;
}
function deleteCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null){
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
}
function getCookie(name){
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null){
		return (arr[2]);
	}
	return null;
}
function getDocumentCookie(){
	return document.cookie;
}

module.exports = {
	addCookie: addCookie,
	deleteCookie: deleteCookie,
	getCookie: getCookie,
	getDocumentCookie: getDocumentCookie
};
},{}],24:[function(require,module,exports){
/* //global document, window  */
"use strict";

var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;

function isFunction( obj ) {
	return type(obj) === "function";
}
function isArray( obj ) {
	//return Array.isArray || type(obj) === "array";
	return typeof obj === 'object' && 
		typeof obj.length === 'number' && 
		typeof obj.slice === 'function' && 
		!(obj.propertyIsEnumerable('length'));
}
function isWindow( obj ) {
	return obj != null && obj === obj.window;
}
function isNumeric( obj ) {
	// parseFloat NaNs numeric-cast false positives (null|true|false|"")
	// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
	// subtraction forces infinities to NaN
	// adding 1 corrects loss of precision from parseFloat (#15100)
	return !isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
}
function isEmptyObject( obj ) {
	var name;
	for ( name in obj ) {
		return false;
	}
	return true;
}
function isPlainObject( obj ) {
	var key;
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if ( !obj || type(obj) !== "object" || obj.nodeType || isWindow( obj ) ) {
		return false;
	}
	try {
		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
	} catch ( e ) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}
	// Support: IE<9
	// Handle iteration over inherited properties before own properties.
	//if ( support.ownLast ) {
	//	for ( key in obj ) {
	//		return hasOwn.call( obj, key );
	//	}
	//}
	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	for ( key in obj ) {}
	return key === undefined || hasOwn.call( obj, key );
}
function type( obj ) {
	if ( obj == null ) {
		return obj + "";
	}
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call(obj) ] || "object" :
		typeof obj;
}
function extend(){
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;
		// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}
	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target)) {
		target = {};
	}
	// extend itself if only one argument is passed
	if ( i === length ) {
		target = {}; //this
		i--;
	}
	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];
				// do not copy prototype function
				if ( !options.hasOwnProperty(name)){
					continue;
				}
				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}
				// Recurse if we're merging plain objects or arrays

				if ( name!== 'parent' && deep && copy && !isPlainObject(copy) &&  typeof  copy.clone === "function" ){
					//remove parent for no dead loop
					//clone is for classType object
					target[ name ] = copy.clone();
					if(target[ name ] ===undefined){ target[ name ]  = copy; }
				} else if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}
					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );
				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}
	// Return the modified object
	return target;
}

module.exports = {
	isFunction: isFunction,
	isArray: isArray,
	isWindow: isWindow,
	isNumeric: isNumeric,
	isEmptyObject: isEmptyObject,
	isPlainObject: isPlainObject,
	type: type,
	extend: extend
};
},{}],25:[function(require,module,exports){

/**
 * 
 */
 "use strict";
var getDateHelper = function(){
	return {
		date : getDate(),
		duration : getDurationHelper(),
		dateDiff : dateDiff,
		dateDiffResult : dateDiffResult,
		dateDiffResultFull : dateDiffResultFull,
		dateToStr : dateToStr,
		datetimeToStr : datetimeToStr,
		getOffsetDate : getOffsetDate,
		paramToDate : paramToDate,
		strToDate : strToDate,
		timeToStr : timeToStr,
		durationToStr : durationToStr,
		durationToObj : durationToObj,
		typeToStr : typeToStr,
		weekdayToStr : weekdayToStr,
		zhDateToStr : zhDateToStr,
		zhDatetimeToStr : zhDatetimeToStr,
		fillZero : fillZero
	};
	
	function getDate(){
		return {
			monthFirstDay : monthFirstDay,
			monthLastDay : monthLastDay
		};
		
		function monthFirstDay(date){
			return paramToDate(date.getFullYear(), date.getMonth());
		}
		function monthLastDay(date){
			var result = monthFirstDay(date);
			result = getOffsetDate('month', result, 1);
			result = getOffsetDate('date', result, -1);
			return result;
		}
	}

	function getDurationHelper() {
		return {
			today : today,
			yestoday : yestoday,
			date: date,
			currentWeek : currentWeek,
			lastWeek : lastWeek,
			currentMonth : currentMonth,
			currentYear : currentYear,
			calendarMonth : calendarMonth,
			month : month,
			year : year
		};

		function today() {
			return getDurationStr('date', new Date());
		}
		function yestoday() {
			return getDurationStr('date', getOffsetDate('date', new Date(), -1));
		}
		function date(date){
			return getDurationStr('date', date);
		}
		function currentWeek(){
			return getDurationStr('day', new Date());
		}
		function lastWeek(){
			return getDurationStr('day', getOffsetDate('date', new Date(), -7));
		}
		function currentMonth(){
			return getDurationStr('month', new Date());
		}
		function currentYear(){
			return getDurationStr('year', new Date());
		}
		function calendarMonth(year, month){
			var now = new Date();
			year = year || now.getFullYear();
			month = month || now.getMonth()+1;
			return getDurationStr('calendarMonth', paramToDate(year, month-1));
		}
		function month(year, month){
			var now = new Date();
			year = year || now.getFullYear();
			month = month || now.getMonth()+1;
			return getDurationStr('month', paramToDate(year, month-1));
		}
		function year(year){
			return getDurationStr('year', paramToDate(year));
		}
	}
	
	function getDurationStr(type, startTime) {
		var result = getDuration(type, startTime);
		return {
			startTime : datetimeToStr(result['startTime']),
			endTime : datetimeToStr(result['endTime'])
		};
	}
	
	function getDuration(type, startTime) {
		var year, month, date, hour, minute, second;
		var day;
		var startTimeDate, endTimeDate;
		switch (type) {
		case 'calendarMonth':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate('month', startTimeDate, 1);
			var startTimeWeekDay = startTimeDate.getDay();
			var endTimeWeekDay = endTimeDate.getDay();
			startTimeDate = getOffsetDate('date', startTimeDate, - startTimeWeekDay%7);
			endTimeDate = getOffsetDate('date', endTimeDate, (7-endTimeWeekDay)%7);
			break;
		case 'year':
			year = startTime.getFullYear();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate(type, startTimeDate, 1);
			break;
		case 'month':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate(type, startTimeDate, 1);
			break;
		case 'date':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			date = startTime.getDate();
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate(type, startTimeDate, 1);
			break;
		case 'day':
			year = startTime.getFullYear();
			month = startTime.getMonth();
			date = startTime.getDate();
			day = startTime.getDay();
			date = date - (day+6)%7;
			startTimeDate = paramToDate(year, month, date, hour, minute, second);
			endTimeDate = getOffsetDate('date', startTimeDate, 7);
			break;
		}
	
		return {
			startTime : startTimeDate,
			endTime : endTimeDate
		};
	}
	
	function dateDiff(type, date1, date2){
		var result = 0;
		switch (type) {
		case 'year':
			result = Math.floor(((date1.getFullYear() - date2.getFullYear())*12+ date1.getMonth() - date2.getMonth())/12);break;
		case 'month':
			result = (date1.getFullYear() - date2.getFullYear())*12 + date1.getMonth() - date2.getMonth() + (((date1.getDate()-date2.getDate())>=0?1:-1) +  (date1>=date2?-1: 1))/2;break;
		case 'date':
			result = Math.floor(date1.getTime()/(1000*60*60*24))-Math.floor(date2.getTime()/(1000*60*60*24)); break;
		case 'hour':
			result = Math.floor(date1.getTime()/(1000*60*60))-Math.floor(date2.getTime()/(1000*60*60)); break;
		case 'minute':
			result = Math.floor(date1.getTime()/(1000*60))-Math.floor(date2.getTime()/(1000*60)); break;
		case 'second':
			result = Math.floor(date1.getTime()/(1000))-Math.floor(date2.getTime()/(1000)); break;
		default:
			result = (date1.getTime()-date2.getTime());
		}
		return result;
	}
	
	function dateDiffResult(date1, date2){
		var offset, type;
		type = 'year';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'month';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'date';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'hour';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'minute';
		offset = dateDiff(type, date1, date2);
		if(offset!==0)return {offset: offset, type: type};
		type = 'second';
		offset = dateDiff(type, date1, date2);
		return {offset: offset, type: type};
	}
	
	function dateDiffResultFull(type, date1, date2){
		var result = {};
		var delta = date1.getTime()-date2.getTime();
		var rest = delta;
		switch(type){
		case 'year': 
			result['year'] = dateDiff('year', date1, date2);
			break;
		case 'date': 
			result['date'] = Math.floor(rest / (1000*60*60*24) );
			rest = rest % (1000*60*60*24);
			result['hour'] = Math.floor(rest / (1000*60*60) );
			rest = rest % (1000*60*60);
			result['minute'] = Math.floor(rest / (1000*60) );
			rest = rest % (1000*60);
			result['second'] = Math.floor(rest / (1000) );
			rest = rest % (1000);
			break;
		}
		return result;
	}
	
	function getOffsetDate(type, date, offset) {
		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		switch (type) {
		case 'year':year+=offset;break;
		case 'month':month+=offset;break;
		case 'date':day+=offset;break;
		case 'hour':hour+=offset;break;
		case 'minute':minute+=offset;break;
		case 'second':second+=offset;break;
		}
		return paramToDate(year, month, day, hour, minute, second);
	}

	function fillZero(input, num) {
		var result = '' + input;
		for (var i = 0; i < (num - result.length); i++) {
			result = '0' + result;
		}
		return result;
	}
	
	function datetimeToStr(date, fmt) {
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'yyyy-MM-dd hh:mm:ss';
		var year = date.getFullYear();
		var month = fillZero(date.getMonth() + 1, 2);
		var dateString = fillZero(date.getDate(), 2);
		var hour = fillZero(date.getHours() ,2);
		var minute = fillZero(date.getMinutes(), 2);
		var second = fillZero(date.getSeconds(), 2);
		return fmt.replace('yyyy',year).replace('MM',month).replace('dd', dateString).replace('hh',hour).replace('mm',minute).replace('ss', second);
	}
	
	function dateToStr(date, fmt) {
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'yyyy-MM-dd';
		var year = date.getFullYear();
		var month = fillZero(date.getMonth() + 1, 2);
		var dateString = fillZero(date.getDate(), 2);
		return fmt.replace('yyyy',year).replace('MM',month).replace('dd', dateString);
	}
	
	function timeToStr(date, fmt){
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'hh:mm:ss';
		var hour = fillZero(date.getHours() ,2);
		var minute = fillZero(date.getMinutes(), 2);
		var second = fillZero(date.getSeconds(), 2);
		return fmt.replace('hh',hour).replace('mm',minute).replace('ss', second);
	}
	
	function durationToStr(millisecond, fmt, fillType){
		fmt = fmt||'hh:mm:ss.ms';
		fillType = fillType||'hh';
		var obj = durationToObj(millisecond);
		var hour = fillZero(obj['hour'] ,2);
		var minute = fillZero(obj['minute'], 2);
		var second = fillZero(obj['second'], 2);
		if(fillType==='hh'||fillType==='mm'&&obj['hour']===0){
			fmt = fmt.replace('hh:', '');
			if(fillType==='mm'&&obj['minute']===0){
				fmt = fmt.replace('mm:', '');
			}
		}
		return fmt.replace('hh', hour).replace('mm', minute).replace('ss', second).replace('ms', obj['millisecond']);
	}
	
	function durationToObj(millisecond){
		var result = {};
		var rest = millisecond;
		result['hour'] = Math.floor(rest / (1000*60*60) );
		rest = rest % (1000*60*60);
		result['minute'] = Math.floor(rest / (1000*60) );
		rest = rest % (1000*60);
		result['second'] = Math.floor(rest / (1000) );
		rest = rest % (1000);
		result['millisecond'] = rest;
		return result;
	}

	function zhDateToStr(date, fmt){
		if(typeof date==='string')date = strToDate(date);
		fmt = fmt||'yyyyMMdd';
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dateString = date.getDate();
		return fmt.replace('yyyy',year+'年').replace('MM',month+'月').replace('dd', dateString+'日');
	}
	function zhDatetimeToStr(date){
		var now = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dateString = date.getDate();
		var hour = fillZero(date.getHours() ,2);
		var minute = fillZero(date.getMinutes(), 2);
		var result = '';
		if(now.getFullYear()===year&&now.getMonth()+1===month){
			if(now.getDate()-dateString===0){
				
			}else if(now.getDate()-dateString===1){
				result += '昨天';
			}else if(now.getDate()-dateString===2){
				result += '前天';
			}else{
				result += zhDateToStr(date);
			}
			if(now.getDate()-dateString!==0)result += ' ';
		}
		result += hour+':'+minute;
		return result;
	}
	
	// 微信客户端不支持new Date("2015-07-04 12:00:00")
	function strToDate(dateTimeStr) {
		if(!dateTimeStr)return null;
		var date = new Date(0);
		var dateTimeArray = dateTimeStr.split(' ');
		var dateStr = dateTimeArray[0];
		var dateArray = dateStr.split('-');
		date.setFullYear(parseInt(dateArray[0]));
		date.setMonth(parseInt(dateArray[1]) - 1);
		date.setDate(parseInt(dateArray[2]));
		if (dateTimeArray.length > 1) {
			var timeStr = dateTimeArray[1];
			var timeArray = timeStr.split(':');
			date.setHours(parseInt(timeArray[0]));
			date.setMinutes(parseInt(timeArray[1]));
			date.setSeconds(parseInt(timeArray[2]));
		}
		return date;
	}

	function paramToDate(year, month, date, hour, minute, second) {
		month =month || 0;
		date = date!==undefined? date : 1;
		hour = hour || 0;
		minute = minute || 0;
		second = second || 0;
		var result = new Date(0);
		result.setFullYear(year);
		result.setMonth(month);
		result.setDate(date);
		result.setHours(hour);
		result.setMinutes(minute);
		result.setSeconds(second);
		return result;
	}
	
	function weekdayToStr(weekday){
		var result = '';
		switch(weekday){
		case 0:result='日';break;
		case 1:result='一';break;
		case 2:result='二';break;
		case 3:result='三';break;
		case 4:result='四';break;
		case 5:result='五';break;
		case 6:result='六';break;
		}
		return result;
	}
	
	function typeToStr(type){
		var result = '';
		switch(type){
		case 'year':result='年';break;
		case 'month':result='月';break;
		case 'day':
		case 'date':result='天';break;
		case 'hour':result='小时';break;
		case 'minute':result='分钟';break;
		case 'second':result='秒';break;
		}
		return result;
	}
};

module.exports = getDateHelper();
},{}],26:[function(require,module,exports){
/* global window */
"use strict";

if(!window){
	return;
}
window.URL = window.URL||window.webkitURL;


},{}],27:[function(require,module,exports){

"use strict";
require('./hack');
var classExtend = require('./classExtend');
var core = require('./core');
var object = require('./object');

var blob = require('./blob');
var browser = require('./browser');
var code = require('./code');
var collection = require('./collection');
var cookie = require('./cookie');
var date = require('./date');
var path = require('./path');
var xhr = require('./xhr');

var util = {
	blob: blob,
	browser: browser,
	code: code,
	collection: collection,
	cookie: cookie,
	date: date,
	path: path,
	xhr: xhr
};
util = core.extend(true, util, core, classExtend, object);

module.exports = util;
},{"./blob":18,"./browser":19,"./classExtend":20,"./code":21,"./collection":22,"./cookie":23,"./core":24,"./date":25,"./hack":26,"./object":28,"./path":29,"./xhr":30}],28:[function(require,module,exports){
"use strict";
//ECMA SCRIPT 5
function defineProperty(obj, name, prop){
	if(typeof Object.defineProperty ==='function'){
		Object.defineProperty(obj, name, prop);
	}
	else{
		obj[name] = prop['value'];
	}
}

function defineProperties(obj, props){
	if(typeof Object.defineProperties ==='function'){
		Object.defineProperties(obj, props);
	}
	else{
		for(var i in props){
			var prop = props[i];
			obj[i] = prop['value'];
		}
	}
}
module.exports = {
	defineProperty: defineProperty,
	defineProperties: defineProperties
};
},{}],29:[function(require,module,exports){
/* global document */
"use strict";
function findCurrentPath(){
	return document.currentScript&&document.currentScript.src||(function(){
		//for IE10+ Safari Opera9
		var a = {}, stack;
		try{
			a.b();
		}catch(e){
			stack = e.stack || e.sourceURL || e.stacktrace;
		}
		var rExtractUri = /(?:http|https|file):\/\/.*?\/.+?.js/, 
        absPath = rExtractUri.exec(stack);
		return absPath[0] || '';
	})()||(function(){
		// IE5.5 - 9
		var scripts = document.scripts;
	    var isLt8 = ('' + document.querySelector).indexOf('[native code]') === -1;
	    for (var i = scripts.length - 1, script; script = scripts[i--];){
	       if (script.readyState === 'interative'){
	          return isLt8 ? script.getAttribute('src', 4) : script.src;   
	       }
	    }
	})();
}
module.exports = {
	findCurrentPath: findCurrentPath
};
},{}],30:[function(require,module,exports){
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
},{"./blob":18}],31:[function(require,module,exports){

"use strict";
var namespace = 'video3d-';
var displayHidden = namespace+'hidden';

module.exports = {
	namespace: namespace,
	displayHidden: displayHidden
};
},{}]},{},[6,31]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global window, module, define */
/*===========================
	AMD Export
===========================*/
if (typeof(module) !== 'undefined'){
    module.exports = window.video3d;
}else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.video3d;
    });
}
},{}]},{},[1]);
