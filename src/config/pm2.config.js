"use strict";

module.exports = {
    apps: [{
        "name": "App",
        "cwd": "./",
        "watch": true,
        "script": "./server/server.js",
        "out_file": "./logs/server-out.log",
        "error_file": "./logs/server-err.log",
        "log_date_format": "MMMM Do YYYY, h:mm:ss a",
        "min_uptime": 10000,
        "max_restarts": 3,
        "next_gen_js": true,
        "ignore_watch": ["node_modules", "server/bin", "server/output", "logs", ".git"],
        "exec_mode": "cluster",
        "instances": 1
  }]
}
