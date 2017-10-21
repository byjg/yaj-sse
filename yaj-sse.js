/*
 * Yaj Plugin for Server-Sent Events (SSE) EventSource Polyfill v0.1.3
 * https://github.com/byjg/yah-sse
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2017 by JG (João Gilberto Magalhães).
 */

var SSE = function (url, customSettings) {

    var _url = url;
    var _settings = {
        onOpen: function (e) {},
        onEnd: function (e) {},
        onError: function (e) {},
        onMessage: function (e) {},
        options: {},
        headers: {},
        events: {}
    };

    yoCopy(customSettings, _settings);

    var _type = null;
    var _instance = null;

    // Private Method for Handle EventSource object
    function createEventSource() {
        _type = 'event';
        _instance = new EventSource(_url);
        _instance.successCount = 0;

        _instance.onmessage = _settings.onMessage;
        _instance.onopen = function (e) {
            if (_instance.successCount++ === 0) {
                _settings.onOpen(e);
            }
        };
        _instance.onerror = function (e) {
            if (e.target.readyState === EventSource.CLOSED) {
                _settings.onError(e);
            }
        };

        for (var key in _settings.events) {
            _instance.addEventListener(key, _settings.events[key], false);
        }
    }
    
    // Handle the Ajax instance (fallback)
    function createAjax() {
        _type = 'ajax';
        _instance = {successCount: 0, id: null, retry: 3000, data: "", event: ""};
        runAjax();
    }
    
    // Handle the continous Ajax request (fallback)
    function runAjax() {
        if (!_instance) {
            return;
        }

        var headers = {'Last-Event-ID': _instance.id};

        for (var key in _settings.headers) {
            headers[key] = _settings.headers[key];
        }

        Yaj.request({
            url: _url,
            method: 'GET',
            headers: headers,
            success: function (receivedData, status, info) {
                if (!_instance) {
                    return;
                }

                if (_instance.successCount++ === 0) {
                    _settings.onOpen();
                }

                var lines = receivedData.split("\n");

                // Process the return to generate a compatible SSE response
                _instance.data = "";
                var countBreakLine = 0;
                for (var key in lines) {
                    var separatorPos = lines[key].indexOf(":");
                    var item = [
                        lines[key].substr(0, separatorPos),
                        lines[key].substr(separatorPos + 1)
                    ];
                    switch (item[0]) {
                        // If the first part is empty, needed to check another sequence
                        case "":
                            if (!item[1] && countBreakLine++ === 1) {  // Avoid comments!
                                eventMessage = {
                                    data: _instance.data,
                                    lastEventId: _instance.id,
                                    origin: info.responseURL,
                                    returnValue: true
                                };

                                // If there are a custom event then call it
                                if (_instance.event && _settings.events[_instance.event]) {
                                    _settings.events[_instance.event](eventMessage);
                                } else {
                                    _settings.onMessage(eventMessage);
                                }
                                _instance.data = "";
                                _instance.event = "";
                                countBreakLine = 0;
                            }
                            break;

                            // Define the new retry object;
                        case "retry":
                            countBreakLine = 0;
                            _instance.retry = parseInt(item[1].trim());
                            break;

                            // Define the new ID
                        case "id":
                            countBreakLine = 0;
                            _instance.id = item[1].trim();
                            break;

                            // Define a custom event
                        case "event":
                            countBreakLine = 0;
                            _instance.event = item[1].trim();
                            break;

                            // Define the data to be processed.
                        case "data":
                            countBreakLine = 0;
                            _instance.data += (_instance.data !== "" ? "\n" : "") + item[1].trim();
                            break;

                        default:
                            countBreakLine = 0;
                    }
                }
                setTimeout(function () {
                    runAjax();
                }, _instance.retry);
            },
            error: _settings.onError
        });
    }

    return {

        start: function () {
            if (_instance) {
                return false;
            }

            if (!window.EventSource || _settings.options.forceAjax || (Object.keys(_settings.headers).length > 0)) {
                createAjax(this);
            } else {
                createEventSource(this);
            }

            return true;
        },

        // Stop the proper object
        stop: function () {
            if (!_instance) {
                return false;
            }

            if (!window.EventSource || _settings.options.forceAjax || (Object.keys(_settings.headers).length > 0)) {
                // Nothing to do;
            } else {
                _instance.close();
            }
            _settings.onEnd();

            _instance = null;
            _type = null;

            return true;
        }
    };
};
