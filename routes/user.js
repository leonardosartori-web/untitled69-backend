"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = require("express");
const authentication_1 = require("./authentication");
const User_1 = require("../models/User");
const permissions_1 = require("../permissions");
let router = express.Router();
exports.router = router;
router.route("/users").get(authentication_1.auth, (req, res, next) => {
    User_1.user.methods.find({}, { salt: 0, digest: 0 }).then(users => {
        return res.status(200).json(users);
    }).catch(e => {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + e });
    });
}).post(authentication_1.auth, (req, res, next) => {
    var _a;
    if (((_a = req === null || req === void 0 ? void 0 : req.auth) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
        req.body.role = "student";
    User_1.user.methods.add(req.body).then((data) => {
        return res.status(200).json(data);
    }).catch((reason) => {
        if (reason.code === 11000)
            return next({ statusCode: 404, error: true, errormessage: "User already exists" });
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason.errmsg });
    });
});
router.route("/users/:email").get(authentication_1.auth, permissions_1.userApiPermission, (req, res, next) => {
    User_1.user.methods.findOne({ email: req.params.email }, { salt: 0, digest: 0 }).then(user => {
        return res.status(200).json(user);
    }).catch(e => {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + e });
    });
}).put(authentication_1.auth, permissions_1.userApiPermission, (req, res, next) => {
    User_1.user.methods.findOne({ email: req.params.email }).then(u => {
        if (req.body.password)
            u.setPassword(req.body.password);
        const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
        u._update(rest).then(us => {
            return res.status(200).json(us);
        }).catch((reason) => {
            if (reason.code === 11000)
                return next({ statusCode: 404, error: true, errormessage: "User already exists" });
            return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
        });
    }).catch(e => {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + e });
    });
}).delete(authentication_1.auth, permissions_1.userApiPermission, (req, res, next) => {
    User_1.user.methods.findOne({ email: req.params.email }).then(u => {
        u._delete().then(q => {
            if (q.deletedCount > 0) {
                return res.status(200).json({ error: false, errormessage: "" });
            }
            else
                return res.status(404).json({ error: true, errormessage: "Invalid user ID" });
        });
    }).catch(e => {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + e });
    });
});
//# sourceMappingURL=user.js.map