<template>
      <div id="container">
       <div id="viewDiv"></div>
       <el-main style="position:absolute;top:10px;left:10px;width:400px;box-shadow:0 0 8px gray;line-height:45px;
       display:flex;flex-direction:column; justify-content:center;align-items:center;background-color:white;">
       <div class="item">
        <el-radio-group v-model="天气" @change="weather_change"><!--天气类型单选按钮组-->
         <el-radio-button value="多云天气">多云天气</el-radio-button>
         <el-radio-button value="下雨天气">下雨天气</el-radio-button>
         <el-radio-button value="下雪天气">下雪天气</el-radio-button>
         <el-radio-button value="有雾天气">有雾天气</el-radio-button>
        </el-radio-group>
       </div>
       <div class="item" style="display:flex;align-items:center;"><!--天气强度滑块-->
        <span>天气强度:&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-slider :min="0" :max="100" v-model="天气_value" @input="weather_change" style="width:260px;" ></el-slider>
       </div>
       </el-main>
      </div>
    </template>
    <script setup>
     import {onMounted,ref} from 'vue'
     import Map from '@arcgis/core/Map'
     import SceneView from '@arcgis/core/views/SceneView'
     import IntegratedMeshLayer from "@arcgis/core/layers/IntegratedMeshLayer"
     var map,view,intergratedMeshLayer,weather
     const 天气=ref('多云天气')//存储当前选择的天气类型
     const 天气_value=ref(50)//存储当前天气的强度
     const weather_change=()=>{//修改天气
      switch(天气.value){
       case '多云天气':
        weather={
         type:"cloudy",
         cloudCover:天气_value.value/100
        }
        view.environment.weather=weather
        break
       case '下雨天气':
        weather={
         type:"rainy",
         precipitation:天气_value.value/100
        }
        view.environment.weather=weather
        break
       case '下雪天气':
        weather={
         type:"snowy",
         snowCover:true,
         precipitation:天气_value.value/100
        }
        view.environment.weather=weather
        break
       case '有雾天气':
        weather={
         type:"foggy",
         fogStrength:天气_value.value/100
        }
        view.environment.weather=weather
        break
      }
     }
     onMounted(()=>{
      intergratedMeshLayer=new IntegratedMeshLayer({//创建模型图层
        url:"https://tiles.arcgis.com/tiles/cFEFS0EWrhfDeVw9/arcgis/rest/services/Buildings_Frankfurt_2021/SceneServer",
       elevationInfo:{
        mode:"absolute-height",
        offset:-5//设置模型高度便宜,负数表示向下偏移
       },
       spaticalReference:{wkid:3857}//设置模型参考系
      })
      map=new Map({//创建地图对象
       basemap:"hybrid",//设置底图
    ground:"world-elevation",//设置高程服务图层
   layers:[intergratedMeshLayer]//设置图层
  })
  view=new SceneView({//创建场景视图对象
   map:map,//绑定map对象
   qualityProfile:"high",
   container:"viewDiv",//绑定DOM元素
   zoom:10,//设置初始状态缩放级别
   viewingMode:"global",//设置视图类型,有"global"和"local"两种
   environment:{//设置环境属性
    weather:{//设置默认天气
     type:'cloudy',
     cloudCover:0.5
    }
   }
  })
  view.when(()=>{
   view.goTo({
    target:intergratedMeshLayer.fullExtent,
    scale:3000,
    tilt:60
   },{
    duration:100
   })
  })
  view.ui.remove(['zoom','compass','attribution','navigation-toggle'])
 })
 </script>
 
<style scoped>
 span{
  white-space: pre-line;
 }
 #container,#viewDiv{
  width:100%; height:100%; padding:0;margin:0;
 }
</style>