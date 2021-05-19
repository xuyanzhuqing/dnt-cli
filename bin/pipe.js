#!/usr/bin/env node
var fs = require("fs");
var path = require('path')
const { source, target } = require('minimist')(process.argv.slice(2))

// 创建一个可读流
var readerStream = fs.createReadStream(path.join(__dirname, '..', 'template', source));

// 创建一个可写流
var writerStream = fs.createWriteStream(path.join(process.cwd(), target));

// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream.pipe(writerStream);