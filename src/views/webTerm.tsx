import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class WebTerm extends React.Component<any, any>{
    private term: any;
    private pid: string;
    render() {
        return (
            <div className="terminal" ref="terminal"></div>
        );
    }

    componentDidMount(): void {
        const cols = 500;
        const rows = 10;

        const protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
        let socketURL = protocol + location.hostname + ((location.port) ? (':' + location.port) : '') + '/terminals/';

        const self = this;

        fetch('/terminals?cols=' + cols + '&rows=' + rows, { method: 'POST' }).then(function (res) {
            res.text().then(function (pid) {
                self.term = new ((window as any).Terminal)({
                    cursorStyle: "underline",
                    cursorBlink: true
                });
                self.term.open(self.refs["terminal"] as HTMLDivElement);
                self.pid = pid;
                socketURL += pid;
                const socket = new WebSocket(socketURL);
                socket.onopen = () => {
                    self.term.attach(socket);
                    self.term._initialized = true;
                }
            });
        });
    }

    componentWillUnmount(): void {
        if (this.term) {
            this.term.destroy();
            this.term = null;
        }
    }
}