import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  // 进行重定向
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home
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
