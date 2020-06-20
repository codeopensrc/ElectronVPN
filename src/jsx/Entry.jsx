"use strict";

import React from 'react';
import DOM from 'react-dom';
import vpn from '../js/vpn.js';


import Input from "./Input.jsx"

require("../style/Entry.less")

class Entry extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: "",
            ip: "",
            port: "",
            cmd: "",
            network: [],
            connection: "Disconnected"
        }
        this.connect = this.connect.bind(this);
        this.updateText = this.updateText.bind(this);
        this.startProxy = this.startProxy.bind(this);
        this.stopProxy = this.stopProxy.bind(this);
        this.issueCommand = this.issueCommand.bind(this);
        this.handleMsg = this.handleMsg.bind(this);
    }

    componentDidMount() {}

    connect() {
        vpn.connectOVPN(this.handleMsg)
    }

    startProxy() {
        vpn.startProxy(this.state);
    }

    stopProxy() {
        vpn.stopProxy();
    }

    updateText(prop, val) {
        this.setState({[prop]: val})
    }

    handleMsg(msg) {
        if(msg.type === "network") {
            let rows = msg.content.split("\n")
            rows.forEach((row) => this.state.network.push(row))
            this.setState({network: this.state.network})
        }
        if(msg.type === "connection") {
           this.setState({connection: msg.content})
       }
    }

    issueCommand() {
        vpn.sendCmd(this.state.cmd, this.handleMsg)
    }

    render() {

        // <Input placeholder={"Account"}/>
        // <Input placeholder={"Password"}/>

        let networkRows = this.state.network.map((msg, i) => {
            return (
                <span key={i} className={'row'}>{msg}</span>
            )
        })

        return (
            <div id="component-entry">
                <h2 id={`productTitle`}>ElecVPN</h2>
                <Input onChange={this.updateText.bind(this, "user")} placeholder={"User"}/>
                <Input onChange={this.updateText.bind(this, "ip")} placeholder={"IP"}/>
                <Input onChange={this.updateText.bind(this, "port")} placeholder={"Port"}/>
                <Input onChange={this.updateText.bind(this, "cmd")} placeholder={"Cmd"}/>
                <button id={`loginButton`} onClick={this.connect}>Start VPN</button>
                <button id={`loginButton`} onClick={this.startProxy}>Start Proxy</button>
                <button id={`loginButton`} onClick={this.stopProxy}>Stop Proxy</button>
                <button id={`loginButton`} onClick={this.issueCommand}>Issue Cmd</button>
                <div className={`loginLinks`}>
                    <a className={`loginHelp`} href="#signup">Sign Up </a>
                    <span style={{color: "white"}}>        |     </span>
                    <a className={`loginHelp`} href="#forgot"> Forgot Password</a>
                </div>
                <div id={"connectionStatus"}>{this.state.connection}</div>
                <div id={"networkInfo"}>{networkRows}</div>

            </div>
        );
    }

}

DOM.render(<Entry />, document.getElementById("main"))
