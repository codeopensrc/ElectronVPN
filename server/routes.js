'use strict';

const routes = function (req, res) {
    //Convert post data to string
    let input = '';
    req.on('data', (buffer) => { input += buffer.toString(); })

    const respond = (response) => {
        response = response || "";
        res.writeHead(200, {'Access-Control-Allow-Origin' : '*'} );
        "err" === response && res.end("err") // TODO: We should really send a more explicit msg in future
        "err" !== response && res.end(JSON.stringify(response));
    }

    req.on("end", () => {
        let parsed = input ? JSON.parse(input) : "";

        switch(req.url) {
            case "/": "";
            break;
            default: respond();
        }
    })
}

module.exports = routes;
