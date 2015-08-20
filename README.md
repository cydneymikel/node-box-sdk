# Node.js Box SDK

Node.js module for both [Box.com Content API](https://box-content.readme.io/) & [Box.com View API](https://box-view.readme.io/)

This module interacts with the Box Content and View APIs.  The Node.js Box SDK module returns the data requested as well as an encrypted string containing the Box Access Token and Box Refresh Token.  

It abstracts away some of the complexity in regards to updating the Box Token upon expiration.  However, provides flexibility for the developer to handle the Box callback and storage of the encrypted Box Token on a user by user basis.  

Examples of how to integrate this module into Express as middleware and into Hapi as a plugin are located in the examples folder.  The examples provided show how to attach the node-box-sdk to the server object, set the returned encrypted token string as a cookie and how to use this encrypted token string with the node-box-sdk methods. 

### Status
#####Content API

 - Authentication - Completed
 - Folders - Completed
 - Files - Completed
 - Shared Items - Completed
 - All Additional Methods - In Progress

#####View API

 - Document - Partially Complete - In Progress
 - Sessions - Partially Complete - In Progress
 - All Additional Methods - In Progress


----------


### Install
    npm install node-box-sdk
   
   
----------


### Configure
    box.configure({
      client_id: 'content_api_client_id',
      client_secret: 'content_api_client_secret',
      api_key: 'view_api_client_secret',
      encrypt: { password: 'pick_a_password' }
    });
    


----------


## Content API

### Authorization

#### Authorize
Returns the URL of Box’s authorization page in the response.redirect. This is the URL that your application should forward the user to in first leg of OAuth.  After successful login it returns YOUR_REDIRECT_URI?code=THE_AUTHORIZATION_CODE.

      var state = 'abc-xyz'; // An arbitrary string of your choosing that will be included in the response to your application.
      box.authorize(state, function(err, res) { });

#### Generate Tokens
Returns the access tokens as an encrypted string. This encrypted token string can be set as cookie in a web application on a user by user basis.  This encrypted token string will need to be stored and used in all subsequent calls in the node-box-sdk.

      box.generateToken({ authorization_code: code }, function(err, tokens) { });


----------


###Folder Operations
All methods have a 3rd argument in the callback function 'tokens'.  Each time the node-box-sdk callsback with the access tokens as an encrypted string.  

The reason for this is because - iIf the access token was expired, node-box-sdk will attempt to refresh this token and then returns the updated version of the access tokens as an encrypted string.  If no refresh was needed then it returns the same access tokens as an encrypted string.

#### Create
Returns a full folder object in the response.body if the parent folder ID is valid.

    var data = { name: 'BoxTest', parent: { id: 0 }};
    box.content.folder.create(data, { tokens: tokens }, function(err, res, tokens) { });

#### Get
Returns a full folder object in the response.body.

    box.content.folder.get(folderID, { tokens: tokens }, function(err, res, tokens) { });

#### Update
Returns a full folder object in the response.body.

    var data = { name: 'BoxTestUpdate', description: 'A folder in Box.'};
    box.content.folder.update(folderID, data, { tokens: tokens }, function(err, res, tokens) { });

#### Delete
Moves the folder to trash. 
Returns an empty response.body and a 204 if successful.
*A recursive parameter must be included in order to delete folders that have items inside of them

    var options = { tokens: tokens params: { recursive: true } };
    box.content.folder.delete(folderID, options, function(err, res, tokens) { });

#### Permanently Delete
Permanently deletes an item that is in the trash. The item will no longer exist in Box. This action cannot be undone.
Returns an empty response.body and a 204 if successful.

    box.content.folder.destroy(folderID, { tokens: tokens }, function(err, res, tokens) { });

#### Copy
Returns a full folder object in the response.body if the parent folder ID is valid.

    var data = { parent: { id : 0 }, name: "AnotherBoxTest" };
    box.content.folder.copy(folderID, data, { tokens: tokens }, function(err, res, tokens) { });    


----------

### Express Use Example
[Using node-box-sdk inside Express](https://github.com/cydneymikel/node-box-sdk/tree/master/examples/express)

### Hapi Use Example
[Using node-box-sdk inside Hapi](https://github.com/cydneymikel/node-box-sdk/tree/master/examples/hapi)


----------


### Inspiration + References
API link mixins and dynamic REST API generator - [Paypal SDK](https://github.com/paypal/PayPal-node-SDK)

Testing with Casper & PhantomJS - [Node Box](https://github.com/adityamukho/node-box-sdk)

