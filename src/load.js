'use strict';

const cp = require('child_process');
// const $ = require('jquery');


let proc = cp.exec('nmap -sn -PS22 10.8.0.*', {
  shell: "/bin/bash"
}, (err, stdout, stderr) => {
  if(err) {
    document.getElementById('results').innerHTML = "<div>No hosts found, are you connected to the VPN?"
  }
  else {
    let re = stdout.match(/\d+\.\d+\.\d+\.\d+/g);
    let hosts = re.map((host) => {
      return `<div>Found ${host} <a id="${host}" class="ssh" href="#">Click to SSH</a></div>`
    })
    $('#results').append(hosts.join(''))
    let newSSH = cp.fork(`${__dirname}/src/child.js`);
    newSSH.on("message", (m) => {
      console.log("Message Received: ", m)
    })

    $('.ssh').on('click', function() {
      console.log("clicked")
      let ip = this.id;
      if(ip === '10.8.0.22') {
        newSSH.send({hello: "world"})
      }
      if(ip === "10.8.0.6") {
        let file = cp.execFile("ssh", ['user@ip', 'pm2 list']);
        file.stdout.on('data', (data) => {
          console.log(data);
        })
        file.stderr.on('data', (data) => {
          console.log(data);
        })
        file.on('exit', () => {
          console.log("exit")
        })
      }
    })
  }

});


setTimeout(() => {
  proc.kill('SIGHUP')
}, 10000)
