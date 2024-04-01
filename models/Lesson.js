"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lesson = void 0;
const mongoose = require("mongoose");
const ModelInterface_1 = require("./ModelInterface");
const lessonSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    students: [{
            type: mongoose.SchemaTypes.String,
            required: true
        }],
    date: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        index: true
    },
    duration: {
        type: mongoose.SchemaTypes.Number,
        required: false
    },
    description: {
        type: mongoose.SchemaTypes.String,
        required: false
    }
});
let lesson = new ModelInterface_1.Model(lessonSchema, 'Lesson');
exports.lesson = lesson;
//# sourceMappingURL=Lesson.js.map