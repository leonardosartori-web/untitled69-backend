"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const mongoose = require("mongoose");
const get_methods = function (table) {
    const methods = {
        findOne: function (filter = {}, projection = {}) {
            return table.getModel().findOne(filter, projection);
        },
        find: function (filter = {}, projection = {}, sort = {}) {
            return table.getModel().find(filter, projection).sort(sort);
        },
        add: function (data) {
            let newModel = table.new(data);
            return newModel.save();
        },
        update: function (filter, data, options = { new: true }) {
            return table.getModel().findOneAndUpdate(filter, data, options);
        },
        deleteOne: function (filter = {}) {
            if (filter !== {})
                return table.getModel().deleteOne(filter);
        }
    };
    return methods;
};
class Model {
    constructor(schema, modelName) {
        this.schema = schema;
        this.modelName = modelName;
        this.methods = get_methods(this);
    }
    getModel() {
        if (!this.model) {
            this.model = mongoose.model(this.modelName, this.getSchema());
        }
        return this.model;
    }
    getSchema() {
        return this.schema;
    }
    new(data) {
        let _model = this.getModel();
        return (new _model(data));
    }
}
exports.Model = Model;
//# sourceMappingURL=ModelInterface.js.map