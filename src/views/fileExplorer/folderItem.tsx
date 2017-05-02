import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FileType, Folder, BaseFileItem, File } from "../../services/file/fileDefinition"
import { ClientFolder } from "../../services/file/clientFolder";
import * as FileExplorerHelper from "./fileExplorerHelper";
import * as FileEditorHelper from "../fileEditor/fileEditorHelper";
import * as $ from "jquery";
import { Loading } from "../loading";
import { Menu, MenuItem, MenuDivider } from "../controls/menu";
import { IPosition } from "../common/layout";
import { FileItem } from "./fileItem";
import { FileName } from "./fileName";

interface IFolderItemProperty {
    folder: Folder;
    expand?: boolean;
}

interface IFolderItemState {
    expand?: boolean;
    loading: boolean;
    showContextMenu: boolean;
    contextMenuPos: IPosition;
    rename: boolean;
}

export class FolderItem extends React.Component<IFolderItemProperty, IFolderItemState>{
    private children: BaseFileItem[] = [];
    private clientFolder: ClientFolder = undefined;

    constructor(props: IFolderItemProperty) {
        super(props);
        this.state = {
            expand: false,
            loading: false,
            showContextMenu: false,
            contextMenuPos: {},
            rename: false
        }
        this.onToggleExpand = this.onToggleExpand.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onRenamed = this.onRenamed.bind(this);
        this.onRequestCloseRename = this.onRequestCloseRename.bind(this);

        this.clientFolder = new ClientFolder(this.props.folder.path);
    }

    componentDidMount() {
        if (this.props.expand) {
            this.onToggleExpand();
        }
    }

    render() {
        const expand = this.state.expand;
        const childrenNodes: any[] = this.state.expand ?
            (this.children.filter(f => f.type === FileType.Folder).map(f => {
                return (<FolderItem key={f.path} folder={f as Folder} />)
            })).concat((this.children.filter(f => f.type === FileType.File).map(f => {
                return (<FileItem key={f.path} file={f as File} />)
            }))) : [];
        const content = childrenNodes.length > 0 ?
            (<ul className="tree-item">{childrenNodes}</ul>) : null;

        const expandIcon = (
            <i className="material-icons">
                {this.state.expand ? "keyboard_arrow_down" : "keyboard_arrow_right"}
            </i>)

        const folderIcon = this.state.loading ? (<Loading size={14} />) : (<i className="material-icons">folder</i>);

        return (
            <li className="folder">
                <div className="text" onClick={this.onToggleExpand} onContextMenu={this.onContextMenu}>
                    {expandIcon}
                    {folderIcon}
                    <FileName rename={this.state.rename} file={this.props.folder} onRenamed={this.onRenamed} onRequestCloseRename={this.onRequestCloseRename} />
                </div>
                <Menu show={this.state.showContextMenu} position={this.state.contextMenuPos}>
                    <MenuItem>New File</MenuItem>
                    <MenuItem>Upload File...</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={this.onRename}>Rename Folder</MenuItem>
                    <MenuItem>Delete Folder</MenuItem>
                </Menu>
                {content}
            </li>
        );
    }

    //#region "Common Functions"

    onContextMenu(event: React.MouseEvent<HTMLDivElement>): boolean {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            showContextMenu: true,
            contextMenuPos: {
                top: event.pageY,
                left: event.pageX
            }
        }, () => {
            setTimeout(() => {
                $("body").one("mouseup", () => {
                    this.setState({
                        showContextMenu: false
                    });
                });
            }, 200);
        });

        return false;
    }

    onRename(): void {
        this.setState({
            rename: true
        });
    }

    onRenamed(folder: BaseFileItem): void {
        this.clientFolder.path = folder.path;
        if (this.state.expand) {
            this.loadChildren();
        }
    }

    onRequestCloseRename() {
        this.setState({
            rename: false
        });
    }

    onToggleExpand() {
        if (this.state.expand) {
            this.setState({
                expand: false
            });
        } else {
            this.loadChildren();
        }
    }

    loadChildren(): void {
        this.setState({
            loading: true
        });
        this.clientFolder.read(children => {
            this.children = children;
            this.setState({
                loading: false,
                expand: true,
            });
        });
    }
    //#endregion "Folder"
}