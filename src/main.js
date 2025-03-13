import { createApp } from 'vue'//导入createApp方法
import App from './App.vue'//导入根组件

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'//👆导入element-plus系列

import '@arcgis/core/assets/esri/themes/light/main.css'
import esriConfig from '@arcgis/core/config'
esriConfig.portalUrl="https://ws8575.club/web"//👆导入arcgis api样式表并配置portal地址

import {createRouter,createWebHashHistory} from 'vue-router'//导入两个路由相关的方法
import Home from './components/Home/Home.vue'//导入Home组件
import stld from './components/views/stld.vue'
import stqh from './components/views/stqh.vue'
import tqqh from './components/views/tqqh.vue'
import jztdt from './components/map/jztdt.vue'
const router=createRouter({//创建路由对象
  history:createWebHashHistory(),
  routes:[//路由映射数组
    {path:'/' , component:Home},
    {path:'/Home' , component:Home},
    {path:'/stld' , component:stld},
    {path:'/stqh' , component:stqh},
    {path:'/tqqh' , component:tqqh},
    {path:'/jztdt' , component:jztdt},
  ]
})

const app=createApp(App)//基于根组件创建实例对象
for (const [key,component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key,component)
}//实例对象创建后,批量导入element-plus组件,导入后在所有组件中无需再次导入

app.use(ElementPlus)
app.use(router)
app.mount('#app')//挂载实例到DOM节点