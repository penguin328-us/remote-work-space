import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Popup, IPopupProperty } from "./popup";
import { IPosition } from "../common/layout";
export class Menu extends React.Component<IPopupProperty, any>{
    render() {
        return (
            <Popup show={this.props.show} position={this.props.position}>
                <ul className="menu">
                    {this.props.children}
                </ul>
            </Popup>
        );
    }
}

interface IMenuItemProperty {
    onClick?: () => void;
}

export class MenuItem extends React.Component<IMenuItemProperty, any>{
    constructor(props: IMenuItemProperty) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    render() {
        return (
            <li className="menu-item" onClick={this.onClick}>{this.props.children}</li>
        );
    }
    onClick(): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }
}

export class MenuDivider extends React.Component<any, any>{
    render() {
        return (
            <li className="menu-divider"><hr /></li>
        );
    }
}