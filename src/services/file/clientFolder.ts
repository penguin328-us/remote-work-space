import { BaseFileItem, FileServiceNameSpace } from "./fileDefinition"

export class ClientFolder {
    public path: string;
    constructor(path: string) {
        this.path = path;
    }

    public read(callback: (children: BaseFileItem[]) => void) {
        fetch(`${FileServiceNameSpace}/dir?path=${this.path}`).then(res => {
            res.json().then(children => {
                callback(children as BaseFileItem[]);
            });
        });
    }
}