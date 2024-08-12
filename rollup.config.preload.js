import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';


const mainConfig={
    input: 'electron/main/main.js', // 主进程入口文件
    output: {
        file: 'dist/assets/progress.js', // 输出文件
        format: 'cjs' // 使用 CommonJS 格式
    },
    plugins: [
        nodeResolve({
            extensions: ['.js'] // 只处理.js和.json文件
        }), // 解析 Node.js 模块
        terser()
    ],
    external:[
        "electron"
    ]

}
const preloadConfig=Object.assign({},mainConfig,{
    input: 'electron/preload/preload.js', // 主进程入口文件
    output: {
        file: 'dist/assets/preload.js', // 输出文件
        format: 'cjs' // 使用 CommonJS 格式
    },
})
export default preloadConfig
