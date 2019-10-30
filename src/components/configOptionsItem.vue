<template>
  <el-form class="option-container">
    <template v-if="select.type !== 'grid'">
      <el-form-item label="标题">
        <el-input v-model="select.label" />
      </el-form-item>

      <el-form-item label="key">
        <el-input v-model="select.key" />
      </el-form-item>

      <el-form-item v-if="select.type === 'label'" label="默认值">
        <el-input v-model="select.default" />
      </el-form-item>

      <el-form-item v-if="select.type !== 'custom'" label="占位内容">
        <el-input v-model="select.placeholder" />
      </el-form-item>

      <el-form-item label="宽度">
        <el-input v-model="select.width" />
      </el-form-item>

      <el-form-item v-if="select.type === 'datePicker' || select.type === 'timePicker'" label="格式化">
        <el-input v-model="select.valueFormat" />
      </el-form-item>

      <div class="config-item">
        <div class="config-item__title">标签宽度</div>
        <el-checkbox v-model="select.customLabel">自定义</el-checkbox>
        <el-input-number 
          v-model="labelWidth" 
          :step="10" 
          :disabled="!select.customLabel"
          size="mini"
        />
      </div>

      <el-form-item label="自定义class">
        <el-input v-model="select.class" />
      </el-form-item>

      <div class="config-item" v-if="select.type !== 'custom'">
        <div class="config-item__title">选项</div>
        <el-radio-group 
          v-if="select.type === 'datePicker'" 
          v-model="select.widgetType"
          @change="handleRadioChange"
        >
          <el-radio-button label="date">日期</el-radio-button>
          <el-radio-button label="datetime">日期时间</el-radio-button>
        </el-radio-group>
        <template v-if="select.type === 'select'">
          <el-radio-group v-model="select.remote">
            <el-radio-button :label="false">静态数据</el-radio-button>
            <el-radio-button :label="true">远程数据</el-radio-button>
          </el-radio-group>
          <mul-options 
            v-if="!select.remote"
            type="select"
            :options="select.options"
            @updateOptions="(val) => {handleUpdateOptions(val, 'select')}"
          />
          <div v-else class="remote-options">
            <el-input v-model="select.remoteMethod" #prepend>api</el-input>
          </div>
        </template>
      </div>

      <div class="config-item" v-if="select.type !== 'custom' && select.type !== 'label'">
        <div class="config-item__title operate">操作</div>
        <el-checkbox label="可清除" v-model="select.clearable" />
        <el-checkbox label="禁用" v-model="select.disabled" />
        <el-checkbox 
          v-if="select.type === 'select'" 
          label="可搜索" 
          v-model="select.filterable"/>
        <el-checkbox 
          v-if="select.type === 'select'" 
          label="多选"
          v-model="select.multiple" />
      </div>

      <div class="config-item" v-if="select.type !== 'custom' && select.type !== 'label'">
        <div class="config-item__title validate">校验</div>
        <el-checkbox label="必填" v-model="select.required" />
      </div>
    </template>
    <template v-if="select.type === 'input'"> </template>
    <template v-else-if="select.type === 'select'">
    </template>
    <template v-else-if="select.type === 'grid'">
      <el-form-item label="分栏间隔">
        <el-input v-model="select.gutter" />
      </el-form-item>
      <div>栅格设置</div>
      <mul-options 
        type="grid" 
        :options="select.columns"
        @updateOptions="(val) => {handleUpdateOptions(val, 'grid')}"/>
    </template>
  </el-form>
</template>

<script>
// import widgetComponent from './widgetComponent';
const widgetComponent = () => import('./widgetConfig');
// import mulOptions from './component/mulOptions';
const mulOptions = () => import('./component/mulOptions');
export default {
  name: 'config-options-item',
  props: {
    select: {
      type: Object,
      required: true,
    },
  },
  components: {
    widgetComponent,
    mulOptions,
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
  },
  watch: {
    'select.required': function(val) {
      const rules = val 
        ? {required: true, message: `${this.select.label}必须填写`} 
        : {required: false};
      this.$nextTick().then(() => {
        this.select.rules = [rules];
      })
    }
  },
  methods: {
    handleRadioChange(val) {
      const format = {
        date: 'yyyy-MM-dd',
        datetime: 'yyyy-MM-dd HH:mm:ss',
      };
      this.select.valueFormat = format[val]
    },
    handleUpdateOptions(val, type) {
      const action = {grid: 'columns', select: 'options'};
      this.select[action[type]] = val;
    }
  }
}
</script> 

<style lang="scss" scoped>
.config-item__title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
.option-container /deep/ .el-form-item {
  margin-bottom: 0px;
}
</style>