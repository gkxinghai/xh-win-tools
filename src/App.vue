<script setup>
import {useRouter} from 'vue-router'
const router=useRouter()

// console.log('myApi',myApi.test)
myApi?myApi.handleGoPage((event, value) => {
  router.push(value)
  console.log(event)
  console.log(value)
  // event.sender.send('counter-value', value)  //将回复结果发回主进程
}):null
myApi?myApi.handlePageRefresh((event,value)=>{
  location.reload()
}):null

</script>

<template>
  <router-view></router-view>
</template>

<style  lang="less">

.size {
  width: 100%;
  height: 100%;
}

#app {
  .size;
}
</style>
