<script>
// import widgetComponent from './widgetComponent';
const widgetComponent = () => import('../widgetConfig');
// import mulOptions from './component/mulOptions';
const widgetOptions = () => import('./widgetOptions');
const customWidth = () => import('./CustomWidth');
const validates = () => import('./validate');
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
    widgetOptions,
    customWidth,
    validates,
  },
  render(h) {
    // 配置项分为三大块
    // normal: 基本都是输入，选择框或者自定义组件
    // options: 主要是一些能用多选框表示的操作项
    // validate: 负责展示校验选项和规则
    const {normal, options, validate} = this.parseSelect();
    const input = (key) => (
      <div class="widget-item">
        <div class="widget-item__label">{this.tranZh(key)}</div>
        <div class="widget-item__prop">
          <el-input
            value={this.select[key]}
            onInput={(val) => {this.select[key] = val}}
          />
        </div>
      </div>
    );
    const labelWidth = (key) => (
      <div class="widget-item">
        <div class="widget-item__label">{this.tranZh(key)}</div>
        <div class="widget-item__prop">
          <custom-width props={{select: this.select}} />
        </div>
      </div>
    )
    const checkBox = (key) => (
      <span class="widget-item">
        <span class="widget-item__prop">
          <el-checkbox 
            label={this.tranZh(key)}
            value={this.select[key]}
            onChange={(val) => {this.select[key] = val}}
          />
        </span>
      </span>
    )
    const widgetOptions = (key) => (
      <div class="widget-item">
        <div class="widget-item__label">{this.tranZh(key)}</div>
        <div class="widget-item__content">
          <widget-options select={this.select} />
        </div>
      </div>
    )
    const radioGroup = (key) => (
      <div class="widget-item">
        <div class="widget-item__label">{this.tranZh()}</div>
        <div class="widget-item__content">
          <el-radio-group 
            value={this.select.widgetType}
            onChange={this.handleRadioChange}
            onInput={(val) => {this.select.widgetType = val}}
          >
            <el-radio-button label="date">日期</el-radio-button>
            <el-radio-button label="datetime">日期时间</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    )
    const widget = {
      label: input,
      key: input,
      default: input,
      width: input,
      placeholder: input,
      valueFormat: input,
      class: input,
      labelWidth: labelWidth,
      clearable: checkBox,
      disabled: checkBox,
      showAlpha: checkBox,
      columns: widgetOptions,
      options: widgetOptions,
      gutter: input,
      filterable: checkBox,
      multiple: checkBox,
      widgetType: radioGroup, 
    };
    return (
      <div class="option-container">
        {normal.map(item => widget[item] && widget[item](item))}
        {options.length !== 0 && <div class="options">
          <div class="options__label">操作</div>
          <div class="options__content">
            {options.map(item => widget[item] && widget[item](`options_${item}`))}
          </div>
        </div>}
        {validate.length !== 0 && <div class="validate">
          <div class="validate__label">校验</div>
          <div class="validate__content">
            <validates props={{select: this.select}} />
          </div>
        </div>}
      </div>
    )
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
    tranZh(str) {
      const zhMap = new Map([
        ['label', '标题'],
        ['default', '默认值'],
        ['width', '宽度'],
        ['placeholder', '占位内容'],
        ['valueFormat', '格式化'],
        ['labelWidth', '标签宽度'],
        ['class', '自定义class'],
        ['options_showAlpha', '透明度'],
        ['options_clearable', '可清除'],
        ['options_filterable', '可搜索'],
        ['options_multiple', '多选'],
        ['options_disabled', '禁用'],
        ['validate_required', '必填'],
        ['options', '选项'],
        ['columns', '栅格设置'],
        ['gutter', '分栏间隔'],
      ]);
      return zhMap.get(str) || str;
    },
    parseSelect() {
      const group = {
        normal: [],
        options: [],
        validate: [],
      };
      Object.keys(this.select).forEach(item => {
        const [type, key] = item.split('_');
        const realKey = key ? key : type;
        const realType = key ? type : 'normal';
        group[realType].push(realKey);
      })
      return group;
    },
    handleRemotChange(isRemote) {
      isRemote && (this.select.options = []);
    },
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
  },
}
</script> 

<style lang="scss" scoped>
.widget-item {
  .widget-item__label {
    margin-bottom: 10px;
  }
  margin-bottom: 20px;
}
.options, .validate {
  margin-bottom: 20px;
}
.options__label, .validate__label {
  margin-bottom: 10px;
  border-bottom: solid 1px gray;
}
.config-item__title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
.option-container /deep/ .el-form-item {
  margin-bottom: 0px;
}
</style>