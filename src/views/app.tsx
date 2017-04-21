import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Splitter, SplitterPanePrimary } from "./controls/splitter";

export class App extends React.Component<any, any> {
    render() {
        const firstPane = (<div></div>);
        const secondPane = (<div></div>);
        return (
            <Splitter firstPane={firstPane} secondPane={secondPane} defaultWidth={200} minWidth={50}>
            </Splitter>
        );
    }
}