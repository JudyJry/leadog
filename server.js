"use strict";

var _http = require("http");

var _path = require("path");

var _fs = require("fs");

var open = require("open");

var _this = void 0;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

//file system module
var hostname = "localhost";
var port = 8000; // setting user-defined type

var mineTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpg",
    "png": "image/png",
    "gif": "image/gif",
    "ico": "image/x-icon",
    "svg": "image/svg+xml",
    'ttc': "font/collection",
    "js": "text/javascript",
    "json": "application/json",
    "css": "text/css",
    "mp4": "video/mp4",
    "wav": "audio/wav",
    "mp3": "audio/mp3"
}; //create http server

(0, _http.createServer)(function (req, res) {
    var uri = new URL(req.url, "http://" + req.headers.host).pathname;
    var fileName = (0, _path.join)(process.cwd(), decodeURI(uri)); //console.log('Loading ' + uri);

    var stats; //check if the file is enter

    try {
        stats = (0, _fs.lstatSync)(fileName);
    } catch (e) {
        res.writeHead(404, {
            'Content-type': 'text/plain'
        });
        res.write('404 Not Found!\n');
        res.end();
        return;
    } //get the file type to check is html type


    if (stats.isFile()) {
        //xxxx.xxxx.html (using reverse to make "html" in the index 0)
        //console.log(extname(fileName));
        var mineType = mineTypes[(0, _path.extname)(fileName).split(".").reverse()[0]];
        res.writeHead(200, {
            'Content-type': mineType,
            "Access-Control-Allow-Origin": "*"
        });
        var fileStream = (0, _fs.createReadStream)(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        //如果發現路徑是資料夾，則找index.html
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {
            'Content-type': 'text/plain'
        });
        res.write('500 Internal Error\n');
        res.end();
    }
}).listen(port, hostname, function () {
    _newArrowCheck(this, _this);
    open("http://" + hostname + ":" + port, "chrome");
    console.log(hostname + ":" + port + " is Ready.");
}.bind(void 0));