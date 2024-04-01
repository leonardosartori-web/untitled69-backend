import mongoose = require("mongoose");

function connect(callbackFunction: Function) {
    mongoose.connect("mongodb+srv://leonardosartori62:8kQJ0rVTNqdNmhRP@cluster0.uapvvbl.mongodb.net/Orkestrani?retryWrites=true&w=majority").then(
        () => {
            /*mongoose.connection.db.dropDatabase();
            console.log("Database connection successfully");
            populates();*/
        }
    ).then(callbackFunction).catch(
        (err) => {
            console.log("Error occurred during initialization");
            console.log(err);
        }
    );
}

function disconnect() {
    return mongoose.connection.close();
}

export {connect, disconnect};