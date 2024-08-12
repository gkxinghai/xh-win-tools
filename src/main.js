import { createApp } from 'vue'
import {createPinia} from 'pinia'
import router from '@/router/index.js'
import ViewUIPlus from 'view-ui-plus'
import i18n from '@/lang'

import 'view-ui-plus/dist/styles/viewuiplus.css'


import './style.css'
import App from './App.vue'
import '@/assets/common.css'
createApp(App,{
    data: () => ({ path: 'hello' })
}).use(router).use(createPinia()).use(i18n).use(ViewUIPlus).mount('#app')
