import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FileType, File } from "../../services/file/fileDefinition"
import * as FileExplorerHelper from "./fileExplorerHelper";
import * as FileEditorHelper from "../fileEditor/fileEditorHelper";
import * as $ from "jquery";
import { MenuItem, MenuDivider } from "../controls/menu";
import { ContextMenu } from "../controls/contextMenu";
import { IPosition } from "../common/layout";
import { FileName } from "./fileName";
import { ConfirmDialog } from "../controls/confirmDialog";

interface IFileItemProperty {
    file: File;
}

interface IFileItemState {
    openContextMenu: boolean;
    contextMenuX: number;
    contextMenuY: number;
    rename: boolean;
    openDeleteConfirmDialog:boolean;
    isDelete:boolean;
}

export class FileItem extends React.Component<IFileItemProperty, IFileItemState>{
    constructor(props: IFileItemProperty) {
        super(props);
        this.state = {
            openContextMenu: false,
            contextMenuX: 0,
            contextMenuY: 0,
            rename: false,
            openDeleteConfirmDialog:false,
            isDelete:false
        }
        this.onOpenFile = this.onOpenFile.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onContextMenuRequestClose = this.onContextMenuRequestClose.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onRequestCloseRename = this.onRequestCloseRename.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onRequstCloseDeleteConfirmDialog = this.onRequstCloseDeleteConfirmDialog.bind(this);
        this.onDeleteConfirm = this.onDeleteConfirm.bind(this);
    }

    render() {
        return this.state.isDelete ? null : (
            <li className="file">
                <div className="text" onDoubleClick={this.onOpenFile} onContextMenu={this.onContextMenu}>
                    <i className="material-icons">description</i>
                    <FileName rename={this.state.rename} file={this.props.file} onRequestCloseRename={this.onRequestCloseRename} />
                </div>
                <ContextMenu open={this.state.openContextMenu} x={this.state.contextMenuX} y={this.state.contextMenuY} onRequestClose={this.onContextMenuRequestClose}>
                    <MenuItem onClick={this.onRename}>Rename File</MenuItem>
                    <MenuItem onClick={this.onDeleteClick}>Delete File</MenuItem>
                </ContextMenu>
                <ConfirmDialog open={this.state.openDeleteConfirmDialog} width="400"
                    onRequestClose={this.onRequstCloseDeleteConfirmDialog}
                    onConfirm={this.onDeleteConfirm} title="Confirm to Delete File">
                    Are you sure to delete file <b>{this.props.file.name}</b> ?
                </ConfirmDialog>
            </li>
        );
    }

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
            openContextMenu: false,
        });
    }

    onRename(): void {
        this.setState({
            rename: true
        });
    }

    onRequestCloseRename(): void {
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
        FileExplorerHelper.deleteFile(this.props.file.path);
        this.setState({
            isDelete: true
        });
    }

    onOpenFile(event: React.MouseEvent<HTMLDivElement>): void {
        FileEditorHelper.openFile(this.props.file as File);
    }
}