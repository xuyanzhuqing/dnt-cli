#!/usr/bin/env node
const exec = require('child_process').exec
const path = require('path')
const chalk = require('chalk')
const ProgressBar = require('progress')

const { program, action } = require('commander')
const { version, bin } = require('./package.json')
const { formatDisplay } = require('./utils.js')
program.version(version, '-v, --version', 'cli的最新版本')

const supported = [
  ['page', 'page 组建', '默认创建文件名称为list'],
  ['/process', '向导组建', '须指定文件夹']
]

program
  .option('-l, --list', '查看支持的模板')
  .action((options, command) => {
    const emptyOpt = !Object.keys(options).length
    if(options.list || emptyOpt) {
      console.log(chalk.blueBright(formatDisplay(supported)))
    }
  })

// 设置子命令
program
  .command('create <filename>')
  .option('-t, --target <value>', '生成模板名称', 'list')
  .option('-s, --suffix <value>', '文件后缀', '.vue')
  .description('创建一个模板 dnt-cli create <template> -t <dest>')
  .action((filename, opts) => {
    console.log(chalk.greenBright('starting to copying tempalte to local'))
    const { target, suffix } = opts
    const pipeScript = path.join(__dirname, 'bin', 'pipe.js')
    filename = filename.startsWith('/') ? filename : filename + suffix

    const command = `node ${pipeScript} --source ${filename} --target ${target}${suffix}`
    let isDone = false
    let bar = null
    let timer = null

    exec(command, function (error) {
      isDone = true
      clearInterval(timer)
      bar.update(1)
      if (error) {
        console.info(error)
        return
      }
      console.log(chalk.greenBright('copy done !'))
    })

    // 模拟进度，如果进行到 90% 的时候，文件没有拷贝完毕则继续等待
    bar = new ProgressBar(':bar', { total: 100 })
    timer = setInterval(() => {
      if (!isDone && bar.curr > 90) return
      bar.tick()
    }, 100)
  })

// 处理命令行输入的参数
program.parse(process.argv)