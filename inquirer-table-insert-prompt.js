const Base = require("inquirer/lib/prompts/base")
const observe = require("inquirer/lib/utils/events")
const { map, takeUntil } = require("rxjs/operators")
const cliCursor = require("cli-cursor")
const chalk = require("chalk")
const Table = require("cli-table")
const figures = require("figures")

class InquirerTableInsertPrompt extends Base {
  constructor(questions, rl, answers) {
    super(questions, rl, answers);
    const steps = this.answers.steps.replace(/\s/g, '').split(',')
    this.opt.columns = steps.map(v => ({ name: v, value: v }))
    this.columns = this.opt.columns
    this.columns.realLength = this.columns.length
    this.rows = this.opt.rows
    this.rows.realLength = this.rows.length
    this.values = this.initValue(this.rows)
    this.pointer = 0;
    this.horizontalPointer = 0;
  }

  initValue (rows) {
    return rows.map(v => {
      const type = v.type

      if (type) {
        if (type.name === 'Boolean') {
          return this.columns.map(m => {
            return typeof v.default !== 'undefined' ? v.default : false
          })
        }
        return this.columns.map(m => {
          return typeof v.default !== 'undefined' ? v.default : new type()
        })
      }

      return this.columns.map(m => [])
    })
  }

  _run(callback) {
    this.done = callback;

    const events = observe(this.rl);
    const validation = this.handleSubmitEvents(
      events.line.pipe(map(this.getCurrentValue.bind(this)))
    );
    validation.success.forEach(this.onEnd.bind(this));
    validation.error.forEach(this.onError.bind(this));
    
    events.keypress.forEach(({ key, value }) => {
      switch (key.name) {
        case "left":
          return this.onLeftKey();

        case "right":
          return this.onRightKey();
        default:
      }

      if (!this.rows[this.pointer].type) {
        switch (key.name) {
          case "backspace":
              this.values[this.pointer][this.horizontalPointer].pop()
              this.render()
            return
            case 'delete':
              this.values[this.pointer][this.horizontalPointer].shift()
              this.render()
            return
          default:
            this.values[this.pointer][this.horizontalPointer].push(value)
            this.render()
        }
      }
    });

    events.normalizedUpKey
      .pipe(takeUntil(validation.success))
      .forEach(this.onUpKey.bind(this));
    events.normalizedDownKey
      .pipe(takeUntil(validation.success))
      .forEach(this.onDownKey.bind(this));
    events.spaceKey
      .pipe(takeUntil(validation.success))
      .forEach(this.onSpaceKey.bind(this));

    if (this.rl.line) {
      this.onKeypress();
    }

    cliCursor.hide();
    this.render();

    return this;
  }

  onLeftKey() {
    const length = this.columns.realLength;

    this.horizontalPointer =
      this.horizontalPointer > 0 ? this.horizontalPointer - 1 : length - 1;
    this.render();
  }

  onRightKey() {
    const length = this.columns.realLength;

    this.horizontalPointer =
      this.horizontalPointer < length - 1 ? this.horizontalPointer + 1 : 0;
    this.render();
  }

  onDownKey() {
    const length = this.rows.realLength;

    this.pointer = this.pointer < length - 1 ? this.pointer + 1 : this.pointer;
    this.render();
  }

  onUpKey() {
    this.pointer = this.pointer > 0 ? this.pointer - 1 : this.pointer;
    this.render();
  }

  onSpaceKey () {
    const curr = this.values[this.pointer][this.horizontalPointer]
    const type = this.rows[this.pointer].type
    if (type && type.name === 'Boolean') {
      this.values[this.pointer][this.horizontalPointer] = !curr
      this.render();
    }
  }

  getCurrentValue () {
    // 拼接参数
    const res = []
    this.columns.forEach((v, i) => {
      const row = {}
      this.rows.forEach((m, k) => {
        row[m.name] = this.values[k][i].join('')
        row.name = v.value
      })
      res.push(row)
    })
    return res
  }

  onEnd(state) {
    this.status = "answered";
    this.spaceKeyPressed = true;

    this.render();

    this.screen.done();
    cliCursor.show();
    this.done(state.value);
  }

  onError(state) {
    this.render(state.isValid);
  }

  paginate() {
    const middleOfPage = Math.floor(this.pageSize / 2);
    const firstIndex = Math.max(0, this.pointer - middleOfPage);
    const lastIndex = Math.min(
      firstIndex + this.pageSize - 1,
      this.rows.realLength - 1
    );
    const lastPageOffset = this.pageSize - 1 - lastIndex + firstIndex;

    return [Math.max(0, firstIndex - lastPageOffset), lastIndex];
  }

  render(error) {
    let bottomContent = "";
    let message = this.getQuestion();
    const [firstIndex, lastIndex] = this.paginate();
    const table = new Table({
      head: [
        chalk.reset.dim(
          `${firstIndex + 1}-${lastIndex + 1} of ${this.rows.length}`
        )
      ].concat(this.columns.map(v => v.name).map(name => chalk.reset.bold(name))),
      chars: {
        middle: ' ',
        right: ' ',
        left: ' ',
        'mid-mid': '─',
        'top-mid': '─',
        'bottom-mid': '─',
        'left-mid': ' ',
        'right-mid': ' ',
        'top-left': ' ',
        'top-right': ' ',
        'bottom-left': ' ',
        'bottom-right': ' '
      }
    });

    this.rows.forEach((row, rowIndex) => {
      if (rowIndex < firstIndex || rowIndex > lastIndex) return;

      const columnValues = [];

      this.columns.forEach((column, columnIndex) => {
        const isSelected =
          this.status !== "answered" &&
          this.pointer === rowIndex &&
          this.horizontalPointer === columnIndex;
        const value = this.rows[rowIndex].type ? this.values[rowIndex][columnIndex] : this.values[rowIndex][columnIndex].join('')
        if (row.type && row.type.name === 'Boolean') {
          const display = value ? figures.radioOn : figures.radioOff
          columnValues.push(`${isSelected ? "[" : " "} ${display} ${isSelected ? "]" : " "}`)
        } else {
          columnValues.push(isSelected ? `[${value}]` : `${value}`);
        }
      });

      const chalkModifier =
        this.status !== "answered" && this.pointer === rowIndex
          ? chalk.reset.bold.cyan
          : chalk.reset;

      table.push({
        [chalkModifier(row.name)]: columnValues
      });
    });

    message += "\n\n" + table.toString();

    if (error) {
      bottomContent = chalk.red(">> ") + error;
    }
    this.screen.render(message, bottomContent);
  }
}

module.exports = InquirerTableInsertPrompt