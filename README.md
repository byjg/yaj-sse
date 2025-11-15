# Yaj SSE

[![Build Status](https://github.com/byjg/yaj-sse/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/byjg/yaj-sse/actions/workflows/build.yml)
[![Opensource ByJG](https://img.shields.io/badge/opensource-byjg-success.svg)](http://opensource.byjg.com)
[![GitHub source](https://img.shields.io/badge/Github-source-informational?logo=github)](https://github.com/byjg/yaj-sse/)
[![GitHub license](https://img.shields.io/github/license/byjg/yaj-sse.svg)](https://opensource.byjg.com/opensource/licensing.html)
[![GitHub release](https://img.shields.io/github/release/byjg/yaj-sse.svg)](https://github.com/byjg/yaj-sse/releases/)
[![](https://data.jsdelivr.com/v1/package/npm/yaj-sse/badge)](https://www.jsdelivr.com/package/npm/yaj-sse)

A lightweight (<2kb) Yaj Plugin for Server-Sent Events (SSE) EventSource Polyfill.
This plugin tries to use the native EventSource object if it is supported by the browser.
If there is no native support, the request is made by AJAX requests (polling).
You do not need to change the server side nor the client side.

## Quick Start

### Client Side

```javascript
var sse = new SSE('http://example.com/sse-server.php', {
    onMessage: function(e){
        console.log("Message:", e.data);
    }
});
sse.start();
```

### Server Side

```php
echo "data: My Message\n";
echo "\n";
```

## Documentation

Comprehensive documentation is available in the `/docs` folder:

1. **[Getting Started](docs/getting-started.md)** - Installation and basic usage
2. **[API Reference](docs/api-reference.md)** - Constructor, methods, and parameters
3. **[Event Handlers](docs/events.md)** - Available events and custom events
4. **[Configuration Options](docs/options.md)** - Options and custom headers
5. **[Examples](docs/examples.md)** - Practical code examples
6. **[Known Limitations & Quirks](docs/quirks.md)** - Important behavior notes

## Installation

Download the repository and include the script:

```html
<script src="yaj-sse.min.js"></script>
```

Or install via package manager:

```bash
yarn add yaj-sse
# or
npm install yaj-sse
```

## Key Features

- **Automatic Fallback**: Uses native EventSource when available, falls back to AJAX polling
- **Custom Headers**: Support for authentication and custom headers
- **Custom Events**: Handle multiple event types from the server
- **Lightweight**: Less than 2kb minified
- **Zero Configuration**: Works out of the box with sensible defaults

## Dependencies

* Yaj (only required for AJAX fallback)

## Development

### Minify

```bash
npm run minify
```

### Running Examples

Start the web server:

```bash
docker run -it --rm -p 8080:80 -v $PWD:/var/www/html byjg/php:7.4-fpm-nginx
```

Open the browser:
[http://localhost:8080/examples/sse-client.html](http://localhost:8080/examples/sse-client.html)

----
[Open source ByJG](http://opensource.byjg.com)
