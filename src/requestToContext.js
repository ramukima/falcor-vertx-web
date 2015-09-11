"use strict";

var url = require("url");

var parseArgs = {
    "jsonGraph": true,
    "callPath": true,
    "arguments": true,
    "pathSuffixes": true,
    "paths": true
};

module.exports = function requestToContext(webRoutingContext) {
    var toParse = webRoutingContext.request().method() === "POST"
	? '?' + webRoutingContext.getBodyAsString() : webRoutingContext.request().uri();

    var queryMap = url.parse(toParse, true).query;
    var context = {};
    if (queryMap) {
        Object.keys(queryMap).forEach(function(key) {
            var arg = queryMap[key];
            if (parseArgs[key] && arg != null) {
                context[key] = JSON.parse(arg);
            } else {
                context[key] = arg;
            }
        });
    }

    return context;
};
