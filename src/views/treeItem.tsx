import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FileType, File, Folder, FileServiceNameSpace, BaseFileItem } from "../services/file/fileDefinition"
import * as FileEditHelper from "./fileEditHelper";

interface ITreeItemProperty {
    file: BaseFileItem,
}

interface ITreeItemState {
    expand?: boolean
}

export class TreeItem extends React.Component<ITreeItemProperty, ITreeItemState>{
    constructor(props: ITreeItemProperty) {
        super(props);
        this.state = {
            expand: false
        }
        this.onToggleExpand = this.onToggleExpand.bind(this);
        this.onOpenFile = this.onOpenFile.bind(this);
    }

    render() {
        const expand = this.state.expand;
        const children: any[] = this.props.file.type === FileType.Folder && expand ?
            (this.props.file as Folder).children.sort((a, b) => {
                if (a.type === FileType.Folder) {
                    return -1;
                } else {
                    return 1;
                }
            }).map(f => {
                return (<TreeItem key={f.path} file={f} />)
            }) : [];
        const content = children.length > 0 ?
            (<ul className="tree-item">{children}</ul>) : null;
        const expandIcon = this.props.file.type === FileType.Folder ?
            (<i className="material-icons">
                {this.state.expand ? "keyboard_arrow_down" : "keyboard_arrow_right"}
            </i>) : null
        const className = this.props.file.type === FileType.Folder ? "folder" : "file";
        const fileIcon = this.getFileIcon();
        return (
            <li className={className}>
                <div className="text" onClick={this.onToggleExpand} onDoubleClick={this.onOpenFile}>
                    {expandIcon}
                    {fileIcon}
                    <span>{this.props.file.name}</span>
                </div>
                {content}
            </li>
        )
    }

    getFileIcon(): any {
        const iconName = this.props.file.type === FileType.Folder ?
            "folder" : "description";
        return (<i className="material-icons">{iconName}</i>);
    }

    onToggleExpand() {
        if (this.props.file.type === FileType.Folder) {
            this.setState({
                expand: !this.state.expand
            })
        }
    }

    onOpenFile() {
        if (this.props.file.type === FileType.File) {
            FileEditHelper.openFile(this.props.file as File);
        }
    }
}