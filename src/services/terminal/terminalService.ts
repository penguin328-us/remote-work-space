import * as express from "express";
import * as pty from "node-pty";
import * as os from "os";

let terminals: any = {};
let logs: any = {};
export function start(app: express.Express): void {
    require("express-ws")(app);

    app.post('/terminals', function (req, res) {
        var cols = parseInt(req.query.cols),
            rows = parseInt(req.query.rows),
            term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
                name: 'xterm-color',
                cols: cols || 80,
                rows: rows || 24,
                cwd: process.env.PWD,
                env: process.env
            });

        console.log('Created terminal with PID: ' + term.pid);
        terminals[term.pid] = term;
        logs[term.pid] = '';
        term.on('data', function (data: string) {
            logs[term.pid] += data;
        });
        res.send(term.pid.toString());
        res.end();
    });

    app.post('/terminals/:pid/size', function (req, res) {
        var pid = parseInt(req.params.pid),
            cols = parseInt(req.query.cols),
            rows = parseInt(req.query.rows),
            term = terminals[pid];

        term.resize(cols, rows);
        console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
        res.end();
    });

    (app as any).ws('/terminals/:pid', function (ws:any, req:any) {
        var term = terminals[parseInt(req.params.pid)];
        console.log('Connected to terminal ' + term.pid);
        ws.send(logs[term.pid]);

        term.on('data', function (data: string) {
            try {
                ws.send(data);
            } catch (ex) {
                // The WebSocket is not open, ignore
            }
        });
        ws.on('message', function (msg: string) {
            term.write(msg);
        });
        ws.on('close', function () {
            term.kill();
            console.log('Closed terminal ' + term.pid);
            // Clean things up
            delete terminals[term.pid];
            delete logs[term.pid];
        });
    });
}

