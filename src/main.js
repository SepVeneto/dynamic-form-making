import Vue from "vue";
import App from "./App.vue";
import store from "./store";
// import ElementUI from 'element-ui';
import {Button, Dialog, Input, InputNumber, Select, DatePicker, TimePicker, Tabs, TabPane, Option,
  Checkbox, Form, FormItem, Icon, Row, Col, Container, Header, Aside, Main, RadioGroup,
  RadioButton, Message} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './static/global.css';
import './static/cover.css';
import '@/icons'
import VueClipboard from 'vue-clipboard2';

Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Option);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.prototype.$message = Message;

Vue.use(VueClipboard);


// Vue.config.productionTip = false;

// Vue.use(ElementUI);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
