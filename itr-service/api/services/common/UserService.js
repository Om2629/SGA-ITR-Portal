
const fs = require('fs');
const bcrypt = require('bcryptjs');
const bcryptConfig = sails.config.bcryptConfig;

class UserService {

  constructor() { }

  async checkUserExistence(userName) {
    try {
      console.log("in userexistence");
      let record = await Users.find({ userName: userName })
      if (record.length != 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async checkEmailExistence(email) {
    try {
      let record = await Users.find({ email: email })
      if (record.length != 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async checkPancardExistence(pancard) {
    try {
      let record = await Users.find({ pancard: pancard })
      if (record.length != 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async isUserExist(dbUsers, req, res, plainPassword, user) {
    if (dbUsers == null || dbUsers.length != 1) {
      sails.log.warn({
        reqId: req.reqId
      }, "No valid user / too many users for userName :", user);
      return sails.helpers.authError('Username / Password is not correct', req, res);
    }
    else {
      let dbUser = dbUsers[0];
      return this.isValidUser(dbUser, plainPassword);
    }
  }

  async isValidUser(dbUser, plainPassword) {
    const match = await bcrypt.compare(bcryptConfig.systemSalt + plainPassword, dbUser.password);
    console.log(await bcrypt.hash(bcryptConfig.systemSalt + plainPassword, bcryptConfig.saltRounds));
    return match;
  }

  async createHashedPassword(plainPassword) {
    const hashPassword = await bcrypt.hash(bcryptConfig.systemSalt + plainPassword, bcryptConfig.saltRounds);
    return hashPassword;
  }

}

module.exports = UserService;