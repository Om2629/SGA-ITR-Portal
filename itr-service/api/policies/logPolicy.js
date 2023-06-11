const uuidv4 = require('uuid/v4');
module.exports = function(req, res, next) {
    req.reqId = uuidv4();
    sails.log.info({ reqId: req.reqId }, "Request Info : ", req.method, req.url);
    return next();
}