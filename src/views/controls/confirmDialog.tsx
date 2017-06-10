import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Dialog, DialogTitle, DialogButton } from "./dialog";

interface IConfirmDialogProperty {
    open: boolean;
    onRequestClose: () => void;
    onConfirm: () => void;
    title?: string;
    width?: any;
}

export class ConfirmDialog extends React.Component<IConfirmDialogProperty, any>{
    constructor(props: IConfirmDialogProperty) {
        super(props);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickOK = this.onClickOK.bind(this);
    }

    render() {
        const title = this.props.title ? (
            <DialogTitle>{this.props.title}</DialogTitle>
        ) : null;

        return (
            <Dialog open={this.props.open} width={this.props.width}>
                {title}
                {this.props.children}
                <div style={{
                    paddingTop: 20,
                    paddingLeft: 20,
                    textAlign: "right"
                }}>
                    <DialogButton onClick={this.onClickCancel}>Cancel</DialogButton>
                    <DialogButton onClick={this.onClickOK}>OK</DialogButton>
                </div>
            </Dialog>
        );
    }

    onClickCancel() {
        this.props.onRequestClose();
    }

    onClickOK() {
        this.props.onRequestClose();
        this.props.onConfirm();
    }
}