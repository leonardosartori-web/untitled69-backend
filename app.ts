import express = require('express');
import cors = require('cors');
import bodyParser = require("body-parser");
//Routes
import * as AuthRouter from "./routes/authentication";
import * as LessonRouter from "./routes/lesson";
import * as UserRouter from "./routes/user";
import {Response} from "express";

declare global {
    namespace Express {
        interface User {
            fullname: string,
            email: string,
            role: string,
            id: string
        }

        interface Request{
            auth: {
                email: string
            }
        }
    }
}

let app = express();
let auth = AuthRouter.auth;

app.use( cors() );
app.use( express.json() );
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());


app.use("/", AuthRouter.router);
app.use("/", LessonRouter.router);
app.use("/", UserRouter.router);


app.use( function(err,req,res:Response,next) {

    console.log("Request error: " + JSON.stringify(err) );
    return res.status(err.statusCode || 500).json( err );

});

app.use( (req,res,next) => {
    res.status(404).json({statusCode:404, error:true, errormessage: "Invalid endpoint"} );
});

module.exports = {app};