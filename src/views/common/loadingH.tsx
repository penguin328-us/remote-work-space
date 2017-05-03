import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface ILoadingHProperty{
    height?:number
}

export class LoadingH extends React.Component<ILoadingHProperty, any>{
    render() {
        const height = this.props.height || 9;
        return (
            <svg version="1.1" className="loading-h" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                width={height * 2} height={height} viewBox="0 0 18 9" enableBackground="new 0 0 50 50;">
                <rect x="0" y="0" width="4" height="8">
                    <animate attributeName="opacity" attributeType="XML"
                        values="1; .2; 1"
                        begin="0s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="7" y="0" width="4" height="8">
                    <animate attributeName="opacity" attributeType="XML"
                        values="1; .2; 1"
                        begin="0.2s" dur="0.6s" repeatCount="indefinite" />
                </rect>
                <rect x="14" y="0" width="4" height="8">
                    <animate attributeName="opacity" attributeType="XML"
                        values="1; .2; 1"
                        begin="0.4s" dur="0.6s" repeatCount="indefinite" />
                </rect>
            </svg>
        );
    }
}