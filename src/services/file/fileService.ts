import { FileType, File, Folder, FileServiceNameSpace, BaseFileItem } from "./fileDefinition"
import * as fs from "fs";
import * as path from "path";
import * as express from "express";
import * as rimraf from "rimraf";

const appSettings = require("../../../appsettings.json");

let root: Folder;
let baseFolder: string;

export function start(app: express.Express): void {
    const folder = path.parse(path.resolve(appSettings.workSpacePath));
    baseFolder = folder.dir;
    root = new Folder();
    root.name = folder.base;
    root.path = "/" + folder.name;
    initRestApi(app);
}

function initRestApi(app: express.Express): void {
    const router = express.Router();
    router.get(`/dir`, (req, res) => {
        if (req.query.path === "/") {
            res.send([root]);
        } else {
            const dir = getServerPath(req.query.path);
            fs.readdir(dir, (err, files) => {
                let count = files.length;
                const children: BaseFileItem[] = [];
                if (count === 0) {
                    res.send(children);
                } else {
                    files.forEach(f => {
                        const fullPath = `${dir}/${f}`;
                        convertToFileItem(fullPath, (fileItem) => {
                            if (fileItem) {
                                children.push(fileItem);
                            }
                            count--;
                            if (count === 0) {
                                res.send(children.sort((a, b) => { return a.name.localeCompare(b.name); }));
                            }
                        });
                    });
                }
            });
        }
    });

    router.put("/dir", (req, res) => {
        const dir = getServerPath(req.query.path);
        fs.mkdir(dir, (err) => {
            if(err){
                res.status(500).send(err.message);
            }else{
                convertToFileItem(dir,(item)=>{
                    res.send(item);
                });
            }
        });
    });

    router.delete(`/dir`, (req, res) => {
        if (req.query.path === "/") {
            res.status(500).send("cannot remove root folder");
        } else {
            const dir = getServerPath(req.query.path);
            rimraf(dir, (err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send("OK");
                }
            });
        }
    });

    router.get(`/file`, (req, res) => {
        const fullPath = getServerPath(req.query.path);
        fs.readFile(fullPath, (err, data) => {
            if (err) {
                res.status(500).send(err.message)
            } else {
                res.send(data);
            }
        });
    });

    router.put("/file", (req, res) => {
        const fullPath = getServerPath(req.query.path);
        fs.open(fullPath, "wx", (err, fd) => {
            if (err || !fd) {
                res.status(500).send("File exists");
            } else {
                req.pipe(fs.createWriteStream(fullPath,{
                    fd:fd
                }));
                convertToFileItem(fullPath, (item) => {
                    res.send(item);
                });
            }
        })
    });

    router.delete(`/file`, (req, res) => {
        const fullPath = getServerPath(req.query.path);
        fs.unlink(fullPath, (err) => {
            if (err) {
                res.status(500).send(err.message)
            } else {
                res.send("OK");
            }
        });
    });

    router.post(`/rename`, (req, res) => {
        const file = req.body.file as BaseFileItem;
        const newName = req.body.newName as string;
        const oldPath = getServerPath(file.path);
        const parsedPath = path.parse(oldPath);
        const newPath = path.join(parsedPath.dir, newName);
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                convertToFileItem(newPath, (fileItem) => {
                    res.send(fileItem);
                });
            }
        });
    });

    app.use(FileServiceNameSpace, router)
}

function getServerPath(clientPath:string):string{
    return path.join(baseFolder, clientPath);
}

function getClientPath(serverPath:string):string{
    return serverPath.substr(baseFolder.length);
}

function convertToFileItem(fullPath: string, callback: (fileItem?: BaseFileItem) => void) {
    fs.stat(fullPath, (err, state) => {
        const pathInfo = path.parse(fullPath);
        if (state.isFile()) {
            const file = new File();
            file.extension = pathInfo.ext;
            file.name = pathInfo.base;
            file.path = getClientPath(fullPath);
            callback(file);
        } else if (state.isDirectory()) {
            const folder = new Folder();
            folder.name = pathInfo.base;
            folder.path = getClientPath(fullPath);
            callback(folder);
        } else {
            callback();
        }
    });
}
