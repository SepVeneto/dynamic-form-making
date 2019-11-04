<template>
  <div> 
    <el-checkbox label="自定义" v-model="select.customLabel"></el-checkbox>
    <el-input-number
      v-model="labelWidth"
      :step="10"
      :disabled="!select.customLabel"
      size="mini"
    />
  </div>
</template>

<script>
export default {
  name: 'custom-label-width',
  props: {
    select: {
      type: Object,
    }
  },
  computed: {
    labelWidth: {
      get() {
        return Number(this.select.labelWidth.replace(/px/, ''));
      },
      set(val) {
        this.select.labelWidth = `${val}px`;
      }
    }
  }
}
</script>