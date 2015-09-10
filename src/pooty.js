// Establish the presence of a window
window = window || {};

(function (window, $) {
    // Create Pooty as a global which executes the report() function
    //  (useful as we create the default functionality later)
    var Pooty = window.Pooty = window.Athlete = function () {
        return Pooty.report ? Pooty.report() : null;
    };
    
    // Error reporter
    //@param title: A brief title for the error
    //@param description: A full description of the error
    //@param details: Any relevant program data (an object, array or value)
    Pooty.error = function (title, description, details) {
        console.error(title + ': ' + description);
        details && console.error(details);
    };
    
    // Assert that jQuery or Zepto is loaded
    if (!window.$) {
        Pooty.error('Missing dependency', 'Pooty requires jQuery or Zepto. Please include one of these.');
        return null;
    }
    
    // Function for data model creation
    //@param modelname: A name for the model
    // returns a function that takes the model as its parameter.
    //  OR
    //@param modelname: A universal model
    Pooty.model = function (modelname) {
        Pooty.utility.check(modelname, ['string', 'object'], 'Pooty.model()') || return;
        if (typeof modelname === 'string') {
            return function (model) {
                Pooty.models = Pooty.models || {};
                Pooty.models[modelname] = model;
                
                Pooty.state = Pooty.state || {};
                var newState = {};
                $.extend(true, newState, model);
                Pooty.state[modelname] = Pooty.utility.clean(newState);
            };
        } else if (typeof modelname === 'object') {
            Pooty.models = Pooty.models || {};
            Pooty.models.universal = modelname;
        }
    };
    
    // Function for controller creation
    //@param controlname: A name for the controller
    // returns a function that takes the controller function as its parameter.
    //  OR
    //@param controlname: A universal controller function
    Pooty.control = function (controllername) {
        Pooty.utility.check(controllername, ['string', 'function'], 'Pooty.control()') || return;
        if (typeof controllername === 'string') {
            return function (controllerFn) {
                Pooty.controllers = Pooty.controllers || {};
                Pooty.controllers[controllername] = controllerFn;
            }
        } else if (typeof controllername === 'function') {
            Pooty.controllers = Pooty.controllers || {};
            Pooty.controllers.universal = controllername;
        }
    };
    
    Pooty.resource = {
        controllerScope: function (mainModel) {
            var scope = this;
            scope.functions = {
                loadModel: function (name) {
                    Pooty.utility.check(name, ['string'], 'this.loadModel()') || return;
                    var newModel = Pooty.models[name];
                    if (!newModel) {
                        return Pooty.error('No model found', 'Could not find a model with the name:', name);
                    }
                    scope.mainModel = newModel;
                },
                useModel: function (name) {
                    Pooty.utility.check(name, ['string'], 'this.useModel()') || return;
                    var newModel = Pooty.models[name];
                    if (!newModel) {
                        return Pooty.error('No model found', 'Could not find a model with the name:', name);
                    }
                    return Pooty.resource.controllerScope(newModel).model;
                },
                model: function (property) {
                    Pooty.utility.check(property, ['string'], 'this.model()') || return;
                    var selector = Pooty.utility.getModelValue(scope.mainModel, property);
                    
                    return {
                        poot: function () {
                            if (!arguments.length) {
                                return Pooty.utility.getViewValue(selector);
                            }
                            Pooty.utility.setViewValue(selector, Array.prototype.join.call(arguments, ' '));
                        },
                        yield: function () {
                            return this.poot.apply(this, arguments);
                        }
                    }
                },
                input: function (property) {
                    Pooty.utility.check(property, ['string'], 'this.input()') || return;
                    var selector = Pooty.utility.getModelValue(scope.mainModel, property);
                    
                    return {
                        poot: {
                            model: function (targetProperty) {
                                Pooty.utility.check(targetProperty, ['string'], 'this.input().poot.model()') || return;
                                var targetSelector = Pooty.utility.getModelValue(scope.mainModel, targetProperty);
                                var handler = function () {
                                    scope.functions.model(selector).poot($(selector).val());
                                };
                                $(selector).on('keyup', null, handler);
                                
                                return {
                                    off: function () {
                                        $(selector).off('keyup', null, handler);
                                    }
                                }
                            }
                        },
                        validate: function validate(validFn) {
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
                            
                            return {
                                off: off,
                                success: function (successFn) {
                                    validated ? successFn($(selector).val()) : null;
                                    return {
                                        off: off
                                    }
                                }
                            }
                        }
                    };
                },
                button: function (property) {
                    Pooty.utility.check(property, ['string'], 'this.button()') || return;
                    var selector = Pooty.utility.getModelValue(scope.mainModel, property);
                    
                    var bind = function (handler, type) {
                        var off = {};
                        handler = handler.bind(off);
                        off.off = function () {
                            $(selector).off(type, null, handler);
                        };

                        $(selector).on(type, null, handler);
                    };
                    
                    return {
                        click: function (handler) {
                            bind(handler, 'click');
                        },
                        doubleclick: function (handler) {
                            bind(handler, 'dblclick');
                        }
                    };
                },
                url: function (url) {
                    Pooty.utility.check(url, ['string'], 'this.url()') || return;
                    var urlObj = this;
                    
                    this.params = null;
                    this.headers = null;
                    this.body = null;
                    
                    return {
                        params: function (paramsObj) {
                            urlObj.params = paramsObj;
                        },
                        headers: function (headersObj) {
                            urlObj.headers = headersObj;
                        },
                        body: function (bodyObj) {
                            urlObj.body = bodyObj;
                        },
                        get: function () {

                        },
                        post: function () {},
                        put: function () {},
                        delete: function () {},
                        http: function (method) {},
                    };
                }
            };
            
            return scope.functions;
        }
    };
    
    Pooty.utility = {
        // Resets every value in a model to null or []
        clean: function clean(model) {
            for (var key in model) {
                // Ignore prototypical properties
                if (!model.hasOwnProperty(key)) continue;
                if (Array.isArray(model[key])) {
                    model[key] = [];
                } else if (typeof model[key] === 'object') {
                    clean(model[key]);
                } else {
                    model[key] = null;
                }
            }
        },
        
        // Gets a (possibly nested) value from the model
        getModelValue: function (model, path) {
            path = path.split('.');
            var value = model;
            for (var key in path) {
                value = value[path[key]];
            }
            return value;
        },
        
        getViewValue: function (selector) {
            return $(selector).text();
        },
        
        setViewValue: function (selector, value) {
            $(selector).text(value);
        },
        
        // Checks an argument's type
        check: function (argument, types, fnName) {
            if (!~types.indexOf(typeof argument) || argument === null) {
                Pooty.error('Incorrect parameter',
                            fnName + ' expected an argument of type ' + types.join('||') + ', but instead received:',
                            argument);
                return false;
            }
            return true;
        }
    };
    
    Pooty.report = function () {
        return {
            modelTemplate: Pooty.models,
            modelValues: Pooty.state,
            controllers: Pooty.controllers
        }
    };
    
    // Run all controllers when page is loaded
    $(function () {
        for (var controller in Pooty.controllers) {
            // Call the controller with a new controllerScope as the lexical scope
            //  (pass in the determined model, which may be empty)
            Pooty.controllers[controller].call(Pooty.resource.controllerScope(
                // Automatically connect the model, if possible
                Pooty.models[controller] || Pooty.models.universal || {}
            ));
        }
    });

})(window, $);