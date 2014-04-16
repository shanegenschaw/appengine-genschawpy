'use strict';
requirejs.config({
	urlArgs : 'v=' + new Date().getTime()
});
requirejs([], function () {
	return 'main';
});