<template>
     <div id="container">
       <div id="viewDiv1" :style="{zIndex:viewDiv1_index}"></div>
       <div id="viewDiv2" :style="{zIndex:viewDiv2_index}"></div>
       <div style="position:absolute;left:20px;top:50px;z-index:1000">
         <el-button size="large" :circle="true" @click="click" >{{button_text}}</el-button>
         <!--创建一个按钮,点击按钮时切换2D与3D视图,同时按钮上面的文字也随之改变-->
       </div>
     </div>
    </template>
    <script setup>
    import Map from '@arcgis/core/Map.js'
    import MapView from '@arcgis/core/views/MapView.js'
    import SceneView from '@arcgis/core/views/SceneView.js'
    import FeatureLayer from '@arcgis/core/layers/FeatureLayer' 
    import {onMounted,ref} from 'vue'
    const viewDiv1_index=ref(100)
    const viewDiv2_index=ref(200)//利用css的z-index的属性,切换2D与3D视图
    const button_text=ref('2D')
    var map,view1,view2,active,sync,views
    function click(){//点击按钮时调整两种视图的z-index属性,同时调整按钮文本
     viewDiv1_index.value=viewDiv1_index.value===100?200:100
     viewDiv2_index.value=viewDiv2_index.value===100?200:100
 button_text.value=button_text.value==="2D"?"3D":"2D"
}
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
 map = new Map({//创建地图对象
  basemap: "satellite",
  layers:[layer]
 })
 view1 = new SceneView({//创建3D视图对象
  container: "viewDiv1",
  map: map,
 })
 view2 = new MapView({//创建2D视图对象
  container:"viewDiv2",
  map: map,
 })
 view1.ui.remove(["zoom","attribution","navigation-toggle","compass"])
 view2.ui.remove(["zoom","attribution"])
 views = [view1, view2]
 sync = (source) => {
  if (!active || !active.viewpoint || active !== source) {
   return;
  }
  for (const view of views) {
   if (view !== active) {
    view.viewpoint = active.viewpoint
   }
  }
 }
 for (const view of views) {
  view.watch(["interacting", "animation"], () => {
   active = view
   sync(active)
  });
view.watch("viewpoint", () => sync(view));
 }
 view1.when(()=>{
  view1.goTo({
   target:[117.045, 36.675],
   zoom:5
  })
 })
})
</script>
 
<style scoped>
#viewDiv1,#viewDiv2,#container{
 height:100%;width:100%;padding:0;margin:0;background-color:white;
 /*👆👆不设置背景会出问题*/
}
#viewDiv1,#viewDiv2{
 position:absolute;top:0px;left:0px
}
#tool_box{
 position:absolute;left:10px;top:10px;;z-index:10000;
}
</style>