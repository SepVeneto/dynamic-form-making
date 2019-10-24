<template>
  <el-select v-model="testData" multiple @input="handleInput">
    <el-option 
      v-for="item in options"
      :key="item.value"
      :label="item.label" 
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'test-component',
  props: ['value', 'options'],
  // props: {
  //   value: {
  //     required: true,
  //   },
  //   options: {
  //     required: true,
  //     type: Array,
  //   }
  // },
  // watch: {
  //   testData: {
  //     deep: true,
  //     handler(val) {
  //       this.$emit('input', val);
  //     }
  //   },
  //   value(val) {
  //     this.testData = val;
  //   }
  // },
  data() {
    return {
      // testData: [...(this.value || [])],
      testData: [],
    }
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event)
    }
  },
  mounted() {
    console.log(this.value);
  }
}
</script>