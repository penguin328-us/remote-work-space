import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FileType, File, Folder, FileServiceNameSpace, BaseFileItem } from "../services/file/fileDefinition"
import * as FileClient from "../services/file/fileClient";
import * as FileEditHelper from "./fileEditHelper";
import * as $ from "jquery";
import { Loading } from "./loading";
import { Menu, MenuItem, MenuDivider } from "./controls/menu";

interface ITreeItemProperty {
    file: BaseFileItem,
    expand?: boolean,
}

interface ITreeItemState {
    expand?: boolean,
    loading: boolean,
    showContextMenu: boolean,
    contextMenuTop?: number,
    contextMenuLeft?: number,
    contextMenuBottom?: number,
    contextMenuRight?: number,
}

export class TreeItem extends React.Component<ITreeItemProperty, ITreeItemState>{
    private children: BaseFileItem[] = [];
    constructor(props: ITreeItemProperty) {
        super(props);
        this.state = {
            expand: false,
            loading: false,
            showContextMenu: false,
        }
        this.onToggleExpand = this.onToggleExpand.bind(this);
        this.onOpenFile = this.onOpenFile.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);

        if(this.props.expand){
            this.onToggleExpand();
        }
    }

    render() {
        const expand = this.state.expand;
        const childrenNodes: any[] = this.state.expand ?
            this.children.sort((a, b) => {
                if (a.type === FileType.Folder) {
                    return -1;
                } else {
                    return 1;
                }
            }).map(f => {
                return (<TreeItem key={f.path} file={f} />)
            }) : [];
        const content = childrenNodes.length > 0 ?
            (<ul className="tree-item">{childrenNodes}</ul>) : null;

        const expandIcon = this.props.file.type === FileType.Folder ?
            (<i className="material-icons">
                {this.state.expand ? "keyboard_arrow_down" : "keyboard_arrow_right"}
            </i>) : null

        const className = this.props.file.type === FileType.Folder ? "folder" : "file";

        const fileIcon = this.getFileIcon();

        return (
            <li className={className}>
                <div className="text" onClick={this.onToggleExpand} onDoubleClick={this.onOpenFile} onContextMenu={this.onContextMenu}>
                    {expandIcon}
                    {fileIcon}
                    <span>{this.props.file.name}</span>
                </div>
                <Menu show={this.state.showContextMenu} top={this.state.contextMenuTop} left={this.state.contextMenuLeft}
                        bottom={this.state.contextMenuBottom} right={this.state.contextMenuRight}>
                    <MenuItem>Rename</MenuItem>
                    <MenuItem>Delete</MenuItem>
                    <MenuDivider />
                    <MenuItem>Action 1</MenuItem>
                    <MenuItem>Action 2</MenuItem>
                </Menu>
                {content}
            </li>
        )
    }

    getFileIcon(): any {
        if (this.state.loading) {
            return (<Loading size={14} />)
        }
        else {
            const iconName = this.props.file.type === FileType.Folder ?
                "folder" : "description";
            return (<i className="material-icons">{iconName}</i>);
        }
    }

    onToggleExpand() {
        if (this.props.file.type === FileType.Folder) {
            if (this.state.expand) {
                this.setState({
                    expand: false
                });
            } else {
                this.loadChildren();
            }
        }
    }

    onContextMenu(event: React.MouseEvent<HTMLDivElement>): boolean {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            showContextMenu: true,
            contextMenuLeft: event.pageX + 10,
            contextMenuTop: event.pageY + 10,
            contextMenuBottom: undefined,
            contextMenuRight: undefined
        });
        

        $("body").one("mousedown", (() => {
            this.setState({
                showContextMenu: false
            });
        }).bind(this));

        return false;
    }

    loadChildren(): void {
        this.setState({
            loading: true
        });
        FileClient.readdir(this.props.file.path).then(res => {
            res.json().then(data => {
                this.children = data;
                this.setState({
                    loading: false,
                    expand: true,
                });
            });
        });
    }

    onOpenFile() {
        if (this.props.file.type === FileType.File) {
            FileEditHelper.openFile(this.props.file as File);
        }
    }
}