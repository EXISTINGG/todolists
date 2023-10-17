import { createRouter, createWebHashHistory } from 'vue-router'
import { getItem } from '@/utils/localStorage.js'

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home', 
    name: 'Home', 
    component: () => import('@/views/home/index.vue'),
    meta: {title: '首页😀',keepAlive: true},
  },
  {path: '/login', name: 'Login', component: () => import('@/views/login/index.vue'),meta: {title: '登录😀'}},
  {path: '/reg', name: 'Register', component: () => import('@/views/register/index.vue'),meta: {title: '注册'}}
]

// 创建路由实例对象
const router = createRouter({
  // 通过createWebHashHistory属性指定路由工作模式
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果登录后要去登录或注册页，则返回原页面
  if((to.name == 'Login' || to.name == 'Register') && getItem('TOKEN') && getItem('user')) next('/home')
  // 如果没有登录去首页,则返回
  if(to.name == 'Home' && !getItem('TOKEN') && !getItem('user')) next('/login')

  else next()
});

//共享路由
export default router
