<template>
  <div>
    <draggable tag="ul" v-model="widgetOptions" v-bind="{ghostClass: 'ghost', handle: '.action-option__move'}">
      <li 
        v-for="(item, index) in widgetOptions" 
        :key="index"
        class="mul-option"
      >
        <template v-if="type === 'select'">
          <el-input v-model="item.value" placeholder="value"></el-input>
          <span>-</span>
          <el-input v-model="item.label" placeholder="label"></el-input>
        </template>
        <template v-else-if="type === 'grid'">
          <el-input-number v-model="item.colSpan" />
        </template>
        <div class="action-option">
          <svg-icon class="action-option__move" icon="move" />
          <svg-icon class="action-option__remove" icon="remove" @click="handleDeleteOption(index)" />
        </div>
      </li>
    </draggable>
    <div class="add-option">
      <el-button type="text" @click="handleAddOption">{{this.type | addLabel}}</el-button>
    </div>
  </div>
</template>
<script>
// import draggable from 'vuedraggable';
const draggable = () => import('vuedraggable');
export default {
  name: 'mul-options',
  components: {
    draggable,
  },
  props: {
    type: {
      default: 'select',
      type: String,
    },
    options: {
      required: true,
      type: Array,
    }
  },
  filters: {
    addLabel(val) {
      return {select: '添加选项', grid: '添加栅格'}[val]
    }
  },
  watch: {
    widgetOptions: {
      deep: true,
      handler(val) {
        // this.$emit('upate:options', ...val);
        this.$emit('updateOptions', val);
      }
    },
    options(val) {
      this.widgetOptions = val;
    }
  },
  data() {
    return {
      widgetOptions: this.options,
      optionIndex: 1,
    }
  },
  methods: {
    handleDeleteOption(index) {
      this.widgetOptions.splice(index, 1);
    },
    handleAddOption() {
      const addItem = {select: {
        label: `option${(this.optionIndex) +1}`,
        value: `option${(this.optionIndex++) +1}`,
      }, grid: {
        colSpan: 12,
        list: []
      }}[this.type]
      this.widgetOptions.push(addItem);
    }
  }
}
</script>
<style lang="scss" scoped>
.action-option {
  display: inline-block;
  vertical-align: middle;
  font-size: 18px;
  .svg-icon {
    margin: 0 4px;
  }
  .action-option__move {
    cursor: move;
  }
  .action-option__remove {
    cursor: pointer;
  }
}
.ghost {
  border: 1px dashed rgb(188, 188, 241);
  content: '';
  overflow: hidden;
}
.add-option {
  margin-left: 20px;
}
.mul-option {
  .el-input {
    display: inline-block;
    width: 40%;
  }
}
</style>