import { FileType, File, Folder, FileServiceNameSpace } from "./fileDefinition"

export function getFolderStructure(){
    return fetch(`${FileServiceNameSpace}/getFolderStructure`);
}

export function readFile(path:string){
    return fetch(`${FileServiceNameSpace}/readFile?path=${path}`);
}