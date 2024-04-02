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
const permissions_1 = require("../permissions");
const User_1 = require("../models/User");
let router = express.Router();
exports.router = router;
router.route("/lessons").get(authentication_1.auth, (req, res, next) => {
    User_1.user.new(Object.assign({}, req.auth)).getLessons(x => x).then(lessons => {
        return res.status(200).json(lessons);
    }).catch(e => {
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + e });
    });
}).post(authentication_1.auth, (0, permissions_1.rolesPermission)(['teacher']), (req, res, next) => {
    User_1.user.new(Object.assign({}, req.auth)).addLesson(req.body).then((data) => {
        return res.status(200).json(data);
    }).catch((reason) => {
        if (reason.code === 11000)
            return next({ statusCode: 404, error: true, errormessage: "Lesson already exists" });
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason.errmsg });
    });
});
router.route("/lessons/:id").get(authentication_1.auth, (req, res, next) => {
    User_1.user.new(Object.assign({}, req.auth)).getLessons(x => x._id = req.params.id).then(ls => {
        if (ls.length > 0) {
            const data = ls[0];
            return res.status(200).json(data);
        }
        else
            return res.status(404).json({ error: true, errormessage: "Invalid lesson ID" });
    });
}).put(authentication_1.auth, (req, res, next) => {
    const _a = req.body, { students } = _a, rest = __rest(_a, ["students"]);
    const update = {
        $set: Object.assign({}, rest),
        $addToSet: { students: { $each: students } }
    };
    User_1.user.new(Object.assign({}, req.auth)).updateLesson({ _id: req.params.id }, update, { new: true }).then(l => {
        return res.status(200).json(l);
    }).catch((reason) => {
        if (reason.code === 11000)
            return next({ statusCode: 404, error: true, errormessage: "Lesson already exists" });
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
    });
}).delete(authentication_1.auth, (req, res, next) => {
    User_1.user.new(Object.assign({}, req.auth)).deleteLesson({ _id: req.params.id }).then(q => {
        if (q.deletedCount > 0) {
            return res.status(200).json({ error: false, errormessage: "" });
        }
        else
            return res.status(404).json({ error: true, errormessage: "Invalid lesson ID" });
    });
});
router.route("/lessons/:id/students/:student").delete(authentication_1.auth, (req, res, next) => {
    const update = {
        $pull: { students: req.params.student }
    };
    User_1.user.new(Object.assign({}, req.auth)).updateLesson({ _id: req.params.id }, update, { new: true }).then(l => {
        return res.status(200).json(l);
    }).catch((reason) => {
        if (reason.code === 11000)
            return next({ statusCode: 404, error: true, errormessage: "Lesson already exists" });
        return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason });
    });
});
//# sourceMappingURL=lesson.js.map