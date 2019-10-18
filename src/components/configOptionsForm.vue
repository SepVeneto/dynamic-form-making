<template>
  <el-form>
    <el-form-item label="表单标签宽度">
      <el-input-number v-model="config.labelWidth" />
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
}
</script>