require('./globals');
const http = require('http');
const path = require('path');
const fs = require('fs');
const queryStringHandler = require('qs');
const controllers = require('./controllers/ControllerLoader').controllers;
const formidable = require('formidable');
const staticServer = require('node-static');
const staticFileServer = new staticServer.Server(
    configs().publicDir,
    {
        cache: 3600,
        gzip: true
    }
);
const viewServer = new staticServer.Server(
    configs().viewsDir,
);

const server = http.createServer((req, res) => {
    req.parsedURL = new URL(path.join(configs().hostname, req.url));
    request(req);
    console.log(req.url);

    route = getControllerMethodName(req);
    console.log(route)
    getRequestData(req).then((data) => {
        if (req.parsedURL.pathname.search('/api') >= 0) {
            if (controllers[route.controller] != undefined) {
                response = controllers[route.controller][route.method](data);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(response), "binary");
                res.end();
                return;
            }

            res.writeHead(404);
            res.end(route.controller + 'Controller not found!');
            return;
        }

        if (controllers[route.controller] != undefined) {
            viewFile = controllers[route.controller][route.method](data);
            viewServer.serveFile(viewFile, 200, {}, req, res);
            return;
        }

        staticFileServer.serve(req, res, function (e, response) {
            if (e && (e.status === 404)) { // If the file wasn't found
                viewServer.serveFile(
                    configs().templates.notFound,
                    404,
                    {},
                    req,
                    res
                );
            }
        });
    });
});

server.listen(80, () => {
    console.log('listen on port: 80');
});

async function getRequestData(req) {
    let promise = new Promise((resolve, reject) => {
        let data = queryStringHandler.parse(req.parsedURL.search);

        if (req.method == 'GET') {
            resolve(data);
        }

        let postData = {
            files: {},
            fields: {}
        };
        let pd = new formidable.IncomingForm();
        // if (!fs.existsSync(configs().uploadDir)) {
        //     fs.mkdirSync(configs().uploadDir);
        // }
        // pd.uploadDir = configs().uploadDir;

        pd.parse(req, (err, fields, files) => {
            postData.fields = Object.assign(postData.fields, fields);
            postData.files = Object.assign(postData.files, files);
        });

        pd.on('end', (fields, files) => {
            data = Object.assign(data, postData);

            resolve(data);
        });
    })

    return await promise;
}

function getControllerMethodName(req) {
    parts = req.parsedURL.pathname.split('/');
    console.log(parts)

    controllerPlace = 1;
    if (req.parsedURL.pathname.search('/api') >= 0) {
        controllerPlace++;
    }

    return {
        controller: (parts[controllerPlace] != undefined ? parts[controllerPlace] : 'home'),
        method: (parts[controllerPlace + 1] != undefined ? parts[controllerPlace + 1] : 'index')
    };
}


