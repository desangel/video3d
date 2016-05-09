/* global window, noGlobal, video3d */
var

	// Map over video3d in case of overwrite
	_video3d = window.video3d;

video3d.noConflict = function( deep ) {
	if ( deep && window.video3d === video3d ) {
		window.video3d = _video3d;
	}

	return video3d;
};

// Expose video3d and $ identifiers, even in AMD
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.video3d = video3d;
}
