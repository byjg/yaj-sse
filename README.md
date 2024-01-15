# Yaj SSE 

[![Build Status](https://github.com/byjg/yaj-sse/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/byjg/yaj-sse/actions/workflows/build.yml)
[![Opensource ByJG](https://img.shields.io/badge/opensource-byjg-success.svg)](http://opensource.byjg.com)
[![GitHub source](https://img.shields.io/badge/Github-source-informational?logo=github)](https://github.com/byjg/yaj-sse/)
[![GitHub license](https://img.shields.io/github/license/byjg/yaj-sse.svg)](https://opensource.byjg.com/opensource/licensing.html)
[![GitHub release](https://img.shields.io/github/release/byjg/yaj-sse.svg)](https://github.com/byjg/yaj-sse/releases/)
[![](https://data.jsdelivr.com/v1/package/npm/yaj-sse/badge)](https://www.jsdelivr.com/package/npm/yaj-sse)

A lightweigth (\<2kb) Yaj Plugin for Server-Sent Events (SSE) EventSource Polyfill. 
This plugin try to use the native EventSource object if it supported by the browser.
If there is no native support the request is made by ajax requests (polling).
You do not need to change the server side nor the client side.

## Example

Client Side

```javascript
var sse = new SSE('http://example.com/sse-server.php', {
    onMessage: function(e){ 
        console.log("Message"); console.log(e); 
    }
});
sse.start();
```

Server Side

```php
echo "data: My Message\n";
echo "\n";
```

## Dependencies

* Yaj (only for ajax fallback)

## Install

Just download the repository and point to the Yaj plugin:

```html
<script src="yaj-sse.js" ></script>
```

or

```html
<script src="yaj-sse.min.js" ></script>
```

You can also install using yarn:

```bash
yarn add yaj-sse
```

## Usage:

### Constructor

```
var sse = new SSE(url, settings);
```

* url: URL for the server will be sent the events to this page;
* settings: The events and options for the SSE instance

### Settings List

All the options:

```
var sseObject = new SSE('sse-server.php', {
    onOpen: function (e) {},
    onEnd: function (e) {},
    onError: function (e) {},
    onMessage: function (e) {},
    options: {},
    headers: {},
    events: {}
});
```

**Event onOpen**

Fired when the connection is opened the first time;

```javascript
onOpen: function(e){ 
    console.log("Open"); console.log(e); 
},
```

**Event onEnd**

Fired when the connection is closed and the client will not listen for the server events;

```javascript
onEnd: function(e){ 
    console.log("End"); console.log(e); 
},
```

**Event onError**

Fired when the connection error occurs;

```javascript
onError: function(e){ 
    console.log("Could not connect"); 
},
```

**Event onMessage**

Fired when the a message without event is received

```javascript
onMessage: function(e){ 
    console.log("Message"); console.log(e); 
},
```

**Custom Options**

Define the options for the SSE instance

```javascript
options: {
    forceAjax: false
},
```

* **forceAjax**: Uses ajax even if the EventSource object is supported natively;


**Custom Events**

Fired when the server set the event and match with the key

For example, if you have a custom event called `myEvent` you may use the follow code:

```javascript
events: {
    myEvent: function(e) {
        console.log('Custom Event');
        console.log(e);
    }
}
```

Server side:

```php
echo "event: myEvent\n";   // Must match with events in the HTML.
echo "data: My Message\n";
echo "\n";
```

**Custom Headers**

You can send custom headers to the request.

```javascript
headers: {
    'Authorization', 'Bearer 1a234fd4983d'
}
```

Note: As the EventSource does not support send custom headers to the request,
the object will fallback automatically to 'forceAjax=true', even this it is not set.


## Methods

**start**

Start the EventSource communication

```javascript
sse.start();
```

**stop**

Stop the EventSource communication

```javascript
sse.stop();
```

## Quirks

The ajax does not support the streaming as the event source supports. In that case we recommend
create a server without streaming and set the "retry" to determine query frequency;

Example Server Side:

```php
echo "retry: 3000\n";
echo "data: My Message\n";
echo "\n";
```

## Minify

```
npm run minify
```

## Running the examples

Start the webserver:

```shell
docker run -it --rm -p 8080:80 -v $PWD:/var/www/html byjg/php:7.4-fpm-nginx 
```

Open the browser:
[http://localhost:8080/examples/sse-client.html](http://localhost:8080/examples/sse-client.html)


## References

* [http://www.w3.org/TR/2009/WD-eventsource-20091029/](http://www.w3.org/TR/2009/WD-eventsource-20091029/)
* [https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events](https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events)
* [http://html5doctor.com/server-sent-events/](http://html5doctor.com/server-sent-events/)
* [http://www.html5rocks.com/en/tutorials/eventsource/basics/](http://www.html5rocks.com/en/tutorials/eventsource/basics/)


----
[Open source ByJG](http://opensource.byjg.com)
