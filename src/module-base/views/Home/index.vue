<template>
  <div class="box-btns">
    <button @click="handleBtn1">合并多个Excel</button>
    <button @click="handleBtn2">合并单个Excel</button>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx/xlsx.mjs";

// 注意：s2ab是一个辅助函数，用于将字符串转换为ArrayBuffer
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

const updateWsData = (ws_data, ws_header, sheet, file) => {
  const arrayBuffer = file.buffer;
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const worksheet = workbook.Sheets[sheet];
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  let header = ws_header

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
  return header
};

// 合并多个Excel
const handleBtn1 = () => {
  myApi.handleReadDirectory((files) => {
    if (files.length > 0) {
      const arrayBuffer = files[0].buffer;
      const workbook_0 = XLSX.read(arrayBuffer, { type: "array" });
      const excelSheetNames = workbook_0.SheetNames;
      const workbook_new = XLSX.utils.book_new();

      excelSheetNames.forEach((sheet) => {
        const ws_data = [];
        let ws_header = [];
        files.forEach((file) => {
          if(ws_header.length === 0) {
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

  });
};

// 合并单个Excel


const handleBtn2 = () => {
  
}
</script>

<style scoped>
.box-btns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  padding: 10px;
}
</style>
