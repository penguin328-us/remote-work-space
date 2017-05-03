import { File, FileServiceNameSpace } from "./fileDefinition";

export class ClientFile {
    public file: File;
    private fileContent: Blob;
    constructor(file: File, fileContent?: Blob) {
        this.file = file;
        fileContent = fileContent;
    }

    public read(callback: (content: Blob) => void) {
        if (this.fileContent) {
            callback(this.fileContent);
        } else {
            fetch(`${FileServiceNameSpace}/file?path=${this.file.path}`).then(res=>{
                res.blob().then(content=>{
                    this.fileContent = content;
                    callback(this.fileContent);
                });
            });
        }
    }
}