import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve, dirname} from 'path'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        hmr: true
    },
    plugins: [
        vue(),
        vueI18n()
    ],
    base: './',
    manifest: true,  //配置后才能让编译后的vue路径被正确识别
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            'module-base': resolve(__dirname, './src/module-base'),
        }
    },
    optimizeDeps: {
        exclude: ['electron'], // 告诉 Vite 排除预构建 electron，不然会出现 __diranme is not defined
    },
    css: {
        // css预处理器
        preprocessorOptions: {
            less: {
                charset: false,
                additionalData: '@import "./src/index.less";',
            },
        },
    },
})
