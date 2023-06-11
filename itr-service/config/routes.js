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

  '/': { view: 'pages/homepage' },

  /***************************************************************************
  *                  Auth Controller                                                        *                                                  *                                                                        *
  ***************************************************************************/
  'post /auth/login': 'common/AuthController.login',
  'post /auth/refreshtoken': 'common/AuthController.refreshToken',
  'post /auth/logout': 'common/AuthController.logout',
  // 'put auth/update-password': 'common/AuthController.updateUserPassword',
  // 'put auth/reset-password': 'common/AuthController.resetUserPassword',
  "get /test": "common/AuthController.testFunction",

  /***************************************************************************
  *                  SignUp Controller                                                        *                                                  *                                                                        *
  ***************************************************************************/
  'post /users': 'common/SignUpController.register',

  /***************************************************************************
    *                  User Controller                                                        *                                                  *                                                                        *
    ***************************************************************************/
  'get /users': 'common/UserController.fetchUsers',
  'post /checkStatus': 'common/UserController.checkItrStatus',
  'post /checkItrHistory': 'common/UserController.fetchItrHistory',
  'post /changePassword': 'common/UserController.changeLoginPassword',
  'get /users/totalClientandItrFileCount': 'common/UserController.totalClientandItrFileCount',
  'post /users/fetchClientProfile':'common/UserController.fetchClientProfile',
  /***************************************************************************
  *                  File Controller                                                        *                                                  *                                                                        *
  ***************************************************************************/

  'post /upload': 'common/FileController.uploadFiles',
  'post /download': 'common/FileController.downloadFile'

};
