"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
//Routes
const AuthRouter = require("./routes/authentication");
const LessonRouter = require("./routes/lesson");
const UserRouter = require("./routes/user");
let app = express();
let auth = AuthRouter.auth;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
app.use("/", AuthRouter.router);
app.use("/", LessonRouter.router);
app.use("/", UserRouter.router);
app.use(function (err, req, res, next) {
    console.log("Request error: " + JSON.stringify(err));
    return res.status(err.statusCode || 500).json(err);
});
app.use((req, res, next) => {
    res.status(404).json({ statusCode: 404, error: true, errormessage: "Invalid endpoint" });
});
module.exports = { app };
//# sourceMappingURL=app.js.map