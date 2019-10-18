<template>
  <div class="container">
    <div class="main-container">
      <header class="form-header">
        <div class="form-header__operate">
          <el-button type="text" @click="handlePreview">
            <svg-icon class="operate-icons" icon="preview" />预览</el-button>
          <el-button type="text" @click="handleGenerateCode">
            <svg-icon class="operate-icons" icon="download" />生成json</el-button>
          <el-button type="text" @click="handleImportCode">
            <svg-icon class="operate-icons" icon="upload" />导入json</el-button>
        </div>
      </header>
      <aside class="form-components" width="300px">
        <template v-for="(items, key, index) in widgetConfig">
          <div class="basic-components" :key="`widget-${key}${index}`"><span>{{key | widgetName}}</span></div>
          <draggable 
            :key="`${key}${index}`"
            :list="items"
            v-bind="{group: {name: 'button', pull: 'clone', put: false}, sort: false}"
            :clone="handleDeepClone"
            class="components-container"
          >
            <div v-for="(item,index) in items" class="form-item" :key="index">
              <svg-icon class="svg-container" :icon="item.icon" />
              <span>{{item.label}}</span>
            </div>
          </draggable>
        </template>
      </aside>
      <main class="form-main">
        <div>
          <common-form class="common-form" :config="config" v-model="formData" :select.sync="selectWidget" />
        </div>
      </main>
      <aside class="form-operate">
        <config-options :visible="visible" :select="selectWidget" :config="config"/>
      </aside>
    </div>
    <!-- <div>
      <el-container>
        <pre>{{config}}</pre>
      </el-container>
    </div> -->
    <el-dialog title="预览" :visible.sync="previewVisible">
      <template v-if="previewVisible">
        <generate-form ref="generateForm" class="generate-form" :config="config" :data="formData" />
        <pre>{{result}}</pre>
      </template>
      <el-button type="primary" @click="handleGetData">获取数据</el-button>
    </el-dialog>
    <el-dialog title="json代码" :visible.sync="codeVisible">
      <div v-if="codeVisible" class="editor" id="json-code">{{config}}</div>
      <el-button 
        id="json-copy-btn" 
        type="primary" 
        :data-clipboard-text="JSON.stringify(config)"
      >复制数据</el-button>
    </el-dialog>
    <el-dialog title="json代码" :visible.sync="importVisible">
      <div v-if="importVisible" class="editor" id="import-code">{{jsonConfig}}</div>
      <template #footer>
        <pre>{{jsonConfig}}</pre>
        <el-button type="primary" @click="handleImport">确定</el-button>
      </template>
    </el-dialog>
    <generate-form :config="testConfig" :data="testData">
      <!-- <template slot="custom1571385002264" slot-scope="scope"> -->
      <template #custom1571385002264="scope">
        <el-input v-model="scope.model.custom1571385002264" />
      </template>
    </generate-form>
    <!-- <common-table :tableConfig="tableConfig" :tableData="tableData">
      <template #test>
        <el-button>test</el-button>
      </template>
    </common-table> -->
  </div>
</template>

