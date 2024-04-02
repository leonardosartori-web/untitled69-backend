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
exports.user = void 0;
const mongoose = require("mongoose");
const crypto = require("crypto");
const ModelInterface_1 = require("./ModelInterface");
const Lesson_1 = require("./Lesson");
const userSchema = new mongoose.Schema({
    fullname: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    role: {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: "student"
    },
    salt: {
        type: mongoose.SchemaTypes.String,
        required: false
    },
    digest: {
        type: mongoose.SchemaTypes.String,
        required: false
    }
});
userSchema.methods.setPassword = function (pwd) {
    this.salt = crypto.randomBytes(16).toString('hex');
    const hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    this.digest = hmac.digest('hex');
};
userSchema.methods.validatePassword = function (pwd) {
    const hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    const digest = hmac.digest('hex');
    return (this.digest === digest);
};
userSchema.methods.setRole = function (role) {
    this.role = role;
};
userSchema.methods.getLessons = function (filter) {
    if (this.role === "student")
        return Lesson_1.lesson.methods.find({ "students": this.fullname }, { students: 0 }).then(lessons => lessons.filter(filter));
    else if (this.role === "teacher")
        return Lesson_1.lesson.methods.find({ "teacher": this.fullname }, {}).then(lessons => lessons.filter(filter));
    else
        return Lesson_1.lesson.methods.find({}, { students: 0 }).then(lessons => lessons.filter(filter));
};
userSchema.methods.addLesson = function (data) {
    if (this.role === "teacher") {
        return Lesson_1.lesson.methods.add(Object.assign(Object.assign({}, data), { teacher: this.fullname }));
    }
    else
        throw new Error("User not allowed");
};
userSchema.methods.updateLesson = function (filter, data, options = { new: true }) {
    if (this.role !== "student") {
        if (this.role === "teacher")
            filter.teacher = this.fullname;
        return Lesson_1.lesson.methods.update(filter, data);
    }
    else
        throw new Error("User not allowed");
};
userSchema.methods.deleteLesson = function (filter) {
    if (this.role !== "student") {
        if (this.role === "teacher")
            filter.teacher = this.fullname;
        return Lesson_1.lesson.methods.deleteOne(filter);
    }
    else
        throw new Error("User not allowed");
};
userSchema.methods._update = function (data) {
    return user.methods.update({ _id: this._id }, data);
};
userSchema.methods._delete = function () {
    return user.methods.deleteOne({ _id: this._id });
};
userSchema.methods.deleteUser = function (filter) {
    if (this.role === "admin") {
        return user.methods.deleteOne(filter);
    }
    else
        throw new Error("User not allowed");
};
let user = new ModelInterface_1.Model(userSchema, 'User');
exports.user = user;
user.methods.add = function (data) {
    try {
        const { password } = data, rest = __rest(data, ["password"]);
        const u = user.new(rest);
        u.setPassword(password);
        return u.save();
    }
    catch (e) {
        throw e;
    }
};
//# sourceMappingURL=User.js.map