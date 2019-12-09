<template>
  <el-form>
    <el-checkbox label="内联" v-model="config.inline"/>
    <el-form-item label="表单class">
      <el-input size="mini" v-model="config.class" />
    </el-form-item>
    <el-form-item label="表单标签宽度">
      <el-input-number size="mini" v-model="labelWidth" :step="10"/>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'config-options-form',
  props: {
    config: {
      type: Object,
      required: true,
    }
  },
  computed: {
    labelWidth: {
      get() {
        return Number(this.config.labelWidth.replace(/px/, ''));
      },
      set(val) {
        this.config.labelWidth = `${val}px`;
      }
    }
  }
}
</script>