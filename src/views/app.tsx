import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Splitter, SplitterPanePrimary } from "./controls/splitter";
import { FileExplorer } from "./fileExplorer"
import { FileEditContainer } from "./fileEditContainer";

export class App extends React.Component<any, any> {
    render() {
        const fileEdit = (<FileEditContainer></FileEditContainer>);
        const misc = (<div></div>);

        const fileExplorer = (<FileExplorer></FileExplorer>);
        const workSpace = (<Splitter firstPane={fileEdit} secondPane={misc} defaultWidth={200} primay={SplitterPanePrimary.Second} vertical={true} />);
        return (
            <Splitter firstPane={fileExplorer} secondPane={workSpace} defaultWidth={200}>
            </Splitter>
        );
    }
}