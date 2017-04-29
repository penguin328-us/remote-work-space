import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FileType, File, Folder, FileServiceNameSpace, BaseFileItem } from "../../services/file/fileDefinition"
import { ClientFolder } from "../../services/file/clientFolder";
import * as FileExplorerHelper from "./fileExplorerHelper";
import * as FileEditorHelper from "../fileEditor/fileEditorHelper";
import * as $ from "jquery";
import { Loading } from "../loading";
import { Menu, MenuItem, MenuDivider } from "../controls/menu";
import { IPosition } from "../common/layout";

interface ITreeItemProperty {
    file: BaseFileItem;
    expand?: boolean;
}

interface ITreeItemState {
    expand?: boolean;
    loading: boolean;
    showContextMenu: boolean;
    contextMenuPos: IPosition;
    rename?: boolean;
}

export class TreeItem extends React.Component<ITreeItemProperty, ITreeItemState>{
    private children: BaseFileItem[] = [];
    private clientFolder: ClientFolder = undefined;
    constructor(props: ITreeItemProperty) {
        super(props);
        this.state = {
            expand: false,
            loading: false,
            showContextMenu: false,
            contextMenuPos: {}
        }
        this.onToggleExpand = this.onToggleExpand.bind(this);
        this.onOpenFile = this.onOpenFile.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onRenameKeyPress = this.onRenameKeyPress.bind(this);
        this.onRenameChange = this.onRenameChange.bind(this);
        if (this.props.file.type === FileType.Folder) {
            this.clientFolder = new ClientFolder(this.props.file.path);
        }

        if (this.props.expand && this.props.file.type === FileType.Folder) {
            this.onToggleExpand();
        }
    }

    render() {
        return this.props.file.type === FileType.Folder ? this.renderFolder() : this.renderFile();
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
        });

        $("body").one("mousedown", (() => {
            this.setState({
                showContextMenu: false
            });
        }).bind(this));

        return false;
    }

    onRename(): void {
        this.setState({
            rename: true
        }, () => {
            const textBox = this.refs["rename"] as HTMLInputElement;
            $(textBox).val(this.props.file.name).focus();
            if (this.props.file.type === FileType.Folder) {
                textBox.setSelectionRange(0, this.props.file.name.length);
            } else {
                textBox.setSelectionRange(0, this.props.file.name.length - (this.props.file as File).extension.length);
            }
        });
    }

    onRenameKeyPress(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.which === 13) {
            this.onRenameChange();
        }
    }

    onRenameChange(): void {
        const newName = $(this.refs["rename"]).val();
        if (newName && newName !== this.props.file.name) {
            const oldName = this.props.file.name;
            FileExplorerHelper.rename(this.props.file,newName,(newItem)=>{
                if(newItem && newItem.type === FileType.Folder){
                    this.loadChildren();
                }else{
                    (this.props.file as File).extension = (newItem as File).extension;
                }
                this.props.file.path = newItem.path;
            });

            this.props.file.name = newName;
        }
        this.setState({
            rename: false
        });
    }

    //#endregion "Common Functions"

    //#region "File"

    renderFile() {
        return (
            <li className="file">
                <div className="text" onDoubleClick={this.onOpenFile} onContextMenu={this.onContextMenu}>
                    <i className="material-icons">description</i>
                    {
                        this.state.rename ?
                            (<input type="text" className="rename" ref="rename" onBlur={this.onRenameChange} onKeyPress={this.onRenameKeyPress} />)
                            : (<span>{this.props.file.name}</span>)
                    }
                </div>
                <Menu show={this.state.showContextMenu} position={this.state.contextMenuPos}>
                    <MenuItem onClick={this.onRename}>Rename File</MenuItem>
                    <MenuItem>Delete File</MenuItem>
                </Menu>
            </li>
        );
    }

    onOpenFile(event: React.MouseEvent<HTMLDivElement>): void {
        FileEditorHelper.openFile(this.props.file as File);
    }

    //#endregion "File"

    //#region "Folder"

    renderFolder() {
        const expand = this.state.expand;
        const childrenNodes: any[] = this.state.expand ?
            (this.children.filter(f => f.type === FileType.Folder).map(f => {
                return (<TreeItem key={f.path} file={f} />)
            })).concat((this.children.filter(f => f.type === FileType.File).map(f => {
                return (<TreeItem key={f.path} file={f} />)
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
                    {
                        this.state.rename ?
                            (<input type="text" className="rename" ref="rename" onBlur={this.onRenameChange} onKeyPress={this.onRenameKeyPress} />)
                            : (<span>{this.props.file.name}</span>)
                    }
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
        )
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