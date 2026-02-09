/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /': { action: 'auth/render-login' },
  'POST /': { action: 'auth/login' },
  'GET /register': {action:'auth/render-register'},
  'POST /register':{action:'auth/register'},
  'GET /logout':{action:'auth/logout'},

  'GET /dashboard':{action:'dashboard/get-all-accounts'}, 
  'GET /account/create':{action:'dashboard/create-account'},
  'POST /account/create':{action:'dashboard/create-account-post'},
  'GET /account/edit/:id':{action:'dashboard/edit-account'},
  'POST /account/edit/:id':{action:'dashboard/edit-account-post'},
  'GET /account/delete/:id':{action:'dashboard/delete-account'},
  'GET /account/activate/:id':{action:'dashboard/activate-account'},
  'GET /account/set-default/:id':{action:'dashboard/set-default-account'},

  'GET /friends':{action:'friend/get-all-friends'},
  'GET /friends/add/:id':{action:'friend/add-friends'},
  'GET /friends/my-friends':{action:'friend/get-my-friends'},
  'GET /friends/remove/:id':{action:'friend/remove-friends'},

  'GET /transfer/create':{action:'transfer/create'},
  'POST /transfer/create':{action:'transfer/create-post'},
  'GET /transfer/history':{action:'transfer/history'},
  'GET /transfer/delete/:id':{action:'transfer/delete-transaction'},
  



  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
