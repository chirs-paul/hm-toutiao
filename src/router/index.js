import Vue from 'vue'
import VueRouter from 'vue-router'
// @代表src文件夹
import Login from '@/views/login'
// 注册vue
Vue.use(VueRouter)
const router = new VueRouter({
  // 配置路由规则
  routes: [
    { name: 'login', path: '/login', component: Login }
  ]
})
// 导出路由
export default router
