<template>
  <Menu theme="dark" width="auto" :class="menuitemClasses">
    <template v-for="item in menuList">
      <template v-if="item.children && item.children.length === 1">
        <!--          只有一个children元素的情况-->
        <SideMenuItem v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></SideMenuItem>
        <MenuItem v-else :name="getNameOrHref(item,true)" :key="`menu-${item.children[0].name}`">
          <svg v-if="item.children[0].meta.iconfont" class="icon" aria-hidden="true">
            <use xlink:href="#icon-weixin"></use>
          </svg>
          <Icon v-else :type="item.children[0].meta.icon"></Icon>
          <span v-if="!isCollapsed" :class="{active:!isCollapsed}">{{ showTitle(item.children[0]) }}</span>
        </MenuItem>
      </template>
      <template v-else>
        <!--          没有children或者有多个children的情况-->
        <SideMenuItem v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></SideMenuItem>
        <MenuItem v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
          <svg v-if="item.meta && item.meta.iconfont" class="icon" aria-hidden="true">
            <use xlink:href="#icon-weixin"></use>
          </svg>
          <Icon v-else-if="item.meta && item.meta.icon" :type="item.meta.icon"></Icon>
          <span v-if="!isCollapsed" :class="{active:!isCollapsed}">{{ showTitle(item) }}</span>
        </MenuItem>
      </template>
    </template>
  </Menu>

</template>

<script setup>

import {getNameOrHref, showChildren, turnToPage, showTitle} from 'module-base/lib/sideMenuHandle'
import SideMenuItem from "module-base/views/Layout/SideMenuItem.vue";
import {computed, ref, inject, onMounted, watch} from "vue";
import {useRouter} from 'vue-router'

const router = useRouter()
const props = defineProps({
  menuList: Array
})
const menuitemClasses = computed(() => {
  return [
    'menu-item',
    props.isCollapsed ? 'collapsed-menu' : ''
  ]
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
