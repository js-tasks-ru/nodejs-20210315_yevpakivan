const url = require('url');
const http = require('http');
const path = require('path');
const mime = require('mime');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  if (pathname.includes('/') || !pathname.length) {
    res.statusCode = 400;
    res.end('Wrong uri');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      try {
        if (fs.existsSync(filepath)) {
          const filename = path.basename(filepath);
          const mimetype = mime.getType(filepath);

          res.setHeader('Content-disposition', 'attachment; filename=' + filename);
          res.setHeader('Content-type', mimetype);

          const filestream = fs.createReadStream(filepath);
          res.statusCode = 200;
          filestream.pipe(res);
        } else {
          res.statusCode = 404;
          res.end('Not found');
        }
      } catch (e) {
        console.dir(e);
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
