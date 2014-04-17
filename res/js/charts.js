'use strict';
define([ 'utils/logger' ], function (logger) {

    var myLogger = logger.newLogger('charts');

    var url = 'http://chart.apis.google.com/chart?';

    var create = function (params) {
        var imgSrc = url + params.join('&');
        myLogger.debug('Chart img.src="' + imgSrc + "'");
        var img = document.createElement('img');
        img.src = imgSrc;
        return img;
    };
    
    myLogger.debug('loaded');

    return {
        create : create
    };

});
