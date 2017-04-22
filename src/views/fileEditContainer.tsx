import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as FileClient from "../services/file/fileClient";
import { FileType, File, Folder, FileServiceNameSpace } from "../services/file/fileDefinition"
import * as FileEditHelper from "./fileEditHelper";

import { FileEditor } from "./fileEditor";

interface IFileEditState{
    opendFiles:File[];
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
            const className = f.path === this.state.activeFile ?
                "item active" : "item";
            return (<div className={className} key={f.path} onClick={() => this.onClickItem(f.path)}>{f.name}</div>)
        });

        const editors = this.state.opendFiles.map(f => {
            return (<FileEditor file={f} />)
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

    private onOpendFilesChanged(opendFiles: File[]): void {
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
}