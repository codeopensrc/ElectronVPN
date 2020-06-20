"use strict";

const net = require("net");

const cp = require("child_process");
const spawn = cp.spawn;
const exec = cp.exec;
const fork = cp.fork;
const execFile = cp.execFile
const spawnFile = cp.spawnFile
const forkFile = cp.forkFile

const PROXY_NET_PORT = process.env.PROXY_NET_PORT || 2000;
let vpn_connected = false;


const funcs = {
    server: null,

    sendCmd(cmd, status) {
        let proc = exec(cmd, {shell: "/bin/bash"})
        // sudo ifconfig [wlan1, eth1, etc..]:1 192.168.30.128 netmask 255.255.255.0

        proc.stdout.on("data", (data) => {
            console.log(`sendCmd: Out: ${data}`);
            if(cmd.match(/nmap/) && data) {
                console.log(data);
                status({type: "network", content: data})
            }
        })

        proc.stderr.on("data", (data) => {
            console.log(`sendCmd: Err: ${data}`);
        })

        proc.on('close', (code) => {
            console.log(`sendCmd: child process exited with code ${code}`);
        });
    },

    connectOVPN(statusFunc)  {
        if(vpn_connected) { return console.log("VPN already started!"); }

        // Inactivity timeout (--ping-restart), restarting

        let openvpn = exec("/usr/sbin/openvpn --config /root/vpn/no-route.ovpn", { shell: '/bin/bash' })
        openvpn.stdout.on("data", (data) => {
            console.log(`OVPN: Out: ${data}`);
            if(data.match(/Initialization Sequence Completed/)) {
                console.log("Connected!");
                vpn_connected = true;
                statusFunc({type: "connection", content: "Connected"})
                this.sendCmd("nmap -sP -PS1194 10.8.0.0/24 | grep report", statusFunc)
            }
        })

        openvpn.stderr.on("data", (data) => {
            console.log(`OVPN: Err: ${data}`);
            vpn_connected = false;
            this.stopProxy();
            statusFunc({type: "connection", content: "Disconnected"})

        })

        openvpn.on('close', (code) => {
            console.log(`OVPN: child process exited with code ${code}`);
            vpn_connected = false;
            this.stopProxy();
            statusFunc({type: "connection", content: "Disconnected"})

        });
    },


    startProxy(connection) {
        let PORT = connection.port;
        let IP = connection.ip;

        if(!vpn_connected) { return console.log("Connect to VPN first!"); }
        if(this.server) { return console.log("Server already started"); }

        console.log("Setting up proxy...");
        console.log(connection.port, connection.ip, connection.user);
        if(!connection.port || !connection.ip) { return console.log("Enter IP/Port"); }

        this.server = net.createServer((socket) => {
            const client = net.connect(PORT, IP)
            socket.pipe(client).pipe(socket);
            socket.on("close", function() {
                console.log("Close");
            })
            socket.on("error", function(err) {
                console.log("err:", err.toString());
            })
        }).listen(PROXY_NET_PORT, console.log("Net listening on: ", PROXY_NET_PORT))

        this.server.on("close", () => {
            this.server = null;
        })
        this.server.on("error", () => {
            this.server = null;
        })

    },

    stopProxy() {
        this.server && console.log("Attempting to close");
        this.server && this.server.close(() => {
            console.log("Closed Net Server");
            this.server = null;
        })
        !this.server && console.log("Server not started");
    }

}

module.exports = funcs;
