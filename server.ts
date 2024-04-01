import {app} from "./app";
import {connect} from "./database";

connect(() => {
    app.listen(8080, () => console.log("HTTP Server started on port 8080"));
})