import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Splitter, SplitterPanePrimary } from "./controls/splitter";
import { FileExplorer } from "./fileExplorer/fileExplorer"
import { FileEditContainer } from "./fileEditContainer";
import { WebTerm } from "./webTerm";

export class App extends React.Component<any, any> {
    render() {
        const fileEdit = (<FileEditContainer></FileEditContainer>);
        const misc = (<WebTerm />);

        const fileExplorer = (<FileExplorer></FileExplorer>);
        const workSpace = (<Splitter firstPane={fileEdit} secondPane={misc} defaultWidth={200} primay={SplitterPanePrimary.Second} vertical={true} />);
        return (
            <Splitter firstPane={fileExplorer} secondPane={workSpace} defaultWidth={200}>
            </Splitter>
        );
    }
}