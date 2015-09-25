// Establish the presence of a window
window = window || {};

(function (window, $, JSON) {
    // Create Pooty as a global which executes the report() function
    //  (useful as we create the default functionality later)
    var Pooty = window.Pooty = window.Athlete = function (modelname) {
        return Pooty.state[modelname];
    };
    
    // Error reporter
    //@param title: A brief title for the error
    //@param description: A full description of the error
    //@param details: Any relevant program data (an object, array or value)
    Pooty.error = function (title, description, details) {
        if (!details) {
            throw Error(title + ': ' + description);
        } else {
            console.error(title + ': ' + description);
            throw Error(details);
        }
    };
    
    // Assert that jQuery or Zepto is loaded
    if (!$) {
        Pooty.error('Missing dependency', 'Pooty requires jQuery or Zepto. Please include one of these.');
        return null;
    }
    
    // Initialize basic properties
    // Models: A home for the user-created models, with name:selector pairs
    // Controllers: A home for the user-created controllers
    // State: A home for the application state
    // Fns: A home for user-defined shared functions and services
    // Templates: A home for user-defined templates
    Pooty.models = Pooty.models || {};
    Pooty.controllers = Pooty.controllers || {};
    Pooty.state = Pooty.state || {};
    Pooty.fns = Pooty.fns || {};
    Pooty.templates = Pooty.templates || {};
    
    // Function for data model creation
    //@param modelname: A name for the model
    // returns a function that takes the model as its parameter.
    //  OR
    //@param modelname: A universal model
    Pooty.model = function (modelname) {
        if (!Pooty.utility.check(modelname, ['string', 'object'], 'Pooty.model()')) return;
        if (typeof modelname === 'string') {
            return function (model) {
                if (!Pooty.utility.check(model, ['object'], 'Pooty.model()')) return;
                Pooty.models[modelname] = model;
                Pooty.state[modelname] = Pooty.utility.clean(model);
            };
        } else { // modelname is a model object
            Pooty.models.universal = modelname;
            Pooty.state.universal = Pooty.utility.clean(modelname);
        }
    };
    
    // Function for controller creation
    //@param controlname: A name for the controller
    // returns a function that takes the controller function as its parameter.
    //  OR
    //@param controlname: A universal controller function
    Pooty.control = function (controllername) {
        if (!Pooty.utility.check(controllername, ['string', 'function'], 'Pooty.control()')) return;
        if (typeof controllername === 'string') {
            return function (controllerFn) {
                if (!Pooty.utility.check(controllerFn, ['function'], 'Pooty.control()')) return;
                Pooty.controllers[controllername] = controllerFn;
            }
        } else { // controllername is a function
            Pooty.controllers.universal = controllername;
        }
    };
    
    // Function for shared service creation
    //@param fnname: A name for the function
    // returns a function that takes the user-defined function as its parameter.
    Pooty.fn = function (fnname) {
        if (!Pooty.utility.check(fnname, ['string'], 'Pooty.fn()')) return;
        return function (sharedfn) {
            if (!Pooty.utility.check(sharedfn, ['function'], 'Pooty.fn()')) return;
            Pooty.fns[fnname] = sharedfn;
        };
    };
    
    // Function to fetch external HTML templates
    //@param url: The location of the template
    Pooty.template = function () {
        var urls = Array.prototype.slice.call(arguments);
        urls.forEach(function (url) {
            Pooty.templates.push($.get(url));
        });
    };
    
    Pooty.resource = {
        controllerScope: function (mainModel, mainState) {
            var scope = this;
            scope.mainModel = mainModel;
            scope.mainState = mainState;
            
            scope.functions = {
                // Change the model associated with this controller
                useModel: function (name) {
                    if (!Pooty.utility.check(name, ['string'], 'this.loadModel()')) return;
                    var newModel = Pooty.models[name];
                    var newState = Pooty.state[name];
                    if (!newModel || !newState) {
                        return Pooty.error('No model found', 'Could not find a model with the name: ', name);
                    }
                    scope.mainModel = newModel;
                    scope.mainState = newState;
                    return;
                },
                // Use an auxiliary model
                loadModel: function (name) {
                    if (!Pooty.utility.check(name, ['string'], 'this.useModel()')) return;
                    var newModel = Pooty.models[name];
                    var newState = Pooty.state[name];
                    if (!newModel || !newState) {
                        return Pooty.error('No model found', 'Could not find a model with the name: ', name);
                    }
                    return Pooty.resource.controllerScope(newModel, newState).model;
                },
                model: function (property) {
                    if (!Pooty.utility.check(property, ['string'], 'this.model()')) return;
                    
                    var poot = function () {
                        if (!arguments.length) {
                            return Pooty.utility.getState(scope.mainModel, scope.mainState, selector);
                        }
                        Pooty.utility.setState(scope.mainModel, scope.mainState, property, Array.prototype.join.call(arguments, ' '));
                    };
                    
                    return {
                        poot: poot,
                        yield: poot
                    }
                },
                fn: function (fnname) {
                    return Pooty.fns[fnname];
                },
                input: function (property) {
                    if (!Pooty.utility.check(property, ['string'], 'this.input()')) return;
                    var selector = Pooty.utility.getSelector(scope.mainModel, property);
                    
                    var poot = function () {
                        if (!arguments.length) {
                            return Pooty.utility.getInputValue(selector);
                        }
                        
                        Pooty.utility.setInputValue(selector, Array.prototype.join.call(arguments, ' '));
                    };
                    
                    poot.model = function (targetProperty) {
                        if (!Pooty.utility.check(targetProperty, ['string'], 'this.input().poot.model()')) return;

                        var handler = function () {
                            scope.functions.model(targetProperty).poot(Pooty.utility.getInputValue(selector));
                        };
                        $(selector).on('keyup', null, handler);

                        return {
                            off: function () {
                                $(selector).off('keyup', null, handler);
                            }
                        }
                    };
                    
                    var validate = function (validFn) {
                        var validated = false;
                        var handler = function () {
                            if (!!validFn($(selector).val())) {
                                validated = true;
                            } else {
                                validated = false;
                            }
                        };

                        $(selector).on('keyup', null, handler);

                        var off = function () {
                            $(selector).off('keyup', null, handler);
                        };
                        
                        var success = function (successFn) {
                            validated ? successFn($(selector).val()) : null;
                            return {
                                off: off
                            }
                        };

                        return {
                            off: off,
                            success: success
                        }
                    }
                    
                    return {
                        poot: poot,
                        yield: poot,
                        validate: validate
                    };
                },
                button: function (property) {
                    if (!Pooty.utility.check(property, ['string'], 'this.button()')) return;
                    var selector = Pooty.utility.getSelector(scope.mainModel, property);
                    
                    var bindHandler = function (type, handler) {
                        if (!Pooty.utility.check(handler, ['function'], 'this.button.' + type + '()')) return;
                        var off = {};
                        handler = handler.bind(off);
                        off.off = function () {
                            $(selector).off(type, null, handler);
                        };

                        $(selector).on(type, null, handler);
                    };
                    
                    return {
                        click: bindHandler.bind(null, 'click'),
                        doubleclick: bindHandler.bind(null, 'dblclick')
                    };
                },
                url: function (url) {
                    if (!Pooty.utility.check(url, ['string'], 'this.url()')) return;
                    var urlObj = {
                        url: url
                    };
                    
                    var optionSet = function (name, value) {
                        if (!Pooty.utility.check(name, ['string'], 'urlObj.option()')) return;
                        if (!Pooty.utility.check(value, ['string'], 'urlObj.option()')) return;
                        urlObj[name] = value;
                        return this;
                    };
                    
                    var ajax = function (type) {
                        if (!Pooty.utility.check(type, ['string'], 'urlObj.http()')) return;
                        urlObj.type = type || urlObj.type;
                        var response = $.ajax(urlObj);
                        var poot = function () {
                            return response;
                        };
                        poot.model = function (property) {
                            if (!Pooty.utility.check(property, ['string'], 'httpResponse.poot.model()')) return;
                            response.then(function (response) {
                                scope.functions.model(property).poot(response);
                            });
                        };
                        return poot;
                    };
                    
                    var websocket = function (protocol) {
                        if (!Pooty.utility.check(protocol, ['string', 'object'], 'urlObj.websocket()')) return;
                        if (!window.WebSocket) 
                            return Pooty.error('WebSocket unavailable', 'This browser does not support WebSockets.',
                                               [url, protocol]);
                        var socket = new window.WebSocket(url, protocol);
                        
                        var sendqueue = [];

                        var send = function (data) {
                            if (typeof data === 'object') {
                                data = JSON.stringify(data);
                            }
                            if (socket.readyState === socket.CONNECTING) {
                                sendqueue.push(data);
                            } else if (socket.readyState === socket.OPEN) {
                                socket.send(data);
                            } else {
                                Pooty.error('Connection failed', 'The websocket connection to ' + url + ' failed to connect.',
                                            [protocol, data]);
                            }
                        };
                        
                        var receive = function (handlerFn) {
                            socket.onmessage = function (message) {
                                handlerFn(message.data);
                            };
                        };
                        
                        socket.onopen = function () {
                            if (sendqueue.length > 0) {
                                for (var msg in sendqueue) {
                                    socket.send(sendqueue[msg]);
                                }
                                sendqueue = [];
                            }
                        };
                        
                        return {
                            send: send,
                            receive: receive,
                            close: socket.close
                        };
                    };
                    
                    this.headers = optionSet.bind(this, 'headers');
                    this.data = optionSet.bind(this, 'data');
                    this.timeout = optionSet.bind(this, 'timeout');
                    this.option = optionSet.bind(this);
                    
                    this.get = ajax.bind(this, 'get');
                    this.post = ajax.bind(this, 'post');
                    this.put = ajax.bind(this, 'put');
                    this.patch = ajax.bind(this, 'patch');
                    this.delete = ajax.bind(this, 'delete');
                    this.http = ajax.bind(this);
                    
                    return this;
                }
            };
            
            return scope.functions;
        }
    };

    Pooty.utility = Pooty.utility || {};
    
    // Resets every non-object value in a model to null
    Pooty.utility.clean = function (model) {
        var cleanModel = $.extend(true, {}, model);
        
        clean(cleanModel);
        
        return cleanModel;
    };
    
    function clean(object) {
        for (var key in object) {
            // Ignore prototypical properties
            if (!object.hasOwnProperty(key)) continue;
            if (typeof object[key] === 'object') {
                clean(object[key]);
            } else {
                object[key] = null;
            }
        }
    }
    
    Pooty.utility.makePathArray = function(path) {
        return path.split('.');
    };
    
    // Traverses an object using a path formatted as 'object.property.subproperty...'
    Pooty.utility.traverse = function (object, path) {
        var value = object;
        for (var key in path) {
            value = value[path[key]];
        }
        return value;
    };
    
    // Changes any property of an object (same path format as above)
    Pooty.utility.mutate = function (object, path, newValue) {
        var last = path.pop();
        Pooty.utility.traverse(object, path)[last] = newValue;
    };
    
    Pooty.utility.getSelector = function (model, path) {
        path = Pooty.utility.makePathArray(path);
        return Pooty.utility.traverse(model, path);
    };

    Pooty.utility.getViewValue = function (selector) {
        return $(selector).text();
    };

    Pooty.utility.setViewValue = function (selector, value) {
        $(selector).text(value);
    };
    
    Pooty.utility.getInputValue = function (selector) {
        return $(selector).val();
    };
    
    Pooty.utility.setInputValue = function (selector, value) {
        $(selector).val(value);
    };
    
    Pooty.utility.getState = function (model, state, path) {
        path = Pooty.utility.makePathArray(path);
        var selector = Pooty.utility.traverse(model, path);
        
        if (typeof selector === 'string') {
            var viewValue = Pooty.utility.getViewValue(selector);
            Pooty.utility.mutate(state, path, viewValue);
            return viewValue;
        } else {
            return Pooty.utility.traverse(state, path);
        }
        
    };
    
    Pooty.utility.setState = function (model, state, path, newValue) {
        path = Pooty.utility.makePathArray(path);
        var selector = Pooty.utility.traverse(model, path);
        Pooty.utility.mutate(state, path, newValue);
        
        if (typeof selector === 'string') {
            Pooty.utility.setViewValue(selector, newValue);
        }
    };

    // Checks an argument's type
    Pooty.utility.check = function (argument, types, fnName) {
        if (!~types.indexOf(typeof argument) || argument === null) {
            Pooty.error('Incorrect parameter',
                        fnName + ' expected an argument of type ' + types.join('||') + ', but instead received: ',
                        argument || 'null');
            return false;
        }
        return true;
    };
        
    Pooty.utility.css = function (css) {
        var head = document.head,
            style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    };

    $(function () {
        // Run all controllers when page is loaded
        for (var controller in Pooty.controllers) {
            // Call the controller with a new controllerScope as the lexical scope
            //  (pass in the determined model, which may be empty)
            Pooty.controllers[controller].call(new Pooty.resource.controllerScope(
                // Automatically connect the model & state, if possible
                Pooty.models[controller] || Pooty.models.universal || {},
                Pooty.state[controller] || Pooty.state.universal || {}
            ));
        }
        
        // Define styles for Pooty elements
        Pooty.utility.css('poot, athlete { display: inline-block; }' + 
                          'poothtml, athletehtml, bucket, ' +
                          'template { display: block; }');
    });

})(window, window.$, window.JSON);