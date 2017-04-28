import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ClientFile } from "../../services/file/clientFile";
import { FileType, File, Folder, FileServiceNameSpace } from "../../services/file/fileDefinition"

import { Loading } from "../loading";
import * as FileEditorHelper from "./fileEditorHelper";

import { MonacoEditor } from "./monacoEditor";

interface IFileEditorProperty {
    clientFile: ClientFile
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
            active:this.props.clientFile.file.path === FileEditorHelper.getActiveFile()
        }
        this.onActiveFileChanged = this.onActiveFileChanged.bind(this);
        this.props.clientFile.read(content=>{
            this.loadFile(content);
        });
    }
    componentDidMount(): void {
        FileEditorHelper.ActiveFileChangeEvent.on(this.onActiveFileChanged);
    }

    componentWillUnmount(): void {
        FileEditorHelper.ActiveFileChangeEvent.off(this.onActiveFileChanged);
    }

    render() {
        return this.state.loading ?
            (<div className="file-editor"><Loading /></div>) :
            (
                <div className="file-editor" style={{
                    display: this.state.active ? "block" : "none"
                }}>
                    <MonacoEditor key={this.props.clientFile.file.path} value={this.state.fileContent} language={this.getLanguage()} />
                </div>
            );
    }

    onActiveFileChanged(activeFile: string): void {
        if(activeFile === this.props.clientFile.file.path){
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
        switch (this.props.clientFile.file.extension) {
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