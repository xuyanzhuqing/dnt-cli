#!/usr/bin/env node
const path = require('path')
const chalk = require('chalk')

const { program, action } = require('commander')
const { version, bin } = require('./package.json')
const { formatDisplay } = require('./utils.js')
const tpl = require('./tpl/index.js')

program.version(version, '-v, --version', 'cli的最新版本')
program
  .option('-l, --list', '查看支持的模板')
  .action((options, command) => {
    const emptyOpt = !Object.keys(options).length
    if(options.list || emptyOpt) {
      console.log(chalk.blueBright(formatDisplay(tpl.getSupportedList())))
    }
  })

// 设置子命令
program
  .command('create')
  .option('-t, --target <value>', '生成模板名称', 'list')
  .action(async (opts) => {
    const res = await tpl.init()
    let tplName = res.name
    const tplOpt = await tpl.config(tplName)
    console.log(chalk.greenBright('starting to copying tempalte to local'))

    const tplInstance = tpl.getTplInstance()
    tplInstance.dest(tplOpt)
    tplInstance.foke && tplInstance.foke(tplOpt)
  })

// 处理命令行输入的参数
program.parse(process.argv)