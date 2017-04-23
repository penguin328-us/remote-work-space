import { FileType, File, Folder, FileServiceNameSpace } from "./fileDefinition"

export function getFolderStructure(){
    return fetch(`${FileServiceNameSpace}/getFolderStructure`);
}

export function readFile(path:string){
    return fetch(`${FileServiceNameSpace}/readFile?path=${path}`);
}

export function readdir(path:string){
    return fetch(`${FileServiceNameSpace}/readdir?path=${path}`);
}