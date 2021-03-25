const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

const err = new LimitExceededError();
class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.fileSize = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    let error; let data;

    this.fileSize += Buffer.byteLength(chunk);

    if (this.fileSize > this.limit) {
      error = err;
    } else {
      data = chunk.toString('utf8');
    }

    return callback(error, data);
  }
}

module.exports = LimitSizeStream;
