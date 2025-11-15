---
sidebar_position: 5
---

# Examples

This page provides practical examples to help you get started with Yaj SSE.

## Basic Example

The simplest way to use Yaj SSE:

### Client Side

```javascript
var sse = new SSE('http://example.com/sse-server.php', {
    onMessage: function(e){
        console.log("Message:", e.data);
    }
});
sse.start();
```

### Server Side (PHP)

```php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");

echo "data: My Message\n";
echo "\n";
```

## Real-time Notifications

Example of a notification system using custom events:

### Client Side

```html
<!DOCTYPE html>
<html>
<head>
    <script src="yaj-sse.js"></script>
    <script src="node_modules/yaj/yaj.min.js"></script>
</head>
<body>
    <h1>Notification System</h1>
    <div id="notifications"></div>

    <script>
        var sse = new SSE('notifications.php', {
            onOpen: function(e) {
                console.log("Connected to notification server");
            },
            onError: function(e) {
                console.error("Connection error");
            },
            events: {
                notification: function(e) {
                    var data = JSON.parse(e.data);
                    var div = document.getElementById('notifications');
                    div.innerHTML += '<p>' + data.message + '</p>';
                }
            }
        });
        sse.start();
    </script>
</body>
</html>
```

### Server Side (PHP)

```php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Access-Control-Allow-Origin: *");

echo "retry: 3000\n";
echo "event: notification\n";
echo "data: " . json_encode([
    'message' => 'New notification received',
    'timestamp' => time()
]) . "\n";
echo "\n";
```

## Chat Application

Example of a simple chat application:

### Client Side

```javascript
var chatSSE = new SSE('chat-server.php', {
    onOpen: function(e) {
        console.log("Connected to chat");
    },
    onError: function(e) {
        console.error("Chat connection error");
    },
    events: {
        message: function(e) {
            var msg = JSON.parse(e.data);
            displayMessage(msg.user, msg.text);
        },
        userJoined: function(e) {
            var data = JSON.parse(e.data);
            console.log(data.user + " joined the chat");
        },
        userLeft: function(e) {
            var data = JSON.parse(e.data);
            console.log(data.user + " left the chat");
        }
    }
});

chatSSE.start();

function displayMessage(user, text) {
    var chatBox = document.getElementById('chat-messages');
    chatBox.innerHTML += '<div><strong>' + user + ':</strong> ' + text + '</div>';
}
```

### Server Side (PHP)

```php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Access-Control-Allow-Origin: *");

// Get last event ID
$lastEventId = isset($_SERVER["HTTP_LAST_EVENT_ID"])
    ? intval($_SERVER["HTTP_LAST_EVENT_ID"])
    : 0;

// Set retry interval
echo "retry: 2000\n";

// Send new messages
$messages = getNewMessages($lastEventId);
foreach ($messages as $msg) {
    echo "id: " . $msg['id'] . "\n";
    echo "event: message\n";
    echo "data: " . json_encode([
        'user' => $msg['user'],
        'text' => $msg['text']
    ]) . "\n";
    echo "\n";
}
```

## Stock Ticker

Real-time stock price updates:

### Client Side

```javascript
var stockSSE = new SSE('stock-ticker.php', {
    events: {
        stockUpdate: function(e) {
            var stock = JSON.parse(e.data);
            updateStockPrice(stock.symbol, stock.price, stock.change);
        }
    },
    onError: function(e) {
        console.error("Failed to connect to stock ticker");
    }
});

stockSSE.start();

function updateStockPrice(symbol, price, change) {
    var element = document.getElementById('stock-' + symbol);
    if (element) {
        element.textContent = symbol + ': $' + price + ' (' + change + '%)';
        element.className = change >= 0 ? 'positive' : 'negative';
    }
}
```

### Server Side (PHP)

```php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");

echo "retry: 5000\n";

$stocks = ['AAPL', 'GOOGL', 'MSFT'];
foreach ($stocks as $symbol) {
    $price = getStockPrice($symbol);
    $change = calculateChange($symbol);

    echo "event: stockUpdate\n";
    echo "data: " . json_encode([
        'symbol' => $symbol,
        'price' => $price,
        'change' => $change
    ]) . "\n";
    echo "\n";
}
```

## Authenticated Connection

Example using custom headers for authentication:

### Client Side

```javascript
var sse = new SSE('secure-endpoint.php', {
    headers: {
        'Authorization': 'Bearer ' + getAuthToken(),
        'X-User-ID': getUserId()
    },
    onMessage: function(e) {
        console.log("Authenticated message:", e.data);
    },
    onError: function(e) {
        console.error("Authentication failed");
        // Redirect to login
        window.location.href = '/login';
    }
});

sse.start();

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function getUserId() {
    return localStorage.getItem('userId');
}
```

### Server Side (PHP)

```php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Access-Control-Allow-Origin: *");

// Verify authentication
if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
    http_response_code(401);
    exit();
}

$token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
if (!validateToken($token)) {
    http_response_code(401);
    exit();
}

// Send authenticated data
echo "data: " . json_encode([
    'message' => 'This is a secure message',
    'timestamp' => time()
]) . "\n";
echo "\n";
```

## Running the Examples

The repository includes working examples. To run them:

1. Start the web server:

```bash
docker run -it --rm -p 8080:80 -v $PWD:/var/www/html byjg/php:7.4-fpm-nginx
```

2. Open your browser:

[http://localhost:8080/examples/sse-client.html](http://localhost:8080/examples/sse-client.html)

:::tip
The examples folder contains additional working examples. Check the `examples/` directory in the repository for more code samples.
:::
