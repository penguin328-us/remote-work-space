import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FileType, File } from "../../services/file/fileDefinition"
import * as FileExplorerHelper from "./fileExplorerHelper";
import * as FileEditorHelper from "../fileEditor/fileEditorHelper";
import * as $ from "jquery";
import { Menu, MenuItem, MenuDivider } from "../controls/menu";
import { IPosition } from "../common/layout";
import { FileName } from "./fileName";

interface IFileItemProperty {
    file: File;
}

interface IFileItemState {
    showContextMenu: boolean;
    contextMenuPos: IPosition;
    rename: boolean;
}

export class FileItem extends React.Component<IFileItemProperty, IFileItemState>{
    constructor(props: IFileItemProperty) {
        super(props);
        this.state = {
            showContextMenu: false,
            contextMenuPos: {},
            rename: false
        }
        this.onOpenFile = this.onOpenFile.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onRenamed = this.onRenamed.bind(this);
    }

    render() {
        return (
            <li className="file">
                <div className="text" onDoubleClick={this.onOpenFile} onContextMenu={this.onContextMenu}>
                    <i className="material-icons">description</i>
                    <FileName rename={this.state.rename} file={this.props.file} onRenamed={this.onRenamed} />
                </div>
                <Menu show={this.state.showContextMenu} position={this.state.contextMenuPos}>
                    <MenuItem onClick={this.onRename}>Rename File</MenuItem>
                    <MenuItem>Delete File</MenuItem>
                </Menu>
            </li>
        );
    }

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

    onRenamed(): void {
        this.setState({
            rename: false
        });
    }

    onOpenFile(event: React.MouseEvent<HTMLDivElement>): void {
        FileEditorHelper.openFile(this.props.file as File);
    }
}