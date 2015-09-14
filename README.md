# Pooty v0.0 (incomplete)
(Known in more formal contexts as Athlete.js)

## What is Pooty?

Pooty is a dead simple VMC framework for Javascript. It depends on Zepto or jQuery.

The **sole purpose** of Pooty is to make it easy for you to describe interactions between your HTML, your Javascript and your API in a smart, readable, and somewhat impolite way. It uses a unique VMC pattern:

V = View. Stoic, reusable HTML and nothing else. Unpolluted with logic, curly braces, mixed directives, and other code smells.

M = Model. A vigilant Javascript object which mirrors your HTML structure (abbreviated somewhat) and tracks the parts of your page that may change for any reason.

C = Controller. A blueprint that describes how to receive changes from the model or the server, enlighten them with logic, and send them in return to the model or the server.

Pooty is built to be:

- **Light**. It's a framework, not a buffet. Add on just the tools and services you need, instead of carrying around 30 kilobytes of stuff you'll never use.
- **Surgical**. You know when things need to change. Instead of suffering through a massive dirty-check every time something happens, just tell Pooty what to do and when to do it. It's driven by events, not by the system clock.
- **Connected**. `input` elements talk to the model, the model talks to the view, and the controller totally makes out with the model and the API. It's a pretty good party.
- **Functional**. Pooty encourages you to describe processes and connections instead of micro-managing your application state.
- **Attractive**. I like cascading functions and so do you.
- **Simple**. Learning to `poot()` is easier than falling over. And less painful.

## Example plz

Here's your first app.

**index.html:**

```html
<html>
  <head>
    <!-- Put this at the head or tail of your document -->
    <script type="text/javascript" src="zepto.min.js" />
    <script type="text/javascript" src="pooty.js" />
    <script type="text/javascript" src="welcomeMessage.model.js" />
    <script type="text/javascript" src="welcomeMessage.control.js" />
  </head>
  <body
    <div class="nudge-down center">
      <!-- A simple node with text we can update. -->
      <poot class="welcome-msg"></poot>
    </div>
    <div class="nudge-down center">
      <!-- An input we can bind to our model. -->
      <input poot class="new-msg" type="text" placeholder="New Message"/>
    </div>
  </body>
</html>
```

**index.css:** (is your first app gonna be ugly? Heck no.)

```css
body {
  color: #444;
}

.nudge-down {
  margin-top: 12px;
}

.center {
  text-align: center;
}
```

**welcomeMessage.model.js:**

```javascript
// Welcome Message model
Pooty.model('Welcome Message')({
  'welcome-message': '.welcome-msg',
  'new-msg': '.new-msg'
});
```

**welcomeMessage.control.js:**

```javascript
// Welcome Message controller
Pooty.control('Welcome Message')(function () {
  // You can put a message on the page this way, with a simple string
  var message = 'Hellooooooo Tina!';
  this.model('welcome-message').poot(message);

  // Or this way, with a REST API and AJAX
  /*
  this.url('/message').get().poot.model('welcome-message');
  */

  // Or this way, with a REST API, AJAX and a failsafe
  /*
  this.url('/message').get().poot().success(function (message) {
    this.model('welcome-message').poot(message);
  }).failure(function (error) {
    this.model('welcome-message').poot('Something really bad has happened.', error);
  });
  */

  // Or this way, with a WebSocket
  /*
  this.url('/message-ws').websocket().poot.model('welcome-message');
  */

  // Or this way, with the input on the page bound to the message
  /*
  this.input('new-msg').poot.model('welcome-message');
  */

  // Or this way, with a validated input bound to the message
  /*
  this.input('new-msg').validate(function (message) {
    if (message.length > 140) {
      this.model('welcome-message').poot('This message is too long.');
      return false;
    }
    return true;
  }).success(function (message) {
    this.model('welcome-message').poot(message);
  });
  */

  // And when you need to send a value somewhere...
  /*
  var current = this.model('welcome-message').poot();
  this.url('/database').post(current);
  */
});
```

Since this is a v0.0 code base, expect everything in this documentation to change at any moment.

## "Athlete" alias

