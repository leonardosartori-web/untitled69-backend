"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userApiPermission = exports.rolesPermission = void 0;
function rolesPermission(roles) {
    return function (req, res, next) {
        if (roles.some(el => el === req.auth.role))
            next();
        else
            next({ statusCode: 403, error: true, errormessage: "Access Denied – You don’t have permission to access" });
    };
}
exports.rolesPermission = rolesPermission;
function userApiPermission(req, res, next) {
    if (req.params.email === req.auth.email || req.auth.role === "admin")
        next();
    else
        next({ statusCode: 403, error: true, errormessage: "Access Denied – You don’t have permission to access" });
}
exports.userApiPermission = userApiPermission;
//# sourceMappingURL=permissions.js.map