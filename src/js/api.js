"use strict";

const api = {

    get: function (type, opts, callback) {
        // if(!opts.id) { return alert("Must provide an 'id' property to options") }
        opts.type = type

        let request = {
            method: "GET"
        }
        fetch(`${HOST}/api/get/${type}`, request)
        .then((r) => r.json())
        .then(callback)
        .catch((e) => console.log("E:", e))
    },

    post: function (type, opts, callback) {
        // if(!opts.id) { return alert("Must provide an 'id' property to options") }
        opts.type = type
        let request = {
            method: "POST",
            body: JSON.stringify(opts),
        }
        fetch(`${HOST}/api/post/${type}`, request)
        .then((r) => r.json())
        .then(callback)
        .catch((e) => console.log("E:", e))
    },

    put: function (type, opts, callback) {
        // if(!opts.id) { return alert("Must provide an 'id' property to options") }
        opts.type = type
        let request = {
            method: "PUT",
            body: JSON.stringify(opts),
        }
        fetch(`${HOST}/api/put/${type}`, request)
        .then((r) => r.json())
        .then(callback)
        .catch((e) => console.log("E:", e))
    },

}

module.exports = api
