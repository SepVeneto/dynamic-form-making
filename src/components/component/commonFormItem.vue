<script>
// import bus from './bus';
const bus = () => import('./bus');
// import draggable from 'vuedraggable';
const draggable = () => import('vuedraggable');
// import commonFormItem from './commonFormItem';
const commonFormItem = () => import('./commonFormItem');
export default {
  name: 'common-form-item',
  props: {
    item: {
      required: true,
      type: Object
    },
    value: {
      default: '',
    },
    isShow: {
      default: false,
    },
    select: {
      type: Object
    },
    node: {
      type: Array
    },
    index: {
      type: Number
    }
  },
  components: {
    commonFormItem
  },
  data() {
    return {
      selectWidget: this.select,
      requestOptions: []
    }
  },
  computed: {
    selected() {
      // console.log(this.item.key)
      return this.selectWidget.key === this.item.key;
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val);
      },
      deep: true
    }
  },
  render(h) {
    if (this.item.hide) {
      return false;
    }
    const renderWidgetAction = () => {
      if (this.selectWidget && (this.selectWidget.key === this.item.key)) {
        return (
          <div class="widget-tools">
            <div class="widget-action widget-drag">
              <svg-icon icon="rank" class="widget-icons"/>
            </div>
            <div class="widget-action widget-edit">
              <svg-icon
                class="widget-icons" 
                icon="copy"
                onClick={this.handleCopy}
              />
              <svg-icon
                class="widget-icons" 
                icon="delete2"
                onClick={this.handleDelete}
              />
            </div>
          </div>
        )
      }
      return false;
    }
    const pickerOptions = {
        disabledDate(value) {
          return value < new Date().setDate(new Date().getDate() - 1)
        }
      };
    const components = {
      input: () => (
        <el-input
          value={this.item.default} 
          style={`width: ${this.item.width}`}
          type={this.item.formType}
          disabled={this.item.disabled}
          clearable={this.item.clearable}
          placeholder={this.item.placeholder}
          readonly={this.item.readonly}
          { ...{on: this.$listeners}}
        ></el-input>
      ),
      select: () => (
        <el-select 
          value={this.item.multiple ? [] : ''}
          style={`width: ${this.item.width}`}
          // value-key={this.item.valueKey && this.item.valueKey}
          multiple={this.item.multiple}
          filterable={this.item.filterable}
          remote={this.item.remote}
          clearable={this.item.clearable}
          no-data-text={this.item.noDataText}
          placeholder={this.item.placeholder}
          disabled={this.item.disabled}
          remote-method={this.item.remote ? this.remoteMethod : null}
          on-change={this.handleEmit}
          { ...{on: this.$listeners}}>
            <el-option label="option1" value="option1"></el-option>
        </el-select>
      ),
      datePicker: () => (
        <el-datePicker 
          value={this.value} 
          // type={`${this.item.componentType}`}
          // type="datetime"
          type={this.item.widgetType}
          style={`width: ${this.item.width}`}
          disabled={this.item.disabled}
          clearable={this.item.clearable}
          picker-options={this.item.banTime && pickerOptions}
          value-format={this.item.valueFormat || 'yyyy-MM-dd HH:mm:ss'}
          {...{on: this.$listeners}}>
        </el-datePicker>
      ),
      timePicker: () => (
        <el-time-picker 
          style={`width: ${this.item.width}`}
          value={this.value} 
          clearable={this.item.clearable}
          disabled={this.item.disabled}
          value-format={this.item.valueFormat || 'HH:mm:ss'}
          placeholder={this.item.placeholder}/>
      ),
      label: () => (
        <div id={this.item.id} class={this.item.class || 'form-label'}>{this.item.default}</div>
      ),
      radio: () => (
        <el-radio-group 
          value={this.value} 
          {...{on: this.$listeners}}
          disabled={this.item.disabled}>
          {this.item.options && this.item.options.map(each => (
            <el-radio label={each.value}>{each.label}</el-radio>
          ))}
        </el-radio-group>
      ),
      colorPicker: () => (
        <el-color-picker 
          style={`width: ${this.item.width}`}
          value={this.value}
          disabled={this.item.disabled}
          show-alpha={this.item.showAlpha}
          color-format={this.item.colorFormat}
        />
      ),
      grid: () => (
        <el-row 
          class={`widget-grid-item ${this.selected ? 'active' : ''}`}
          nativeOnClick={(e) => {this.handleClick(e,this.item)}}
          gutter={Number(this.item.gutter)}
        >
          {this.item.columns.map(col => (
            <el-col span={col.colSpan} class="widget-grid-wrap">
              <draggable
                class="widget-col"
                list={col.list}
                group="button"
                ghostClass="widget-preview"
              >
                {col.list.map((element, index) => (
                  <common-form-item
                    key={element.key}
                    item={element}
                    value={element.value}
                    select={this.select}
                    node={col.list}
                    index={index}
                    {...{on: {
                      'update:select': (val) => {this.selectWidget = val}
                    }}}
                  ></common-form-item>
                ))}
              </draggable>
            </el-col>
          ))}
          {renderWidgetAction()}
        </el-row>
      ),
      custom: () => (
        <div class="custom-widget"><span>自定义组件</span></div>
      )
    }
    const formItem = this.item.type === 'grid' 
      ? (components['grid']())
      : 
        <el-form-item 
          id={this.item.id}
          class={`${this.item.class} widget-item ${this.selected ? 'active': ''}`}
          label-width={this.item.customLabel ? this.item.labelWidth : null}
          label={this.item.label} 
          rules={this.item.rules}
          prop={this.item.key}
          nativeOnClick={(e) => {this.handleClick(e, this.item)}}
        >
          <span>{components[this.item.type]()}</span>
          <div class="widget-key">{this.item.key}</div>
          {renderWidgetAction()}
        </el-form-item>
 
    return formItem;
  },
  created() {
    // 解决火狐拖拽会打开新标签的问题
    // document.body.ondrop = (event) => {
    //   event.preventDefault();
    //   event.stopPropagation();
    // }
  },
  mounted() {
    const {api} = this.item;
    const params = this.item.apiParams ? this.item.apiParams : '';
    const options = [...this.item.options || []];
    if(api)
    {
      this.$http[api](params).then((res)=> {
        this.requestOptions = [...options, ...res.data || []];
        // this.item.options = [...res.data]
      })
    } else {
      this.requestOptions = options;
    }
  },
  methods: {
    handleClick(event, row) {
      event.stopPropagation();
      // console.log(this.item.key, this.selectWidget.key);
      this.selectWidget = row;
      // console.log(this.item.key, this.selectWidget.key);
    },
    handleCopy() {
      function setKey(widget) {
        if (widget.type === 'grid') {
          widget.key = `grid${new Date().getTime()}`
          widget.columns.forEach(item => {
            item.list.forEach(each => {
              setKey(each);
            })
          })
        } else {
          widget.key = `${widget.type}${new Date().getTime() - parseInt(widget.key.replace(/[a-zA-Z]*/, ''))}`;
        }
      }
      const newWidget = JSON.parse(JSON.stringify(this.selectWidget));
      setKey(newWidget);
      this.node.push(newWidget);
    },
    handleDelete(event) {
      event.stopPropagation();
      if (this.node.length === 1) {
        this.selectWidget = {};
      } else {
        this.selectWidget = this.node[this.index === 0 ? this.index + 1 : this.index - 1]
      }
      this.$nextTick(() => {
        this.node.splice(this.index, 1);
      })
    },
    getComponentData(target) {
      return {
        on: {
          input: this.handleInput
        }
      }
    },
    handleInput(value, target) {
      // console.log(value);
      target = value;
    },
    handleEmit(value) {
      if (this.item.emitEvent) {
        bus.$emit(this.item.emitEvent, value);
      }
    },
    remoteMethod(query) {
      this.$http[this.item.api](query).then((res) => {
        this.requestOptions = res.data;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-widget {
  height: 40px;
  background: rgb(219, 217, 217);
  display: grid;
  span {
    align-self: center;
    justify-self: center;
  }
}
.widget-key {
  position: absolute;
  top: 0;
  right: 0;
  color: green;
  font-size: 8px;
  line-height: 8px;
  margin: 4px 2px;
}
.test {
  outline: 2px solid #e6a23c;
  border: 1px solid #e6a23c;
}
.widget-icons {
  color: #fff;
  font-size: 20px;
  margin: 2px 4px;
}
.widget-tools {
  .widget-drag {
    position: absolute;
    top: -1px;
    left: 0;
    height: 24px;
    line-height: 20px;
    z-index: 381;
    cursor: move;
  }
  .widget-edit {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 24px;
    line-height: 20px;
    z-index: 381;
    .widget-icons {
      cursor: pointer;
    }
  }
}
.widget-grid-item.active {
  border: 1px solid #e6a23c;
  outline: 2px solid #e6a23c;
  .widget-tools {
    .widget-drag {
      background: #e6a23c;
    }
    .widget-edit {
      background: #e6a23c;
    }
  }
}
.widget-grid-item {
  padding: 4px;
  border: 1px dashed #d5c0c0;
  background: rgba(253,246,236,.3);
  &:hover {
    border: 1px solid #e6a23c;
  }
}
.widget-grid-wrap {
  background: white;
}
.widget-preview {
  width: 100% !important;
  height: 0px !important;
  overflow: hidden;
  content: '';
  background: #F56c6c;
  outline: 0px;
  border: 2px solid #F56c6c;
}
.widget-item.active {
  outline: 2px solid #409eff;
  border: 1px solid #409eff;
  .widget-tools {
    .widget-drag {
      background: #409eff;
    }
    .widget-edit {
      background: #409eff;
    }
  }
}
.widget-item {
  background: rgba(236,245,255,.3);
  position: relative;
  border: 1px dashed #d5c0c0;
  height: 60px;
  line-height: 60px;
  &:hover {
    background: #e9f8ff;
    border: 1px solid #409eff;
  }
}
// .widget-item:hover {
//   outline: 2px solid #409eff;
//   border: 1px solid #409eff;
// }
// .widget-item:hover .widget-action {
//   height: 30px;
//   line-height: 34px;
//   background: #409eff;
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   z-index: 9;
//   cursor: pointer;
// }
// .widget-item:hover .widget-drag {
//   height: 30px;
//   line-height: 30px;
//   background: #409eff;
//   position: absolute;
//   top: 0;
//   left: 0;
//   z-index: 9;
//   cursor: move;
// }
.widget-col {
  min-height: 64px;
  border: 1px dashed #d5c0c0;
}
.icons {
  color: #fff;
  font-size: 20px;
  margin: 0 2px;
}
</style>
