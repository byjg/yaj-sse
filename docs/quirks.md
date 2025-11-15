---
sidebar_position: 6
---

# Known Limitations & Quirks

This page documents important limitations and behaviors to be aware of when using Yaj SSE.

## AJAX Fallback Limitations

### No True Streaming

The AJAX fallback does not support true streaming like the native EventSource API. When using AJAX mode (either through `forceAjax: true` or when custom headers are set), the connection uses polling instead of a persistent connection.

**Implication**: Each request-response cycle completes before the next one begins.

**Recommendation**: Use the `retry` directive to control the polling frequency:

```php
// Server side - set polling interval to 3 seconds
echo "retry: 3000\n";
echo "data: My Message\n";
echo "\n";
```

```javascript
// Client side
var sse = new SSE('sse-server.php', {
    options: {
        forceAjax: true  // Uses polling
    },
    onMessage: function(e) {
        console.log(e.data);
    }
});
```

### Server-Side Considerations

When clients are using AJAX fallback, structure your server responses differently:

**Don't do this** (streaming multiple messages):
```php
// This won't work well with AJAX fallback
while (true) {
    echo "data: Message " . time() . "\n\n";
    flush();
    sleep(1);
}
```

**Do this instead** (single message per request):
```php
// Better for AJAX fallback
echo "retry: 3000\n";  // Poll every 3 seconds
echo "data: Message " . time() . "\n";
echo "\n";
```

## Custom Headers Force AJAX Mode

When you specify custom headers, Yaj SSE automatically uses AJAX mode because the native EventSource API doesn't support custom headers.

```javascript
var sse = new SSE('sse-server.php', {
    headers: {
        'Authorization': 'Bearer token123'
    },
    // Even if forceAjax is false, AJAX mode will be used
    onMessage: function(e) {
        console.log(e.data);
    }
});
```

:::caution
This happens automatically and silently. If you need custom headers (e.g., for authentication), be aware that you're using polling instead of streaming.
:::

## Browser Compatibility

### Native EventSource Support

Most modern browsers support the native EventSource API:
- Chrome 6+
- Firefox 6+
- Safari 5+
- Edge (all versions)
- Opera 11+

**Internet Explorer**: Does not support EventSource and will automatically use AJAX fallback.

### Yaj Dependency

The AJAX fallback requires the Yaj library. If you're only targeting modern browsers and not using custom headers, you can use the native EventSource without the Yaj dependency.

## Event ID Persistence

### Last-Event-ID Header

The `Last-Event-ID` header is used to track which events have been received. This is handled automatically by:
- Native EventSource (sent as HTTP header)
- AJAX fallback (sent as custom header)

### Server-Side Access

```php
// Access the last event ID
$lastEventId = isset($_SERVER["HTTP_LAST_EVENT_ID"])
    ? intval($_SERVER["HTTP_LAST_EVENT_ID"])
    : 0;

// Or from GET parameter (fallback)
if ($lastEventId == 0) {
    $lastEventId = isset($_GET["lastEventId"])
        ? intval($_GET["lastEventId"])
        : 0;
}

// Send new messages after this ID
$messages = getMessagesAfter($lastEventId);
foreach ($messages as $msg) {
    echo "id: " . $msg['id'] . "\n";
    echo "data: " . $msg['data'] . "\n";
    echo "\n";
}
```

## Connection Behavior

### onOpen Event

The `onOpen` event fires only once per SSE instance, even if the connection reconnects:

```javascript
var sse = new SSE('sse-server.php', {
    onOpen: function(e) {
        // Only fires on the first successful connection
        console.log("Opened once");
    }
});
```

This is by design to distinguish the initial connection from automatic reconnections.

### Automatic Reconnection

Native EventSource automatically reconnects when the connection is lost. The AJAX fallback continues polling unless `stop()` is called.

## CORS Considerations

For cross-origin requests, ensure your server sends appropriate CORS headers:

```php
header("Access-Control-Allow-Origin: *");
// Or specific origin:
// header("Access-Control-Allow-Origin: https://yourdomain.com");

// If using custom headers:
header("Access-Control-Allow-Headers: Authorization, X-Custom-Header");
header("Access-Control-Allow-Methods: GET");
```

:::warning
When using custom headers with cross-origin requests, browsers send a preflight OPTIONS request. Your server must handle this correctly.
:::

## Performance Considerations

### Polling Frequency

When using AJAX fallback, balance between real-time updates and server load:

```php
// More frequent = more real-time but higher load
echo "retry: 1000\n";  // Poll every 1 second

// Less frequent = lower load but less real-time
echo "retry: 5000\n";  // Poll every 5 seconds
```

### Connection Limits

Browsers limit the number of concurrent connections per domain (typically 6). Each SSE connection counts toward this limit.

**Impact**: Having many SSE connections open can block other requests.

**Recommendation**: Limit the number of simultaneous SSE connections in your application.

## References

For more information on Server-Sent Events:

* [W3C EventSource Specification](http://www.w3.org/TR/2009/WD-eventsource-20091029/)
* [MDN: Using Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
* [HTML5 Doctor: Server-Sent Events](http://html5doctor.com/server-sent-events/)
* [HTML5 Rocks: Stream Updates with Server-Sent Events](http://www.html5rocks.com/en/tutorials/eventsource/basics/)
