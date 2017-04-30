import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as $ from "jquery";
import { FileType, File, Folder, BaseFileItem } from "../../services/file/fileDefinition"
import * as FileExplorerHelper from "./fileExplorerHelper";

interface IFileNameProperty {
    file: BaseFileItem,
    onRenamed?: (newfile?: BaseFileItem) => void;
    rename?: boolean;
}

interface IFileNameState {
    rename?: boolean;
}

export class FileName extends React.Component<IFileNameProperty, IFileNameState>{
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
            this.rename();
        }
    }

    componentWillReceiveProps(nextProps: IFileNameProperty) {
        if (nextProps.rename) {
            this.rename();
        }
    }

    render() {
        return this.state.rename ?
            (<input type="text" className="rename" ref="rename" onBlur={this.onBlur} onKeyPress={this.onKeyPress} onClick={this.onClick} />) :
            (<span>{this.props.file.name}</span>)
    }

    rename(): void {
        if (this.state.rename !== true) {
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
    }

    onBlur() {
        const newName = $(this.refs["rename"]).val();
        if (newName && newName !== this.props.file.name) {
            const oldName = this.props.file.name;
            FileExplorerHelper.rename(this.props.file, newName, (newItem) => {
                if (newItem && newItem.type === FileType.File) {
                    (this.props.file as File).extension = (newItem as File).extension;
                }
                this.props.file.path = newItem.path;
                if (this.props.onRenamed) {
                    this.props.onRenamed(newItem);
                }
            });
            this.props.file.name = newName;
        } else {
            if (this.props.onRenamed) {
                this.props.onRenamed();
            }
        }

        this.setState({
            rename: false
        });
    }

    onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.which === 13) {
            this.onBlur();
        }
    }

    onClick(event:React.MouseEvent<HTMLInputElement>){
        event.preventDefault();
        event.stopPropagation();
    }
}