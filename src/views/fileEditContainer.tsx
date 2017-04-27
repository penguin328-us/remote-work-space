import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ClientFile } from "../services/file/clientFile";
import { FileType, File, Folder, FileServiceNameSpace } from "../services/file/fileDefinition"
import * as FileEditHelper from "./fileEditHelper";

import { FileEditor } from "./fileEditor";

interface IFileEditState{
    opendFiles:ClientFile[];
    activeFile:string;
}

export class FileEditContainer extends React.Component<any, IFileEditState>{
    constructor(props: any) {
        super(props);
        this.state = {
            opendFiles: [],
            activeFile: null
        };
        this.onOpendFilesChanged = this.onOpendFilesChanged.bind(this);
        this.onActiveFileChanged = this.onActiveFileChanged.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
        this.onCloseItem = this.onCloseItem.bind(this);
    }

    componentDidMount():void{
        FileEditHelper.OpenedFilesChangeEvent.on(this.onOpendFilesChanged);
        FileEditHelper.ActiveFileChangeEvent.on(this.onActiveFileChanged);
    }

    componentWillUnmount():void{
        FileEditHelper.OpenedFilesChangeEvent.off(this.onOpendFilesChanged);
        FileEditHelper.ActiveFileChangeEvent.off(this.onActiveFileChanged);
    }

    render() {
        const headers = this.state.opendFiles.map(f => {
            const className = f.file.path === this.state.activeFile ?
                "item active" : "item";
            return (
                <div className={className} key={f.file.path} onClick={() => this.onClickItem(f.file.path)}>
                    <span>{f.file.name}</span>
                    <span className="close" onClick={(e)=>this.onCloseItem(e,f.file)}>
                        <i className="material-icons">close</i>
                    </span>
                </div>)
        });

        const editors = this.state.opendFiles.map(f => {
            return (<FileEditor key={f.file.path} clientFile={f} />)
        });
        return (
            <div className="file-edit-container">
                <div className="header">{headers}</div>
                <div className="body">
                    {editors}
                </div>
            </div>
        );
    }

    private onOpendFilesChanged(opendFiles: ClientFile[]): void {
        this.setState({
            opendFiles:opendFiles
        });
    }

    private onActiveFileChanged(activeFile:string):void{
        this.setState({
            activeFile:activeFile
        });
    }

    private onClickItem(path:string):void{
        FileEditHelper.setActiveFile(path);
    }

    private onCloseItem(event: React.MouseEvent<HTMLSpanElement>, file: File): void {
        event.stopPropagation();
        event.preventDefault();
        FileEditHelper.closeFile(file);
    }
}