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
import 二三维视图联动 from './components/视图/二三维视图联动.vue'
import 二三维视图切换 from './components/视图/二三维视图切换.vue'
import 切换3D视图天气 from './components/视图/切换3D视图天气.vue'
import 显示当前坐标 from './components/视图/显示当前坐标.vue'
import 移动视点 from './components/视图/移动视点.vue'
import 第三人称漫游 from './components/视图/第三人称漫游.vue'

import 加载天地图 from './components/地图与图层/加载天地图.vue'
import 使用图形图层 from './components/地图与图层/使用图形图层.vue'
import 客户端要素图层 from './components/地图与图层/客户端要素图层.vue'
import 要素信息模板 from './components/地图与图层/要素信息模板.vue'
import 动作按钮 from './components/地图与图层/动作按钮.vue'

const router=createRouter({//创建路由对象
  history:createWebHashHistory(),
  routes:[//路由映射数组
    {path:'/' , component:二三维视图联动},
    {path:'/Home' , component:Home},
    {path:'/二三维视图联动',component:二三维视图联动},
    {path:'/二三维视图切换',component:二三维视图切换},
    {path:'/切换3D视图天气',component:切换3D视图天气},
    {path:'/显示当前坐标',component:显示当前坐标},
    {path:'/移动视点',component:移动视点},
    {path:'/第三人称漫游',component:第三人称漫游},
    {path:'/加载天地图',component:加载天地图},
    {path:'/使用图形图层' , component:使用图形图层},
    {path:'/客户端要素图层',component:客户端要素图层},
    {path:'/要素信息模板',component:要素信息模板},
    {path:'/动作按钮',component:动作按钮}
  ]
})

const app=createApp(App)//基于根组件创建实例对象
for (const [key,component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key,component)
}//实例对象创建后,批量导入element-plus组件,导入后在所有组件中无需再次导入

app.use(ElementPlus)
app.use(router)
app.mount('#app')//挂载实例到DOM节点