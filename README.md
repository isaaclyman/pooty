# Pooty v0.0 (incomplete)
(Known in more formal contexts as Athlete.js)

## What is Pooty?

Pooty is a dead simple VMC framework for Javascript. It depends on Zepto, jQuery, or any other CSS selector engine which uses the `$` global and has a few simple jQuery-syntaxed DOM manipulation methods. For the best, most lightweight solution, use Zepto.

The **sole purpose** of Pooty is to make it easy for you to describe interactions between your HTML, your Javascript and your API in a sensible, modular, extensible, readable, and somewhat impolite way.

V = View. Stoic, reusable HTML and nothing else. Unpolluted with logic, curly braces, mixed directives, and other code smells.

M = Model. A watchful Javascript object which mirrors your HTML structure (abbreviated somewhat) and tracks the parts of your page that may change for any reason.

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
  <body>
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
  }).poot.model('welcome-message');
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

`Pooty` > `Athlete` (both of these are globals)

`poot` > `deliver`

`<poot>` > `<athlete>`

`<poothtml>` > `<athletehtml>`

`<pootcontainer>` > `<athletecontainer>`

`<poottemplate>` > `<athletetemplate>`

Then rename `pooty.js` to `athlete.js` and you're all set.

The name "Athlete" is chosen in honor of my favorite band. I recommend listening to their *Live at Union Chapel* album on repeat while coding; it will make your code 46% more robust (probably).


# A complete Pooty dictionary

## HTML

Pooty introduces a few new tags and an attribute.

`<poot></poot>` is a tag which has no special qualities; as far as the browser is concerned, it is a `<span>`. Its only purpose is to indicate that the contents are determined by the model. The model interfaces easily with `<poot>` elements. Ideally, you should add a `class` attribute with a highly descriptive name for the `<poot>` so that you'll have an easy time selecting it later.

It is generally a bad idea to put other elements inside of `<poot>` tags.

`<poothtml></poothtml>` is a tag that allows you to inject arbitrary HTML into your page. You should add a `class` attribute to make it easy for the model to select. The *only* appropriate use for this is to format text. For example, you may on occasion need to add `<i>` or `<strong>` tags to messages visible on the page, which is fine. Do *not* use this for templating or for nested HTML structures. Instead, use `<poottemplate>`.

`<pootcontainer></pootcontainer>` is a tag which is useful for displaying array-like information. If you have a list of identical objects somewhere in your model, and each one needs to be displayed in an identical HTML structure, use a `<poot-container>`. If you have a single object which needs to be displayed, use a `<poottemplate>`.

Two attributes are important here: the `insert` attribute, which allows you to specify a template to display for each item in the array, and the `class` attribute, which the model will use to provide data.

`<poottemplate></poottemplate>` is a tag which you can use to define *or* insert a template (a piece of reusable HTML).

If you add a `name` attribute to this tag, it will be interpreted as a template *definition*. The name will identify it for use with the `insert` attribute on the `<pootcontainer>` or `<poottemplate>` tag.

If you add an `insert` attribute to this tag, it will insert the specified template.

## Javascript 

### Pooty (global)

The global `Pooty` object, which you can use at any point after `pooty.js` has been loaded, has the following functions:


#### `model()`:
A home for your data model. The base `key: value` pair is modeled after `property name: CSS selector`. The CSS selector may refer to one or many page elements; Pooty will keep all of them up to date. You may nest these as necessary:

```javascript
{
  head: {
    title: 'span.title',
    user: {
      name: 'span.name',
      age: 'span.age',
      instruments: {
        primary: 'div.instrument .primary',
        secondary: 'div.instrument .secondary',
        fullList: null
      }
    }
  }
}
```

Google 'CSS Selectors' for a number of great tutorials on how to use these.

If an HTML tag is not specified (as in `.primary`), Pooty will look for either a `<poot>` tag or any tag with the `poot` attribute (e.g. `<span poot>`).

Use the model, *not the controller*, to maintain state in your application. For any state information which should not be visible to the user, write `null` in place of a CSS selector. You will be able to change and access the value as normal but it will not attempt to update the view.

The `model()` function can be invoked one of two ways:

- `model(object)` will create One Model to Rule Them All (a "universal" model). This is fine for very simple apps, where only one model is needed. If you invoke the `model()` function again, the first model will be overwritten.

