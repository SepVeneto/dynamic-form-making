<template>
  <el-select v-model="testData" multiple>
    <el-option label="1" value="1"></el-option>
    <el-option label="2" value="2"></el-option>
    <el-option label="3" value="3"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'test-component',
  props: ['value'],
  watch: {
    testData: {
      deep: true,
      handler(val) {
        this.$emit('input', val);
      }
    },
    value(val) {
      this.testData = val;
    }
  },
  data() {
    return {
      testData: this.value,
    }
  }
}
</script>