const Basic = require('./basic')

class Page extends Basic {
  constructor () {
    super(
      'page.vue',
      'page 组建',
      '默认创建文件名称为list',
      [
        { type: 'input', name: 'name', message: '请输入组建名称' },
        { type: 'input', name: 'dest', message: '请输入文件名称', default: 'list.vue' }
      ]
    )
  }
}

module.exports = Page
