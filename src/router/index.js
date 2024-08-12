import {createRouter,createWebHashHistory} from 'vue-router'
import {routes} from './router'
import {  getToken } from '@/lib/util'

const router=createRouter({
    // history:createWebHistory(),
    history:createWebHashHistory(), //只能用hash模式
    routes
})

router.beforeEach((to,from)=>{
    const token = getToken()
    if (
        // 检查用户是否已登录
        !token &&
        // ❗️ 避免无限重定向
        to.name !== 'home'
    ) {
        // 将用户重定向到登录页面
        return { name: 'home' }
    }
})

export default router
