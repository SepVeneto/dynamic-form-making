<template>
  <div>
    <template v-if="select.type !== 'grid'">
      <el-radio-group v-model="select.options_remote">
        <el-radio-button :label="false">静态数据</el-radio-button>
        <el-radio-button :label="true">动态数据</el-radio-button>
      </el-radio-group>
    </template>
    <mul-options
      v-if="!select.options_remote"
      :type="select.type"
      :options=options
      @updateOptions="(val) => {handleUpdateOptions(val, select.type)}"
    />
    <div v-else class="remote-options">
      <el-input v-model="select.remoteMethod" #prepend>api</el-input>
    </div>
  </div>
</template>

<script>
const mulOptions = () => import('../component/mulOptions');
export default {
  name: 'widget-options',
  props: ['select'],
  components: {
    mulOptions,
  },
  computed: {
    options() {
      const type = {
        grid: 'columns',
        select: 'options',
      }[this.select.type];
      return this.select[type];
    }
  },
  methods: {
    handleUpdateOptions(val, type) {
      this.select[type] = val;
    }
  }
}
</script>