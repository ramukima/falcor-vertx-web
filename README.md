# falcor-vertx-web
Server middleware for falcor-vertx-web

Working usage example of the basic repro in ramukima/falcor-vertx-web-demo

Under Development Note
======================
<a href="https://github.com/Netflix/falcor">Falcor</a> <a href="http://vertx.io/">vert.x</a> integration is best done through the vert.x event bus (I am still working on it). Meanwhile, since there was a working example of falcor-express, I found it useful to have a falcor-vertx-web integration done directly. Once the integration with vert.x event bus is functional, that integration will be preferred over falcor-vertx-web.

## Usage

Example of using a static model (for development purposes only)

Server
======
```
var VertxRouter = require("vertx-web-js/router");
var StaticHandler = require("vertx-web-js/static_handler");
var BodyHandler = require("vertx-web-js/body_handler");

var falcor = require("falcor");
var falcorVertxWeb = require("falcor-vertx-web");
var $ref = falcor.Model.ref;

function example() {
    return {
        cache: {
            productsById: {
                 1: {
                     name: "Product ABC",
                     otherAdd: "something 1"
                 },
                 2: {
                     name: "Product 123",
                     otherAdd: "something 2"
                 },

            },
            _view: [ $ref('productsById[1]') ],
            _cart: []
        }
    }
}

var vRouter = VertxRouter.router(vertx);
vRouter.route().handler(BodyHandler.create().handle);
vRouter.route().path("/model.json").handler(falcorVertxWeb.dataSourceRoute(function (routingContext) {
	return new falcor.Model(example()).asDataSource();
}));

vRouter.route().handler(StaticHandler.create().handle);
vertx.createHttpServer().requestHandler(vRouter.accept).listen(8080);
```

Client
======
```
<head>
    <script src="//netflix.github.io/falcor/build/falcor.browser.js">
    </script>
    <script>

        //create model:
        var model = new falcor.Model({
            source: new falcor.HttpDataSource('/model.json')
        });

        //logging:
        var log = console.log.bind(console);
        var jlog = function(x) { console.log(JSON.stringify(x, null, 3)); };
        var jerror = function(x) { console.error(JSON.stringify(x, null, 3)); };        

model.
  getValue("_view[0].name"). // <-- works fine
  then(function(response1) { 
    console.log( response1 );
    model.
      setValue("_view[0].name", "Another book"). // <-- fails
      subscribe(function(response2){ // <-- fails on both subscribe() and then()
        console.log( response2 );
      });
  });
  </script>
</head>
```

## Installation
Before contributing, please run the linter and the tests to be sure there are no issues.
```
git clone <repo>
cd <repo>
npm install -g
```
