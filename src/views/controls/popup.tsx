import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IPosition } from "../common/layout"


export interface IPopupProperty {
    position: IPosition
    open?: boolean
}

export class Popup extends React.Component<IPopupProperty, any>{
    render() {
        return (<div className="popup" style={{
            display: this.props.open ? "block" : "none",
            top: this.props.position.top,
            left: this.props.position.left,
            bottom: this.props.position.bottom,
            right: this.props.position.right
        }}>{this.props.children}</div>);
    }
}