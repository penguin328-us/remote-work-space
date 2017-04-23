/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IMonacoEditorProperty {
    value?: string;
    language?: string;
    onChange?: (newValue: string) => any;
}

export class MonacoEditor extends React.Component<IMonacoEditorProperty, any>{
    private editor: monaco.editor.IStandaloneCodeEditor;

    constructor(props: any) {
        super(props);
        this.onResize = this.onResize.bind(this);
    }
    componentDidMount(): void {
        const require: any = (window as any)['require'];
        // Monaco requires the AMD module loader to be present on the page. It is not yet
        // compatible with ES6 imports. Once that happens, we can get rid of this.
        // See https://github.com/Microsoft/monaco-editor/issues/18
        require.config({ paths: { 'vs': 'monaco-editor/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            this.editor = monaco.editor.create(this.refs['editor'] as HTMLDivElement, {
                value: this.props.value,
                language: this.props.language,
                theme: "vs-dark"
            });

            this.editor.onDidChangeModelContent(event => {
                if (this.props.onChange) {
                    this.props.onChange(this.editor.getValue());
                }
            });
        });
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount(): void {
        if (this.editor) {
            this.editor.dispose();
            this.editor = undefined;
        }
        window.removeEventListener("resize", this.onResize);
    }

    componentDidUpdate(prevProps: IMonacoEditorProperty) {
        if (prevProps.value !== this.props.value && this.editor) {
            this.editor.setValue(this.props.value);
        }

        if (prevProps.language !== this.props.language) {
            throw new Error('<MonacoEditor> language cannot be changed.');
        }
    }

    render() {
        return (
            <div className="file-editor" ref="editor">
            </div>
        );
    }

    onResize(): void {
        if (this.editor) {
            this.editor.layout();
        }
    }
}