export enum FileType {
    File,
    Folder,
}

export class BaseFileItem {
    public path: string;
    public name: string;
    public type: FileType;
}

export class Folder extends BaseFileItem {
    public children: BaseFileItem[] = [];
    constructor() {
        super();
        this.type = FileType.Folder;
    }
}

export class File extends BaseFileItem {
    public extension: string;
    constructor() {
        super();
        this.type = FileType.File;
    }
}

export const FileServiceNameSpace: string = "/fileService";