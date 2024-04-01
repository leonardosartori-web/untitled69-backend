"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
const mongoose = require("mongoose");
function connect(callbackFunction) {
    mongoose.connect("mongodb+srv://leonardosartori62:8kQJ0rVTNqdNmhRP@cluster0.uapvvbl.mongodb.net/Orkestrani?retryWrites=true&w=majority&authSource=admin").then(() => {
        /*mongoose.connection.db.dropDatabase();
        console.log("Database connection successfully");
        populates();*/
    }).then(callbackFunction).catch((err) => {
        console.log("Error occurred during initialization");
        console.log(err);
    });
}
exports.connect = connect;
function disconnect() {
    return mongoose.connection.close();
}
exports.disconnect = disconnect;
//# sourceMappingURL=database.js.map