import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FileType, File, Folder, BaseFileItem } from "../../services/file/fileDefinition"

interface IFileRenameTextboxProperty {
    file: BaseFileItem,
    onRename: (newName: string) => void;
}

export class FileRenameTextbox extends React.Component<IFileRenameTextboxProperty, any>{
    constructor(props:IFileRenameTextboxProperty){
        super(props);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    componentDidMount() {
        const textBox = this.refs["rename"] as HTMLInputElement;
        $(textBox).val(this.props.file.name).focus();
        if (this.props.file.type === FileType.Folder) {
            textBox.setSelectionRange(0, this.props.file.name.length);
        } else {
            textBox.setSelectionRange(0, this.props.file.name.length - (this.props.file as File).extension.length);
        }
    }

    render(){
        return (<input type="text" className="rename" ref="rename" onBlur={this.onBlur} onKeyPress={this.onKeyPress} />)
    }

    onBlur(){
        const newName = $(this.refs["rename"]).val();
        if(this.props.onRename){
            this.props.onRename(newName);
        }
    }

    onKeyPress(event: React.KeyboardEvent<HTMLInputElement>){
        if (event.which === 13) {
            this.onBlur();
        }
    }
}