import express = require('express');
import {lesson} from "../models/Lesson";
import {auth} from "./authentication";
import {NextFunction, Response} from "express";
import {rolesPermission} from "../permissions";
import {user} from "../models/User";

let router = express.Router();

router.route("/lessons").get(auth, (req, res:Response, next: NextFunction) => {

    lesson.methods.find({}, {}).then(lessons => {
        return res.status(200).json(lessons);
    }).catch(e => {
        return next({ statusCode:404, error: true, errormessage: "DB error: " + e });
    });

}).post(auth, rolesPermission(['teacher']), (req, res:Response, next:NextFunction) => {

    user.new({...req.auth}).addLesson(req.body).then( (data) => {
        return res.status(200).json(data);
    }).catch( (reason) => {
        if( reason.code === 11000 )
            return next({statusCode:404, error:true, errormessage: "Lesson already exists"} );
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason.errmsg });
    });

});

router.route("/lessons/:id").get(auth, (req, res:Response, next: NextFunction) => {
    user.new({...req.auth}).getLessons(x => x._id = req.params.id).then(ls => {
        if (ls.length > 0) {
            const data = ls[0];
            return res.status(200).json(data);
        }
        else return res.status(404).json({error: true, errormessage: "Invalid lesson ID"});
    })
}).put(auth, (req, res:Response, next: NextFunction) => {
    const {students, ...rest} = req.body;
    const update = {
        $set: {...rest},
        $addToSet: { students: {$each: students}}
    }
    user.new({...req.auth}).updateLesson({_id: req.params.id}, update, {new: true}).then(l => {
        return res.status(200).json(l);
    }).catch( (reason) => {
        if( reason.code === 11000 )
            return next({statusCode:404, error:true, errormessage: "Lesson already exists"} );
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
    });

}).delete(auth, (req, res:Response, next: NextFunction) => {
    user.new({...req.auth}).deleteLesson({_id: req.params.id}).then(q => {
        if (q.deletedCount > 0) {
            return res.status(200).json({error: false, errormessage: ""});
        } else
            return res.status(404).json({error: true, errormessage: "Invalid lesson ID"});
    })
});


router.route("/lessons/:id/students/:student").delete(auth, (req, res:Response, next: NextFunction) => {
    const update = {
        $pull: {students: req.params.student}
    }
    user.new({...req.auth}).updateLesson({_id: req.params.id}, update, {new: true}).then(l => {
        return res.status(200).json(l);
    }).catch( (reason) => {
        if( reason.code === 11000 )
            return next({statusCode:404, error:true, errormessage: "Lesson already exists"} );
        return next({ statusCode:404, error: true, errormessage: "DB error: " + reason });
    });
});


export {router};