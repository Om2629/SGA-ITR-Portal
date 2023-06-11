const DefaultAuthService = require('../common/DefaultAuthService');

const jwtConfig = sails.config.jwtConfig;
let authService;

/**
 * Token type mismatch error
 * @param {*} message 
 */
function TokenTypeError(message) {
    this.name = "TokenTypeError";
    this.message = (message || "Invalid token type");
}
TokenTypeError.prototype = Error.prototype;

function TokenExpiredError(message) {
    this.name = "TokenExpiredError";
    this.message = (message || "jwt expired");
}
TokenExpiredError.prototype = Error.prototype;

class AuthService {
    constructor() {
        if (jwtConfig.useKmsForJwt) {
            this.authService = new KmsAuthService();
        } else {
            this.authService = new DefaultAuthService();
        }
    }

    sign(privateClaim) {
        return this.authService.sign(privateClaim);
    }

    verifyToken(token) {
        return this.authService.verifyToken(token);
    }

    verifyRefreshToken(token) {
        return this.authService.verifyRefreshToken(token);
    }

    decode(token) {
        return this.authService.decode(token);
    }

    isUserRefreshTokenValid(decodedToken, decodedRefreshToken) {
        return this.authService.isUserRefreshTokenValid(decodedToken, decodedRefreshToken);
    }
}

module.exports = AuthService;