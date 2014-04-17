'use strict';
var APP = {};
define([ 'utils/logger', 'pagespeed' ], function (logger, pagespeed) {

    var myLogger = logger.newLogger('view');

    var callbacks = {};
    var resultContainer = null;
    APP.runPagespeedCallbacks = function (result) {
        if (result.error) {
            var errors = result.error.errors;
            for ( var i = 0, len = errors.length; i < len; ++i) {
                if (errors[i].reason == 'badRequest' && API_KEY == 'yourAPIKey') {
                    alert('Please specify your Google API key in the API_KEY variable.');
                } else {
                    // NOTE: your real production app should use a better
                    // mechanism than alert() to communicate the error to the
                    // user.
                    alert(errors[i].message);
                }
            }
            return;
        }
 
        resultContainer = document.getElementById('results');
        resultContainer.appendChild(document.createElement('hr'));
        var h1 = document.createElement('h2');
        h1.innerHTML = 'Results for: ' + result.id;
        resultContainer.appendChild(h1);

        // Dispatch to each function on the callbacks object.
        for ( var fn in callbacks) {
            var f = callbacks[fn];
            if (typeof f === 'function') {
                f(result);
            }
        }
    };

    callbacks.displayPageSpeedScore = function (result) {
        var h2 = document.createElement('h3');
        h2.innerHTML = 'Page Speed Score';
        resultContainer.appendChild(h2);
        resultContainer.appendChild(pagespeed.chartScore(result));
    };
 
    callbacks.displayTopPageSpeedSuggestions = function (result) {
        var h2 = document.createElement('h3');
        h2.innerHTML = 'Top Page Speed Suggestions';
        resultContainer.appendChild(h2);
        resultContainer.appendChild(pagespeed.listSuggestions(result));
    };
 
    callbacks.displayResourceSizeBreakdown = function (result) {
        var h2 = document.createElement('h3');
        h2.innerHTML = 'Resource size breakdown';
        resultContainer.appendChild(h2);
        resultContainer.appendChild(pagespeed.chartResourceSizeBreakdown(result));
    };
 
    var initialize = function () {
        var pageURL = jQuery('#pageURL');
        jQuery('#main-content button').click(function (event) {
            var urlToAnalyze = pageURL.val();
            if ('' !== urlToAnalyze) {
                pagespeed.analyze(urlToAnalyze, 'APP.runPagespeedCallbacks');
            }
        });
    };
 
    myLogger.debug('loaded');
 
    return { initialize: initialize};

});
