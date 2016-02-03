'use strict';

const cp = require('child_process');

let file = cp.execFile("gnome-terminal", {cwd: "/Users/cjones/.ssh"});
// ['-i', 'id_rsa', '-T', 'user@ip', 'ls']
file.stdout.on('data', (data) => {
  process.send({data: data});
  // console.log(data);
})
file.stderr.on('data', (data) => {
  process.send({data: data});
  // console.log(data);
})
file.on('exit', () => {
  process.send({data: "end"});
  console.log("exit")
})

// process.on('message', (m) => {
//   console.log("CHILD got message: ", m);
//   process.send({data: "BACK AT YOU"});
// })
