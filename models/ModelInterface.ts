import * as mongoose from "mongoose";

interface ModelInterface<T extends mongoose.Document> {
    getSchema: () => mongoose.Schema<T>,
    getModel: () => mongoose.Model<T>,
    new: (data:any) => T
}

export interface deleteReturn {
    acknowledged: boolean,
    deletedCount: number
}


interface MethodsInterface<T extends mongoose.Document> {
    findOne: (filter:any = {}, projection:any = {}) => Promise<T>,
    find: (filter:any = {}, projection:any = {}, sort:any = {}) => Promise<T[]>,
    add: (data: any) => Promise<T>,
    update: (filter:any, data:any, options:any = {}) => Promise<T>,
    deleteOne: (filter:any={}) => Promise<deleteReturn>
}

const get_methods = function<T extends mongoose.Document> (table) {

    const methods : MethodsInterface<T> = {

        findOne: function (filter:any = {}, projection:any = {}) {
            return table.getModel().findOne(filter, projection);
        },

        find: function (filter:any = {}, projection:any = {}, sort:any = {}) {
            return table.getModel().find(filter, projection).sort(sort);
        },

        add: function (data: any) {
            let newModel = table.new(data);
            return newModel.save();
        },

        update: function (filter:any, data:any, options:any = {new: true}) {
            return table.getModel().findOneAndUpdate(filter, data, options);
        },

        deleteOne: function (filter:any={}) {
            if (filter !== {}) return table.getModel().deleteOne(filter);
        }

    }
    return methods;
}

class Model<T extends mongoose.Document> implements ModelInterface<T> {
    schema: mongoose.Schema<T>;
    model: mongoose.Model<T>;
    methods: MethodsInterface<T>;
    modelName: string;

    constructor(schema: mongoose.Schema<T>, modelName: string) {
        this.schema = schema;
        this.modelName = modelName;
        this.methods = get_methods<T>(this);
    }

    getModel(): mongoose.Model<T> {
        if( !this.model ) {
            this.model = mongoose.model(this.modelName, this.getSchema() );
        }
        return this.model;
    }

    getSchema(): mongoose.Schema<T> {
        return this.schema;
    }

    new(data: any): T {
        let _model = this.getModel();
        return (new _model( data ));
    }

}

export {Model, MethodsInterface};
