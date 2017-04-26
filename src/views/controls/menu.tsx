import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Popup, IPopupProperty}  from "./popup";

export class Menu extends React.Component<IPopupProperty,any>{
    render(){
        return(
            <Popup show={this.props.show} top={this.props.top} left={this.props.left} bottom={this.props.bottom} right={this.props.right}>
                <ul className="menu">
                    {this.props.children}
                </ul>
            </Popup>
        );
    }
}

export class MenuItem extends React.Component<any, any>{
    render(){
        return(
            <li className="menu-item">{this.props.children}</li>
        );
    }
}

export class MenuDivider extends React.Component<any, any>{
    render(){
        return(
            <li className="menu-divider"><hr/></li>
        );
    }
}