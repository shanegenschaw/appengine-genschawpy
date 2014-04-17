'use strict';
requirejs.config({
	urlArgs : 'v=' + new Date().getTime()
});
requirejs(['utils/logger', 'view'], function (logger, view) {
	var myLogger = logger.newLogger('main');
	myLogger.debug('loaded');
	view.initialize();
	return 'main';
});