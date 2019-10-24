<template>
  <div class="container">
    <div class="main-container">
      <header class="form-header">
        <div class="form-header__operate">
          <el-button type="text" @click="handlePreview">
            <svg-icon class="operate-icons" icon="preview" />预览</el-button>
          <el-button type="text" @click="handleGenerateJson">
            <svg-icon class="operate-icons" icon="download" />生成json</el-button>
          <el-button type="text" @click="handleImportJson">
            <svg-icon class="operate-icons" icon="upload" />导入json</el-button>
          <el-button type="text" @click="handleGenerateCode">
            <svg-icon class="operate-icons" icon="code" />生成代码</el-button>
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
    <el-dialog v-if="previewVisible" title="预览" :visible.sync="previewVisible">
      <template>
        <generate-form ref="generateForm" class="generate-form" :config="config" :data="formData" />
        <pre>{{result}}</pre>
      </template>
      <el-button type="primary" @click="handleGetData">获取数据</el-button>
    </el-dialog>
    <el-dialog v-if="jsonVisible" title="json代码" :visible.sync="jsonVisible">
      <div class="editor" id="json-code">{{config}}</div>
      <el-button 
        class="copy-btn"
        type="primary" 
        @click="handleCopy(config)"
      >复制数据</el-button>
    </el-dialog>
    <el-dialog v-if="importVisible" title="json代码" :visible.sync="importVisible">
      <div class="editor" id="import-code">{{jsonConfig}}</div>
      <template #footer>
        <pre>{{jsonConfig}}</pre>
        <el-button type="primary" @click="handleImport">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog v-if="codeVisible" title="生成代码" :visible.sync="codeVisible">
      <div class="editor" id="template-code">{{codeTemplate}}</div>
      <el-button 
        class="copy-btn"
        type="primary" 
        @click="handleCopy(codeTemplate)"
      >复制数据</el-button>
    </el-dialog>
    <div>{{testData}}</div>
    <div>{{testDataTest}}</div>
    <generate-form ref="generateForms" :config="testConfig">
      <!-- <template slot="custom1571385002264" slot-scope="scope"> -->
      <template #test1="scope">
        <el-input v-model="scope.model.test1" />
      </template>
      <template #test2="scope">
        <test-com v-model="scope.model.test2" :options="testOptions" />
      </template>
      <template>
        <div>testtest</div>
      </template>
    </generate-form>
    <el-button @click="handleSubmit">获取数据</el-button>
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
import configOptions from './components/configOptions';
import generateForm from './components/generateForm';
import testCom from './test/testCom';
import generateTemplate from './components/generateTemplate';
export default {
  name: 'app',
  components: {
    commonForm,
    draggable,
    configOptions,
    generateForm,
    commonTable,
    testCom,
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
      testOptions: [
        {label: '11', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
      ],
      codeTemplate: '',
      testConfig: {"class":"midget-main","labelWidth":"120px","list":[{"label":"栅格","icon":"grid","type":"grid","columns":[{"colSpan":12,"list":[{"label":"栅格","icon":"grid","type":"grid","columns":[{"colSpan":12,"list":[{"label":"自定义组件","icon":"custom","type":"custom","labelWidth":"100px","key":"test1"}]},{"colSpan":12,"list":[{"label":"单行文本","icon":"input","type":"input","default":"","rules":[],"labelWidth":"100px","width":"100%","required":false,"clearable":false,"disabled":false,"placeholder":"","key":"input1571728608775"}]}],"key":"grid1571728560684"}]},{"colSpan":12,"list":[{"label":"单行文本","icon":"input","type":"input","default":"","rules":[],"labelWidth":"100px","width":"100%","required":false,"clearable":false,"disabled":false,"placeholder":"","key":"input1571728610285"}]}],"key":"grid1571726361648"},{"label":"单行文本","icon":"input","type":"input","default":"","rules":[],"labelWidth":"100px","width":"100%","required":false,"clearable":false,"disabled":false,"placeholder":"","key":"input1571726365012"},{"label":"自定义组件","icon":"custom","type":"custom","labelWidth":"100px","key":"test2"}]},
      testData: {},
      testDataTest: {},
      importVisible: false,
      jsonConfig: '',
      copyBoard: null,
      codeVisible: false,
      jsonVisible: false,
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
    handleCopy(textObj) {
      this.$copyText(JSON.stringify(textObj)).then(() => {
        this.$message({
          type: 'success',
          message: '复制成功',
        }, (err) => {
          console.log(err);
          this.$message({
            type: 'error',
            message: '复制失败'
          })
        })
      })
    },
    handleSubmit() {
      this.$refs.generateForms.getData().then(data => {
        this.testDataTest = this.testData = data;
      })
    },
    handleGenerateCode() {
      this.codeVisible = true;
      this.$nextTick().then(() => {
        const editor = ace.edit('template-code');
        editor.session.setMode('ace/mode/html');
      })
      this.codeTemplate = generateTemplate(this.config);
    },
    handleImport() {
      try {
        this.config = JSON.parse(this.importEditor.getValue());
        this.importVisible = false;
      } catch(error) {
        this.$message.error(error);
      }
    },
    handleImportJson() {
      this.importVisible = true;
      this.$nextTick().then(() => {
        this.importEditor = ace.edit('import-code');
        this.importEditor.session.setMode('ace/mode/json');
      })
    },
    handleGenerateJson() {
      this.jsonVisible = true;
      this.$nextTick().then(() => {
        const editor = ace.edit('json-code');
        editor.session.setMode('ace/mode/json');
      })
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
.copy-btn {
  margin-left: 50%;
  transform-origin: center;
  transform: translate(-50%, 10px);
}
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
// .generate-form {

// }
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