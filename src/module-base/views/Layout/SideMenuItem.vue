<template>
<!--显示二级子菜单-->
            <Submenu :name="parentItem.name">
              <template #title>
                <svg v-if="parentItem.meta.iconfont" class="icon" aria-hidden="true">
                  <use xlink:href="#icon-weixin"></use>
                </svg>
                <Icon v-else :type="parentItem.meta.icon" />


                <span v-if="!isCollapsed" :class="{active:!isCollapsed}">{{ showTitle(parentItem) }}</span>
              </template>
              <template  v-for="item in parentItem.children">
<!--                递归调用本组件-->
                <SideMenuItem v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></SideMenuItem>
                <MenuItem v-else :name="item.name">
                  <svg v-if="parentItem.meta.iconfont" class="icon" aria-hidden="true">
                    <use xlink:href="#icon-weixin"></use>
                  </svg>
                  <Icon v-else :type="item.meta.icon"></Icon>
                  <span v-if="!isCollapsed" :class="{active:!isCollapsed}">{{ item.name }}</span>
                </MenuItem>
              </template>

            </Submenu >
</template>
<script setup>
import {inject} from "vue";
import {showTitle,showChildren} from "module-base/lib/sideMenuHandle";
const props=defineProps({
  parentItem:Object
})
const isCollapsed = inject('isCollapsed', false)

</script>
<style scoped>
@keyframes show {
  from {opacity: 0;}
  to {opacity: 1;}
}
.active{
  animation:show 0.5s ease-in;
}
</style>
