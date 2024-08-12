// 注册快捷键监听器.
const {globalShortcut}=require('electron')
class GlobalShortcut{

    create(win){
        globalShortcut.register('F5', () => {
            win.webContents.send('page-refresh', '') //主进程主动通信到渲染进程
        })
    }
}
module.exports = new GlobalShortcut()
