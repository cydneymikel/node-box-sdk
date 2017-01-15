# Node.js Box SDK

----------

### Deprecated
 Six months ago Box released their official node module.  This has since been deprecated in favor of support development efforts there.
 https://github.com/box/box-node-sdk

----------

Node.js module for both [Box.com Content API](https://box-content.readme.io/) & [Box.com View API](https://box-view.readme.io/)

The purpose of this module is to provide an efficient and intentional method of interacting with the Box APIs.  This SDK wraps both the Box Content and View API  Thus, it is important to understand the Box APIs at the REST endpoint level.  You are strongly encouraged to read the Box documentation.

Examples of how to integrate this module into Express as middleware and into Hapi as a plugin are located in the examples folder.  The examples provided show how to attach the node-box-sdk to the server object, set the returned encrypted token string as a cookie and how to use this encrypted token string with the node-box-sdk methods. 

Contributors Welcome!

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
      client_id: 'content_api_client_id',             // REQUIRED
      client_secret: 'content_api_client_secret',     // REQUIRED
      api_key: 'view_api_client_secret',              // REQUIRED
      encrypt: { password: 'pick_a_password' }        // OPTIONAL
    });
    


----------


## Content API

### Authorization

#### Authorize
Returns the URL of Box’s authorization page in the response.redirect. This is the URL that your application should forward the user to in first leg of OAuth.  After successful login it returns YOUR_REDIRECT_URI?code=THE_AUTHORIZATION_CODE.

      var state = 'abc-xyz'; // An arbitrary string of your choosing that will be included in the response to your application.
      box.authorize(state, function(err, res) { });

#### Generate Tokens
Returns the access tokens.  If the box client was configured using encrypt with a password then the tokens will be returned as an encrypted string.  Otherwise the tokens will be returned as an object. Either the encrypted token string or the token object will need to be persisted, because the box client will handle refreshing the authorization tokens as needed. 

One option is to set the encrypted token string as cookie in a web application.  Examples of this strategy are provided.

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

#### Items
Returns the files and/or folders contained within this folder in the response.body.

    box.content.folder.items(folderID, { tokens: tokens }, function(err, res, tokens) { });

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

#### Restore
Restores a full folder object that is in the trash.

    box.content.folder.restore(folderID, {}, { tokens: tokens }, function(err, res, tokens) { });

#### Trash
View the files and/or folders that have been moved to the trash.

    box.content.folder.trash(null, { tokens: tokens }, function(err, res, tokens) { });

View a specific folders that has been moved to the trash.

    box.content.folder.trash(folderID, { tokens: tokens }, function(err, res, tokens) { });

#### Share
Creates a shared link for this folder, returns a full folder object in the response.body.
    
    var data = { shared_link: { } }; // default access
    box.content.folder.share(folderID, data, { tokens: tokens }, function(err, res, tokens) { });   

#### Collaborations
Returns a list of all the collaborations on a folder.

    box.content.folder.collaborations(folderID, { tokens: tokens }, function(err, res, tokens) { });   

----------


###File Operations
All methods have a 3rd argument in the callback function 'tokens'.  Each time the node-box-sdk callsback with the access tokens as an encrypted string.  

The reason for this is because - iIf the access token was expired, node-box-sdk will attempt to refresh this token and then returns the updated version of the access tokens as an encrypted string.  If no refresh was needed then it returns the same access tokens as an encrypted string.

    // TODO update docs

----------

###Shared Items Operations
All methods have a 3rd argument in the callback function 'tokens'.  Each time the node-box-sdk callsback with the access tokens as an encrypted string.  

The reason for this is because - iIf the access token was expired, node-box-sdk will attempt to refresh this token and then returns the updated version of the access tokens as an encrypted string.  If no refresh was needed then it returns the same access tokens as an encrypted string.

    // TODO update docs

----------

## View API

    // TODO update docs


----------

### Express Use Example
[Using node-box-sdk inside Express](https://github.com/cydneymikel/node-box-sdk/tree/master/examples/express)

### Hapi Use Example
[Using node-box-sdk inside Hapi](https://github.com/cydneymikel/node-box-sdk/tree/master/examples/hapi)


----------


### Inspiration + References
API link mixins and dynamic REST API generator - [Paypal SDK](https://github.com/paypal/PayPal-node-SDK)

Testing with Casper & PhantomJS - [Node Box](https://github.com/adityamukho/node-box-sdk)
