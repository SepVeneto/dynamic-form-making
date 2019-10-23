<!--
<template>
  <el-form
    ref="validateForm"
    :model="models"
    :class="config.class"
    :label-width="config.labelWidth"
  >
    <template v-for="item in config.list">
      <generate-form-item 
        :key="item.key"
        :item="item"
        :modal.sync="models"
        @inputChange="handleInputChange"
      >
      </generate-form-item>
    </template>
  </el-form>
</template>
-->
<!--
<template>
  <el-form :model="models">
    <el-form-item label=""><slot/></el-form-item>
  </el-form>
</template>
-->

<script>
import generateFormItem from './generateFormItem';
export default {
  name: 'generate-form',
  props: {
    config: {
      required: true,
      type: Object,
    },
    // data: {
    //   required:  true,
    //   type: Object,
    // }
  },
  render(h) {
    return (
      <el-form
        ref="validateForm"
        class={this.config.class}
        label-width={this.config.labelWidth}
        props={{model: this.models}}
      >
        {this.config.list.map(item => (
          <generateFormItem
            key={item.key}
            item={item}
            props={{modal: this.models}}
            {...{on: {'update:modal': this.updateModal}}}
            {...{scopedSlots: {...this.$scopedSlots}}}
          >
          </generateFormItem>
        ))}
      </el-form>
    )
  },
  components: {
    generateFormItem,
  },
  mounted() {
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
      }
    }
  },
  data() {
    return {
      models: {},
    }
  },
  methods: {
    updateModal(val) {
      this.models = val;
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.validateForm.validate(valid => {
          if (!valid) {
            // return false;
            reject(false);
          } else {
            resolve(this.models);
          }
        })
      })
    },
      // return new Promise((resolve, reject) => {
      //   resolve(this.models);
      // })
      // return this.models;
    handleInputChange(key, val) {

    }
  }
}
</script>