"use strict";
var requestToContext = require("./requestToContext");
var FalcorEndpoint = module.exports = {};

FalcorEndpoint.dataSourceRoute = function(getDataSource) {
    return function(routingContext) {
        var obs;
	var req = routingContext.request();
	var res = routingContext.response();

        var dataSource = getDataSource(routingContext);
        var context = requestToContext(routingContext);

        // probably this should be sanity check function?
        if (Object.keys(context).length === 0) {
            return res.setStatusCode(500).end("Request not supported");
        }
        if (typeof context.method === "undefined" || context.method.length === 0) {
            return res.setStatusCode(500).end("No query method provided");
        }
        if (typeof dataSource[context.method] === "undefined") {
            return res.setStatusCode(500).end("Data source does not implement the requested method");
        }

        if (context.method === "set") {
            obs = dataSource[context.method](context.jsonGraph);
        } else if (context.method === "call") {
            obs = dataSource[context.method](context.callPath, context.arguments, context.pathSuffixes, context.paths);
        } else {
            obs = dataSource[context.method]([].concat(context.paths));
        }

        obs.subscribe(function(jsonGraphEnvelope) {
            res.setStatusCode(200).end(JSON.stringify(jsonGraphEnvelope));
        }, function(err) {
            res.setStatusCode(500).end(err);
        });
    };
};

