import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class WebTerm extends React.Component<any, any>{
    private term: any;
    private pid: string;

    constructor(props: any) {
        super(props);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    render() {
        return (
            <div className="terminal" ref="terminal"></div>
        );
    }

    componentDidMount(): void {
        const div = this.refs["terminal"] as HTMLDivElement;
        const cols = 80;
        const rows = 20;
        const protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
        let socketURL = protocol + location.hostname + ((location.port) ? (':' + location.port) : '') + '/terminals/';
        const self = this;
        fetch('/terminals?cols=' + cols + '&rows=' + rows, { method: 'POST' }).then(function (res) {
            res.text().then(function (pid) {
                self.term = new ((window as any).Terminal)({
                    cursorBlink: true,
                });
                self.term.open(div);
                self.term.on('resize', function (size: any) {
                    if (!pid) {
                        return;
                    }
                    var cols = size.cols,
                        rows = size.rows,
                        url = '/terminals/' + pid + '/size?cols=' + cols + '&rows=' + rows;

                    fetch(url, { method: 'POST' });
                });

                self.term.fit();
                self.term.setOption("cursorStyle", "underline");
                self.pid = pid;
                socketURL += pid;
                const socket = new WebSocket(socketURL);
                socket.onopen = () => {
                    self.term.attach(socket);
                    self.term._initialized = true;
                }
            });
        });

        window.addEventListener("resize", this.onWindowResize);
    }

    componentWillUnmount(): void {
        if (this.term) {
            this.term.destroy();
            this.term = null;
        }
        window.removeEventListener("resize", this.onWindowResize);
    }

    onWindowResize(): void {
        if (this.term) {
            this.term.fit();
        }
    }
}