<script>
import widgetConfig from './components/widgetConfig';
import commonForm from './components/component/commonForm';
import commonTable from './components/component/commonTable';
import draggable from 'vuedraggable';
import Clipboard from 'clipboard';
import configOptions from './components/configOptions';
import generateForm from './components/generateForm';
export default {
  name: 'app',
  components: {
    commonForm,
    draggable,
    configOptions,
    generateForm,
    commonTable,
  },
  computed: {
    visible() {
      return Object.keys(this.selectWidget).length !== 0;
    }
  },
  filters: {
    widgetName(val) {
      return {base: '基础表单项', advance: '高级表单项', layout: '布局'}[val];
    }
  },
  data() {
    return {
      testConfig: {"class":"midget-main","labelWidth":"120px","list":[{"label":"自定义组件","icon":"custom","type":"custom","labelWidth":"100px","key":"custom1571385002264"}]},
      testData: {},
      importVisible: false,
      jsonConfig: '',
      copyBoard: null,
      codeVisible: false,
      result: {},
      previewVisible: false,
      selectWidget: {},
      choose: null,
      isDrag: false,
      formData: {},
      config: {
        class: 'midget-main',
        labelWidth: '120px',
        list: [
        ]
      },
      widgetConfig,
      importEditor: null,
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],
      tableConfig: [
        {prop: 'date', label: '日期', align: 'center'},
        {prop: 'name', label: '姓名', align: 'center'},
        {prop: 'address', label: '地址', align: 'center'},
        {label: '操作', align: 'center', slotName: 'test'},
      ]
    }
  },
  methods: {
    handleImport() {
      try {
        this.config = JSON.parse(this.importEditor.getValue());
        this.importVisible = false;
      } catch(error) {
        this.$message.error(error);
      }
    },
    handleImportCode() {
      this.importVisible = true;
      this.$nextTick().then(() => {
        this.importEditor = ace.edit('import-code');
        this.importEditor.session.setMode('ace/mode/json');
      })
    },
    handleGenerateCode() {
      this.codeVisible = true;
      this.$nextTick().then(() => {
        const editor = ace.edit('json-code');
        editor.session.setMode('ace/mode/json');
      })
      if (!this.copyBoard) {
        this.copyBoard = new Clipboard('#json-copy-btn');
        this.copyBoard.on('success', () => {
          this.$message.success('复制成功');
        })
      }
    },
    handleGetData() {
      this.$refs.generateForm.getData().then(data => {
        this.result = data;
      })
      .catch(error => { })
    },
    handlePreview() {
      this.previewVisible = true;
    },
    handleDeepClone(value) {
      const target = JSON.parse(JSON.stringify(value));
      target.key || (target.key = `${target.type}${new Date().getTime()}`);
      return target;
    },
  },
};
</script>

<style lang="scss" scoped>
.operate-icons {
  vertical-align: bottom;
  margin-right: 4px;
  font-size: 16px;
}
.basic-components {
  display: grid;
  align-self: center;
  height: 40px;
  span {
    align-self: center;
  }
}
.components-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  margin-bottom: 20px;
}
// .container {
//   display: grid;
//   grid-template-rows: 50px auto;
//   gap: 6px;
// }
.main-container {
  display: grid;
  grid-template-columns: 250px auto 300px;
  grid-template-rows: 40px auto;
  gap: 6px;
  margin: 0 10px;
}
.form-operate {
  grid-column: 3;
  grid-row: 1 / 3;
}
.generate-form {

}
#json-copy-btn {
  margin: 0 auto;
}
.editor {
  height: 400px;
}
.form-header {
  border-bottom: 1px solid gray;
  display: grid;
  grid-column: 2;
  grid-row: 1;
}
.form-header__operate {
  align-self: center;
  justify-self: right;
  margin-right: 20px;
}
.widget-preview {
  height: 0px !important;
  overflow: hidden;
  content: '';
  background: #F56c6c;
  outline: 0px;
  border: 2px solid #F56c6c;
}
.form-components {
  grid-column: 1;
  grid-row: 1 / 3;
}
.form-components .form-item{
  display: inline-block;
  /* width: 46%; */
  background: rgb(217, 232, 252);
  /* margin: 4px; */
  cursor: move;
  font-size: 16px;
}
/* .ghost {
  height: 3px !important;
  background: red;
  content: '';
  overflow: hidden;
} */
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.choose-input {
  /* position: absolute; */
  cursor: pointer;
}
.form-main {
  border: 1px dashed gray;
  padding: 4px;
  grid-column: 2;
  grid-row: 2;
}
.form-main /deep/ .el-form-item__content {
  position: static;
}
.form-main /deep/ .el-form-item::after {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
}
.form-main /deep/ .el-form-item {
  margin-bottom: 2px;
}
.svg-container {
  font-size: 16px;
  margin-right: 8px;
  /* vertical-align: middle; */
}
.form-item * {
  vertical-align: middle;
}
</style>
