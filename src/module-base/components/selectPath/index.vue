<template>
  <Input v-model="targetPath" placeholder="Enter something...">
    <template #prepend>
      <Button icon="ios-search" @click="selectDownloadPath()">选择软件目录</Button>
    </template>
  </Input>
</template>

<script setup>
/*path路径维护*/
import {usePath} from './path'

const {targetPath, selectDownloadPath} = usePath()


</script>

<style scoped>

</style>
