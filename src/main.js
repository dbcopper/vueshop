import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入发起
import axios from 'axios'
// 设定配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 将其挂载到vue的原型上
// 使得每一个vue组件都可以通过this.$http来进行ajax请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')