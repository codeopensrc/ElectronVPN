"use strict";

console.log("DWADW");
setTimeout(() => { console.log("DWADWA");}, 10000)
process.on("message", (m) => {
    console.log("Child got message:", m);
})

process.send("Hey")
