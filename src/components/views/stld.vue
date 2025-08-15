<template>
      <div id="container">
       <div id="view1Div" style="float: left; width: 50%; height: 100%"></div>
       <div id="view2Div" style="float: left; width: 50%; height: 100%"></div>
      </div>
     </template>
     <script setup>
      import Map from '@arcgis/core/Map'
      import MapView from '@arcgis/core/views/MapView'
      import SceneView from '@arcgis/core/views/SceneView'
      import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
      import {onMounted} from 'vue'
      var map,view1,view2,active,sync,views=[]
     //active用于存储当前激活的视图,sync方法用于将激活的视图的视点实时转递给未激活的视图,views数组存放两个视图,方便遍历视图对象
      var layer=new FeatureLayer({
        url:"https://ws8575.club/web/rest/services/Hosted/course_2D/FeatureServer/2",
       renderer:{
        type:"simple",
        symbol:{
         type:"simple-fill",
         color:[200,50,50,0.2],
         outline:{
          color:[0,0,0],
          width:0.5
         }
        }
       }
      })
     onMounted(()=>{
  map = new Map({//创建地图对象,两个视图将共用一个map对象
   basemap: "satellite",
   layers:[layer]
  })
  view1 = new SceneView({//创建3D视图对象
   container: "view1Div",
   map: map,
  })
  view2 = new MapView({//创建2D视图对象
   container: "view2Div",
   map: map,
  })
  views = [view1, view2];//将2个视图放到一个数组中,为了方便遍历视图
  sync = (source) => {
   if (!active || !active.viewpoint || active !== source) {
    return
   }//如果当前存在正在激活的视图,且激活的视图存在视点,且激活的视图就是作为参数的视图,则执行下面的语句
   for (const view of views) {//遍历两个视图
    if (view !== active) {//将激活的视图的中心点传递给未激活的视图
     view.viewpoint = active.viewpoint;
    }
   }
  }
 for (const view of views) {//遍历两种视图
   view.watch(["interacting", "animation"], () => {//监听视图是否正在与用户交互(比如拖曳,旋转,缩放)或动画(如执行goTo方法)
    active = view;//本视图将作为当前激活的视图
    sync(active);//对当前激活的视图执行sync方法
   })
   view.watch("viewpoint", () => sync(view))//监听视点的变化,视点发生变化时不将本视图作为当前激活的视图
  }
  view1.when(()=>{
   view1.goTo({
    target:[117.045, 36.675],
    zoom:8
   })
  })
  view1.ui.remove(["zoom","attribution","navigation-toggle","compass"])
  view2.ui.remove(["zoom","attribution"])
 })
 </script>
 
 <style scoped>
 #viewDiv,#container{
  height:100%;width:100%;padding:0;margin:0;
 }
 #tool_box{
  position:absolute;left:10px;top:10px;;z-index:10000;
 }
 </style>