If you find the word "poot" offensive, you may use the following aliases in your code.

Javascript:

`Pooty` > `Athlete` (both of these are globals)

`poot` > `yield`

HTML:

`<poot>` > `<athlete>`

`poot` (HTML attribute) > `athlete`

`<poothtml>` > `<athletehtml>`

Then rename `pooty.js` to `athlete.js` and you're all set.

The name "Athlete" is chosen in honor of my favorite band. I recommend listening to their *Live at Union Chapel* album on repeat while coding; it will make your code 46% more robust (probably).


# A complete Pooty dictionary

## HTML

Pooty introduces a few new tags and an attribute.

`<poot></poot>` is a tag which has no special qualities; as far as the browser is concerned, it is a `<span>`. Its only purpose is to indicate that the contents are determined by the model. Ideally, you should add a `class` attribute with a highly descriptive name for the `<poot>` so that you'll have an easy time selecting it later.

It is generally a bad idea to put other elements inside of `<poot>` tags.

As an alternative to the `<poot>` tag, you may add the `poot` attribute to any HTML tag to provide the same semantic meaning.

`<poothtml></poothtml>` is a tag that allows you to inject arbitrary HTML into your page. You should add a `class` attribute to make it easy for the model to select. The *only* appropriate use for this is to format text. For example, you may on occasion need to add `<i>` or `<strong>` tags to messages visible on the page, which is fine. Do *not* use this for templating or for nested HTML structures. Instead, use `<poottemplate>`.

`<bucket></bucket>` is a tag which is useful for displaying array-like information. If you have a list of identical objects somewhere in your model, and each one needs to be displayed in an identical HTML structure, use a `<bucket>`. If you have a single object which needs to be displayed, use a `<template>`.

Two attributes are important here: the `insert` attribute, which allows you to specify a template to display for each item in the array, and the `class` attribute, which the model will use to provide data.

`<template></template>` is a tag which you can use to define *or* insert a template (a piece of reusable HTML).

If you add a `name` attribute to this tag, it will be interpreted as a template *definition*. The name will identify it for use with the `insert` attribute on a `<pootcontainer>` tag or a different `<poottemplate>` tag.

If you add an `insert` attribute to this tag, it will insert the specified template.

## Javascript 

### Pooty (global)

The global `Pooty` object, which you can use at any point after `pooty.js` has been loaded, has the following functions:


#### `model()`:
A home for your data model. The base `key: value` pair is modeled after `property name: CSS selector`. Property names may not contain spaces; use a dash instead. CSS selectors may refer to one or many page elements, and Pooty will keep all of them up to date. You may nest these as necessary:

```javascript
{
  head: {
    title: 'span[poot].title',
    user: {
      name: 'poot.name',
      age: 'poot.age',
      instruments: {
        primary: 'div.instrument poot.primary',
        secondary: 'div.instrument poot.secondary',
        fullList: null
      }
    },
    favoriteArtists: [{
        name: 'poot.artist-name',
        born: 'poot.artist-birth',
        died: 'poot.artist-death',
        famousFor: 'poot.famous-for'
    }]
  }
}
```

Nested elements are accessed like this: `this.model('user.instruments.primary')`.

Google 'CSS Selectors' for a number of great tutorials on how to use these. They are plugged directly into jQuery or Zepto to find the element you want, so you can use any selectors your chosen library supports.

For arrays of data, add an array *with a single element* (an object), which will represent the model for each element in the array. In the example above, you can see that a list of favorite artists is going to be displayed on the page. A `<pootcontainer>` HTML element on the page should reference a template which contains at least four elements: `<poot class="artist-name">`, `<poot class="artist-birth">`, `<poot class="artist-death">`, and `<poot class="famous-for">`. You can use nested arrays where necessary.

Use the model, *not the controller*, to maintain state in your application. For any state information which should not be visible to the user, write `null` in place of a CSS selector. You will be able to change and access the value as normal but it will not attempt to update the view.

The `model()` function can be invoked one of two ways:

- `model(object Model)` will create One Model to Rule Them All (a "universal" model). This is fine for very simple apps, where only one model is needed. If you invoke the `model()` function again, the first model will be overwritten.

