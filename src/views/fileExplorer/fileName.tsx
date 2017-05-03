import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as $ from "jquery";
import { FileType, File, Folder, BaseFileItem } from "../../services/file/fileDefinition";
import * as FileExplorerHelper from "./fileExplorerHelper";

interface IFileNameProperty {
    file: BaseFileItem;
    onRequestCloseRename: () => void;
    rename: boolean;
    onRenamed?: (newfile: BaseFileItem) => void;
}

export class FileName extends React.Component<IFileNameProperty, any>{
    constructor(props: IFileNameProperty) {
        super(props);
        this.state = {
            rename: false
        };
        this.onBlur = this.onBlur.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        if (this.props.rename) {
            this.setRenameSelection();
        }
    }

    componentDidUpdate(prevProps: IFileNameProperty, prevState: any) {
        if (this.props.rename && !prevProps.rename) {
            this.setRenameSelection();
        }
    }

    render() {
        return this.props.rename ?
            (<input type="text" className="rename" ref="rename" onBlur={this.onBlur} onKeyPress={this.onKeyPress} onClick={this.onClick} />) :
            (<span>{this.props.file.name}</span>)
    }

    setRenameSelection(): void {
        const textBox = this.refs["rename"] as HTMLInputElement;
        $(textBox).val(this.props.file.name).focus();
        if (this.props.file.type === FileType.Folder) {
            textBox.setSelectionRange(0, this.props.file.name.length);
        } else {
            textBox.setSelectionRange(0, this.props.file.name.length - (this.props.file as File).extension.length);
        }
    }

    onBlur() {
        const newName = $(this.refs["rename"]).val();
        if (newName && newName !== this.props.file.name) {
            const oldName = this.props.file.name;
            FileExplorerHelper.rename(this.props.file, newName, (newItem) => {
                if (newItem) {
                    if (newItem.type === FileType.File) {
                        (this.props.file as File).extension = (newItem as File).extension;
                    }
                    this.props.file.path = newItem.path;
                    if (this.props.onRenamed) {
                        this.props.onRenamed(newItem);
                    }
                }
            });
            this.props.file.name = newName;
        }

        if (this.props.onRequestCloseRename) {
            this.props.onRequestCloseRename();
        }
    }

    onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.which === 13) {
            this.onBlur();
        }
    }

    onClick(event: React.MouseEvent<HTMLInputElement>) {
        event.preventDefault();
        event.stopPropagation();
    }
}