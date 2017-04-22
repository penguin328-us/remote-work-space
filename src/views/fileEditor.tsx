import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as FileClient from "../services/file/fileClient";
import { FileType, File, Folder, FileServiceNameSpace } from "../services/file/fileDefinition"

import { Loading } from "./loading";
import * as FileEditHelper from "./fileEditHelper";

import { MonacoEditor } from "./monacoEditor";

interface IFileEditorProperty{
    file:File
}

interface IFileEditorState{
    loading:boolean;
    fileContent:any;
    active:boolean;
}

export class FileEditor extends React.Component<IFileEditorProperty, IFileEditorState>{
    constructor(props: IFileEditorProperty) {
        super(props);
        this.state ={
            loading:true,
            fileContent:null,
            active:this.props.file.path === FileEditHelper.getActiveFile()
        }
        this.onActiveFileChanged = this.onActiveFileChanged.bind(this);
        FileClient.readFile(this.props.file.path).then((res)=>{
            res.blob().then(b=>{
                this.loadFile(b);
            });
        });
    }
    componentDidMount(): void {
        FileEditHelper.ActiveFileChangeEvent.on(this.onActiveFileChanged);
    }

    componentWillUnmount(): void {
        FileEditHelper.ActiveFileChangeEvent.off(this.onActiveFileChanged);
    }

    render() {
        return this.state.loading ?
            (<div className="file-editor"><Loading /></div>) :
            (
                <div className="file-editor" style={{
                    display: this.state.active ? "block" : "none"
                }}>
                    <MonacoEditor key={this.props.file.path} value={this.state.fileContent} language={this.getLanguage()} />
                </div>
            );
    }

    onActiveFileChanged(activeFile: string): void {
        if(activeFile === this.props.file.path){
            this.setState({
                active:true
            });
        }else{
            this.setState({
                active:false
            });
        }
    }

    loadFile(blob: Blob) {
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({
                loading: false,
                fileContent: reader.result
            });
        };
        reader.readAsText(blob);
    }

    getLanguage(): string {
        switch (this.props.file.extension) {
            case ".ts":
                return "typescript";
            case ".js":
                return "javascript";
            case ".json":
                return "json"
            case ".css":
                return "css";
        }
        return undefined;
    }
}