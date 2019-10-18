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
      <slot :name="item.key" :model="models" />
      </generate-form-item>
    </template>
  </el-form>
</template>

<script>
import generateFormItem from './generateFormItem';
export default {
  name: 'generate-form',
  props: {
    config: {
      required: true,
      type: Object,
    },
    data: {
      required:  true,
      type: Object,
    }
  },
  components: {
    generateFormItem,
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