import { FileType, File, Folder, FileServiceNameSpace } from "./fileDefinition"
import * as fs from "fs";
import * as path from "path";
import * as express from "express";

const appSettings = require("../../../appsettings.json");

let root: Folder;
let baseFolder: string;

export function start(app: express.Express): void {
    buildFolderStructure(() => {
        initRestApi(app);
    });
}

function initRestApi(app: express.Express): void {
    app.get(`${FileServiceNameSpace}/getFolderStructure`, (req, res) => {
        res.send(root);
    });
}

function buildFolderStructure(complete?: () => void): void {
    const folder = path.parse(path.resolve(appSettings.workSpacePath));
    baseFolder = folder.dir;
    root = new Folder();
    root.name = folder.base;
    root.path = "/" + folder.name.toLowerCase();
    buildSubFolderStructure(root, complete);
}

function buildSubFolderStructure(parent: Folder, complete?: () => void, count: number = 0): void {
    count++;
    const dir = path.join(baseFolder, parent.path);
    fs.readdir(dir, (err, files) => {
        count += files.length;
        files.forEach(f => {
            const fullPath = `${dir}/${f}`
            fs.stat(fullPath, (err, state) => {
                const pathInfo = path.parse(fullPath);
                if (state.isFile()) {
                    const file = new File();
                    file.extension = pathInfo.ext;
                    file.name = pathInfo.base;
                    file.path = pathInfo.dir.substr(baseFolder.length) + "/" + file.name;
                    parent.children.push(file);
                } else if (state.isDirectory()) {
                    const folder = new Folder();
                    folder.name = pathInfo.base;
                    folder.path = pathInfo.dir.substr(baseFolder.length) + "/" + folder.name;
                    parent.children.push(folder);
                    buildSubFolderStructure(folder);
                }
                count--;
                if (count === 0 && complete) {
                    complete();
                }
            });
        });
        count--;
        if (count === 0 && complete) {
            complete();
        }
    });
}