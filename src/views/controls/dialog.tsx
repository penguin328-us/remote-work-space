import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IDialogProperty {
    modal?: boolean;
    open: boolean;
    width?:any;
}

export class Dialog extends React.Component<IDialogProperty, any>{
    render() {
        return this.props.open ? (
            <div className="dialog-bg">
                <div className="dialog" style={{
                    maxWidth: this.props.width ? "none" : "100%",
                    width: this.props.width ? this.props.width : 768,
                }}>
                    {this.props.children}
                </div>
            </div>
        ) : null;
    }
}

export class DialogTitle extends React.Component<any,any>{
    render(){
        return (
            <div className="dialog-title">
                {this.props.children}
            </div>
        );
    }
}

interface IDialogButtonProperty {
    onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

export class DialogButton extends React.Component<IDialogButtonProperty, any>{
    render() {
        return (
            <span className="dialog-button" onClick={this.props.onClick}>
                {this.props.children}
            </span>
        );
    }
}