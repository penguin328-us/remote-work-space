import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as FileClient from "../services/file/fileClient";

import { Loading } from "./loading";
import * as FileEditHelper from "./fileEditHelper";

import { MonacoEditor } from "./monacoEditor";

export class FileEditor extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.onActiveFileChanged = this.onActiveFileChanged.bind(this);
    }
    componentDidMount(): void {
        FileEditHelper.ActiveFileChangeEvent.on(this.onActiveFileChanged);
    }

    componentWillUnmount(): void {
        FileEditHelper.ActiveFileChangeEvent.off(this.onActiveFileChanged);
    }

    render() {
        return (
            <MonacoEditor value="this is a test" />
        );
    }

    onActiveFileChanged(activeFile: string): void {

    }
}