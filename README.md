# Pooty v0.0 (incomplete)
(Known in more formal contexts as Athlete.js)

## What is Pooty?

Pooty is a dead simple VMC framework for Javascript.

The **sole purpose** of Pooty is to make it easy for you to describe interactions between your HTML, your Javascript and your API in a sensible, modular, extensible, readable, and somewhat impolite way.

V = View. Stoic, reusable HTML and nothing else. Unpolluted with logic, curly braces, mixed directives, and other code smells.

M = Model. A watchful Javascript object which mirrors your HTML structure (abbreviated somewhat) and tracks the parts of your page that may change for any reason.

C = Controller. A blueprint that describes how to receive changes from the model or the server, enlighten them with logic, and send them in return to the model or the server.

Pooty is built to be:

- **Light**. It's a framework, not a buffet. Add on just the tools and services you need, instead of carrying around 30 kilobytes of stuff you'll never use.
- **Surgical**. You know when things need to change. Instead of suffering through a massive dirty-check every time something happens, just tell Pooty what to do and when to do it. It's driven by events, not by the system clock.
- **Connected**. `input` elements talk to the model, the model talks to the view, and the controller totally makes out with the model and the API. It's a pretty good party.
- **Attractive**. I like cascading functions and so do you.
- **Simple**. Learning to `poot()` is easier than falling over. And less painful.

## Example plz

Here's your first app.

**index.html:**

    <html>
      <head>
        <!-- Put this at the head or tail of your document -->
        <script type="text/javascript" src="pooty.js" />
        <script type="text/javascript" src="index.model.js" />
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

**index.css:** (is your first app gonna be ugly? Heck no.)

    body {
      color: #444;
    }
    
    .nudge-down {
      margin-top: 12px;
    }
    
    .center {
      text-align: center;
    }

**index.model.js:**

    Pooty.model({
      'welcome-message': '.welcome-msg',
      'new-msg': '.new-msg'
    });

**welcomeMessage.control.js:**

    // Welcome Message controller
    Pooty.control('Welcome Message')(function () {
      // You can put a message on the page this way, with a simple string
      var message = 'Hellooooooo Tina!';
      this.model('welcome-message').poot(message);
      
      // Or this way, with a REST API and AJAX
      this.url('/message').get().poot.model('welcome-message');
      
      // Or this way, with a REST API, AJAX and a failsafe
      this.url('/message').get().success(function (message) {
        this.model('welcome-message').poot(message);
      }).failure(function (error) {
        this.model('welcome-message').poot('Something really bad has happened.', error);
      });

      // Or this way, with a WebSocket
      this.url('/message-ws').websocket().poot.model('welcome-message');

      // Or this way, with the input on the page bound to the message
      this.input('new-msg').poot.model('welcome-message');
      
      // Or this way, with a validated input
      this.input('new-msg').validate(function (message) {
        if (message.length > 140) {
          this.model('welcome-message').poot('This message is too long.');
          return false;
        }
        return true;
      }).poot.model('welcome-message');
      
      // And when you need to send a value somewhere...
      var current = this.model('welcome-message').poot();
      this.url('/database').post(current);
    });

If this isn't enough to get you started, documentation is forthcoming.

## "Athlete" alias

If you find the word "poot" offensive, you may use the following aliases in your code.

`Pooty` > `Athlete` (both of these are globals)

`poot` > `deliver`

Then rename `pooty.js` to `athlete.js` and you're all set.

The name "Athlete" is chosen in honor of my favorite band. I recommend listening to their *Live at Union Chapel* album on repeat while coding; it will make your code 46% more robust (probably).