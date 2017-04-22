import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Splitter, SplitterPanePrimary } from "./controls/splitter";
import { FileExplorer } from "./fileExplorer"

export class App extends React.Component<any, any> {
    render() {
        const firstPane = (<FileExplorer></FileExplorer>);
        const secondPane = (<div></div>);
        return (
            <Splitter firstPane={firstPane} secondPane={secondPane} defaultWidth={200}>
            </Splitter>
        );
    }
}