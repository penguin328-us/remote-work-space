import { FileType, File, Folder, FileServiceNameSpace } from "./fileDefinition"

export function getFolderStructure(){
    return fetch(`${FileServiceNameSpace}/getFolderStructure`);
}