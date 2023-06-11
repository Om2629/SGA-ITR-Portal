var AuthService = require('../services/common/AuthService');
let authService = new AuthService();

function getErrorResp(errorMesssage) {
    let errResp = {
        message: errorMesssage ? errorMesssage : "Invalid Token"
    }
    return errResp;
}

async function validateToken(req, res) {
    var token;
    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(' ');
        if (parts.length == 2) {
            var scheme = parts[0],
                credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
            return token;
        } else {
            return sails.helpers.authError('Wrong authorization header', req, res);
        }
    } else if (req.param('token')) {
        token = req.param('token');
        // We delete the token from param to not mess with blueprints
        delete req.query.token;
        return token;
    } else {
        return sails.helpers.authError('No Authorization header found', req, res);
    }
}

module.exports = function (req, res, next) {
    sails.log.debug({
        reqId: req.reqId
    }, "Auth Token Policy invoked for endpoint");
    validateToken(req, res).then(token => {
        authService.verifyToken(token).then((decodedToken) => {
            req.tokenInfo = decodedToken;
            next();
        }).catch((err) => {
            return sails.helpers.authError('Invalid token', req, res, err.name);
        });
    })
};