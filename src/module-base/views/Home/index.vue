<template>
  <div class="box-btns">
    <button @click="handleBtn1">合并多个Excel(表名相同)</button>
    <button @click="handleBtn5">合并多个Excel(表名不同)</button>
    <button @click="handleBtn2">合并单个Excel</button>
    <button @click="handleBtn3">批量新建文件夹</button>
    <button @click="handleBtn4">提取文件夹名称</button>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx/xlsx.mjs";

/**
 * 解析sheet数据
 */
const updateWsData = (ws_data, ws_header, sheet, file) => {
  const arrayBuffer = file.buffer;
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const worksheet = workbook.Sheets[sheet];
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  let header = ws_header;

  for (let r = 0; r <= range.e.r; r++) {
    const row = [];
    for (let c = 0; c <= range.e.c; c++) {
      const cell = XLSX.utils.encode_col(c);
      row.push(worksheet[`${cell}${r + 1}`]?.v);
    }
    if (r === 0) {
      if (header.length === 0) {
        header = row;
        ws_data.push(row);
      }
    } else {
      ws_data.push(row);
    }
  }
  return header;
};

/**
 * 合并多个Excel（表名相同）
 * 将多个格式相同的Excel文件合并成一个文件，表名相同的数据会合并到一起
 */
const handleBtn1 = () => {
  myApi.handleInvoke("read-directory").then(e => {
    const files = e.files;
    if (files.length > 0) {
      const arrayBuffer = files[0].buffer;
      const workbook_0 = XLSX.read(arrayBuffer, { type: "array" });
      const excelSheetNames = workbook_0.SheetNames;
      const workbook_new = XLSX.utils.book_new();

      excelSheetNames.forEach((sheet) => {
        const ws_data = [];
        let ws_header = [];
        files.forEach((file) => {
          if (ws_header.length === 0) {
            ws_header = updateWsData(ws_data, ws_header, sheet, file);
          } else {
            updateWsData(ws_data, ws_header, sheet, file);
          }
        });
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(workbook_new, ws, sheet);
      });

      XLSX.writeFile(workbook_new, "output.xlsx");
    }
  })
};

/**
 * 合并单个Excel
 * 将多个相同格式的表数据合并到一张表中
 */
const handleBtn2 = () => {
  myApi.handleInvoke('read-file').then(e => {
    const file = e.file;
    const arrayBuffer = file.buffer;
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const excelSheetNames = workbook.SheetNames;
    const workbook_new = XLSX.utils.book_new();
    const ws_data = [];
    let ws_header = [];

    excelSheetNames.forEach(() => {
      ws_header = updateWsData(ws_data, ws_header, excelSheetNames[0], file);
    });
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(workbook_new, ws, excelSheetNames[0]);
    XLSX.writeFile(workbook_new, "output.xlsx");
  });
};

/**
 * 根据Excel批量新建文件夹
 */
const handleBtn3 = () => {
  myApi.handleInvoke('read-file').then(e => {
    const { file, filePath } = e;
    const arrayBuffer = file.buffer;
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const ws_data = [];
    const ws_header = [1];
    updateWsData(ws_data, ws_header, workbook.SheetNames[0], file);

    const index = filePath.lastIndexOf("\\");
    const path = filePath.slice(0, index + 1);
    const arr = ws_data
      .map((item) => item.join("").replaceAll("/", ""))
      .filter((item) => item)
      .map((item) => path + item);
    myApi.handleInvoke('create-directorys', arr);
  });
};

/**
 * 提取文件夹名称到Excel
 */
const handleBtn4 = () => {
  myApi.handleInvoke("get-directory-names").then(directoryNames => {
    const workbook_new = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(directoryNames.map((item) => [item]));
    XLSX.utils.book_append_sheet(workbook_new, ws, "Sheet1");
    XLSX.writeFile(workbook_new, "output.xlsx");
  })
};

/**
 * 合并多个Excel（表名不同）
 * 将多个Excel表格合并到一个文件中
 */
const handleBtn5 = () => {
  myApi.handleInvoke("read-directory").then(e => {
    const files = e.files;
    const workbook_new = XLSX.utils.book_new();
    if (files.length > 0) {
      files.forEach(file => {
        const arrayBuffer = file.buffer;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const excelSheetNames = workbook.SheetNames;

        excelSheetNames.forEach((sheet) => {
          const ws_data = [];
          let ws_header = [];
          if (ws_header.length === 0) {
            ws_header = updateWsData(ws_data, ws_header, sheet, file);
          } else {
            updateWsData(ws_data, ws_header, sheet, file);
          }
          const ws = XLSX.utils.aoa_to_sheet(ws_data);
          XLSX.utils.book_append_sheet(workbook_new, ws, sheet);
        });
      })

      XLSX.writeFile(workbook_new, "output.xlsx");
    }
  })
}
</script>

<style scoped>
.box-btns {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  padding: 10px;
}
</style>
