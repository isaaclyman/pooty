# Pooty Time v0.0 (incomplete)
(Known in more formal contexts as Athlete.js)

## What is Pooty Time?
Pooty Time is a dead simple VMC framework for Javascript.

V = View. Stoic, reusable HTML and nothing else. Unpolluted with logic, curly braces, mixed directives, and other code smells.

M = Model. A watchful Javascript object which mirrors your HTML structure (abbreviated somewhat) and tracks the parts of your page that may change for any reason.

C = Controller. A blueprint that describes how to receive changes from the model or the server, enlighten them with logic, and send them in return to the model or the server.

Pooty Time is built to be:

- **Light**. It's a framework, not a buffet. Add on just the tools and services you need, instead of carrying around 30 kilobytes of stuff you'll never use.
- **Surgical**. You know when things need to change. Instead of suffering through a massive dirty-check every time something happens, just tell Pooty Time when and how to act.
- **Connected**. `input` elements talk to the model, the model talks to the view, and the controller totally makes out with the model and the API. It's a pretty good party.
- **Attractive**. I like cascading functions and so do you.
- **Simple**. Learning to `poot()` is easier than falling over. And less painful.
- **Satisfying**. Enough said.

## Example plz

Here's your first app.

**index.html:**

    <html>
      <head>
        <!-- Put this at the head or tail of your document -->
        <script type="text/javascript" src="pootytime.js" />
        <script type="text/javascript" src="index.model.js" />
        <script type="text/javascript" src="index.control.js" />
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

**index.control.js:**

    // Welcome Message controller
    Pooty.control(function () {
      // You can put a message on the page this way, with a simple string
      var message = 'Hellooooooo Tina!';
      this.model('welcome-message').poot(message);
      
      // Or this way, with a REST API and AJAX
      this.url('/message').get().pootAt.model('welcome-message');
      
      // Or this way, with a REST API, AJAX and a failsafe
      this.url('/message').get().success(function (message) {
        this.model('welcome-message').poot(message);
      }).failure(function (error) {
        this.model('welcome-message').poot('Something really bad has happened.', error);
      });

      // Or this way, with a WebSocket
      this.url('/message-ws').websocket().pootAt.model('welcome-message');

      // Or this way, with the input on the page bound to the message
      this.input('new-msg').pootAt.model('welcome-message');
      
      // Or this way, with a validated input
      this.input('new-msg').validate(function (message) {
        if (message.length > 140) {
          this.model('welcome-message').poot('This message is too long.');
          return false;
        }
        return true;
      }).pootAt.model('welcome-message');
      
      // And when you need to send a value somewhere...
      var current = this.model('welcome-message').poot();
      this.url('/database').post(current);
    });

If this isn't enough to get you started, documentation is forthcoming.