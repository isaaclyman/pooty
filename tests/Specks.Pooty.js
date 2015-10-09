// Establish the presence of a window
window = window || {};

(function (window, $) {
    
    /*
        DEPENDENCY ON POOTY.JS
    */
    
    if (!window.Pooty) {
        throw new Error('Specks depends on Pooty.js. Please load Pooty.js first.');
    }
    
    /*
        Pooty.test
    */
    
    var successes = 0;
    var failures = 0;
    var failMessages = [];
    var successMessages = [];
    
    Pooty.test = function(component, testFn) {
        testFn.call(testFnScope(component));
        failMessages.push('');
        successMessages.push('');
    };
    
    function testFnScope(component) {
        return {
            should: should.bind({
                component: component
            })
        };
    }
        
    function should(expectation) {
        return {
            byPassing: byPassing.bind({
                component: this.component,
                expectation: expectation
            })
        };
    }
        
    function byPassing(spec) {
        if (typeof spec === 'function') {
            !!spec() ? succeed(this.component, this.expectation) : fail(this.component, this.expectation);
        } else {
            !!spec ? succeed(this.component, this.expectation) : fail(this.component, this.expectation);
        }
    }
    
    function succeed(component, expectation) {
        successMessages.push('SUCCESS: ' + component + ' DID ' + expectation + '.');
        successes++;
    }
    
    function fail(component, expectation) {
        failMessages.push('FAIL: ' + component + ' DID NOT ' + expectation + '.');
        failures++;
    }
    
    $(function () {
        $('#test-results').append('<br>' + successes + ' passed.');
        $('#test-results').append('<br>' + failures + ' failed.');
        failMessages.forEach(function(message) {
            $('#test-failures').append('<br>' + message);
        });
        successMessages.forEach(function (message) {
            $('#test-successes').append('<br>' + message);
        });
    });

})(window, window.$);