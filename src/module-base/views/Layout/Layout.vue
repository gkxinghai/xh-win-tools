<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
}

.layout .ivu-menu {
  z-index: 0
}

.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  border-bottom: 1px solid #e8eaec;
}

.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}

.menu-icon {
  transition: all .3s;
}

.rotate-icon {
  transform: rotate(-90deg);
}

.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}

.menu-item i {
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}

.collapsed-menu span {
  width: 0px;
  transition: width .2s ease;
}

.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}

.icon-menu {
  color: #ff9900;
  position: absolute;
  right: 4px;
  top: 0px;
  font-size: 20px;
  cursor: pointer;
}
</style>
<template>
  <div class="layout">
    <Layout style="height: 100%">
      <Sider ref="side1" style="min-width: 100px" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <SideMenu ref="sideMenu" :menu-list="menuList" @on-select="turnToPage_sideMenu"></SideMenu>
<!--        <svg class="icon icon-menu" @click="collapsedSider" aria-hidden="true">-->
<!--          <use xlink:href="#icon-pendant-full"></use>-->
<!--        </svg>-->
      </Sider>

      <Layout>
        <Content :style="{overflowY:'auto',overflowX:'auto', background: '#fff', minHeight: '260px'}">
          <!--router-view嵌套，这里渲染Layout路由的children路由          -->
          <router-view v-slot="{Component}">
            <KeepAlive :max="10">
              <component :is="Component"></component>
            </KeepAlive>
          </router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script setup>

import {computed, onMounted, ref, provide} from 'vue'
import SideMenu from 'module-base/views/Layout/SideMenu.vue'

import {useRouter} from 'vue-router'

const router = useRouter()


import useRouterStore from '@/store/base/router'

const routerStore = useRouterStore()
const menuList = ref(routerStore.getMenuList)

/*sider部分*/
import {turnToPage} from 'module-base/lib/sideMenuHandle'

const isCollapsed = ref(false)
const side1 = ref(null)
provide('isCollapsed', isCollapsed)

function collapsedSider() {
  side1.value.toggleCollapse()
}

const rotateIcon = computed(() => {
  return [
    'menu-icon',
    isCollapsed.value ? 'rotate-icon' : ''
  ]
})

function turnToPage_sideMenu(name) {
  console.log(name)
  turnToPage(router, name)
}


</script>
