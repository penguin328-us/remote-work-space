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

export class Splitter extends React.Component<ISplitterProperty, ISplitterState>{
    private splitterRootDiv: HTMLDivElement = null;
    private lastX:number = 0;
    private width: number = 0;
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
        this.onMouseDownn = this.onMouseDownn.bind(this);
        this.onWindowMouseMove = this.onWindowMouseMove.bind(this);
        this.onWindowMouseUp = this.onWindowMouseUp.bind(this);
    }

    public setWidth(width?: number): void {
        this.setState(this.calculateState(width));
    }

    public getWidth(): number {
        return this.width;
    }

    componentDidMount() {
        this.setWidth(this.props.defaultWidth);
    }

    calculateState(width?: number): ISplitterState {
        const handlerbarWidth: number = 5;
        const size = this.getSize();
        if (size) {
            const maxWidth = this.props.vertical ? size.height : size.width;
            width = width || Math.floor((maxWidth - handlerbarWidth) / 2);
            if (width + handlerbarWidth > maxWidth) {
                width = maxWidth - handlerbarWidth;
            }
            const minWidth = this.props.minWidth || 0;
            if (width < minWidth) {
                width = minWidth;
            }
            this.width = width;
            if (this.props.primay === SplitterPanePrimary.Second) {
                width = maxWidth - width - 10;
            }
            return {
                firstPane: {
                    top: 0,
                    left: 0,
                    right: this.props.vertical ? 0 : maxWidth - width,
                    bottom: this.props.vertical ? maxWidth - width : 0
                },
                handlerbar: {
                    top: this.props.vertical ? width : 0,
                    left: this.props.vertical ? 0 : width,
                    right: this.props.vertical ? 0 : maxWidth - width - handlerbarWidth,
                    bottom: this.props.vertical ? maxWidth - width - handlerbarWidth : 0
                },
                secondPane: {
                    top: this.props.vertical ? width + handlerbarWidth : 0,
                    left: this.props.vertical ? 0 : width + handlerbarWidth,
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
            <div className={"splitter " + (this.props.vertical ? "vertical" : "horizontal")} ref={(d) => { this.splitterRootDiv = d; }}>
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
                }} onMouseDown={this.onMouseDownn}></div>
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

    onMouseDownn(e: React.MouseEvent<HTMLDivElement>): void {
        window.addEventListener("mousemove", this.onWindowMouseMove);
        window.addEventListener("mouseup", this.onWindowMouseUp);
        this.lastX = this.props.vertical ? e.pageY : e.pageX;
    }

    onWindowMouseMove(e: MouseEvent): void {
        const newX = this.props.vertical ? e.pageY : e.pageX;
        if (newX !== this.lastX) {
            let difference = newX - this.lastX;
            if(this.props.primay === SplitterPanePrimary.Second){
                difference = -difference;
            }
            const newWidth = this.width + difference;
            this.lastX = newX;
            this.setWidth(newWidth);
        }
    }

    onWindowMouseUp(e: MouseEvent): void {
        window.removeEventListener("mousemove", this.onWindowMouseMove);
        window.removeEventListener("mouseup", this.onWindowMouseUp);
        window.dispatchEvent(new Event("resize"));
    }
}