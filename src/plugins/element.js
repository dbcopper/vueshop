import Vue from 'vue'
// 按需导入
// eslint-disable-next-line import/no-duplicates
import { Button, Form, FormItem, Message, Input } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 弹框组件全局挂载
Vue.prototype.$message = Message
