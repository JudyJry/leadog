import { createServer } from 'http';
import { join, extname } from 'path';
import { lstatSync, createReadStream } from 'fs'; //file system module
import open from 'open';

const hostname = "localhost";
const port = 8000;
// setting user-defined type
const mineTypes = {
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
};

//create http server
createServer(function (req, res) {
    let uri = new URL(req.url, `http://${req.headers.host}`).pathname;
    let fileName = join(process.cwd(), decodeURI(uri));
    //console.log('Loading ' + uri);
    let stats;

    //check if the file is enter
    try {
        stats = lstatSync(fileName);
    } catch (e) {
        res.writeHead(404, { 'Content-type': 'text/plain' });
        res.write('404 Not Found!\n');
        res.end();
        return;
    }

    //get the file type to check is html type
    if (stats.isFile()) { //xxxx.xxxx.html (using reverse to make "html" in the index 0)
        //console.log(extname(fileName));
        let mineType = mineTypes[extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, { 'Content-type': mineType, "Access-Control-Allow-Origin": "*" });

        let fileStream = createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) { //如果發現路徑是資料夾，則找index.html
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, { 'Content-type': 'text/plain' });
        res.write('500 Internal Error\n');
        res.end();
    }
})
    .listen(port, hostname, () => {
        console.log(`${hostname}:${port} is Ready.`);
        open(`http://${hostname}:${port}`, "chrome");
    });
