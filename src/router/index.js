import Vue from 'vue'
import VueRouter from 'vue-router'
// @代表src文件夹
import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import NotFound from '@/views/404'

// 注册vue
Vue.use(VueRouter)
const router = new VueRouter({
  // 配置路由规则
  routes: [
    { name: 'login', path: '/login', component: Login },
    {
      path: '/',
      component: Home,
      children: [
        { name: 'welcome', path: '/', component: Welcome }
      ] },
    { name: '404', path: '*', component: NotFound }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const user = window.sessionStorage.getItem('hm-toutiao')
  if (user) return next()
  next('/login')
})
// 导出路由
export default router
