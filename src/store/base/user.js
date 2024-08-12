import {defineStore} from 'pinia'
import {getUserInfo} from '@/api/user'
import {getToken} from "@/lib/util";

const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: {},
        access: '',
        token:getToken()
    }),
    getters: {
        getAccess: (state) => state.access
    },
    actions: {
        initUserInfo(v) {
            this.userInfo = v
        },
        setAccess(state, access) {
            state.access = access
        }
    }
})

export default useUserStore
