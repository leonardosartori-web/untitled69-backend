import {NextFunction, Response} from "express";


function rolesPermission(roles: string[]) {
    return function (req, res:Response, next: NextFunction) {
        if (roles.some(el => el === req.auth.role)) next();
        else next({ statusCode:403, error: true, errormessage: "Access Denied – You don’t have permission to access" });
    }
}

function userApiPermission(req, res, next) {
    if (req.params.email === req.auth.email || req.auth.role === "admin") next();
    else next({ statusCode:403, error: true, errormessage: "Access Denied – You don’t have permission to access" });
}

export {rolesPermission, userApiPermission};