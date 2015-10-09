/*
    GLOBAL
*/
Pooty.test('global variable', function () {
    this.should('have a models object').byPassing(Pooty.models && typeof Pooty.models === 'object');
    this.should('have a controllers object').byPassing(Pooty.controllers && typeof Pooty.controllers === 'object');
    this.should('have a state object').byPassing(Pooty.state && typeof Pooty.state === 'object');
    this.should('have a functions object').byPassing(Pooty.fns && typeof Pooty.fns === 'object');
    this.should('have a templates object').byPassing(Pooty.templateUrls && Array.isArray(Pooty.templateUrls));
});

/*
    POOTY.MODEL()
*/
Pooty.test('model function', function () {
    this.should('create a universal model and state').byPassing(function () {
        Pooty.model({
            property: 'test'
        });
        return (
            Pooty.models.universal &&
            Pooty.models.universal.property === 'test' &&
            Pooty.state.universal &&
            Pooty.state.universal.property === null
        );
    });
    
    this.should('create two named models and states').byPassing(function () {
        Pooty.model('first')({
            property1: 'test1'
        });
        Pooty.model('second')({
            property2: 'test2'
        });
        return (
            Pooty.models.first &&
            Pooty.models.first.property1 === 'test1' &&
            Pooty.state.first.property1 === null &&
            
            Pooty.models.second &&
            Pooty.models.second.property2 === 'test2' &&
            Pooty.state.second.property2 === null
        );
    });
});

/*
    POOTY.CONTROLLER()
*/
Pooty.test('controller function', function () {
    this.should('create a universal controller').byPassing(function () {
        Pooty.controller(function () {});
        return (
            Pooty.controllers.universal
        );
    });
    
    this.should('create two named controllers').byPassing(function () {
        Pooty.controller('first')(function () {});
        Pooty.controller('second')(function () {});
        return (
            Pooty.controllers.first &&
            Pooty.controllers.second
        );
    });
});

/*
    POOTY.UTILITY
*/