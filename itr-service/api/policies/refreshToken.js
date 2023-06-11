var AuthService = require('../services/common/AuthService');
let authService = new AuthService();

function getErrorResp(errorMesssage) {
    let errResp = {
        message: errorMesssage ? errorMesssage : "Invalid Token"
    }
    return errResp;
}

module.exports = function(req, res, next) {
    sails.log.debug({ reqId: req.reqId }, "Refresh Auth Token Policy invoked");
    let token;
    let refreshToken;
    if ( req.body == null || req.body.token == null || req.body.refreshToken == null ) {
        return sails.helpers.badRequest('Missing required parameters',req ,res);
    }
    token = req.body.token;
    refreshToken = req.body.refreshToken;
    authService.verifyToken(token).then((decodedToken) => {
        sails.log.debug({ reqId: req.reqId }, "Token is already valid");
        // If request comes with valid token, then throw an error
        return sails.helpers.badRequest('Token is already valid', req, res);
    }).catch((err) => {
        // Error format
        // err = { name: 'TokenExpiredError', message: 'jwt expired', expiredAt: 1408621000 }
        // Proceed only for token expiration error
        if (err != null && err.name == 'TokenExpiredError') {
            authService.verifyRefreshToken(refreshToken).then((decodedRefreshToken) => {
                decodedToken = authService.decode(token);
                if (!authService.isUserRefreshTokenValid(decodedToken, decodedRefreshToken)) {
                    return sails.helpers.authError('Invalid token / refresh token');
                }
                // Check whether token in exist in DB or not
                RefreshToken.find({loginID: decodedRefreshToken.data.user, refreshToken: refreshToken}).exec(function(err, tokens){
                    if(err){
                        sails.log.debug({ reqId: req.reqId }, "Refresh Token Verification failed.", {name: err.name, message: err.message, token: req.body.refreshToken});
                        return sails.helpers.authError('Invalid refresh token ',req, res, err.name);
                    }
                    if (tokens == null || tokens.length == 0) {
                        sails.log.debug({ reqId: req.reqId }, "Refresh token is not exist in db.",  { user:decodedRefreshToken.data.user, refreshToken : refreshToken});
                        return sails.helpers.authError('Invalid refresh token', req, res);
                    }
                    req.tokenInfo = decodedRefreshToken;
                    // Proceed further
                    return next();
                });  
            }).catch((err) => {
                sails.log.debug({ reqId: req.reqId }, "Refresh Token Verification failed.", {name: err.name, message: err.message, token: req.body.refreshToken});
                return sails.helpers.authError('Invalid refresh token ', req, res, err.name);
            });
        } else {
            return sails.helpers.authError('Invalid token', req, res);
        }
    });
  };