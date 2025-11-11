---
sidebar_position: 2
---

# API Reference

## Constructor

```javascript
var sse = new SSE(url, settings);
```

### Parameters

* **url**: URL for the server that will send the events to this page
* **settings**: The events and options for the SSE instance

### Settings Object

The settings object can contain the following properties:

```javascript
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

## Methods

### start()

Start the EventSource communication.

```javascript
sse.start();
```

**Returns**: `true` if started successfully, `false` if already running

**Example**:

```javascript
var sse = new SSE('http://example.com/sse-server.php', {
    onMessage: function(e) {
        console.log(e.data);
    }
});
sse.start();
```

### stop()

Stop the EventSource communication.

```javascript
sse.stop();
```

**Returns**: `true` if stopped successfully, `false` if not running

**Example**:

```javascript
sse.stop();
```

## Event Object Structure

When an event is received, the event object contains the following properties:

* **data**: The message data from the server
* **lastEventId**: The last event ID received
* **origin**: The origin URL of the response
* **returnValue**: Boolean indicating the event was processed
