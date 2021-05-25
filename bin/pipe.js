#!/usr/bin/env node
var fs = require("fs");
var path = require('path')

class Pipe {
  constructor (source, target) {
    this.source = source
    this.target = target
  }

  run (transform, callback) {
    const { source, target } = this
    const readerStream = fs.createReadStream(path.join(__dirname, '..', 'template', source))
    const targetPath = path.join(process.cwd(), target)
    const parentPath = path.parse(targetPath).dir
    if (!fs.existsSync(parentPath)) {
      fs.mkdirSync(parentPath)
    }
    const writerStream = fs.createWriteStream(targetPath)

    readerStream.pipe(transform).pipe(writerStream);
    callback()
  }
}

module.exports = Pipe
