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
            if (callback) {
                callback(newFile);
            }
            (RenameEvent as Event<IRenameEventArg>).trigger({
                oldFile: file,
                newFile: newFile
            });
        });
    })
}