- `model(string ModelName)(object Model)` will create a named model. You can create as many named models as you want, as long as they have different names. Attempting to create a model of the same name twice will overwrite the first one, so be careful. Creating a model with the name "universal" will overwrite a universal model.

#### `control()`:
A home for your controller. The syntax is very similar to the `model` function:

- `control(function ControllerFn)` will assign a function as the controller for the entire application, which is fine for simple apps. If you invoke the `control()` function again, the first controller will be overwritten.

- `control(string ControllerName)(function ControllerFn)` will create a named controller. You can create as many named controllers as you want with different names. If you create a controller with the same name as an earlier one, the earlier one will be overwritten. If the controller has the same exact name as a model, *or* if you are using a universal model, the two will be connected automatically. Otherwise, you'll have to make the connection yourself (see the `loadModel()` function below).

### Controller's lexical scope (`this`)

Inside the controller is where the magic happens. The `this` keyword inside of a controller refers to an object that has the following properties and methods:

`loadModel(string ModelName)`: Loads the model with the specified name and connects it to the current controller. Use this only once, and only if needed, at the very top of your controller.

`useModel(string ModelName)`: Returns any auxiliary model you may want to use. You may store it in a variable and access it in the same way as your regular model, like so:

```javascript
var otherModel = this.useModel('otherModel`);
otherModel('model-property').poot('A new value');
```

`model()` (no parameters): Returns the name of the current model, or `'universal'` if a universal model is being used.

`model(string ModelProperty)`: Searches the current model for the property with the specified name and returns a `model` object, which refers to an HTML tag *for displaying information*, usually a `<poot>` or `<span>` tag. This is rarely useful on its own, and generally begins a series of cascading functions. See below for available methods.

`input(string ModelProperty)`: Searches the current model for the property with the specified name and returns an `input` object, which refers to an `<input>` tag. Like the `model` object, this is rarely useful on its own. See below for available methods.

`button(string ModelProperty)`: Searches the current model for the property with the specified name and returns a `button` object, which refers to a `<button>` tag (or any other element which may be clicked by the user). Again, this is not very useful on its own. See below for available methods.

`url(string Url)`: Returns a `url` object which can be used for REST methods or websockets. See below for available methods.


### The `model` object

The `model` object refers to HTML elements which are informative (i.e. interactivity is irrelevant for the current operation) or to state variables. It is obtained by calling `this.model(string)` with a property name from the model, and has the following methods:

`poot()` (no parameters): Returns the current value of this property.

`poot(string [, string2,...stringN])`: Replaces the property's value with the arguments passed in. All the arguments will be joined into a single string, each separated by a single space.


### The `input` object

The `input` object refers to HTML `<input>` elements which accept user input. It is obtained by calling `this.input(string)` with a property name from the model, and has the following properties and methods:

`poot`: A property which can be used to bind all user input to another part of the model.

`poot.model(string ModelProperty)`: The most common implementation of the `poot` property. Makes a permanent binding which will replicate everything typed into the `input` element on another property of the model. Returns a binding object, which has an `off()` method that will destroy the binding.

`validate(function ValidationFn)`: Takes a function, to which is passed all user input. You can chain a `success(function)` method to this, which will run if your validation function returns a truthy value, or will be skipped if it returns a falsy value. The function passed to `success()` will be called with the user input value. Both `validate()` and `success()` return a binding object, which has an `off()` method that will destroy the binding.

To get the value of the model property (instead of binding it to another property), use the `model.poot()` method instead. 


### The `button` object

The `button` object refers to any clickable HTML element (most commonly `<button>`). It is obtained by calling `this.button(string)` with a property name from the model, and has the following methods:

`click(function HandlerFn)`: A property which can be used to bind click events to a function which runs on every click. Inside the function, you may call `this.off()` to destroy the binding.

`doubleclick(function HandlerFn)`: Identical to `click(function)`, except that it registers double clicks instead of single clicks.


### The `url` object

The `url` object refers to a static URL string, which can be used for REST methods and websockets. It is obtained by calling `this.url(string Url)` with an absolute or relative URL. It has the following methods:

`headers(object HeaderObj)`: Sets the request headers for the `url` object, then returns the `url` object for further operations.

`data(object DataObj)`: Sets the request body (or query parameters, in the case of `get` requests) for the `url` object, then returns the `url` object for further operations.

`timeout(number Timeout)`: Sets the timeout of a request in milliseconds for the `url` object, then returns the `url` object for further operations.

`option(string OptionName, value OptionValue)`: Sets the value of any configuration option for the `url` object, which will be passed to the `$.ajax()` function from jQuery or Zepto. Chain as many of these together as needed. Returns the `url` object for further operations.

`get()`: Performs a GET request against the URL, using any configuration provided. You can `poot` the response to the model (`...get().poot.model(string ModelProperty)`) directly, or just `...get().poot()` it to return a Promise object which will resolve with the response from the API.

`post()`: Performs a POST request against the URL. See `get()`.

`put()`: Performs a PUT request against the URL. See `get()`.

`delete()`: Performs a DELETE request against the URL. See `get()`.

`http(string Method)`: Performs a miscellaneous request named by the parameter (e.g. `'UPDATE'` or `'OPTIONS'`). See `get()`. You may optionally include an options object with properties like `timeout`, `async`, `username`, and `password` (see jQuery or Zepto for a complete list of available options).

`websocket(string||[string] Protocol)`: Open a websocket connection with the specified URL, using an optional protocol name. Pooty will throw an error if the `window.WebSocket` object does not exist, so for best results, check for its existence before using it. Returns a `websocket` object. See below for use.


### The `websocket` object

The `websocket` object refers to an open websocket connection, which can be used to send and receive event-driven data asynchronously. It has the following methods:

`send(string||object||Blob||ArrayBuffer data)`: Sends data to the server using the websocket connection. JSON data sent this way will be stringified. If the connection is not yet successful, the data will be queued and sent when a connection is available.

`receive(function HandlerFn)`: Provides a handler for any data sent from the server to the client using the websocket connection. Calling `this.close()` inside of the handler function will close the websocket connection.

`close()`: Closes the websocket connection.


# Other functions you may use

`Pooty.utility.check(var, [string], string)`: Accepts a variable, an array of `typeof` strings, and a function signature as a string. Asserts that the variable type matches at least one of the `typeof` strings, and throws an error if it doesn't. Uses the function signature as part of the error message. Use this to implement type safety in your app.

# Technical Q&A

Q: I've noticed you're not using an automated build system, like Grunt or Gulp.

A: Yeah. That's because I hate them.

Q: Why do you call Pooty a VMC instead of an MVC like everybody else?

A: Most MVC's are really just VC's. The model either doesn't exist, or the developer doesn't have any control over it. If it does exist, it's generally bloated with all kinds of extraneous data and is very difficult to sift through. VMC is also a more correct description of what Pooty is doing. The interactions are like this: `V <-> M <-> C`. The Controller doesn't interact with the View or vice versa. Instead, they both interact with the Model. Since you create the Model yourself, you have a very clear idea about what data is being exchanged.

Q: Why should I use Pooty instead of Angular?

A: I don't totally hate Angular, and for extremely large-scale apps that need to do *everything*, Angular works. But for simple apps, it's got too much boilerplate. You can't write an Angular app in an hour. Pooty is a lot simpler. You can wire up a server-to-view connection in minutes. Also, Pooty encourages a functional programming style; application state is maintained by processes you describe, not by your own micromanagement. Angular, on the other hand, makes you maintain a complicated `$scope` variable and an abstruse prototype chain. If that's your cup of tea, great; otherwise, Pooty might make your life a bit easier.

Q: Why should I use Pooty instead of Meteor?

A: I love Meteor. It's a beautiful system. Again, though, Pooty is simpler. The main things you want to do when building an app are 1) Get stuff from the API to the view, 2) Get user input to the API, and 3) Allow parts of the view to manipulate each other. Voila, that's all Pooty does. Wish granted. It lets you specify what kind of bindings you want and when you want them, instead of assuming that all your data is bound three ways.