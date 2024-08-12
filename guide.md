# 

# demo步骤
1. 按照官网快速开始，完成demo项目的运行与打包。需要使用插件：electron-forge

2. 下载 electron-packager，electron-winstaller,electron-squirrel-startup(先尝试dev模式下载，不知道对不对)

3. 尝试electron-builder。

npm安装插件后，运行大概率会报错： 
```
 ⨯ Get "https://github.com/electron-userland/electron-builder-binaries/releases/download/nsis-resources-3.4.1/nsis-resources-3.4.1.7z": read tcp 172.19.68.67:63202->20.205.243.166:443: wsarecv: An existing connection was forcibly clos
                  ed by the remote host.
```
这是因为某些插件无法通过npm包下载成功，需要点击前面的下载链接直接下载离线的压缩包，然后按照要求放到npm本地仓库中。我的仓库地址形如：
```
C:\Users\Administrator\AppData\Local\electron-builder\Cache\nsis
```
4. windows安装时修改注册表，增加右键功能
创建文件installer.nsh:
```
!macro customInstall
   WriteRegStr HKCR "*\shell\cnde-demo" "" "cnde上传文件"
   WriteRegStr HKCR "*\shell\cnde-demo" "Icon" "$INSTDIR\cnde-demo.exe"
   WriteRegStr HKCR "*\shell\cnde-demo\command" "" '"$INSTDIR\cnde-demo.exe" "read" "%1"'
!macroend
;卸载时清除
!macro customUninstall
   DeleteRegKey HKCR "*\shell\cnde-demo"
!macroend

```
**注意路径书写方式，网上文章的路径百分之九十是错误的。**

修改package.json:
```
{
  "name": "cnde-pc-electron",
  "version": "1.0.0",
  "description": "cnde-pc-electron",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "electron-forge start",
    "package": "electron-forge package",
    "make": "electron-forge make",
    "package-win": "electron-packager ./ --out ./package-win-out --arch=x64 --electron-version=20.1.1 --overwrite --icon=./src/assets/img/favicon.ico",
    "package-linux": "electron-packager ./cnde --out ./OutApp --version 1.0.0 --arch=x64 --electron-version=20.1.1 --overwrite --icon=./app/img/icon/icon.ico",
    "builder-win": "electron-builder",
    "builder-wl": "electron-builder -wl"

  },
  "author": "lize",
  "license": "MIT",
  "devDependencies": {
    "@electron-forge/cli": "^6.0.0-beta.65",
    "@electron-forge/maker-deb": "^6.0.0-beta.65",
    "@electron-forge/maker-rpm": "^6.0.0-beta.65",
    "@electron-forge/maker-squirrel": "^6.0.0-beta.65",
    "@electron-forge/maker-zip": "^6.0.0-beta.65",
    "electron": "^20.1.1",
    "electron-builder": "^23.3.3"
  },
  "build": {
    "productName": "cnde-demo",
    "appId": "cnde",
    "directories": {
      "output": "dist"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "include": "./src/installer.nsh"
    },
    "mac": {
      "category": "your.app.category.type"
    },
    "win": {
      "icon": "./src/assets/img/favicon.ico",
      "target": [
        {
          "target": "nsis",
          "arch": [
            "ia32"
          ]
        }
      ]
    },
    "linux": {
      "icon": "./src/assets/img/favicon.ico"
    }
  },
  "config": {
    "forge": {
      "packagerConfig": {},
      "makers": [
        {
          "name": "@electron-forge/maker-squirrel",
          "config": {
            "name": "cnde_pc_electron"
          }
        },
        {
          "name": "@electron-forge/maker-zip",
          "platforms": [
            "darwin"
          ]
        },
        {
          "name": "@electron-forge/maker-deb",
          "config": {}
        },
        {
          "name": "@electron-forge/maker-rpm",
          "config": {}
        }
      ]
    }
  },
  "dependencies": {}
}

```
**重点关注scripts、build属性。**

5. linux环境打包项目
npm install更新项目依赖后，重新更新下electron-builder，加上参数--unsafe-perm，解决经常出现的权限不足问题。
```sudo npm install electron -g --unsafe-perm=true --allow-root
npm install electron-builder --unsafe-perm
```
遇到linux文件权限问题，对我们的项目文件cnde-pc-electron修改权限：
```
sudo chmod -R 777 cnde-pc-electron
```
在linux系统大概率还会碰到windows系统中遇到的，插件资源下载不成功的问题，按照提示，在相应的网址下载资源，放到系统对应的文件系统
中。

没搞明白为啥linux-centos下打包的程序无法在银河麒麟中运行。

现在搞明白了，因为.ico图片是windows系统中的文件格式，不能用于linux。

# 开发

1. nodemon解决热更新问题:
    
    下载nodemon，package.json配置：
    ```
        "dev": "nodemon --exec electron ."
    ```
   这样只能监听js文件的改变，配置其他文件类型的热更新：
   ```
   nodemon --exec electron . --watch ./ --ext .js,.html,.css,.vue
   
   ```
   --watch --ext 均为nodemon的参数，可通过以下命令查看：
   ```
   nodemon --help
   ```
   
