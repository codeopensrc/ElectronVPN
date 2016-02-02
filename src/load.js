'use strict';

const exec = require('child_process').exec;
const $ = require('jquery');
// window.$ = window.jQuery = require('jquery')


let proc = exec('nmap -sn -PS22 10.8.0.*', {
  shell: "/bin/bash"
}, (err, stdout, stderr) => {
  if(err) {
    document.getElementById('results').innerHTML = "<div>No hosts found, are you connected to the VPN?"
  }
  else {
    let re = stdout.match(/\d+\.\d+\.\d+\.\d+/g);
    let hosts = re.map((host) => {
      return `<div>Found ${host}, <a id="blah" class="ssh" href="#">ssh</a></div>`
    })
    document.getElementById('results').innerHTML = hosts.join('')
  }


});

$('#main').on('click', function() { console.log("fesfsef") })


$('#blah').on('click', function() {
  console.log("herer")
  var ip = this.id;
  console.log(ip)
  // if(ip === '10.8.0.22') {
  //   var newSSH = exec(`ssh kc@${ip}`, {shell: "/bin/bash"}, function(err, stdo, stde) {
  //     console.log(stdo);
  //     console.log(err);
  //     console.log(std);
  //   })
  // }
})


setTimeout(() => {
  proc.kill('SIGHUP')
}, 10000)
