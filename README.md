# Node.js Box SDK

Node.js module for both [Box.com Content API](https://box-content.readme.io/) & [Box.com View API](https://box-view.readme.io/)

This module interacts with the Box Cotent and View APIs.  The Node.js Box SDK module returns the data requested as well as an encrypted string containing the Box Access Token and Box Refresh Token.  

It abstracts away some of the complexity in regards to updating the Box Token upon expiration.  However, provides flexibility for the developer to handle the Box callback and storage of the encrypted Box Token on a user by user basis.  


### Install
    npm install node-box-sdk
    
### Express Use Example
[Using node-box-sdk inside Express](https://github.com/cydneymikel/node-box-sdk/tree/master/examples/express)

### Hapi Use Example
[Using node-box-sdk inside Hapi](https://github.com/cydneymikel/node-box-sdk/tree/master/examples/hapi)

