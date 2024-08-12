import {defineStore} from 'pinia'
import {
    getMenuByRouter,
} from '@/lib/util'
import {routes} from '@/router/router'
import useUserStore from './user'
const useRouterStore = defineStore('routerStore', {
    state: () => ({
        menuList: []
    }),
    getters: {
        getMenuList:(state)=> {
            const userStore = useUserStore();
            return getMenuByRouter(routes, userStore.getAccess)
        }
    },
    actions: {

    }
})

export default useRouterStore
