<template>
  <div style="">
    <el-input
      type="textarea"
      :autosize="{ minRows: 20}"
      placeholder="请输入内容"
      v-model="inputStr">
    </el-input>
    <el-select v-model="initRange"
      clearable
      placeholder="选择主要音域"
      size="small"
      style="max-width: 130px"
    >
      <el-option 
        v-for="r in ranges"
        :key="r.value"
        :label="r.label"
        :value="r.value"
      >
      </el-option>
    </el-select>
    <el-select v-model="key"
      clearable
      placeholder="选择简谱原调"
      size="small"
      style="max-width: 130px"
    >
      <el-option 
        v-for="k in keyTable"
        :key="k"
        :label="k"
        :value="k"
      >
      </el-option>
    </el-select>
    <el-button type="primary" v-on:click="convert" size="small">转换</el-button>
    <el-input
      type="textarea"
      :autosize="{ minRows: 20}"
      placeholder="转换结果将在这里显示"
      v-model="resultStr">
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'ConvertPanel',
  data() {
    return {
      inputStr: '',
      resultStr: '',
      key: '',
      initRange: undefined,
      ranges: [{
        value: 0,
        label: '低'
      }, {
        value: 1,
        label: '中'
      }, {
        value: 2,
        label: '高'
      }],
      keyTable: ['C', 'bD', 'D', 'bE', 'E', 'F', 'bG', 'G', 'bA', 'A', 'bB', 'B'],
      cKeyNumTable: ['1', '#1', '2', '#2', '3', '4', '#4', '5', '#5', '6', '#6', '7']
    }
  },
  // watch: {
  //   inputStr(curVal, oldVal) {
  //     this.resultStr = this.change(curVal)
  //   }
  // },
  methods: {
    convert() {
      const input = this.inputStr
      const start = this.keyTable.indexOf(this.key)
      if (start === -1) {
        this.resultStr = '输入key错误'
        return
      }

      const initLevel = parseInt(this.initRange) // 想办法转成int

      let result = ''
      let level = initLevel
      let rise = false
      for (const i in input) {
        const c = input.charAt(i)

        if (c === 'd') { // 低音
          level = initLevel - 1
          continue
        }

        if (c === 'g') { // 高音
          level = initLevel + 1
          continue
        }

        if (c === 'r') { // 升半key
          rise = true
          continue
        }

        if (c === '\n') {
          result = result.concat(c)
          continue
        }


        const offset = this.cKeyNumTable.indexOf(c)
        if (offset === -1) { // 其他字符
          result = result.concat(c)
          continue
        }

        let finalIndex = start + offset + (rise ? 1 : 0)
        if (finalIndex >= 12) {
          finalIndex = finalIndex % 12
          level += 1
        }

        result = result.concat(this.getScale(finalIndex, level))
        rise = false
        level = initLevel
      }
      this.resultStr = result
    },
    getScale(index, level) {
      switch (level) {
        case 1: // 中音
          return this.cKeyNumTable[index]
        case 0: // 低音
          return '(' + this.cKeyNumTable[index] + ')'
        case 2: // 高音
          return '[' + this.cKeyNumTable[index] + ']'
        case 3: // 倍高音
          return '[[' + this.cKeyNumTable[index] + ']]'
        case -1: // 倍低音
          return '{' + this.cKeyNumTable[index] + '}'
      }
      return typeof(level)
    }
  }
}
</script>

