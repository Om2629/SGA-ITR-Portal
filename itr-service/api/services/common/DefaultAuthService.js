const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const TOKEN_TYPE_ACCESS = "access";
const TOKEN_TYPE_REFRESH = "refresh";
const jwtConfig = sails.config.jwtConfig;

/**
 * Token type mismatch error
 * @param {*} message 
 */
function TokenTypeError(message) {
    this.name = "TokenTypeError";
    this.message = (message || "Invalid token type");
}
TokenTypeError.prototype = Error.prototype;

class DefaultAuthService {

    constructor() {
        this.ALGORITHM = 'RS256';
        this.privateKey = fs.readFileSync(path.resolve(__dirname + '/../../../config/key/jwtRS256.key'));
        this.publicKey = fs.readFileSync(path.resolve(__dirname + '/../../../config/key/jwtRS256.key.pub'));
    }

    sign(privateClaim) {
        let cert = this.privateKey;
        let alg = this.ALGORITHM;
        // Access token
        let payload = this.getCommonClaims();
        payload.data = privateClaim;
        payload.tokenType = TOKEN_TYPE_ACCESS;
        // Refresh token
        let refreshTokenPayload = this.getCommonClaimsForRefreshToken();
        refreshTokenPayload.data = privateClaim; // Should have user & role
        refreshTokenPayload.tokenType = TOKEN_TYPE_REFRESH;

        return new Promise(function (resolve, reject) {
            jwt.sign(payload, cert, {
                algorithm: alg,
            }, function (err, token) {
                if (err) {
                    return reject(err);
                }
                jwt.sign(refreshTokenPayload, cert, {
                    algorithm: alg,
                }, function (err, refreshToken) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({ token: token, refreshToken: refreshToken, refreshTokenExp: refreshTokenPayload.exp });
                });
            });
        })
    }

    verify(token, claims, tokenType) {
        let cert = this.publicKey;
        return new Promise(function (resolve, reject) {
            jwt.verify(token, cert, claims, function (err, decoded) {
                if (err) {
                    return reject(err);
                } else if (decoded.tokenType != tokenType) {
                    return reject(new TokenTypeError('Invalid Token type'));
                }
                return resolve(decoded);
            });
        });
    }

    decode(token) {
        var decoded = jwt.decode(token);
        return decoded;
    }

    verifyToken(token) {
        let commonClaims = this.verificationClaim();
        return this.verify(token, commonClaims, TOKEN_TYPE_ACCESS)
    }


    verifyRefreshToken(token) {
        let commonClaims = this.verificationClaim();
        return this.verify(token, commonClaims, TOKEN_TYPE_REFRESH)
    }

    verificationClaim() {
        return { iss: jwtConfig.issuer };
    }

    isUserRefreshTokenValid(decodedToken, decodedRefreshToken) { // Already token type is verified, so need to include it again
        if (decodedToken.data.user != decodedRefreshToken.data.user
            || decodedToken.data.role != decodedRefreshToken.data.role
            || decodedToken.iss != jwtConfig.issuer
            || decodedRefreshToken.iss != jwtConfig.issuer) {
            return false;
        }
        return true;
    }
    /**
     * Registered Claim Names
     * https://tools.ietf.org/html/rfc7519#section-4.1
     * 
     * "iss" (Issuer) Claim
     * "sub" (Subject) Claim
     * "aud" (Audience) Claim
     * "exp" (Expiration Time) Claim
     */
    getCommonClaims() {
        let claims = {
            iss: jwtConfig.issuer,
            iat: Math.floor(Date.now() / 1000),
            // Expire in 10 mins
            exp: Math.floor(Date.now() / 1000) + jwtConfig.validity.accessToken,
        };
        return claims;
    }

    getCommonClaimsForRefreshToken() {
        let claims = {
            iss: jwtConfig.issuer,
            iat: Math.floor(Date.now() / 1000),
            // Expire in 24 hours
            exp: Math.floor(Date.now() / 1000) + jwtConfig.validity.refreshToken,
        };
        return claims;
    }
}

module.exports = DefaultAuthService;