
const inquirer = require('inquirer')
inquirer.registerPrompt("table", require('inquirer-table-insert-prompt'))

const Page = require('./page')
const Process = require('./process')

class Tpl {
  constructor (...supported) {
    this.supported = supported
    this.currentTpl = null
  }

  getSupportedList () {
    return this.supported.map(({ name, desc, note }) => [name, desc, note])
  }

  init () {
    const options = [
      { type: 'list', name: 'name', message: '请选择模板名称', choices: this.supported.map(v => v.name)}
    ]
    return inquirer.prompt(options)
  }

  // 根据模板类型设置参数
  config (name) {
    this.currentTpl = name
    const basic = this.supported.find(v => v.name === name)
    return inquirer.prompt(basic.prompt)
  }

  getTplInstance () {
    return this.supported.find(v => v.name === this.currentTpl)
  }
}

module.exports = new Tpl(
  new Page(),
  new Process()
)