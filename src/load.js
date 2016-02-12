'use strict';

const cp = require('child_process');
const fs = require('fs');
const os = require('os');
const Websocket = require('ws');
const webSocketUrl = "wss://cjones-nodejs.herokuapp.com";
// const webSocketUrl = "ws://localhost";

let WS = '';
let curChatroom = '';

const newWebSocket = function(newChatId) {
  let chat = newChatId ? newChatId : "Chatroom-1";

  WS = new Websocket(`${webSocketUrl}/${chat}`
    , {
    protocolVersion: 8,
    origin: 'https://cjones-nodejs.herokuapp.com'
  }
  );
  WS.on('open', () => {
    WS.send(`Client connected to ${chat}`);
    curChatroom = chat;
  });
  WS.on('message', (data, flags) => {
    $('#results').append(`${data}<br>`);
    $("#terminal").scrollTop($("#terminal")[0].scrollHeight);
  });
  WS.on('close', () => {
    console.log(`Disconnected from ${chat}`)
  });
};

newWebSocket();

$('#terminal-input').on('keypress', (e) => {
  if(e.keyCode == 13) {
    let input = $('#terminal-input').val()
    WS.send(input);
    $('#terminal-input').val('');
  }
});

$('.chat').on('click', function() {
  WS.send(`Client disconnected from ${curChatroom}`);
  setTimeout(() => {
    WS.close();
    let newChatId = this.id;
    newWebSocket(newChatId);
  }, 50)

})


// $.post("http://localhost:8080", JSON.stringify({data: "hello"}), (data) => {
//   // console.log(data);
//   console.log("Received res")
// });

// let proc = cp.exec('nmap -sn -PS22 10.8.0.*', {
//   shell: "/bin/bash",
//   timeout: 15000
// }, (err, stdout, stderr) => {
//   if(err) {
//     document.getElementById('results').innerHTML = "<div>No hosts found, are you connected to the VPN?"
//   }
//   else {
//     let re = stdout.match(/\d+\.\d+\.\d+\.\d+/g);
//     let hosts = re.map((host) => {
//       return `<div>Found ${host} <a id="${host}" class="ssh" href="#">Click to SSH</a></div>`
//     })
//     $('#results').append(hosts.join(''))
//   }
//
//   $('.ssh').on('click', function() {
//     console.log("clicked")
//     let ip = this.id;
//   })
//
// });
//
// let child = cp.spawn(`ssh`, ['user@ip'], {
//   detached: true,
//   stdio: ['pipe', 'pipe', 'pipe']
// })
//
// child.stdout.on('data', (data) => {
//   console.log(`Out: ${data}`)
//   $('#results').append(`<br>Out: ${data}`)
// })
//
// child.stderr.on('data', (data) => {
//   console.log(`Err: ${data}`)
//   if(data.indexOf("stdin") === -1){
//     $('#results').append(`<br>Err: ${data}`)
//   }
// })
// child.on('exit', (data) => {
//   console.log(`Exit: ${data}`)
//   $('#results').append(`<br>Exit: ${data}`)
// })
