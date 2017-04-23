import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as xTerm from "xterm";

export class Terminal extends React.Component<any, any>{
    private term :xTerm;
    private pid:string;
    render(){
        return (
            <div className="terminal" ref="terminal"></div>
        );
    }

    componentDidMount():void{
        this.term = new xTerm();
        this.term.open(this.refs["terminal"] as HTMLDivElement);

        const cols = 80;
        const rows = 20;

        const protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
        let socketURL = protocol + location.hostname + ((location.port) ? (':' + location.port) : '') + '/terminals/';

        fetch('/terminals?cols=' + cols + '&rows=' + rows, {method: 'POST'}).then(function (res) {
            res.text().then(function (pid) {
                socketURL += pid;
                const socket = new WebSocket(socketURL);
                socket.onopen = () => {
                    this.term.attach(socket);
                    this.term._initialized = true;
                }
            });
        });
    }

    componentWillUnmount():void{
        if(this.term){
            this.term.destroy();
            this.term = null;
        }
    }
}