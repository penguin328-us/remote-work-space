import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FileType, File, Folder, FileServiceNameSpace, BaseFileItem } from "../services/file/fileDefinition"

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
                return (<TreeItem file={f} />)
            }) : [];
        const content = children.length > 0 ?
            (<ul className="treeItem">{children}</ul>) : null;
        const expandIcon = this.props.file.type === FileType.Folder ?
            (<i className="material-icons expandIcon" onClick={this.onToggleExpand}>
                {this.state.expand ? "keyboard_arrow_down" : "keyboard_arrow_right"}
            </i>) : null
        const className = this.props.file.type === FileType.Folder ? "folder" : "file";
        return (
            <li className={className}>
                {expandIcon}
                <span>{this.props.file.name}</span>
                {content}
            </li>
        )
    }

    onToggleExpand() {
        this.setState({
            expand: !this.state.expand
        })
    }
}