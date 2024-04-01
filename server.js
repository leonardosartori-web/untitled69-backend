"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./database");
(0, database_1.connect)(() => {
    app_1.app.listen(8080, () => console.log("HTTP Server started on port 8080"));
});
//# sourceMappingURL=server.js.map