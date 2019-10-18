<template>
  <el-form 
    :ref="config.ref"
    :class="config.class"
    :model="value" 
    :inline="config.inline"
    :label-width="config.labelWidth">
    <slot name="front" />
    <draggable 
      v-model="config.list"
      v-bind="{group: 'button', ghostClass: 'widget-preview', handle: '.widget-drag'}"
    >
    <transition-group name="fade" tag="div" class="widget-view">
      <template v-for="(row, index) in config.list">
        <div :key="index">
          <common-form-item
            :item="row"
            :select.sync="selectWidget"
            :node="config.list"
            :index="index"
            @input="handleInput($event, item.key)"
          />
      </div>
      </template>
    </transition-group>
    </draggable>
    <slot name="back" />
  </el-form>
</template>

<script>
import commonFormItem from './commonFormItem';
import draggable from 'vuedraggable';
export default {
  name: 'common-form',
  props: {
    config: {
      required: true,
      type: Object
    },
    value: {
      required: true,
      type: Object
    },
    select: {
      type: Object
    }
  },
  components: {
    commonFormItem,
    draggable,
  },
  data() {
    return {
      selectWidget: {},
    }
  },
  mounted() {
    this.setDefaultValue();
  },
  watch: {
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val);
      },
      deep: true
    },
    select(val) {
      this.selectWidget = val;
    }
  },
  methods: {
    handleAdd(ext) {
      console.log('enter')
      console.log(ext);
    },
    handleClicK(e) {
      console.log('click')
    },
    handleInput(value, key) {
      this.$emit('input', {...this.value, [key]: value});
    },
    setDefaultValue() {
      let searchValue = { ...this.value };
      // console.log(searchValue);
      this.config.list.forEach(({key, value})=> {
        // 如果表单原来就有值就放弃赋初值
        searchValue[key] = searchValue[key] ? searchValue[key] : value;
      })
      this.$emit('input', searchValue);
    }
  }
}
</script>

<style scoped>
.fade-enter {
  transition: all .5s;
}
.widget-view {
  min-height: 400px;
}
.widget-col {
  height: 60px;
  border: 1px dashed #2c3e50
}
.widget-preview {
  width: 100% !important;
  height: 0px !important;
  overflow: hidden;
  content: '';
  background: red;
  outline: 0px;
  border: 2px solid red !important;
}
</style>

