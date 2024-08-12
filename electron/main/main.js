const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  globalShortcut,
} = require("electron");
const fs = require("fs");
const getMenuPersonal = require("./Menu");
const getWindow = require("./Window");
const getGlobalShortcut = require("./controller/GlobalShortcut");
//TODO:引入主进程操作js

app.whenReady().then(() => {
  let win = new getWindow().createWindow(); //创建窗口

  new getMenuPersonal(win).createMenu(); //创建工具栏
  // 注册快捷键监听器
  getGlobalShortcut.create(win);

  // 读取文件夹
  ipcMain.on("read-directory", (event, arg) => {
    dialog.showOpenDialog({ properties: ["openDirectory"] }).then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        const directory = result.filePaths[0];
        const fileList = fs.readdirSync(directory);
        const results = []
        fileList.forEach(file => {
          const result = fs.readFileSync(directory + "\\" + file);
          results.push(result)
        })
        
        event.reply('on-read-directory', {
          files: results,
          filePaths: fileList
        });
      }
    });
  });

  // 读取文件
  ipcMain.on("read-file", (event, arg) => {
    dialog.showOpenDialog({ properties: ["openFile"] }).then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        const file = result.filePaths[0];
        const fileContent = fs.readFileSync(file);
        event.reply('on-read-file', {
          filePath: file,
          file: fileContent
        });
      }
    });
  })

  // 批量新建文件夹
  ipcMain.on("create-directorys", (event, arg) => {
    arg.forEach((item) => {
      fs.mkdirSync(item);
    });
  })

  // 读取文件夹名称
  ipcMain.on("get-directory-name", (event, arg) => {
    dialog.showOpenDialog({ properties: ["openDirectory"] }).then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        const directory = result.filePaths[0];
        const fileList = fs.readdirSync(directory);
        const results = fileList.filter(item => {
          return fs.statSync(directory + "\\" + item).isDirectory()
        })
        event.reply('on-get-directory-name', {
          directoryPath: directory,
          directoryNames: results
        });
      }
    });
  })

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0)
    new getWindow().createWindow();
});
