# Specks

Specks is the Pooty test runner. It is very small. The API is as follows:

`Pooty.test(string ComponentName, function TestFunction)`: Runs the TestFunction, using the arbitrary string ComponentName to provide debugging information if the test fails.

Inside of the TestFunction, the lexical scope (`this`) has the following methods:

`this.should(string Expectation).byPassing(expression || function SpecFunction)`: Evaluates the expression or runs the SpecFunction. If the result is truthy, the spec passes. If it is falsy, the spec fails and it uses the arbitrary string Expectation to provide debugging information.