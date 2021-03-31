const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const server = new http.Server();
const fs = require('fs');
const mime = require('mime');

const FILE_LIMIT = 1000000;

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  if (pathname.includes('/') || !pathname.length) {
    res.statusCode = 400;
    res.end('Wrong uri');
    return;
  }
  const filepath = path.join(__dirname, 'files', pathname);

  const limitedStream = new LimitSizeStream({limit: FILE_LIMIT, encoding: 'utf-8'});

  limitedStream.on('error', (e) => {
    fs.unlink(filepath, (err) => console.dir(err));
    res.statusCode = 413;
    res.end('sl9pa');
  });
  req.connection.on('close', function(err) {
    fs.unlink(filepath, (err) => console.dir(err));
  });

  switch (req.method) {
    case 'POST':
      try {
        if (fs.existsSync(filepath)) {
          res.statusCode = 409;
          res.end('File Exists');
          return;
        } else {
          const fileWright = fs.createWriteStream(filepath);
          const mimetype = mime.getType(filepath);

          fileWright.on('finish', function() {
            res.writeHead(201, {
              'Context-Type': mimetype,
              'Access-Control-Allow-Origin': '*',
            });
            res.end('Success');
          });


          req.pipe(limitedStream).pipe(fileWright);
        }
      } catch (e) {
        res.statusCode = 501;
        fs.unlinkSync(filePath);
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
