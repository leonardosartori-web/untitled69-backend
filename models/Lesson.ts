import mongoose = require('mongoose');
import {Model} from "./ModelInterface";

export interface Lesson extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    teacher: string,
    students: string[],
    date: mongoose.Schema.Types.Date,
    duration: number,
    description: string
}

const lessonSchema = new mongoose.Schema<Lesson>( {
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
    duration:  {
        type: mongoose.SchemaTypes.Number,
        required: false
    },
    description:  {
        type: mongoose.SchemaTypes.String,
        required: false
    }
})


let lesson = new Model<Lesson>(lessonSchema, 'Lesson');

export {lesson};