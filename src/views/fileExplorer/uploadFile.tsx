import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseFileItem } from "../../services/file/fileDefinition";
import * as FileExplorerHelper from "./fileExplorerHelper";
import { LoadingH } from "../common/loadingH";

interface IUploadFileProperty {
    folderPath: string;
    file: File;
    onUploaded: (newFile?: BaseFileItem) => void
}

export class UploadFile extends React.Component<IUploadFileProperty, any>{
    componentDidMount() {
        const reader = new FileReader();
        reader.onload = (event=>{
            const fullPath  = this.props.folderPath + "/" + this.props.file.name;
            FileExplorerHelper.createFile(fullPath,this.props.onUploaded, reader.result);
        });
        reader.readAsArrayBuffer(this.props.file);
    }

    render() {
        const icon = (<i className="material-icons">description</i>);
        const content = (<span>{this.props.file.name}</span>);

        const loading = (<span style={{ marginLeft: 5 }}><LoadingH /></span>)
        return (
            <li className="file">
                <div className="text">
                    {icon}
                    {content}
                    {loading}
                </div>
            </li>
        );
    }
}