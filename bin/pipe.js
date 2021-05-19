#!/usr/bin/env node
var fs = require("fs");
var path = require('path')
// 创建一个可读流
var readerStream = fs.createReadStream(path.join(__dirname, '../template/page.vue'));

// 创建一个可写流
var writerStream = fs.createWriteStream(path.join(process.cwd(), 'list.vue'));

// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream.pipe(writerStream);