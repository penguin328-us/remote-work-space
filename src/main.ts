import * as http from "http";
import * as path from "path";

import * as express from "express";

const app = express();
const server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, "client")));

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", () => {
    const addr = server.address();
    console.log("Web server is listening at", addr.address + ":" + addr.port)
});
