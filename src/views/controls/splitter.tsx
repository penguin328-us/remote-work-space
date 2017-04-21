import * as React from 'react';
import * as ReactDOM from 'react-dom';

export enum SplitterPanePrimary {
    First,
    Second,
}

export interface ISplitterProperty {
    vertical?: boolean;
    minWidth?: number;
    defaultWidth?: number;
    primay?: SplitterPanePrimary;
    firstPane: any;
    secondPane: any;
}

interface IPosition {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

interface ISize {
    width: number;
    height: number;
}

interface ISplitterState {
    firstPane: IPosition;
    handlerbar: IPosition;
    secondPane: IPosition;
}

const handlerbarWidth: number = 5;

export class Splitter extends React.Component<ISplitterProperty, ISplitterState>{
    private splitterRootDiv: HTMLDivElement = null;

    constructor(props: ISplitterProperty) {
        super(props);
        const zeroPosition: IPosition = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        };
        this.state = {
            firstPane: zeroPosition,
            handlerbar: zeroPosition,
            secondPane: zeroPosition,
        };
    }

    componentDidMount() {
        this.setState(this.calculateState(this.props.defaultWidth));
    }

    calculateState(width?: number): ISplitterState {
        const size = this.getSize();
        if (size) {
            width = width || Math.floor((size.width - handlerbarWidth) / 2);
            if (width + handlerbarWidth > size.width) {
                width = size.width - handlerbarWidth;
            }
            const minWidth = this.props.minWidth || 0;
            if (width < minWidth) {
                width = minWidth;
            }
            return {
                firstPane: {
                    top: 0,
                    left: 0,
                    right: size.width - width,
                    bottom: 0
                },
                handlerbar: {
                    top: 0,
                    left: width,
                    right: size.width - width - handlerbarWidth,
                    bottom: 0
                },
                secondPane: {
                    top: 0,
                    left: width + handlerbarWidth,
                    right: 0,
                    bottom: 0
                }
            }
        }
    }

    getSize(): ISize {
        if (this.splitterRootDiv) {
            return {
                width: this.splitterRootDiv.clientWidth,
                height: this.splitterRootDiv.clientHeight,
            }
        }
        return null;
    }

    render() {
        return (
            <div className="splitter" ref={(d) => { this.splitterRootDiv = d; }}>
                <div style={{
                    position: "absolute",
                    top: this.state.firstPane.top,
                    left: this.state.firstPane.left,
                    bottom: this.state.firstPane.bottom,
                    right: this.state.firstPane.right
                }}>
                    {this.props.firstPane}
                </div>
                <div className="handlerbar" style={{
                    position: "absolute",
                    top: this.state.handlerbar.top,
                    left: this.state.handlerbar.left,
                    bottom: this.state.handlerbar.bottom,
                    right: this.state.handlerbar.right
                }}></div>
                <div style={{
                    position: "absolute",
                    top: this.state.secondPane.top,
                    left: this.state.secondPane.left,
                    bottom: this.state.secondPane.bottom,
                    right: this.state.secondPane.right
                }}>
                    {this.props.secondPane}
                </div>
            </div>
        );
    }
}