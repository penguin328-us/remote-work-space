import { ClientFile } from "../../services/file/clientFile";
import { FileType, File, Folder, FileServiceNameSpace } from "../../services/file/fileDefinition"
import { IEvent, Event } from "../../common/event";
import * as FileExplorerHelper from "../fileExplorer/fileExplorerHelper";

let openedFiles: ClientFile[] = [];
export const OpenedFilesChangeEvent: IEvent<ClientFile[]> = new Event<ClientFile[]>();

let activeFile: string = null;
export const ActiveFileChangeEvent: IEvent<string> = new Event<string>();

function getFileIndex(file: File): number {
    for (let i = 0; i < openedFiles.length; i++) {
        if (file.path === openedFiles[i].file.path) {
            return i;
        }
    }
    return -1;
}

export function openFile(file: File, fileContent?: Blob): void {
    const index = getFileIndex(file);
    if (index < 0) {
        openedFiles.push(new ClientFile(file, fileContent));
        (OpenedFilesChangeEvent as Event<ClientFile[]>).trigger(openedFiles);
    }
    setActiveFile(file.path);
}

export function closeFile(file: File): void {
    const index = getFileIndex(file);
    if (index >= 0) {
        openedFiles.splice(index, 1);
        (OpenedFilesChangeEvent as Event<ClientFile[]>).trigger(openedFiles);

        if (file.path === activeFile) {
            setActiveFile(openedFiles.length > 0 ? openedFiles[0].file.path : null);
        }
    }
}

export function setActiveFile(filePath: string) {
    if (activeFile !== filePath) {
        activeFile = filePath;
        (ActiveFileChangeEvent as Event<string>).trigger(activeFile);
    }
}

export function getActiveFile(): string {
    return activeFile;
}

function init(){
    FileExplorerHelper.RenameEvent.on((arg)=>{
        let found = false;
        if(arg.oldFile.type === FileType.File){
            for(var i=0;i<openedFiles.length;i++){
                if(arg.oldFile.path === openedFiles[i].file.path){
                    found = true;
                    openedFiles[i].file = arg.newFile as File;
                    break;
                }
            }
        }else{
            openedFiles.forEach(f=>{
                if(f.file.path.indexOf(arg.oldFile.path)===0){
                    f.file.path.replace(arg.oldFile.path, arg.newFile.path);
                    found = true;
                }
            });
        }

        if(activeFile === arg.oldFile.path){
            setActiveFile(arg.newFile.path);
        }

        if(found){
            (OpenedFilesChangeEvent as Event<ClientFile[]>).trigger(openedFiles);
        }
    });
}

init();