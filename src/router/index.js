import { createRouter, createWebHashHistory } from 'vue-router'
// import MemberDutyVue from '../OA/components/MemberDuty.vue'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'default'
    }
  ]
})

// 路由守卫
// router.beforeEach((to, from, next) => {
//   // const isAuthenticated = true; // 替换为你的身份验证逻辑
//   if (to.path.startsWith('/OA/')) {
//     // window.location.href = to.pat
//   }
// console.log(to.path)
// console.log(from)
// console.log(next)

// if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
//   // 如果需要身份验证且用户未登录，则重定向到登录页
//   next({ path: '/' });
// } else if (isAuthenticated && to.path === '/') {
//   // 如果用户已登录且尝试访问登录页，则重定向到仪表板页
//   // window.location.href = '/OA/'
//   // next({ path: '/' });
// } else {
//   // 其他情况允许导航
//   next();
// }
// })

export default router
