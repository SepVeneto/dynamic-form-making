<template>
  <div>
    <el-checkbox 
      label="必填" 
      v-model="select.validate_required" 
      @change="handleCheckBox"
    />
    <div>规则</div>
    <el-select 
      v-model="pattern" 
      placeholder=""
      @change="handleSelect"
      clearable
    >
      <el-option
        v-for="item in optionsReg"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-input v-if="pattern === 'custom'" v-model="custom" @input="updateRules"/>
  </div>
</template>

<script>
function lettrs(rule, value, callback) {
  // const regExp = new RegExp('[a-z][A-Z]', 'g');
 const regExp = /^[a-zA-Z]+$/g;
  if (regExp.test(value)) {
    callback();
  } else {
    callback('请输入字母');
  }
}
export default {
  name: 'validate',
  props: ['select'],
  data() {
    return {
      custom: '',
      pattern: '',
      optionsReg: [
        {label: '字母', value: 'letters'},
        {label: '自定义', value: 'custom'},
      ]
    }
  },
  methods: {
    updateRules() {
      const required = this.select.validate_required;
      const rules = [this.pattern === 'custom' ? this.custom : this.pattern, required && 'required'];
      const regExpPattern = {
        required: {required: required, message: `请输入${this.select.label}`},
        letters: {validator: lettrs}
      };
      this.select.validate_rules.length = 0;
      // rules.forEach(item => {
      //   this.select.validate_rules.push(regExpPattern[item])
      // });
      this.select.validate_rules = [...rules];
    },
    handleCheckBox() {
      this.updateRules();
    },
    handleSelect() {
      this.updateRules();
    }
  }
}
</script>