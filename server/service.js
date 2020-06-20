"use strict";

const http = require("http");
const SERVICE_NAME = process.env.SERVICE_NAME
const SERVICE_PORT = process.env.SERVICE_PORT

// This is dockers default docker0 bridge - Keeping hardcoded until its a problem
const bridgeIP = "172.17.0.1"
const consulAPIPort = 8500;
const IMAGE_VER = process.env.IMAGE_VER

module.exports = {

    register: function() {
        let script = `
            NUM_CONTAINERS=$(docker ps -f status=running -f "label=com.consul.service=${SERVICE_NAME}" | wc -l | awk '{lines=$0-1; print lines}');
            echo $NUM_CONTAINERS;
            if [ "$NUM_CONTAINERS" = 0 ]; then exit 2 ; fi;
            if [ "$NUM_CONTAINERS" > 0 ]; then exit 0 ; fi;`

        let serviceToRegister = {
            "ID": SERVICE_NAME,
            "Name": SERVICE_NAME,
            "Tags": [ IMAGE_VER ],
            "Address": "",
            "Port": +SERVICE_PORT,
            "EnableTagOverride": false,
            "Checks": [
                {
                    "DeregisterCriticalServiceAfter": "12h",
                    "Script": script,
                    "Interval": "20s",
                },
            ]
        }

        let opts = {
            method: "PUT",
            port: consulAPIPort,
            path: `/v1/agent/service/register`,
            hostname: bridgeIP
        }
        let response = "";
        let req = http.request(opts, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => { response += chunk.toString(); });
            res.on('end', () => { console.log(response); });
        })
        req.on("error", (e) => { console.log("ERR:", e) })
        req.end(JSON.stringify(serviceToRegister))

    },

    deregister: function(service, ip, respond) {
        console.log("Deregistering "+service);
        let opts = {
            method: "PUT",
            port: consulAPIPort,
            path: `/v1/agent/service/deregister/${service}`,
            hostname: ip
        }
        let response = "";
        let req = http.request(opts, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => { response += chunk.toString(); });
            res.on('end', () => { console.log("res:", response); respond && respond(response) });
            res.on('error', () => { console.log("err:", response); });
        })
        req.on("error", (e) => { console.log("ERR:", e) })
        req.end()
    }

}
