import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/User.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'
import Params from './components/goods/Params.vue'
import List from './components/goods/List.vue'
import Add from './components/goods/Add.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  // 进行重定向
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    // 为什么没有代码直接纠错啊！！！！！！！！！！！！！！！！！！！！！
    // 子定向，显示在不同位置上
    children: [{ path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add }
    ]
  }

]

const router = new VueRouter({
  mode: 'hash',
  routes
})

// 挂载路由导航守卫,有token才能访问home
// 到哪去，从哪来, 让不让你去
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
