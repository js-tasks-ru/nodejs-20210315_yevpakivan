const url = require('url');
const http = require('http');
const path = require('path');
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

  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, (err) => console.dir(err));
      res.statusCode = 200;
      res.end('File successfully deleted!');
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
