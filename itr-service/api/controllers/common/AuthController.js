var bcrypt = require('bcryptjs');
var AuthService = require('../../services/common/AuthService');
var authService = new AuthService();
const bcryptConfig = sails.config.bcryptConfig;

async function isValidUser(dbUsers, req, plainPassword) {
    if (dbUsers == null || dbUsers.length != 1) {
        sails.log.warn({
            reqId: req.reqId
        }, "No valid user / too many users");
        return {
            error: true,
            message: "Username / Password is not correct",
        }
    }
    else {
        let dbUser = dbUsers[0];
        if (await bcrypt.compare(bcryptConfig.systemSalt + plainPassword, dbUser.password)) {
            return true
        } else {
            return {
                error: true,
                message: "Username / Password is not correct",
            }
        }
    }
}

function saveToken(user, refreshToken, expiresAt, updateFlag, oldRefreshToken) {
    var refreshTokenInfo = {
        loginID: user,
        refreshToken: refreshToken,
        disabled: false,
        expiresAt: new Date(expiresAt * 1000), // Convert to milliseconds
    }
    // Before we share refresh token,
    if (updateFlag) {
        RefreshToken.find({
            loginID: user,
            refreshToken: oldRefreshToken
        }).exec(function (err, tokens) {
            if (err) {
                sails.log.info("err is :", err);
                handleError(res);
            }
            return deleteToken(tokens[0].loginID, tokens[0].refreshToken)
                .then(() => {
                    return insertToken(refreshTokenInfo);
                });
        });
    } else {
        return insertToken(refreshTokenInfo);
    }
}

function insertToken(refreshTokenInfo) {
    // Register user in db
    return new Promise(function (resolve, reject) {
        return RefreshToken.create(refreshTokenInfo).exec(function (err, refreshToken) {
            if (err) {
                reject(err);
            }
            return resolve();
        });
    });
}

function deleteToken(userId, refreshToken) {
    // Register user in db
    return new Promise(function (resolve, reject) {
        return RefreshToken.destroy({ loginID: userId, refreshToken: refreshToken }).exec(function (err, refreshToken) {
            if (err) {
                reject(err);
            }
            return resolve();
        });
    });
}


module.exports = {

    login: async function (req, res) {
        try {
            let body = req.body;
            if (body == null) {
                return sails.helpers.badRequest('Invalid request', req, res);
            }
            let loginId = body.user;
            let password = body.password;
            if ((loginId == null || !(typeof loginId == "string")) || (password == null || !(typeof password == "string"))) {
                return sails.helpers.badRequest('Invalid request', req, res);
            }
            // Fetch user
            let user = await Users.find({
                or: [
                    { mobileNumber: loginId },
                    { pancard: loginId }
                ]
            });

            let validUser = await isValidUser(user, req, password);
            if (!validUser.error) {
                let payload = {
                    user: user[0].userName,
                    pan: user[0].pancard,
                    mobileNo: user[0].mobileNumber,
                    role: user[0].role
                }
                let tokenInfo = await authService.sign(payload);
                saveToken(payload.user, tokenInfo.refreshToken, tokenInfo.refreshTokenExp);
                return res.status(200).send({
                    token: tokenInfo.token,
                    refreshToken: tokenInfo.refreshToken,
                    role: payload.role,
                    user: payload.user,
                    pan: payload.pan,
                    mobileNo: payload.mobileNo
                });
            } else {
                return res.status(200).send({
                    error: true,
                    message: "Username / Password is not correct",
                });
            }
        } catch (error) {
            sail.log.error(error);
        }
    },

    refreshToken: async function (req, res) {
        try {
            let body = req.body;
            if (body == null) {
                return handleInvalidRequest(res);
            }
            let token = body.token;
            let refreshToken = body.refreshToken;
            if ((token == null || !(typeof token == "string")) || (refreshToken == null || !(typeof refreshToken == "string"))) {
                return handleInvalidRequest(res);
            }

            let userData = req.tokenInfo.data;
            let dbUsers = await Users.find({ pancard: userData.pan });
            if (dbUsers == null || dbUsers.length != 1) {
                sails.log.warn({
                    reqId: req.reqId
                }, 'No valid user / too many users');
                return sails.helpers.authError('No valid user / too many users for loginID', req, res);
            }
            let user = dbUsers[0];
            let payload = {
                user: user.userName,
                pan: user.pancard,
                mobileNo: user.mobileNumber,
                role: user.role
            }
            let tokenInfo = await authService.sign(payload);
            saveToken(payload.user, tokenInfo.refreshToken, tokenInfo.refreshTokenExp, true, refreshToken);
            return res.status(200).send({
                token: tokenInfo.token,
                refreshToken: tokenInfo.refreshToken,
            });
        } catch (error) {
            sails.log.error(error);
            handleError(res);
        }
    },

    logout: async function (req, res) {
        let body = req.body;
        if (body == null) {
            return handleInvalidRequest(res);
        }
        let refreshToken = body.refreshToken;
        let userId = req.tokenInfo.data.user;
        if ((refreshToken == null || !(typeof refreshToken == "string")) || (userId == null || !(typeof userId == "string"))) {
            return handleInvalidRequest(res);
        }
        await deleteToken(userId, refreshToken);
        return res.status(200).send({
            message: "Logged out successfully"
        });
    },

    testFunction: async function (req, res) {
        try {
            res.status(200).send("Ok");
        } catch (err) {
            console.log(err);
        }

    }

} 