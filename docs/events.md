---
sidebar_position: 3
---

# Event Handlers

Yaj SSE provides several event handlers to manage the lifecycle and messages of your Server-Sent Events connection.

## onOpen

Fired when the connection is opened for the first time.

```javascript
var sse = new SSE('sse-server.php', {
    onOpen: function(e){
        console.log("Connection opened");
        console.log(e);
    }
});
```

:::tip
The `onOpen` event is only triggered once, even if the connection reconnects automatically.
:::

## onEnd

Fired when the connection is closed and the client will not listen for server events anymore.

```javascript
var sse = new SSE('sse-server.php', {
    onEnd: function(e){
        console.log("Connection ended");
        console.log(e);
    }
});
```

## onError

Fired when a connection error occurs.

```javascript
var sse = new SSE('sse-server.php', {
    onError: function(e){
        console.log("Could not connect");
        console.log(e);
    }
});
```

## onMessage

Fired when a message without a specific event name is received.

```javascript
var sse = new SSE('sse-server.php', {
    onMessage: function(e){
        console.log("Message received");
        console.log(e.data);
    }
});
```

### Server Side

```php
echo "data: My Message\n";
echo "\n";
```

## Custom Events

You can define custom event handlers that are triggered when the server sends a message with a specific event name.

### Client Side

```javascript
var sse = new SSE('sse-server.php', {
    events: {
        myEvent: function(e) {
            console.log('Custom Event Received');
            console.log(e.data);
        },
        notification: function(e) {
            console.log('Notification Event');
            console.log(e.data);
        }
    }
});
```

### Server Side

```php
echo "event: myEvent\n";
echo "data: My Custom Message\n";
echo "\n";
```

:::info
The event name in the client must exactly match the event name sent by the server.
:::

## Complete Example

Here's a complete example showing all event handlers:

```javascript
var sse = new SSE('sse-server.php', {
    onOpen: function(e) {
        console.log("Connection opened");
    },
    onEnd: function(e) {
        console.log("Connection closed");
    },
    onError: function(e) {
        console.error("Connection error", e);
    },
    onMessage: function(e) {
        console.log("Default message:", e.data);
    },
    events: {
        userJoined: function(e) {
            console.log("User joined:", e.data);
        },
        userLeft: function(e) {
            console.log("User left:", e.data);
        }
    }
});
sse.start();
```
