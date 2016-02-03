'use strict';

const cp = require('child_process');
const fs = require('fs');
const os = require('os')


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

let child = cp.spawn(`ssh`, ['user@ip'], {
  detached: true,
  stdio: ['pipe', 'pipe', 'pipe']
})

child.stdout.on('data', (data) => {
  console.log(`Out: ${data}`)
  $('#results').append(`<br>Out: ${data}`)
})

child.stderr.on('data', (data) => {
  console.log(`Err: ${data}`)
  if(data.indexOf("stdin") === -1){
    $('#results').append(`<br>Err: ${data}`)
  }
})
child.on('exit', (data) => {
  console.log(`Exit: ${data}`)
  $('#results').append(`<br>Exit: ${data}`)
})

$('#terminal-input').on('keypress', (e) => {
  if(e.keyCode == 13) {
    let input = $('#terminal-input').val()
    child.stdin.setEncoding('utf8');
    child.stdin.write("echo "+input.replace(/[|:;\\'"]/gim, ""));
    child.stdin.write(os.EOL);
    $('#terminal-input').val('');
  }
})
