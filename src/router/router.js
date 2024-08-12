import Home from 'module-base/views/Home/index.vue'
import Layout from 'module-base/views/Layout/Layout.vue'
import {getModules} from '@/router/routerSetting'

export const routes = [
    {
        path: '/home',
        name: 'home',
        component: Home, //默认直接加载
        meta: {
            hideInMenu: true
        },
    },
    // {
    //     path: '/home',
    //     name: 'home',
    //     component: Layout,
    //     children: [
    //         {
    //             path: '/home_page',
    //             name: 'home_page',
    //             meta: {
    //                 title: '首页',
    //                 icon: 'ios-list-box'

    //             },
    //             component: () => import('module-base/views/Home.vue')
    //         }
    //     ]
    // },
    // ...getModules(), //此处可通过getModules构造各模块路由，也可以直接引入各模块路由，例如...module-toolBox
]
