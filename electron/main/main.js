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
  ipcMain.handle("read-directory", (event, arg) => {
    return new Promise((resolve, reject) => {
      dialog
        .showOpenDialog({ properties: ["openDirectory"] })
        .then((result) => {
          if (!result.canceled && result.filePaths.length > 0) {
            const directory = result.filePaths[0];
            const fileList = fs.readdirSync(directory);
            const results = [];
            fileList
              .filter((item) => {
                const isFile = fs.statSync(directory + "\\" + item).isFile()
                const fileType = item.slice(item.lastIndexOf(".") + 1).toLowerCase();
                const isExcel = fileType === "xlsx" || fileType === "xls";

                return isFile && isExcel;
              })
              .forEach((file) => {
                const result = fs.readFileSync(directory + "\\" + file);
                results.push(result);
              });
            resolve({
              files: results,
              filePaths: fileList,
            });
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  });

  // 读取文件
  ipcMain.handle("read-file", (event, arg) => {
    return new Promise((resolve, reject) => {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          filters: [{ name: "Excel", extensions: ["xlsx", "xls"] }],
        })
        .then((result) => {
          if (!result.canceled && result.filePaths.length > 0) {
            const file = result.filePaths[0];
            const fileContent = fs.readFileSync(file);
            resolve({
              filePath: file,
              file: fileContent,
            });
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  });

  // 批量新建文件夹
  ipcMain.handle("create-directorys", (event, arg) => {
    return new Promise((resolve, reject) => {
      arg.forEach((item) => {
        fs.mkdirSync(item);
      });
      resolve();
    });
  });

  // 读取文件夹名称
  ipcMain.handle("get-directory-names", (event, arg) => {
    return new Promise((resolve, reject) => {
      dialog
        .showOpenDialog({ properties: ["openDirectory"] })
        .then((result) => {
          if (!result.canceled && result.filePaths.length > 0) {
            const directory = result.filePaths[0];
            const fileList = fs.readdirSync(directory);
            const results = fileList.filter((item) => {
              return fs.statSync(directory + "\\" + item).isDirectory();
            });
            resolve(results);
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0)
    new getWindow().createWindow();
});
