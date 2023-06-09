const { Transform } = require('stream')
const ProgressBar = require('progress')
const Pipe = require('../bin/pipe.js')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

class Basic {
  constructor (name, desc, note, prompt = []) {
    this.name = name
    this.desc = desc
    this.note = note
    this.prompt = this.validatePrompt(prompt)
    this.isDir = name.startsWith('/')
  }

  get entry () {
    return this.isDir ? this.name + '/index.vue' : this.name
  }

  get opt () {
    const { name, desc, note } = this
    return { name, desc, note }
  }

  // 验证文件是否存在
  validatePrompt (prompt) {
    const destIndex = prompt.findIndex(v => v.name === 'dest')
    const me = this
    if (destIndex > -1) {
      const warningRepeat = {
        name: '_warningRepeat',
        type: 'input',
        message: '检测到当前路径已经存在，是否覆盖 ' + chalk.gray('Yes/No'),
        when: function (answers) {
          const targetPath = path.join(process.cwd(), me.redirct({ dest: answers.dest }))
          try {
            const stat = fs.statSync(targetPath)
            return stat.isDirectory() || stat.isFile()
          } catch (err) {
            return false
          }
        },
        validate: function (input) {
          const whiteList = ['yes', 'y']
          const lowerCase = input.toLocaleLowerCase()
          if (!whiteList.includes(lowerCase)) {
            process.exit(0)
          }
          return true
        }
      }
      prompt.splice(destIndex + 1, 0, warningRepeat)
    }

    return prompt
  }

  redirct ({ dest }) {
    return dest
  }

  transform (opts) {
    const replaceAll = this.replaceAll
    return new Transform({
      transform(chunk, encoding, callback) {
        this.push(replaceAll(chunk.toString(), opts))
        callback()
      }
    })
  }

  replaceAll (data, opts) {
    for (let opt in opts) {
      data = data.replace(`#${opt}#`, opts[opt])
    }
    return data
  }

  dest (tplOpt) {
    const pipe = new Pipe(
      this.entry,
      this.redirct(tplOpt)
    )
    let isDone = false

    // 模拟进度，如果进行到 90% 的时候，文件没有拷贝完毕则继续等待
    let bar = new ProgressBar(':bar', { total: 100 })
    let timer = setInterval(() => {
      if (!isDone && bar.curr > 90) return
      bar.tick()
    }, 100)

    const transform = this.transform(tplOpt)
    pipe.run(transform, () => {
      isDone = true
      clearInterval(timer)
      bar.update(1)
      console.log(chalk.greenBright('copy done !'))
    })
  }
}

module.exports = Basic