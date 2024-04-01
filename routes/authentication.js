"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.router = void 0;
const express = require("express");
const User_1 = require("../models/User");
const passport = require("passport"); // authentication middleware for Express
const passportHTTP = require("passport-http"); // implements Basic and Digest authentication for HTTP (used for /login endpoint)
const jsonwebtoken = require("jsonwebtoken"); // JWT generation
const { expressjwt: jwt, } = require('express-jwt'); // JWT parsing middleware for express
const result = require('dotenv').config();
if (result.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key");
    process.exit(-1);
}
if (!process.env.JWT_SECRET) {
    console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found");
    process.exit(-1);
}
let auth = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
});
exports.auth = auth;
const router = express.Router();
exports.router = router;
passport.use(new passportHTTP.BasicStrategy(function (email, password, done) {
    User_1.user.methods.findOne({ email }, {}).then((u) => {
        if (!u)
            return done(null, false, { statusCode: 500, error: true, errormessage: "Invalid user" });
        if (u.validatePassword(password))
            return done(null, u);
        return done(null, false, { statusCode: 500, error: true, errormessage: "Invalid password" });
    }).catch((err) => {
        return done({ statusCode: 500, error: true, errormessage: err });
    });
}));
router.get("/login", passport.authenticate('basic', { session: false }), (req, res, next) => {
    let tokendata = {
        fullname: req.user.fullname,
        role: req.user.role,
        email: req.user.email,
        id: req.user.id
    };
    console.log("Login granted. Generating token");
    let token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.status(200).json({ error: false, errormessage: "", token: token_signed });
});
//# sourceMappingURL=authentication.js.map