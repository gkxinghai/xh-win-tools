/*
 *  预加载脚本虽运行于渲染器的环境中，却因能访问 Node.js API 而拥有了更多的权限；
 * 预加载脚本与渲染器的主要运行环境是隔离开来的，无法直接操作网页元素，不过可以通过contextBridge 模块来安全地实现交互
 * 总结：预加载脚本作为渲染进程（页面）和主进程（底层）之间的桥梁。
 * */

console.log(process.platform);

const { contextBridge, ipcRenderer, dialog } = require("electron");

const handleTest = async () => {
  let result = await ipcRenderer.invoke("test", "test");
  // console.log(result)
  return result;
};

const handleGoPage = (callback) => ipcRenderer.on("go-page", callback); //监听主进程事件
const handlePageRefresh = (cb) => ipcRenderer.on("page-refresh", cb); //监听主进程事件

const handleGetProgressArgv = async () => {
  let files = await ipcRenderer.invoke("get-progress-files");
  console.log("files", files);
  return files; // 返回结果
};

const handleReadDirectory = (cb) => {
    ipcRenderer.on('on-read-directory', (event, arg) => {
        console.log('on-read-directory', arg)
        if(cb){
            cb(arg)
        }
    })

    ipcRenderer.send("read-directory");
};

/**
 * 暴露给前端windows对象，windows对象的属性可以用windows.myApi调用或者直接简写为myApi调用
 * */
contextBridge.exposeInMainWorld("myApi", {
  platform: process.platform,
  handleTest,
  handleGoPage,
  handleGetProgressArgv,
  handlePageRefresh,
  handleReadDirectory
});
