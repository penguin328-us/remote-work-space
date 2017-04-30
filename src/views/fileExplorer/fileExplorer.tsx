import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ClientFolder } from "../../services/file/clientFolder";
import { FileType, File, Folder, FileServiceNameSpace, BaseFileItem } from "../../services/file/fileDefinition";

import { Loading } from "../loading";
import { FolderItem } from "./folderItem";

interface IFileExplorerState {
    loading: boolean;
}

export class FileExplorer extends React.Component<any, IFileExplorerState>{
    private roots: BaseFileItem[];
    private rootFolder = new ClientFolder("/");

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        this.rootFolder.read((children) => {
            this.roots = children;
            this.setState({
                loading: false
            })
        });
    }

    render() {
        const content = this.state.loading ?
            (<Loading size={30} />) :
            (
                <ul className="tree-item">
                    {
                        this.roots.map(r => {
                            return (<FolderItem key={r.path} folder={r as Folder} expand={true} />);
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