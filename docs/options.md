---
sidebar_position: 4
---

# Configuration Options

Yaj SSE provides several configuration options to customize the behavior of your Server-Sent Events connection.

## Options

The `options` object allows you to configure how the SSE connection works.

### forceAjax

Forces the use of AJAX polling even if the browser supports native EventSource.

```javascript
var sse = new SSE('sse-server.php', {
    options: {
        forceAjax: true
    },
    onMessage: function(e) {
        console.log(e.data);
    }
});
```

**Default**: `false`

**Use Cases**:
- Testing AJAX fallback behavior
- Working around browser-specific EventSource bugs
- Debugging connection issues

:::caution
When `forceAjax` is enabled, the connection uses polling instead of true streaming, which may increase server load and latency.
:::

## Custom Headers

You can send custom headers with your SSE requests. This is useful for authentication, API keys, or other custom headers.

```javascript
var sse = new SSE('sse-server.php', {
    headers: {
        'Authorization': 'Bearer 1a234fd4983d',
        'X-Custom-Header': 'custom-value'
    },
    onMessage: function(e) {
        console.log(e.data);
    }
});
```

:::important
The native EventSource API does not support custom headers. When you specify headers, Yaj SSE automatically falls back to AJAX mode (as if `forceAjax: true` was set).
:::

### Authentication Example

```javascript
var sse = new SSE('https://api.example.com/events', {
    headers: {
        'Authorization': 'Bearer ' + getUserToken()
    },
    onMessage: function(e) {
        var data = JSON.parse(e.data);
        console.log('Authenticated message:', data);
    },
    onError: function(e) {
        console.error('Authentication failed');
    }
});
sse.start();
```

### Server Side (PHP)

Access custom headers on the server:

```php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Access-Control-Allow-Origin: *");

// Access custom headers
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $token = $_SERVER['HTTP_AUTHORIZATION'];
    // Validate token
    if (validateToken($token)) {
        echo "data: Authenticated message\n";
        echo "\n";
    }
}
```

:::tip
HTTP headers are converted to `$_SERVER` variables with the `HTTP_` prefix and uppercase with underscores. For example, `Authorization` becomes `HTTP_AUTHORIZATION`.
:::

## Complete Configuration Example

Here's an example using all available options:

```javascript
var sse = new SSE('https://api.example.com/events', {
    // Event handlers
    onOpen: function(e) {
        console.log("Connected");
    },
    onMessage: function(e) {
        console.log("Message:", e.data);
    },
    onError: function(e) {
        console.error("Error:", e);
    },
    onEnd: function(e) {
        console.log("Connection closed");
    },

    // Configuration options
    options: {
        forceAjax: false  // Use native EventSource if available
    },

    // Custom headers (will force AJAX mode)
    headers: {
        'Authorization': 'Bearer token123',
        'X-API-Key': 'your-api-key'
    },

    // Custom events
    events: {
        notification: function(e) {
            console.log("Notification:", e.data);
        }
    }
});

sse.start();
```
