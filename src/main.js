import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './static/global.css';
import './static/cover.css';
import '@/icons'
import VueClipboard from 'vue-clipboard2';

Vue.use(VueClipboard);


// Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
