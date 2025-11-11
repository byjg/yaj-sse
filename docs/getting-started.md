---
sidebar_position: 1
---

# Getting Started

A lightweight (<2kb) Yaj Plugin for Server-Sent Events (SSE) EventSource Polyfill. This plugin tries to use the native EventSource object if it's supported by the browser. If there is no native support, the request is made by ajax requests (polling). You do not need to change the server side nor the client side.

## Dependencies

* Yaj (only for ajax fallback)

## Installation

### Download

Just download the repository and point to the Yaj plugin:

```html
<script src="yaj-sse.js"></script>
```

or use the minified version:

```html
<script src="yaj-sse.min.js"></script>
```

### NPM/Yarn

You can also install using yarn or npm:

```bash
yarn add yaj-sse
```

```bash
npm install yaj-sse
```

### CDN

You can use the CDN version:

```html
<script src="https://cdn.jsdelivr.net/npm/yaj-sse@latest/yaj-sse.min.js"></script>
```

## Basic Usage

### Client Side

```javascript
var sse = new SSE('http://example.com/sse-server.php', {
    onMessage: function(e){
        console.log("Message");
        console.log(e);
    }
});
sse.start();
```

### Server Side

```php
echo "data: My Message\n";
echo "\n";
```

That's it! You're ready to use Server-Sent Events in your application.
