const path = require('path')
const {Menu, BrowserWindow, Tray, app} = require('electron')
const {join} = require('path')
process.env.DIST = join(__dirname, '../')
const indexHtml = join(process.env.DIST, 'index.html')
let electronAssetsPath=''
let preloadPath=''
if(app.isPackaged){
    electronAssetsPath=join(process.env.DIST, 'electron')
    preloadPath=join(__dirname, 'preload.js')

}else{
    electronAssetsPath=path.resolve(__dirname, '../../public/electron')
    preloadPath=join(__dirname, '../preload/preload.js')

}

/**
 * 创建窗口对象*/
class Window {
    win = null

    getWindowState() {
        //    配置electron-window-state插件,获取窗口option
        let win
        const options = {
            width:600,
            height:800,
            devTools: true,
            show: false,
            icon: path.resolve(electronAssetsPath, 'log.ico'),
            webPreferences: {
                // nodeIntegration:true,  //集成node api
                // contextIsolation:false  //关闭上下文隔离，配合nodeIntegration，可以赋予在render进程中写node代码的能力
                preload: preloadPath  //预加载的js文件
            }
        }


        win = new BrowserWindow(options)

        return win
    }

    createContextMenu(contents) {
        //    创建右键菜单
        let contextMenu = Menu.buildFromTemplate([
            {label: 'Item 1'},
            {role: 'editMenu'}
        ])
        contents.on('context-menu', (e, params) => {
            contextMenu.popup()
        })
    }

    createTray() {
        //    创建托盘
        let trayMenu = Menu.buildFromTemplate([
            {label: 'Item 1'},
            {role: 'quit'}
        ])

        let tray =new Tray( path.resolve(electronAssetsPath, 'log.ico'))
        tray.setToolTip('Tray details')

        tray.on('click', e => {
            console.log(e)
            if (e.shiftKey) {
                app.quit()
            } else {
                this.win.isVisible() ? this.win.hide() : this.win.show()
            }
        })

        tray.setContextMenu(trayMenu)
    }

    createWindow() {
        this.win = this.getWindowState()
        this.createTray()

        if(app.isPackaged){
            this.win.loadFile(indexHtml)
            // this.win.loadURL(' https://www.baidu.com/')
        }else{
            this.win.loadURL('http://localhost:5173/')
        }
        //等待dom渲染后打开窗口
        this.win.on('ready-to-show', () => {
            this.win.show()
        })
        this.win.on('closed', () => {
            this.win = null;
        })

        let contents = this.win.webContents

        // contents.openDevTools()

        this.createContextMenu(contents)
        // this.createTray()

        return this.win
    }

}

module.exports = Window
