import mongoose = require('mongoose');
import crypto = require('crypto');
import {deleteReturn, Model} from "./ModelInterface";
import {lesson, Lesson} from "./Lesson";

export interface User extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    fullname: string,
    email: string,
    role: string,
    salt: string,
    digest: string,
    setPassword: (pwd:string)=>void,
    validatePassword: (pwd:string)=>boolean,
    setRole: (role:string)=>void,
    getLessons: (filter: Function) => Promise<Lesson[]>,
    addLesson: (data: Lesson|any) =>Promise<Lesson> | never,
    updateLesson: (filter: Lesson|any,data: Lesson|any, options:any = {new: true}) => Promise<Lesson> | never
    deleteLesson: (filter: Lesson|any) => Promise<deleteReturn> | never,
    _update: (data: User|any) => Promise<User>,
    _delete: () => Promise<deleteReturn> | never
}

const userSchema = new mongoose.Schema<User>( {
    fullname: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    role:  {
        type: mongoose.SchemaTypes.String,
        required: true,
        default: "student"
    },
    salt:  {
        type: mongoose.SchemaTypes.String,
        required: false
    },
    digest:  {
        type: mongoose.SchemaTypes.String,
        required: false
    }
})

userSchema.methods.setPassword = function( pwd:string ) {
    this.salt = crypto.randomBytes(16).toString('hex');
    const hmac = crypto.createHmac('sha512', this.salt );
    hmac.update( pwd );
    this.digest = hmac.digest('hex');
}

userSchema.methods.validatePassword = function( pwd:string ):boolean {
    const hmac = crypto.createHmac('sha512', this.salt );
    hmac.update(pwd);
    const digest = hmac.digest('hex');
    return (this.digest === digest);
}

userSchema.methods.setRole = function(role:string) {
    this.role = role;
}

userSchema.methods.getLessons = function(filter: Function) {
    if (this.role === "student")
        return lesson.methods.find({"students": this.fullname}, {students: 0}).then(lessons => lessons.filter(filter));
    else if (this.role === "teacher") return lesson.methods.find({"teacher": this.fullname}, {}).then(lessons => lessons.filter(filter));
    else return lesson.methods.find({}, {students: 0}).then(lessons => lessons.filter(filter))
}

userSchema.methods.addLesson = function (data: Lesson|any): Promise<Lesson> | never {
    if (this.role === "teacher") {
        return lesson.methods.add({...data, teacher: this.fullname});
    }
    else throw new Error("User not allowed");
}

userSchema.methods.updateLesson = function (filter: Lesson|any, data: Lesson|any, options:any = {new: true}) {
    if (this.role !== "student") {
        if (this.role === "teacher") filter.teacher = this.fullname;
        return lesson.methods.update(filter, data);
    }
    else throw new Error("User not allowed");
}

userSchema.methods.deleteLesson = function (filter: Lesson|any) {
    if (this.role !== "student") {
        if (this.role === "teacher") filter.teacher = this.fullname;
        return lesson.methods.deleteOne(filter);
    }
    else throw new Error("User not allowed");
}

userSchema.methods._update = function (data: User|any) {
    return user.methods.update({_id: this._id}, data);
}

userSchema.methods._delete = function () {
    return user.methods.deleteOne({_id: this._id});
}

userSchema.methods.deleteUser = function (filter: Lesson|any) {
    if (this.role === "admin") {
        return user.methods.deleteOne(filter);
    }
    else throw new Error("User not allowed");
}

let user = new Model<User>(userSchema, 'User');

user.methods.add = function (data: any) {
    try {
        const {password, ...rest} = data;
        const u = user.new(rest);
        u.setPassword(password);
        return u.save();
    } catch (e) {
        throw e;
    }

}

export {user};