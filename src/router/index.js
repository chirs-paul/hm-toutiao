import Vue from 'vue'
import VueRouter from 'vue-router'
// @代表src文件夹
import Login from '@/views/login'
import Home from '@/views/home'

// 注册vue
Vue.use(VueRouter)
const router = new VueRouter({
  // 配置路由规则
  routes: [
    { name: 'login', path: '/login', component: Login },
    { name: 'home', path: '/', component: Home }
  ]
})
// 导出路由
export default router
