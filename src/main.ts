import * as http from "http";
import * as path from "path";
import * as express from "express";

import * as FileService from "./services/file/fileService"
import * as TerminalService from "./services/terminal/terminalService";

const app: express.Express = express();
const server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, "client")));

server.listen(process.env.PORT || 9999, process.env.IP || "0.0.0.0", () => {
    const addr = server.address();
    console.log("Web server is listening at", addr.address + ":" + addr.port)
});

const expressWs = require("express-ws")(app, server);

FileService.start(app);
TerminalService.start(app);