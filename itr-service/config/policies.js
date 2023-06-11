/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  // 'common/AuthController': {
  //   'login': ['logPolicy'],
  //   'logout': ['logPolicy', 'authToken'],
  //   'refreshToken': ['logPolicy', 'refreshToken'],
  //   'updateUserPassword': ['logPolicy'],
  //   'resetUserPassword': ['logPolicy', 'authToken'],
  // },
  'common/SignUpController': {
    '*': ['logPolicy'],
    'register': ['logPolicy'],
  },
  'common/AuthController': {
    '*': ['logPolicy'],
    'login': ['logPolicy'],
    'refreshToken': ['logPolicy','refreshToken'],
    'testFunction': ['logPolicy', 'authToken'],
    'logout': ['logPolicy', 'authToken'],
  },
  'common/UserController': {
    '*': ['logPolicy'],
    'fetchUsers': ['logPolicy', 'authToken'],
    'checkItrStatus': ['logPolicy', 'authToken'],
    'fetchItrHistory': ['logPolicy', 'authToken'],
    'changeLoginPassword': ['logPolicy', 'authToken']
  }

};
