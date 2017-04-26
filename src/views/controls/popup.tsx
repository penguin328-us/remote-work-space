import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface IPopupProperty{
    top?:number,
    left?:number,
    bottom?:number,
    right?:number,
    show?:boolean
}

export class Popup extends React.Component<IPopupProperty, any>{
    render() {
        return (<div className="popup" style={{
            display: this.props.show ? "block" : "none",
            top: this.props.top,
            left: this.props.left,
            bottom: this.props.bottom,
            right: this.props.right
        }}>{this.props.children}</div>);
    }
}