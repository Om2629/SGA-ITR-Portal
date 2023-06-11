
let UserService = require('../../services/common/UserService');
let userService = new UserService();
let RoleBasedAccessService = require('../../services/common/RoleBasedAccessService');
let roleBasedAccessService = new RoleBasedAccessService();
const bcrypt = require('bcryptjs');
const {
  v4: uuid
} = require('uuid');
const bcryptConfig = sails.config.bcryptConfig;
const businessObject = sails.config.businessObject;
const permissions = sails.config.permissions;
const roles = sails.config.roles;

function logError(req, error) {
  sails.log.error({
    reqId: req.reqId
  }, `${error}`);
  return;
};

function logInfo(req, msg) {
  sails.log.info({
    reqId: req.reqId
  }, `${msg}`);
  return;
};


/**
 * `signUpController.createUser()`
 */
async function createUser(req, userInfo) {
  console.log("in createuser");
  try {
    await Users.create(userInfo);
  } catch (error) {
    logError(req, `${error}`);
    sails.log.error({
      reqId: req.reqId,
      error: true
    }, 'Error creating a new user.');
  }
}

async function createHashedPassword(plainPassword) {
  const hashPassword = await bcrypt.hash(bcryptConfig.systemSalt + plainPassword, bcryptConfig.saltRounds);
  console.log(hashPassword)
  return hashPassword;
}

module.exports = {

  register: async function (req, res) {
    let body = req.body;
    console.log(body)
    if (body && body.userInfo) {
      let userInfo = body.userInfo;
      // let actionItem = body.action;

      // if (actionItem !== permissions.CREATE) {
      //   return res.status(200).send({
      //     error: true,
      //     message: 'Invalid action'
      //   })
      // }
      try {
        let password = userInfo['password'];
        console.log(password)
        createHashedPassword(password).then(async (hashedPassword) => {
          console.log(hashedPassword);
          userInfo['password'] = hashedPassword;
          console.log(userInfo);
          // userInfo['passwordChangeRequired'] = (actionItem === permissions.CREATE) ? true : false;
          // userInfo['isActive'] = true;
          // if (actionItem === permissions.CREATE) {
            // let userinfo = body.userInfo
            // Check user existence
            let isUserExist = await userService.checkUserExistence(userInfo.userName)
            if (isUserExist) {
              return res.status(200).send({
                message: 'Username is already registered',
                error: true
              })
            }
            // Check email existence
            let isMailExist = await userService.checkEmailExistence(userInfo.email)
            if (isMailExist) {
              return res.status(200).send({
                message: 'Email address is already registered',
                error: true
              })
            }

            // Check Role based access
           // await roleBasedAccessService.checkAccess(businessObject.USER, permissions.CREATE, req, res);
            // userInfo['verified'] = true;
            // userInfo['passwordHistory'] = []
          // }
          // Create user in mongodb
          await createUser(req, userInfo);
          logInfo(req, `Successfully registered user`);
          return res.status(201).send({
            error: false,
            message: 'Successfully registered user'
          });
        });
      } catch (error) {
        console.log(error);
        logError(req, `${error}`);
        return res.status(400).send({
          error: true,
          message: error.toString()
        });
      }
    } else {
      logError(req, `Invalid request parameters.`);
      res.status(500).send(`Invalid request parameters`);
    }
  },

  validateUsername: async function (req, res) {
    let body = req.body;
    if (body && body.value) {
      let value = body.value;
      let count = await Users.count({
        userName: value
      });
      if (count == 0) {
        return res.status(200).send({
          error: false
        });
      } else if (count != 0) {
        logError(req, `Username is already registered`);
        return res.status(200).send({
          message: 'Username is already registered',
          error: true
        })
      }
    } else {
      logError(req, `Invalid request parameters.`);
      res.status(500).send(`Invalid request parameters`);
    }
  },

  validateEmail: async function (req, res) {
    let body = req.body;
    if (body && body.value) {
      let value = body.value;
      let count = await Users.count({
        email: value
      });
      if (count === 0) {
        return res.status(200).send({
          error: false
        });
      } else if (count != 0) {
        logError(req, `Email address is already registered`);
        return res.status(200).send({
          message: 'Email address is already registered',
          error: true
        })
      }
    } else {
      logError(req, `Invalid request parameters.`);
      res.status(500).send(`Invalid request parameters`);
    }
  }
};