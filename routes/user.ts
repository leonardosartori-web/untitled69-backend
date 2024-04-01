import express = require('express');
import {auth} from "./authentication";
import {NextFunction, Response} from "express";
import {user} from "../models/User";
import {userApiPermission} from "../permissions";

let router = express.Router();


router.route("/users").get(auth, (req, res:Response, next: NextFunction) => {
    user.methods.find({}, {salt: 0, digest: 0}).then(users => {
        return res.status(200).json(users);
    }).catch(e => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + e });
    });
}).post(auth, (req, res:Response, next:NextFunction) => {

    if (req?.auth?.role !== "admin") req.body.role = "student";

    user.methods.add(req.body).then( (data) => {
        return res.status(200).json(data);
    }).catch( (reason) => {
        if( reason.code === 11000 )
            return next({statusCode:404, error:true, errormessage: "User already exists"} );
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason.errmsg });
    });

});

router.route("/users/:email").get(auth, userApiPermission, (req, res:Response, next: NextFunction) => {
    user.methods.findOne({email: req.params.email}, {salt: 0, digest: 0}).then(user => {
        return res.status(200).json(user);
    }).catch(e => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + e });
    });
}).put(auth, userApiPermission, (req, res:Response, next: NextFunction) => {
    user.methods.findOne({email: req.params.email}).then(u => {
        if (req.body.password) u.setPassword(req.body.password);
        const {password, ...rest} = req.body;
        u._update(rest).then(us => {
            return res.status(200).json(us);
        }).catch( (reason) => {
            if( reason.code === 11000 )
                return next({statusCode:404, error:true, errormessage: "User already exists"} );
            return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
        });
    }).catch(e => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + e });
    });
}).delete(auth, userApiPermission, (req, res:Response, next: NextFunction) => {
    user.methods.findOne({email: req.params.email}).then(u => {
        u._delete().then(q => {
            if (q.deletedCount > 0) {
                return res.status(200).json({error: false, errormessage: ""});
            } else
                return res.status(404).json({error: true, errormessage: "Invalid user ID"});
        })
    }).catch(e => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + e });
    });
});


export {router};