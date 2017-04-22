import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as FileClient from "../services/file/fileClient";
import { FileType, File, Folder, FileServiceNameSpace } from "../services/file/fileDefinition"

import { Loading } from "./loading";
import { TreeItem } from "./treeItem";

interface IFileExplorerState {
    loading: boolean;
}

export class FileExplorer extends React.Component<any, IFileExplorerState>{
    private rootFolder: Folder;

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true
        }
        FileClient.getFolderStructure().then((res) => {
            res.json().then((data) => {
                this.rootFolder = data;
                this.setState({
                    loading: false
                })
            })
        })
    }

    render() {
        const content = this.state.loading ?
            (<Loading size={30} />) : (
                <ul className="treeItem">
                    <TreeItem file={this.rootFolder} />
                </ul>
            );

        return (
            <div className="fileExplorer">
                <h4>Explorer</h4>
                {content}
            </div>
        );
    }
}