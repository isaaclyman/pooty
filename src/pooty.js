// Establish the presence of a window
window = window || {};

(function () {
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
        if (typeof modelname === 'string') {
            return function (model) {
                if (!model || typeof model !== 'object') {
                    return Pooty.error('Incorrect parameters', 'Called model()(object) with incorrect parameters:', model);
                }
                
                Pooty.models = Pooty.models || {};
                Pooty.models[modelname] = Pooty.utility.flattenModel(model);
                
                Pooty.state = Pooty.state || {};
                Pooty.state[modelname] = Pooty.utility.clean(model);
            };
        } else if (typeof modelname === 'object') {
            Pooty.models = Pooty.models || {};
            Pooty.models.universal = modelname;
        } else {
            Pooty.error('Incorrect parameters', 'Called model(string || object) with incorrect parameters:', modelname);
        }
    };
    
    // Function for controller creation
    //@param controlname: A name for the controller
    // returns a function that takes the controller function as its parameter.
    //  OR
    //@param controlname: A universal controller function
    Pooty.control = function (controllername) {
        if (typeof controllername === 'string') {
            return function (controllerFn) {
                if (!controllerFn || typeof controllerFn !== 'function') {
                    return Pooty.error('Incorrect parameters', 'Called control()(function) with incorrect parameters:', controllerFn);
                }
                
                Pooty.controllers = Pooty.controllers || {};
                Pooty.controllers[controllername] = controllerFn;
            }
        } else if (typeof controllername === 'function') {
            Pooty.controllers = Pooty.controllers || {};
            Pooty.controllers.universal = controllername;
        } else {
            Pooty.error('Incorrect parameters', 'Called control(string || function) with incorrect parameters:', controllername);
        }
    };
    
    Pooty.resource = {
        controllerScope: function (mainModel) {
            return {
                loadModel: function (name) {
                    var newModel = Pooty.models[name];
                    if (!newModel) {
                        return Pooty.error('No model found', 'Could not find a model with the name:', name);
                    }
                    mainModel = newModel;
                },
                useModel: function (name) {
                    var newModel = Pooty.models[name];
                    if (!newModel) {
                        return Pooty.error('No model found', 'Could not find a model with the name:', name);
                    }
                    return Pooty.resource.controllerScope(newModel).model;
                },
                model: function (property) {
                    if (!property || typeof property !== 'string') {
                        return Pooty.error('Incorrect parameters', 'Called model(string) with incorrect parameters:', property);
                    }

                    var selector = Pooty.utility.getModelValue(model, property);
                    
                    return {
                        poot: function () {
                            if (!arguments.length) {
                                return Pooty.utility.getViewValue(selector);
                            }
                            Pooty.utility.setViewValue(selector, Array.prototype.join.call(arguments, ' '));
                        }
                    }
                },
                input: function (property) {
                    
                },
                button: function (property) {
                
                },
                url: function (url) {
                
                }
            };
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
                    continue;
                }
                switch (typeof model[key]) {
                    case 'object':
                        clean(model[key]);
                        break;
                    default:
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

})();