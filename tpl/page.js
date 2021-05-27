const Basic = require('./basic')
const { validator, required, IntRange, filename } = require('inquirer-table-insert-prompt/validator')

class Page extends Basic {
  constructor () {
    super(
      'page.vue',
      'page 组建',
      '默认创建文件名称为list',
      [
        { type: 'input', name: 'dest', message: '请输入文件名称', default: 'list.vue', validate: validator(required) },
        { type: 'input', name: 'name', message: '请输入组建名称', validate: validator(required) }
      ]
    )
  }
}

module.exports = Page
