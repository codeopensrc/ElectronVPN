'use strict';

const WebSocketServer = require('ws').Server;

const doNotSendRes = ["Client connected", "Client disconnected"];

module.exports = {

  init: function() {
    this.wss = new WebSocketServer({port: 5050});
    this.registerEventHandlers();
  },

  registerEventHandlers: function() {
    this.wss.on("connection", (ws) => {
      ws.send(`Welcome to ${ws.upgradeReq.url.replace("\/", "")}!`);
      ws.on('message', (msg) => {
        switch(msg) {
          case "ls": this.ls(ws.upgradeReq.url, ws); return;
          break;
          default: this.broadcast(`${msg}`, ws.upgradeReq.url, ws);
        }
      })
    });
  },

  ls: function(chatroom, ws) {
    let clientsInRoom = this.wss.clients.filter((client) => {
      return client.upgradeReq.url === chatroom
    })
    ws.send(`ls`)
    ws.send(`Connected users: ${clientsInRoom.length}`)
  },

  broadcast: function(msg, chatroom, ws) {
    let shouldNotSendRes = doNotSendRes.some((doNotSend) => {
      return msg.indexOf(doNotSend) > -1
    })
    this.wss.clients.forEach((client) => {
      if(client.upgradeReq.headers['sec-websocket-key'] ===
        ws.upgradeReq.headers['sec-websocket-key'] &&
        shouldNotSendRes) { return; }
      let clientChatroom = client.upgradeReq.url;
      if(clientChatroom === chatroom) {
        client.send(msg);
      }
    })
  },

}
