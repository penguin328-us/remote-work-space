import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as FileClient from "../services/file/fileClient";
import { FileType, File, Folder, FileServiceNameSpace, BaseFileItem } from "../services/file/fileDefinition"

import { Loading } from "./loading";
import { TreeItem } from "./treeItem";

interface IFileExplorerState {
    loading: boolean;
}

export class FileExplorer extends React.Component<any, IFileExplorerState>{
    private roots: BaseFileItem[];

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true
        }
        FileClient.readdir("/").then((res) => {
            res.json().then((data) => {
                this.roots = data;
                this.setState({
                    loading: false
                })
            })
        })
    }

    render() {
        const content = this.state.loading ?
            (<Loading size={30} />) :
            (
                <ul className="tree-item">
                    {
                        this.roots.map(r => {
                            return (<TreeItem key={r.path} file={r} expand={true} />);
                        })
                    }
                </ul>
            );

        return (
            <div className="file-explorer">
                <h4>Explorer</h4>
                {content}
            </div>
        );
    }
}