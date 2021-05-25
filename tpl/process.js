const Basic = require('./basic')

class Step extends Basic {
  constructor (name, desc, note, prompt = []) {
    super(name, desc, note, prompt)
    this.parentDir = null
  }

  redirct ({ dest }) {
    return `${this.parentDir}/step/${dest}.vue`
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
        { type: 'input', name: 'dest', message: '向导组建文件夹名称' },
        { type: 'input', name: 'title', message: '向导组建别名' },
        { type: 'input', name: 'steps', message: '请输入步骤名称<步骤间用逗号分隔>'},
        {
          type: 'table',
          name: 'process',
          message: '请输入步骤配置信息',
          columns: [],
          rows: [
            {
              name: 'label'
            },
            {
              name: 'isLink',
              type: Boolean
            }
          ]
        }
      ]
    )

    this.stepInstances = []
  }

  static formatJsonString (data) {
    return JSON.stringify(data, null, 2).replace(/\"(?=(\w+")?:)/g, '').replace(/(?<=:\s(\"\w+)?)\"/g, '\'')
  }

  replaceAll (data, opts) {
    const requiredOpt = {
      import: [],
      steps: [],
      components: [],
      modal: {},
      currentView: ''
    }
    opts.process.forEach(v => {
      const name = v.name
      requiredOpt.import.push(`import ${name} from './step/${name}.vue'`)
      requiredOpt.steps.push({
        name: v.name,
        title: v.label
      })
      requiredOpt.components.push(name)
      requiredOpt.modal[name] = {}
    })
    requiredOpt.currentView = opts.process[0].name
    
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
          case 'modal':
            data = data.replace(`#${opt}#`, Process.formatJsonString(curr))
            break
          default:
            data = data.replace(`#${opt}#`, curr)
      }
    }

    for (let opt in opts) {
      data = data.replace(`#${opt}#`, opts[opt])
    }
    return data
  }

  redirct ({ dest }) {
    return `${dest}/index.vue`
  }

  foke ({ process, dest }) {
    process.forEach(opt => {
      const step = new Step(opt.name)
      step.parentDir = dest
      step.dest({
        dest: opt.name
      })
    })
  }
}

module.exports = Process
