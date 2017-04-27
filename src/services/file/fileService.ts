import { FileType, File, Folder, FileServiceNameSpace, BaseFileItem } from "./fileDefinition"
import * as fs from "fs";
import * as path from "path";
import * as express from "express";

const appSettings = require("../../../appsettings.json");

let root: Folder;
let baseFolder: string;

export function start(app: express.Express): void {
    const folder = path.parse(path.resolve(appSettings.workSpacePath));
    baseFolder = folder.dir;
    root = new Folder();
    root.name = folder.base;
    root.path = "/" + folder.name.toLowerCase();
    initRestApi(app);
}

function initRestApi(app: express.Express): void {
    app.get(`${FileServiceNameSpace}/readdir`, (req, res) => {
        if (req.query.path === "/") {
            res.send([root]);
        } else {
            const dir = path.join(baseFolder, req.query.path);
            fs.readdir(dir, (err, files) => {
                let count = files.length;
                const children: BaseFileItem[] = [];
                if (count === 0) {
                    res.send(children);
                } else {
                    files.forEach(f => {
                        const fullPath = `${dir}/${f}`
                        fs.stat(fullPath, (err, state) => {
                            const pathInfo = path.parse(fullPath);
                            if (state.isFile()) {
                                const file = new File();
                                file.extension = pathInfo.ext;
                                file.name = pathInfo.base;
                                file.path = pathInfo.dir.substr(baseFolder.length) + "/" + file.name;
                                children.push(file);
                            } else if (state.isDirectory()) {
                                const folder = new Folder();
                                folder.name = pathInfo.base;
                                folder.path = pathInfo.dir.substr(baseFolder.length) + "/" + folder.name;
                                children.push(folder);
                            }
                            count--;
                            if (count === 0) {
                                res.send(children);
                            }
                        });
                    });
                }
            });
        }
    });

    app.get(`${FileServiceNameSpace}/readFile`, (req, res) => {
        const fullPath = path.join(baseFolder, req.query.path);
        fs.readFile(fullPath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.send(err)
            }
            res.send(data);
        });
    });
}
