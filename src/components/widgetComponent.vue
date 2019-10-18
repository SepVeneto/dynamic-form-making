<template>
  <el-form-item :label="config.label">
    <template v-if="config.type === 'input'">
      <el-input v-model="value" :placeholder="config.placeholder" />
    </template>
  </el-form-item>
</template>

<script>
export default {
  name: 'widget-component',
  props: {
    config: {
      required: true,
      type: Object,
    },
    value: {
      required: true,
    }
  },
}
</script>