# Node.js Box SDK

Node.js module for both [Box.com Content API](https://box-content.readme.io/) & [Box.com View API](https://box-view.readme.io/)

This module interacts with the Box Content and View APIs.  The Node.js Box SDK module returns the data requested as well as an encrypted string containing the Box Access Token and Box Refresh Token.  

It abstracts away some of the complexity in regards to updating the Box Token upon expiration.  However, provides flexibility for the developer to handle the Box callback and storage of the encrypted Box Token on a user by user basis.  

Examples of how to integrate this module in Express & Hapi are shown below.  The examples provided show how to attach the node-box-sdk to the server object and then set the return token as a cookie.

### Status
#####Content API

 - Authentication - Completed
 - Folders - Completed
 - Files - Partially Complete - In Progress
 - Shared Items - Completed
 - All Additional Methods - In Progress

#####View API

 - Document - Partially Complete - In Progress
 - Sessions - Partially Complete - In Progress
 - All Additional Methods - In Progress

### Install
    npm install node-box-sdk
   
### Configure
    box.configure({
      client_id: 'content_api_client_id',
      client_secret: 'content_api_client_secret',
      api_key: 'view_api_client_secret',
      encrypt: { password: 'pick_a_password' }
    });
    
### Express Use Example
[Using node-box-sdk inside Express](https://github.com/cydneymikel/node-box-sdk/tree/master/examples/express)

### Hapi Use Example
[Using node-box-sdk inside Hapi](https://github.com/cydneymikel/node-box-sdk/tree/master/examples/hapi)


### Inspiration + References
Link mixins and Dynamic REST API Generator - [Paypal SDK](https://github.com/paypal/PayPal-node-SDK)

Testing with Casper & PhantomJS - [Node Box](https://github.com/adityamukho/node-box-sdk)

