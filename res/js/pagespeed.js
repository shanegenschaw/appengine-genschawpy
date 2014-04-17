'use strict';
define([ 'utils/logger', 'charts' ], function (logger, charts) {

    var key = 'YOUR_KEY_HERE', url = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?';

    var myLogger = logger.newLogger('pagespeed');

    var chartScore = function (result) {
        var score = result.score;
        // Construct the params to send to the Google Chart Tools.
        var params = [ 'chtt=Page+Speed+score:+' + score, 'chs=180x100', 'cht=gom', 'chd=t:' + score, 'chxt=x,y', 'chxl=0:|' + score, ];
        var chart = charts.create(params);
        return chart;
    };

    var listSuggestions = function (result) {
        // Helper function that sorts results in order of impact.
        var sortByImpact = function (a, b) {
            return b.impact - a.impact;
        };

        var results = [];
        var ruleResults = result.formattedResults.ruleResults;
        for ( var i in ruleResults) {
            var ruleResult = ruleResults[i];
            // Don't display lower-impact suggestions.
            // if (ruleResult.ruleImpact < 3.0) continue;
            results.push({
                name : ruleResult.localizedRuleName,
                impact : ruleResult.ruleImpact
            });
        }
        results.sort(sortByImpact);
        var ul = document.createElement('ul');
        for ( var i = 0, len = results.length; i < len; ++i) {
            var r = document.createElement('li');
            r.innerHTML = results[i].name;
            ul.insertBefore(r, null);
        }
        if (ul.hasChildNodes()) {
            return ul;
        }
        var div = document.createElement('div');
        div.innerHTML = 'No high impact suggestions. Good job!';
        return div;
    };

    var RESOURCE_TYPE_INFO = [ {
        label : 'JavaScript',
        field : 'javascriptResponseBytes',
        color : 'e2192c'
    }, {
        label : 'Images',
        field : 'imageResponseBytes',
        color : 'f3ed4a'
    }, {
        label : 'CSS',
        field : 'cssResponseBytes',
        color : 'ff7008'
    }, {
        label : 'HTML',
        field : 'htmlResponseBytes',
        color : '43c121'
    }, {
        label : 'Flash',
        field : 'flashResponseBytes',
        color : 'f8ce44'
    }, {
        label : 'Text',
        field : 'textResponseBytes',
        color : 'ad6bc5'
    }, {
        label : 'Other',
        field : 'otherResponseBytes',
        color : '1051e8'
    }, ];

    var chartResourceSizeBreakdown = function (result) {
        var stats = result.pageStats;
        var labels = [];
        var data = [];
        var colors = [];
        var totalBytes = 0;
        var largestSingleCategory = 0;
        for ( var i = 0, len = RESOURCE_TYPE_INFO.length; i < len; ++i) {
            var label = RESOURCE_TYPE_INFO[i].label;
            var field = RESOURCE_TYPE_INFO[i].field;
            var color = RESOURCE_TYPE_INFO[i].color;
            if (field in stats) {
                var val = Number(stats[field]);
                totalBytes += val;
                if (val > largestSingleCategory)
                    largestSingleCategory = val;
                labels.push(label);
                data.push(val);
                colors.push(color);
            }
        }
        // Construct the params to send to the Google Chart Tools.
        var params = [ 'chs=300x140', 'cht=p3', 'chts=' + [ '000000', 16 ].join(','), 'chco=' + colors.join('|'),
            'chd=t:' + data.join(','), 'chdl=' + labels.join('|'), 'chdls=000000,14', 'chp=1.6', 'chds=0,' + largestSingleCategory, ];
        var chart = charts.create(params);
        return chart;
    };
    
    var analyze = function (urlToAnalyze, callback) {
        var query = [ 'url=' + urlToAnalyze, 'callback=' + callback, 'key=' + key ].join('&');
        var pagespeedUrl = url + query;
        myLogger.debug('about to call: ' + pagespeedUrl);
        jQuery.get(pagespeedUrl);
    };

    myLogger.debug('loaded');
    
    return {
        analyze : analyze,
        chartScore : chartScore,
        listSuggestions : listSuggestions,
        chartResourceSizeBreakdown : chartResourceSizeBreakdown
    };

});
