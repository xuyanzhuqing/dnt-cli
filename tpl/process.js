const Basic = require('./basic')
const { hyphens } = require('../utils')
const { validator, required, IntRange, filename } = require('inquirer-table-insert-prompt/validator')
const Select = require('inquirer-table-insert-prompt').Select

class Step extends Basic {
  constructor (name, desc, note, prompt = []) {
    super(name, desc, note, prompt)
    this.parentDir = null
  }

  redirct ({ dest }) {
    return `${this.parentDir}/step/${dest}.vue`
  }

  replaceAll (data, opts) {
    // 替换代码模板
    const { submit, preview, next, ...rest } = opts

    const selfReplace = (data, key, value) => {
      const keepLine = `(.*)#${key}#(.*)`
      const specLine = keepLine + '\n'
      if (value) {
        const reg = new RegExp(specLine, 'g')
        return data.replace(new RegExp(keepLine), '').replace(reg, '')
      } else {
        const reg = new RegExp(`${specLine}(.|\n)+${specLine}`)
        return data.replace(reg, '')
      }
    }

    for (let opt in { submit, preview, next }) {
      data = selfReplace(data, opt, opts[opt])
    }

    return super.replaceAll(data, opts)
  }

  get entry () {
    return 'process/step.vue'
  }
}

class Process extends Basic {
  constructor () {
    super(
      '/process',
      '向导组建',
      '须指定文件夹',
      [
        { type: 'input', name: 'dest', message: '向导组建文件夹名称', validate: validator(required, filename) },
        { type: 'input', name: 'title', message: '向导组建别名', validate: required },
        { type: 'input', name: 'steps', message: '请输入步骤总数', validate: validator(required, IntRange({ min: 2 }))},
        {
          type: 'table',
          name: 'process',
          message: '请输入步骤配置信息',
          columns: (answers) => {
            return new Array(parseInt(answers.steps)).fill(null).map((v, i) => i + 1)
          },
          rows: [
            {
              name: 'name',
              validate: validator(required, filename)
            },
            {
              name: 'title'
            },
            {
              name: 'template',
              type: new Select(['default', 'form']),
              default: 'default'
            },
            {
              name: 'exit',
              type: Boolean,
              default: true
            },
            {
              name: 'submit',
              type: Boolean,
              default: true
            },
            {
              name: 'preview',
              type: Boolean,
              default: true
            },
            {
              name: 'next',
              type: Boolean,
              default: true
            },
            {
              name: 'disabled',
              type: Boolean,
              default: false
            }
          ]
        }
      ]
    )
  }

  static formatJsonString (data) {
    return JSON.stringify(data, null, 2).replace(/\"/g, '\'').replace(/(\'+)(?=:)/g, '').replace(/(\'+)(?=\w+:)/g, '')
  }

  replaceAll (data, opts) {
    const requiredOpt = {
      dest: opts.dest,
      import: [],
      steps: [],
      components: [],
      modal: {},
      currentView: ''
    }
    opts.process.forEach(v => {
      const hyname = hyphens(v.name)
      requiredOpt.import.push(`import ${hyname}, { useModal as ${hyname}Modal } from './step/${v.name}.vue'`)
      requiredOpt.steps.push({
        ...v,
        name: hyname
      })
      requiredOpt.components.push(hyname)
      requiredOpt.modal[hyname] = `${hyname}Modal()`
    })
    requiredOpt.currentView = requiredOpt.steps[0].name
    
    // 替换模板中必须有的参数
    for (let opt in requiredOpt) {
      const curr = requiredOpt[opt]
      switch (opt) {
        case 'import': 
            data = data.replace(`#${opt}#`, curr.join('\n'))
          break
          case 'components':
            data = data.replace(`#${opt}#`, curr.join(', '))
          break
          case 'steps':
            data = data.replace(`#${opt}#`, Process.formatJsonString(curr))
            break
          case 'modal':
            data = data.replace(`#${opt}#`, Process.formatJsonString(curr).replace(/\'/g, ''))
            break
          default:
            data = data.replace(`#${opt}#`, curr)
      }
    }

    return super.replaceAll(data, opts)
  }

  redirct ({ dest }) {
    return `${dest}/index.vue`
  }

  foke ({ process, dest }) {
    const rows = this.prompt.find(v => v.name === 'process').rows || []
    const tplOptions = rows.find(v => v.name === 'template').type.options || []
    process.forEach(opt => {
      const tplName = tplOptions[opt.template]
      const step = new class extends Step {
        get entry () {
          return `process/${tplName}.vue`
        }
      }(opt.name)

      step.parentDir = dest
      step.dest({
        dest: opt.name,
        ...opt
      })
    })
  }
}

module.exports = Process
