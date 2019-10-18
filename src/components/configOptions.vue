<template>
  <el-tabs>
    <el-tab-pane label="表单项属性">
      <template v-if="visible">
        <config-options-item :select="select" />
      </template>
    </el-tab-pane>
    <el-tab-pane label="表单属性">
      <config-options-form :config="config" />
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import configOptionsItem from './configOptionsItem';
import configOptionsForm from './configOptionsForm';
export default {
  name: 'config-options',
  components: {
    configOptionsItem,
    configOptionsForm,
  },
  props: {
    visible: {
      default: false,
      required: true,
      type: Boolean
    },
    type: {
      default: '',
      required: false,
      type: String
    },
    select: {
      default: {},
      required: true,
      type: Object
    },
    config: {
      required: true,
      type: Object,
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  
}
</script>

<style lang="scss" scoped>
.operate {
  &::after {
    margin: 5px 0;
    content: '';
    display: block;
    height: 1px;
    background: rgb(182, 182, 182);
  }
}
</style>