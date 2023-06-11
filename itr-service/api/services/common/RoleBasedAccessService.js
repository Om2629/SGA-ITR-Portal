class RoleBasedAccessService {

    constructor() { }

    async checkAccess(businessObj, requiredPermission, req, res) {
        if (req.tokenInfo.data.permissions[businessObj] && (req.tokenInfo.data.permissions[businessObj].includes(requiredPermission))) {
            return true;
        } else {
            return sails.helpers.authError(req.tokenInfo.data.role + ' user cannot perform this action', req, res);
        }
    }
}
module.exports = RoleBasedAccessService;