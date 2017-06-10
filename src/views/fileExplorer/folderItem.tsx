import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FileType, Folder, BaseFileItem, File } from "../../services/file/fileDefinition"
import { ClientFolder } from "../../services/file/clientFolder";
import * as FileExplorerHelper from "./fileExplorerHelper";
import * as FileEditorHelper from "../fileEditor/fileEditorHelper";
import * as $ from "jquery";
import { Loading } from "../common/loading";
import { MenuItem, MenuDivider } from "../controls/menu";
import { ContextMenu } from "../controls/contextMenu";
import { IPosition } from "../common/layout";
import { FileItem } from "./fileItem";
import { FileName } from "./fileName";
import { NewItem } from "./newItem";
import { UploadFile } from "./uploadFile";
import { ConfirmDialog } from "../controls/confirmDialog";

interface IFolderItemProperty {
    folder: Folder;
    expand?: boolean;
}

interface IFolderItemState {
    expand?: boolean;
    loading: boolean;
    openContextMenu: boolean;
    contextMenuX: number;
    contextMenuY: number;
    rename: boolean;
    newItem: boolean;
    newItemType: FileType;
    uploadFile:any;
    openDeleteConfirmDialog:boolean;
    isDelete:boolean;
}

export class FolderItem extends React.Component<IFolderItemProperty, IFolderItemState>{
    private children: BaseFileItem[] = [];
    private clientFolder: ClientFolder = undefined;

    constructor(props: IFolderItemProperty) {
        super(props);
        this.state = {
            expand: false,
            loading: false,
            openContextMenu: false,
            contextMenuX: 0,
            contextMenuY: 0,
            rename: false,
            newItem: false,
            newItemType: FileType.File,
            uploadFile: null,
            openDeleteConfirmDialog: false,
            isDelete: false
        }
        this.onToggleExpand = this.onToggleExpand.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onContextMenuRequestClose = this.onContextMenuRequestClose.bind(this);

        this.onCreatedNewItem = this.onCreatedNewItem.bind(this);
        this.onUploadFile = this.onUploadFile.bind(this);
        this.onUploadFileChange = this.onUploadFileChange.bind(this);
        this.onUploadedFile = this.onUploadedFile.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onRenamed = this.onRenamed.bind(this);
        this.onRequestCloseRename = this.onRequestCloseRename.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onRequstCloseDeleteConfirmDialog = this.onRequstCloseDeleteConfirmDialog.bind(this);
        this.onDeleteConfirm = this.onDeleteConfirm.bind(this);

        this.clientFolder = new ClientFolder(this.props.folder.path);
    }

    componentDidMount() {
        if (this.props.expand) {
            this.onToggleExpand();
        }
    }

    render() {
        const expand = this.state.expand;
        const childrenNodes: any[] = []
        if (this.state.expand) {
            if (this.state.newItem) {
                childrenNodes.push(
                    (<NewItem key="newitem" fileType={this.state.newItemType} folderPath={this.props.folder.path} onCreatedNewItem={this.onCreatedNewItem} />)
                );
            }
            if (this.state.uploadFile) {
                childrenNodes.push(
                    (<UploadFile key="uploadFile" file={this.state.uploadFile} folderPath={this.props.folder.path} onUploaded={this.onUploadedFile} />)
                );
            }
            childrenNodes.push(
                (this.children.filter(f => f.type === FileType.Folder).sort((a,b)=>{return a.name.localeCompare(b.name)}).map(f => {
                    return (<FolderItem key={f.path} folder={f as Folder} />)
                })).concat((this.children.filter(f => f.type === FileType.File).sort((a,b)=>{return a.name.localeCompare(b.name)}).map(f => {
                    return (<FileItem key={f.path} file={f as File} />)
                })))
            )
        }
        const content = childrenNodes.length > 0 ?
            (<ul className="tree-item">{childrenNodes}</ul>) : null;

        const expandIcon = (
            <i className="material-icons">
                {this.state.expand ? "keyboard_arrow_down" : "keyboard_arrow_right"}
            </i>)

        const folderIcon = this.state.loading ? (<Loading size={14} />) : (<i className="material-icons">folder</i>);

        return this.state.isDelete ? null : (
            <li className="folder">
                <div className="text" onClick={this.onToggleExpand} onContextMenu={this.onContextMenu}>
                    {expandIcon}
                    {folderIcon}
                    <FileName rename={this.state.rename} file={this.props.folder} onRenamed={this.onRenamed} onRequestCloseRename={this.onRequestCloseRename} />
                </div>
                <input type="file" ref="file" onChange={this.onUploadFileChange} style={{
                    position: "fixed",
                    top: "-100",
                }} />
                <ContextMenu open={this.state.openContextMenu} x={this.state.contextMenuX} y={this.state.contextMenuY} onRequestClose={this.onContextMenuRequestClose}>
                    <MenuItem onClick={() => { this.onNewItem(FileType.File) }}>New File</MenuItem>
                    <MenuItem onClick={this.onUploadFile}>Upload File...</MenuItem>
                    <MenuItem onClick={() => { this.onNewItem(FileType.Folder) }}>New Folder</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={this.onRename}>Rename Folder</MenuItem>
                    <MenuItem onClick={this.onDeleteClick}>Delete Folder</MenuItem>
                </ContextMenu>
                {content}
                <ConfirmDialog open={this.state.openDeleteConfirmDialog} width="400"
                    onRequestClose={this.onRequstCloseDeleteConfirmDialog}
                    onConfirm={this.onDeleteConfirm} title="Confirm to Delete Folder">
                    Are you sure to delete folder <b>{this.props.folder.name}</b> ?
                </ConfirmDialog>
            </li>
        );
    }

    //#region "Common Functions"

    onContextMenu(event: React.MouseEvent<HTMLDivElement>): boolean {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            openContextMenu: true,
            contextMenuX: event.pageX,
            contextMenuY: event.pageY
        });

        return false;
    }

    onContextMenuRequestClose() {
        this.setState({
            openContextMenu: false
        });
    }

    onNewItem(type: FileType) {
        this.setState({
            newItem: true,
            newItemType: type
        });
        if (!this.state.expand) {
            this.onToggleExpand();
        }
    }

    onCreatedNewItem(newItem?: BaseFileItem) {
        if (newItem) {
            this.children.push(newItem);
        }
        this.setState({
            newItem: false
        });
    }

    onUploadFile(){
        $(this.refs["file"]).click();
    }

    onUploadFileChange() {
        const file = this.refs["file"] as HTMLInputElement;
        if (file.files && file.files.length > 0) {
            this.setState({
                uploadFile: file.files[0]
            });
            if (!this.state.expand) {
                this.onToggleExpand();
            }
        }
    }

    onUploadedFile(newItem?: BaseFileItem) {
        if (newItem) {
            this.children.push(newItem);
        }
        this.setState({
            uploadFile: undefined
        });
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

     onDeleteClick(): void {
        this.setState({
            openDeleteConfirmDialog: true
        });
    }

    onRequstCloseDeleteConfirmDialog(): void {
        this.setState({
            openDeleteConfirmDialog: false
        });
    }
    onDeleteConfirm(): void {
        FileExplorerHelper.rmdir(this.props.folder.path);
        this.setState({
            isDelete: true
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