const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.line = '';
    this.lastEl = '';
  }

  _transform(chunk, encoding, callback) {
    this.line = `${this.lastEl}${chunk.toString()}`;

    if (this.line.includes(os.EOL)) {
      const [line, ...rest] = this.line.split(os.EOL);
      this.push(line);
      this.lastEl = rest.join(os.EOL);
    } else {
      this.lastEl = this.line;
    }

    callback();
  }

  _flush(callback) {
    this.lastEl.split(os.EOL).forEach((item) => this.push(item));

    callback();
  }
}

module.exports = LineSplitStream;
