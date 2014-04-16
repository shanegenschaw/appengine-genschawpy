'use strict';
requirejs.config({
	urlArgs : 'v=' + new Date().getTime()
});
requirejs(['utils/logger'], function (logger) {
	var myLogger = logger.newLogger('main');
	myLogger.debug('loaded');
	return 'main';
});