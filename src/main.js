import 'default-passive-events'
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
// vue-tree
import TreeTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 设定配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置axios请求拦截器,拦截每一次请求头
axios.interceptors.request.use(config => {
  console.log(config)
  // 后端文档要求为请求头添加一个Authorization等于token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 将其挂载到vue的原型上
// 使得每一个vue组件都可以通过this.$http来进行ajax请求
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

// 注册一个全局过滤器，用来标准化时间
Vue.filter('dateFormat', function (originVal) {
  // 将秒时间重置为标准化时间
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // 从0开始的，加上字符串变为字符串，后面的是补充0使其成为两位
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
})

// 使用富文本编辑器
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
