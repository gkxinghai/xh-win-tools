const {app, Menu, ipcMain} = require('electron')

/**
 创建工具栏*/
class MenuPersonal {

    constructor(win) {
        this.win = win
    }

    createMenu() {
        let me = this
        if (process.env.NODE_ENV !== 'development') {
            const template = [{
                label: '文件',
                submenu: [
                    {
                        label: '返回首页',
                        accelerator: 'CmdOrCtrl+W',
                        click:() => this.win.webContents.send('go-page', 'home'), //主进程主动通信到渲染进程
                    },
                    {
                        label: '退出',
                        accelerator: 'CmdOrCtrl+Q',
                        click() {
                            app.quit()
                        }
                    }
                ]
            },
                {
                    label: '窗口',
                    submenu: [
                        {
                            label: '打开调试工具',
                            accelerator: 'F12',
                            role: 'toggleDevTools'
                            // click() {
                            //     win.webContents.openDevTools ()
                            // }
                        }
                    ]
                }
            ]
            let menu = Menu.buildFromTemplate(template)
            Menu.setApplicationMenu(menu)
        }
    }
}

module.exports = MenuPersonal
