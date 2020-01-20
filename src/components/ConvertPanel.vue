<template>
  <div id="container">
    <el-input
      class="ipt"
      type="textarea"
      :autosize="{ minRows: 20}"
      v-model="inputStr">
    </el-input>
    <div id="op">
      <el-select 
        v-model="offset"
        class="ops"
        placeholder="选择升降调"
        size="small"
        style="max-width: 150px"
        @change="handleChange"
        >
        <el-option 
          v-for="r in selections"
          :key="r.value"
          :label="r.label"
          :value="r.value"
        >
        </el-option>
      </el-select>
      <el-button class="ops" type="primary" v-on:click="handleChange" size="small">转换</el-button>
      <!-- <el-button class="ops" type="primary" v-on:click="handleDown" size="small">降半key</el-button> -->
    </div>
    <el-input
      class="opt"
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
      inputStr: '输入原调简谱，形如：\n\n[67]1234(12)\n\n可中途临时增加key：\n+1\n[67]1234(12)\n\n右边选择转换key即可输出结果。',
      resultStr: '',
      offset: 0,

      selections: [
        {
          value: 6,
          label: '+6(#F)'
        },
        {
          value: 5,
          label: '+5(F)'
        },
        {
          value: 4,
          label: '+4(E)'
        },
        {
          value: 3,
          label: '+3(bE)'
        },
        {
          value: 2,
          label: '+2(D)'
        },
        {
          value: 1,
          label: '+1(#C)'
        },
        {
          value: -1,
          label: '-1(B)'
        },
        {
          value: -2,
          label: '-2(bB)'
        },
        {
          value: -3,
          label: '-3(A)'
        },
        {
          value: -4,
          label: '-4(bA)'
        },
        {
          value: -5,
          label: '-5(G)'
        }
      ],
      keyNumMap: {
        '1': 25,
        '#1': 26,
        '2': 27,
        '#2': 28,
        '3': 29,
        '#3': 30,
        '4': 30,
        '#4': 31,
        '5': 32,
        '#5': 33,
        '6': 34,
        '#6': 35,
        '7': 36,
        '#7': 37,
      },
      numKeyMap: {
        25: '1',
        26: '#1',
        27: '2',
        28: '#2',
        29: '3',
        30: '4',
        31: '#4',
        32: '5',
        33: '#5',
        34: '6',
        35: '#6',
        36: '7',
      },
    }
  },
  // watch: {
  //   inputStr(curVal, oldVal) {
  //     this.resultStr = this.change(curVal)
  //   }
  // },
  methods: {
    handleUp() {
      let nums = this.getNumsFromInput(this.inputStr)
      console.log('nums',nums)
      nums = this.handleNums(nums, 1)
      console.log('nums after offset',nums)
      this.resultStr = this.getKeysFromNums(nums)
    },
    handleDown() {
      let nums = this.getNumsFromInput(this.inputStr)
      nums = this.handleNums(nums, -1)
      this.resultStr = this.getKeysFromNums(nums)
    },
    handleChange() {
      console.log('handleChange.offset', this.offset)
      let nums = this.getNumsFromInput(this.inputStr)
      nums = this.handleNums(nums, this.offset)
      this.resultStr = this.getKeysFromNums(nums)
    },
    getNumsFromInput(input) {
      console.log('getNumsFromInput.input', input)
      let level = 0
      let rise = false
      let result = []
      let hasPlus = false
      let plus = 0
      for (const i in input) {
        const c = input.charAt(i)
        console.log('getNumsFromInput.for.i', i, c)
        if (hasPlus) {
          plus = parseInt(c)
          hasPlus = false
          continue
        }
        
        if (c == '{') {
          level -= 2
          continue
        }
        if (c == '}') {
          level += 2
          continue
        }
        if (c == '[') {
          level -= 1
          continue
        }
        if (c == ']') {
          level += 1
          continue
        }
        if (c == '(') {
          level += 1
          continue
        }
        if (c == ')') {
          level -= 1
          continue
        }
        if (c == '#') {
          rise = true
          continue
        }
        if (c == '+') {
          hasPlus = true
          continue
        }

        if (c >= 1 && c <= 7) {
          let num = c
          if (rise) {
            num = this.keyNumMap['#'+c] + level*12
            rise = false
          } else{
            num = this.keyNumMap[c] + level*12
          }
          result.push(num + plus)
          continue
        }
        result.push(c)
      }
      return result
    },
    getKeysFromNums(nums) {
      console.log('getKeysFromNums.nums', nums)
      let result = ''
      if (nums.length == 0) {
        return result
      }

      let idx = 0 
      while (typeof(nums[idx]) != 'number') {
        result = result.concat(nums[idx])
        idx++
      }

      let lastLevel = {}
      if (idx < nums.length) {
        lastLevel = this.getLevel(nums[idx])
        result = result.concat(lastLevel.start)
        result = result.concat(this.numKeyMap[nums[idx] - lastLevel.value*12])
        idx++
      }
      
      for (let i = idx; i < nums.length; i++) {
        const num = nums[i]
        if (typeof(num) != 'number') {
          result = result.concat(lastLevel.end)
          lastLevel = {value:0, start: '', end: ''}
          result = result.concat(num)
          continue
        }
        const level = this.getLevel(num)
        console.log('getKeysFromNums.nums.i', i, num, level)
        if (lastLevel.value != level.value) {
          result = result.concat(lastLevel.end)
          result = result.concat(level.start)
          lastLevel = level
          result = result.concat(this.numKeyMap[num - level.value*12])
        } else {
          result = result.concat(this.numKeyMap[num - level.value*12])
        }
      }
      result = result.concat(lastLevel.end)
      return result
    },
    getLevel(num) {
      if (num >= 25 && num <= 36) {
        return {value:0, start: '', end: ''}
      } else if (num >= 37 && num <= 48) {
        return {value:1, start: '(', end: ')'}
      } else if (num >= 13 && num <= 24) {
        return {value:-1, start: '[', end: ']'}
      } else if (num >= 1 && num <= 12) {
        return {value:-2, start: '{', end: '}'}
      }
    },
    handleNums(nums, offset) {
      let newNums = []
      for (const i in nums) {
        let num = nums[i]
        if (num >= 1 && num <= 48) {
          newNums.push(nums[i] + offset)
        } else {
          newNums.push(num)
        }
      }
      return newNums
    }
  }
}
</script>

<style>
#container {
  float: left;
  height: 100%;
  width: 800px;
}
.ipt {
  float: left;
  width: 40%;
  height: 100%;
}
#op {
  float: left;
  width: 20%;
  margin-top: 20%;
  text-align: center;
}
.ops {
  margin-bottom: 5px;
}
.opt {
  float: right;
  width: 40%;
  height: 100%;
}
</style>

