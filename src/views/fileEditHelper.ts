import * as FileClient from "../services/file/fileClient";
import { FileType, File, Folder, FileServiceNameSpace } from "../services/file/fileDefinition"
import { IEvent, Event } from "../common/event";

let openedFiles: File[] = [];
const openedFilesChangeEvent = new Event<File[]>();
export const OpenedFilesChangeEvent: IEvent<File[]> = openedFilesChangeEvent;

let activeFile:string = null;
const activeFileChangeEvent = new Event<string>();
export const ActiveFileChangeEvent: IEvent<string> = activeFileChangeEvent;

function getFileIndex(file: File): number {
    for (let i = 0; i < openedFiles.length; i++) {
        if (file.path === openedFiles[i].path) {
            return i;
        }
    }
    return -1;
}

export function openFile(file: File): void {
    const index = getFileIndex(file);
    if (index < 0) {
        openedFiles.push(file);
        openedFilesChangeEvent.trigger(openedFiles);
    }
    setActiveFile(file.path);
}

export function closeFile(file: File): void {
    const index = getFileIndex(file);
    if (index >= 0) {
        openedFiles.splice(index, 1);
        openedFilesChangeEvent.trigger(openedFiles);
    }
}

export function setActiveFile(filePath:string){
    if(activeFile !== filePath){
        activeFile = filePath;
        activeFileChangeEvent.trigger(activeFile);
    }
}

export function getActiveFile():string{
    return activeFile;
}