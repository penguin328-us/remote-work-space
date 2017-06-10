import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { IPosition } from "../common/layout";
import { Menu } from "./menu";
import * as $ from "jquery";

interface IContextMenuProperty {
    open: boolean;
    x: number;
    y: number;
    onRequestClose: () => void;
}

interface IContextMenuState {
    position: IPosition
}

export class ContextMenu extends React.Component<IContextMenuProperty, IContextMenuState>{
    constructor(props: IContextMenuProperty) {
        super(props);
        this.state = {
            position: {}
        };
    }

    componentDidMount() {
        this.setPosition();
        this.setupCloseEvent();
    }

    componentWillReceiveProps(nextProps: IContextMenuProperty) {
        if (this.props.x !== nextProps.x ||
            this.props.y !== nextProps.y) {
            this.setPosition(nextProps.open, nextProps);
        }
    }

    componentDidUpdate(prevProps: IContextMenuProperty, prevState: IContextMenuState) {
        if (this.props.open && !prevProps.open) {
            this.setupCloseEvent();
        }
    }

    render() {
        return (
            <Menu open={this.props.open} position={this.state.position}>
                {this.props.children}
            </Menu>);
    }

    setupCloseEvent() {
        if (this.props.open) {
            setTimeout(() => {
                $("body").one("mouseup", () => {
                    if (this.props.onRequestClose) {
                        this.props.onRequestClose();
                    }
                });
            }, 300);
        }
    }

    setPosition(force?: boolean, props?: IContextMenuProperty) {
        if (this.props.open || force) {
            const p = props|| this.props;
            const width = window.innerWidth;
            const height = window.innerHeight;

            const maxMenuWidth = 250;
            const maxMenuHeight = React.Children.count(this.props.children) * 30 + 10;
            const left = (width - p.x) > maxMenuWidth;
            const top = (height - p.y) > maxMenuHeight;
            this.setState({
                position: {
                    top: top ? p.y : undefined,
                    bottom: top ? undefined : height - p.y,
                    left: left ? p.x : undefined,
                    right: left ? undefined : width - p.x
                }
            })
        }
    }
}