2. openDevTools解决打开调试工具

createWindow()方法返回win对象，createMenu()方法传入win对象，并配置F12快捷键，通过win.webContents.openDevTools ()打开调试工具

3.如何在渲染进程render中获得操控底层系统的能力，主进程->渲染进程。
* 在创建窗口时，添加属性：
    ```
          webPreferences:{
                nodeIntegration:true,  //集成node api
                contextIsolation:false  //关闭上下文隔离，配合nodeIntegration，可以赋予在render进程中写node代码的能力
            }
    ```
  不安全，不建议。
 * 创建preload.js，在创建窗口时，添加属性：
 ```
    preload: path.resolve(__dirname, './preload.js')  //预加载的js文件

 ```

  preload.js实在render进程之前渲染，在此js文件调用electron提供的api，可以在主进程和渲染进程间搭建一个桥，实现在preload中
 4. 渲染进程<->主进程
 
 ipcMain、ipcRender
 
 5. 保持桌面大小插件electron-window-state
 
 6. 重要参数——webContents:
 
 >> 渲染和控制网页，包括与网页相关的监听、方法
    
     * context-menu:监听鼠标右键
     * executeJavaScript:向页面注入js代码
 # 构建electron+vue3项目
 
## 1. 构建项目。

不要使用系统自带cmd，我的电脑出现上下键无法使用的情况。使用webstorm进入要创建项目的文件夹，初始化vite项目：
 
 ```
    npm init vite
```
根据提示依次完成项目创建，考虑团队技术栈，暂定js版本vue。

创建后，命令行启动项目：
```
npm install 
npm run dev
```

## 2. 下载electron
 
 ```
    npm i electron -d
    // 或者 yarn add electron -D ;下载总是出现不知名错误，很可能是网络环境问题，直接用手机流量下载。因为上一步运行了项目，记得下载前先关闭项目，否则报错没有权限。
```
一定要看看package.json，有没有把electron加载到devDependencies，否则会拖累最终打包的大小。

## 3.定义入口文件
 
 package.js文件中增加配置定义入口文件：
 
 ```
 "main": "main.js",   
```

## 4.安装nodemon
 
 ```
    npm i nodemon -D
```
## 5. 配置启动命令并监控文件热更新

```
    "start": "nodemon --exec electron . --watch ./ --ext .js,.html,.css,.vue",
```
修改package.json的type字段：
```
"type": "commonjs"
```

## 6.安装插件

    * electron-window-state
    * pinia
    * store2（可选）
    * lodash
    * vue-router
### electron-window-state

不过多介绍，相关代码在Window.js中。

### pinia

下载：
```
npm i pinia -S
```
在vue项目中main.js使用插件：
```
import {createPinia} from 'pinia'
……
createApp(App).use(createPinia()).mount('#app')
```

src目录下创建store文件夹，创建示例store文件：
```
import {defineStore} from 'pinia'

const useTest=defineStore('testStore',{
    state() {
        return{
            showTest:false
        }
    },
    actions:{
        changeTest(v){
            this.showTest=v
            return v
        }
    }
})

export default useTest
```
在需要使用的vue组件引入，例如TestStore.vue:

```
import useTest from '@/store/test'
const test=useTest()
```
## vue-router

下载
```
npm i vue-router -S

```
创建router文件夹，并在其中创建index.js文件,基本代码结构如下：

```
import {createRouter,createWebHistory} from 'vue-router'
import Home from '@/views/Home.vue'
const routes=[
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: Home //默认直接加载
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('@/views/TestStore.vue')  //懒加载，点击时跳转
    }
]
const router=createRouter({
    history:createWebHistory(),
    routes
})

export default router

```
vue-router最重要的两个HTML标签为router-link、router-view。

在App.vue中写router-view，作为渲染组件的位置。

写一个简单的header组件，使用router-link在其中写入两个跳转按钮，实现点击不同按钮时，跳转到不同页面的功能：
header.vue的核心代码为：
```
<script setup>
import {ref} from 'vue'

</script>

<template>
  <div class="header-container">
    <router-link to="/home">
      首页
    </router-link>
    <router-link to="/test">
      <div>
        test按钮
      </div>
    </router-link>
  </div>
</template>

<style>

</style>

```
这样已经基本实现路由跳转功能，下面利用this.$router.push将路由跳转改为函数式编程。

```
<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
const router=useRouter()
const list = ref([
  {
    name: 'home',
    meta: {
      icon: 'md-stats',
      title: '首页'
    },
  },
  {
    name: 'test',
    meta: {
      icon: 'md-stats',
      title: 'test'
    },
  }
])

const turnToPage=(item)=> {
  router.push(item.name)
}
</script>

<template>
  <div class="header-container">
    <div v-for="item in list" :key="item.name"  @click="turnToPage(item)">
      {{ item.meta.title }}
    </div>
  </div>
</template>

<style>

</style>

```

# 注意

* vue-router只能使用hash模式
* vite配置manifest，否则打包后的vue路径不正确。或者将index中的./相对路径换成“/”绝对路径，但是
对于复杂的系统，后续路径方面也可能出问题，所以不推荐第二种。

# 使用插件i18n