- `model(string)(object)` will create a named model. You can create as many named models as you want, as long as they have different names. Attempting to create a model of the same name twice will overwrite the first one, so be careful.

#### `control()`:
A home for your controller. The syntax is very similar to the `model` function:

- `control(function)` will assign a function as the controller for the entire application, which is fine for simple apps. If you invoke the `control()` function again, the first controller will be overwritten.

- `control(string)(function)` will create a named controller. You can create as many named controllers as you want with different names. If you create a controller with the same name as an earlier one, the earlier one will be overwritten. If the controller has the same exact name as a model, *or* if you are using a universal model, the two will be connected automatically. Otherwise, you'll have to make the connection yourself (see the `loadModel()` function below).

### Controller's lexical scope (`this`)

Inside the controller is where the magic happens. The `this` keyword inside of a controller refers to an object that has the following properties and methods:

`loadModel(string)`: Loads the model with the specified name and connects it to the current controller. Use this only once, and only if needed, at the very top of your controller.

`useModel(string)`: Returns any auxiliary models you may want to use. You may store them in a variable and access them in the same way as your regular model.

`model()` (no parameters): Returns the name of the current model, or `'universal'` if a universal model is being used.

`model(string)`: Searches the current model for the property with the specified name and returns a `model` object, which refers to an HTML tag *for displaying information*, usually a `<poot>` or `<span>` tag. This is rarely useful on its own, and generally begins a series of cascading functions. See below for available methods.

`input(string)`: Searches the current model for the property with the specified name and returns an `input` object, which refers to an `<input>` tag. Like the `model` object, this is rarely useful on its own. See below for available methods.

`button(string)`: Searches the current model for the property with the specified name and returns a `button` object, which refers to a `<button>` tag (or any other element which may be clicked by the user). Again, this is not very useful on its own. See below for available methods.

`url(string)`: Returns a `url` object which can be used for REST methods or websockets. See below for available methods.


### The `model` object

The `model` object refers to HTML elements which are informative (i.e. not interactive) or to state variables. It is obtained by calling `this.model(string)` with a property name from the model, and has the following methods:

`poot()` (no parameters): Returns the current value of this property.

`poot(string [, string2,...stringN])`: Replaces the property's value with the arguments passed in. All the arguments will be joined into a single string, each separated by a single space.


### The `input` object

The `input` object refers to HTML `<input>` elements which accept user input. It is obtained by calling `this.input(string)` with a property name from the model, and has the following properties and methods:

`poot`: A property which can be used to bind all user input to another part of the model.

`poot.model(string)`: The most common implementation of the `poot` property. Makes a permanent binding which will replicate everything typed into the `input` element on another property of the model. Returns a binding object, which has an `off()` method that will destroy the binding.

`validate(function)`: Takes a function, to which is passed all user input. If the function returns a falsy value, no further chained functions will be evaluated.

To get the value of the model property (instead of binding it to another property), use the `model.poot()` method instead. 


### The `button` object

The `button` object refers to any clickable HTML element (most commonly `<button>`). It is obtained by calling `this.button(string)` with a property name from the model, and has the following methods:

`click(function)`: A property which can be used to bind click events to a function which runs on every click. Inside the function, you may call `this.off()` to destroy the binding.

`doubleclick(function)`: Identical to `click(function)`, except that it registers double clicks instead of single clicks.


### The `url` object

The `url` object refers to a static URL string, which can be used for REST methods and websockets. It is obtained by calling `this.url(string)` with an absolute or relative URL. It has the following methods:

`params(object)`: Sets the query parameters for the `url` object, then returns the `url` object for further operations.

`headers(object)`: Sets the request headers for the `url` object, then returns the `url` object for further operations.

`body(object)`: Sets the request body for the `url` object, then returns the `url` object for further operations.

`get()`: Performs a GET request against the URL, using any configuration provided. You can `poot` this to the model (`poot.model(string)`) directly, or just `poot()` it to return a Promise object which will resolve with the response from the API.

`post()`: Performs a POST request against the URL. See `get()`.

`put()`: Performs a PUT request against the URL. See `get()`.

`delete()`: Performs a DELETE request against the URL. See `get()`.

`http(string)`: Performs a miscellaneous request named by the parameter (e.g. `'UPDATE'`, `'JSONP'` or `'OPTIONS'`). See `get()`.

