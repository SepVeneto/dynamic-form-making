<script>
// import bus from './component/bus';
const bus = () => import('./component/bus');
// import generateFormItem from './generateFormItem';
const generateFormItem = () => import('./generateFormItem');
import validateConfig from './validateConfig';
export default {
  name: 'generate-form-item',
  props: {
    item: {
      required: true,
      type: Object,
    },
    modal: {
      required: true,
    }
  },
  components: {
    generateFormItem,
  },
  render(h) {
    const pickerOptions = {
        disabledDate(value) {
          return value < new Date().setDate(new Date().getDate() - 1)
        }
      };
    const components = {
      input: () => (
        <el-input
          value={this.widgetData}
          style={`width: ${this.item.width}`}
          type={this.item.formType}
          disabled={this.item.disabled}
          clearable={this.item.options_clearable}
          placeholder={this.item.placeholder}
          readonly={this.item.options_readonly}
          onInput={this.handleInput}
        ></el-input>
      ),
      select: () => (
        <el-select 
          value={this.widgetData} 
          style={`width: ${this.item.width}`}
          value-key={this.item.valueKey}
          multiple={this.item.options_multiple}
          filterable={this.item.options_filterable && this.item.options_remote}
          remote={this.item.options_remote && this.item.options_filterable}
          clearable={this.item.options_clearable}
          no-data-text={this.item.noDataText}
          placeholder={this.item.placeholder}
          disabled={this.item.validate_disabled}
          remote-method={this.item.options_remote ? this.remoteMethod : null}
          on-change={this.handleEmit}
          { ...{on: this.$listeners}}>
          {(this.requestOptions ).map(each => (
            <el-option
              key={each.value}
              label={each.label}
              value={each.value}>
            </el-option>
          ))}
        </el-select>
      ),
      datePicker: () => (
        <el-datePicker 
          value={this.widgetData} 
          // type={`${this.item.componentType}`}
          type={this.item.widgetType}
          style={`width: ${this.item.width}`}
          disabled={this.item.options_disabled}
          clearable={this.item.options_clearable}
          picker-options={this.item.banTime && pickerOptions}
          value-format={this.item.valueFormat || 'yyyy-MM-dd HH:mm:ss'}
          onInput={this.handleInput}
          {...{on: this.$listeners}}>
        </el-datePicker>
      ),
      timePicker: () => (
        <el-time-picker 
          style={`width: ${this.item.width}`}
          value={this.widgetData}
          disabled={this.item.options_disabled}
          clearable={this.item.options_clearable}
          value-format={this.item.valueFormat}
          placeholder={this.item.placeholder} 
          onInput={this.handleInput}
        />
      ),
      colorPicker: () => (
        <el-color-picker
          style={`width: ${this.item.width}`}
          value={this.widgetData}
          disabled={this.item.options_disabled}
          color-format={this.item.colorFormat}
          show-alpha={this.item.options_showAlpha}
          onInput={this.handleInput}
        />
      ),
      label: () => (
        <div id={this.item.id} class={this.item.class || 'form-label'}>{this.widgetData}</div>
      ),
      radio: () => (
        <el-radio-group 
          value={this.value} 
          {...{on: this.$listeners}}
          disabled={this.item.options_disabled}>
          {this.item.options && this.item.options.map(each => (
            <el-radio label={each.value}>{each.label}</el-radio>
          ))}
        </el-radio-group>
      ),
      grid: () => (
        <el-row 
          gutter={Number(this.item.gutter)}
        >
          {this.item.columns.map(col => (
            <el-col span={col.colSpan}>
              {col.list.map((element, index) => (
                <generate-form-item
                  key={element.key}
                  item={element}
                  {...{props: {modal: this.modal}}}
                  {...{on: {'update:modal': this.handleUpdatemodal}}}
                  {...{scopedSlots: {...this.$scopedSlots}}}
                >
                </generate-form-item>
              ))}
            </el-col>
          ))}
        </el-row>
      ),
      custom: () => (
        <div class={this.item.class}>
          {this.$scopedSlots[this.item.key] 
            && this.$scopedSlots[this.item.key]({model: this.modal})}
        </div>
      )
    }
    const formItem = this.item.type === 'grid' 
      ? (components['grid']())
      : (
        <el-form-item 
          id={this.item.id}
          class={this.item.class}
          label={this.item.label} 
          rules={this.rulesFunction}
          prop={this.item.key}
        >
          {components[this.item.type]()}
        </el-form-item>
      )
    return formItem
  },
  computed: {
    rulesFunction() {
      const required= {required: true, message: `请输入${this.item.label}`};
      const pattern = {required, ...validateConfig};
      const { validate_rules } = this.item;
      // console.log(pattern);
      return validate_rules && this.item.validate_rules.map(item => item && pattern[item]);
    },
  },
  mounted() {
  },
  created() {
    const {remoteMethod} = this.item;
    const api = remoteMethod;
    const params = this.item.apiParams ? this.item.apiParams : '';
    const options = [...this.item.options || []];
    // if(api)
    // {
    //   this.$http[api](params).then((res)=> {
    //     this.requestOptions = [...options, ...res.data || []];
    //     // this.item.options = [...res.data]
    //   })
    // } else {
      this.requestOptions = options;
    // }
  },
  data() {
    return {
      widgetData: this.modal[this.item.key],
      requestOptions: []
    }
  },
  methods: {
    handleEmit(val) {
      this.widgetData = val;
      if (this.item.emitEvent) {
        // this.handleInput(val)
        bus.$emit(this.item.emitEvent, value);
      }
    },
    handleUpdatemodal(val) {
      this.$emit('update:modal', {...val});
    },
    handleInput(val) {
      // this.modal[this.item.key] = val;
      this.widgetData = val;
      // this.$emit('update:modal', {
      //   ...this.modal,
      //   [this.item.key]: val,
      // })
    }
  },
  watch: {
    widgetData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.modal[this.item.key] = val;
        this.$emit('update:modal', {
          ...this.modal,
          [this.item.key]: val
        })
      }
    },
    modal: {
      deep: true,
      immediate: true,
      handler(val) {
        // console.log(this.item.key, val)
        this.widgetData = val[this.item.key];
      }
    }
  }
}
</script>