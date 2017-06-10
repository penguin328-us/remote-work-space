import { FileType, File, Folder, FileServiceNameSpace, BaseFileItem } from "../../services/file/fileDefinition";
import { IEvent, Event } from "../../common/event";
import * as Request from "../common/request";

interface IRenameEventArg {
    oldFile: BaseFileItem;
    newFile: BaseFileItem;
}

export const RenameEvent: IEvent<IRenameEventArg> = new Event<IRenameEventArg>();

export function rename(file: BaseFileItem, newName: string, callback?: (newItem?: BaseFileItem) => void) {
    Request.postJson(`${FileServiceNameSpace}/rename`, {
        file: file,
        newName: newName
    }).then(res => {
        res.json().then(data => {
            const newFile = data as BaseFileItem;
            (RenameEvent as Event<IRenameEventArg>).trigger({
                oldFile: file,
                newFile: newFile
            });
            if (callback) {
                callback(newFile);
            }
        });
    })
}

export function mkdir(path: string, callback?: (newItem?: BaseFileItem) => void) {
    fetch(`${FileServiceNameSpace}/dir?path=${path}`, {
        method: "PUT"
    }).then(res => {
        if (res.ok) {
            res.json().then(data => {
                if (callback) {
                    callback(data);
                }
            });
        }
        else {
            if (callback) {
                callback();
            }
        }
    });
}

export function rmdir(path: string, callback?: () => void) {
     fetch(`${FileServiceNameSpace}/dir?path=${path}`, {
        method: "DELETE",
    }).then(res => {
        if (res.ok) {
            if (callback) {
                callback();
            }
        }
        else {
            if (callback) {
                callback();
            }
        }
    });
}

export function createFile(path: string, callback?: (newItem?: BaseFileItem) => void, content?: any) {
    fetch(`${FileServiceNameSpace}/file?path=${path}`, {
        method: "PUT",
        body: content
    }).then(res => {
        if (res.ok) {
            res.json().then(data => {
                if (callback) {
                    callback(data);
                }
            });
        }
        else {
            if (callback) {
                callback();
            }
        }
    });
}

export function deleteFile(path: string, callback?: () => void) {
     fetch(`${FileServiceNameSpace}/file?path=${path}`, {
        method: "DELETE",
    }).then(res => {
        if (res.ok) {
            if (callback) {
                callback();
            }
        }
        else {
            if (callback) {
                callback();
            }
        }
    });
}