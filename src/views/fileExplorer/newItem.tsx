import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as $ from "jquery";
import { FileType, File, Folder, BaseFileItem } from "../../services/file/fileDefinition"
import { LoadingH } from "../common/loadingH";

interface INewItemProperty {
    fileType: FileType;
};

interface INewItemState {
    edit: boolean;
    loading: boolean;
    name: string;
}

export class NewItem extends React.Component<INewItemProperty, INewItemState>{
    constructor(props: INewItemProperty) {
        super(props);
        this.state = {
            edit: true,
            loading: false,
            name: ""
        }

        this.onBlur = this.onBlur.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    componentDidMount(){
        if(this.state.edit){
            const edit = this.refs["rename"] as HTMLInputElement;
            $(edit).focus();
        }
    }

    render() {
        const icon = (<i className="material-icons">{this.props.fileType === FileType.File ? "description" : "folder"}</i>);
        const content = this.state.edit ?
            (<input type="text" className="rename" ref="rename" onBlur={this.onBlur} onKeyPress={this.onKeyPress} />) :
            (<span>{this.state.name}</span>);

        const loading = this.state.loading ? (
            <span style={{ marginLeft: 5 }}><LoadingH /></span>
        ) : null;
        return (
            <li className="file">
                <div className="text">
                    {icon}
                    {content}
                    {loading}
                </div>
            </li>
        );
    }

    onBlur() {
        const edit = this.refs["rename"] as HTMLInputElement;
        const name = $(edit).val();
        this.setState({
            loading: true,
            name: name,
            edit: false
        });
    }

    onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.which === 13) {
            this.onBlur();
        }
    }
}