window = window || {};

(function () {
    window.Pooty = window.Pooty || function () {};
    var Pooty = window.Pooty;
    
    Pooty.model = function (modelname) {
        if (typeof modelname === 'string') {
            return function (model) {
                Pooty.modeler = {};
                Pooty.modeler[modelname] = model;
            };
        } else if (typeof modelname === 'object') {
            Pooty.modeler = {
                solo: modelname
            };
        }
    };
    
    
})();
