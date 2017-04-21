import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Splitter } from "./controls/splitter";

export class Layout extends React.Component<any, any> {
    render() {
        return (
            <Splitter>
                <div></div>
                <div></div>
            </Splitter>
        );
    }
}