
<template>
  <div id="container">
    <div id="viewDiv"></div>
    <el-main  style="position:absolute;top:10px;left:5px;box-shadow:0 0 8px rgb(240,240,240);background-color:white;color:gray;">
        <span>Web墨卡托参考系坐标---X:{{x.toFixed(3)}}&nbsp;|&nbsp;Y:{{y.toFixed(3)}}</span><br>
        <span>WGS84参考系坐标---经度:{{lon.toFixed(8)}}°&nbsp;|&nbsp;纬度:{{lat.toFixed(8)}}</span>
    </el-main>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Map from "@arcgis/core/Map";
import MapView from '@arcgis/core/views/MapView';
var map,view
const x=ref(0)//存储web墨卡托参考系x坐标
const y=ref(0)//存储web墨卡托参考系y坐标
const lon=ref(0)//存储wgs84参考系经度
const lat=ref(0)//存储wgs84参考系纬度
map=new Map({//创建地图对象
  basemap:"hybrid"
})
onMounted(()=>{
  view = new MapView({//创建视图对象
    map: map, container: "viewDiv",
    center:[120.4,36.1],zoom:15,
  })
  view.ui.remove(["zoom","attribution"])//移除默认小部件
  //👇👇添加view的移动鼠标事件的处理程序,view对象的toMap方法将屏幕坐标转换成point对象,
  //👇👇toMap方法的参数是一个对象,对象有两个成员,分别是当前鼠标所在位置的屏幕坐标x,y
  //👇👇point对象有几个常用属性,x表示投影参考系下的x坐标,y表示投影参考系下的y坐标,
  //👇👇,如果投影参考系为3857,那么longitude属性表示相应的经度,latitude表示纬度,否则这两个属性值为0
  view.on("pointer-move",(event)=>{
    x.value=view.toMap({x:event.x,y:event.y}).x
    y.value=view.toMap({x:event.x,y:event.y}).y
    lon.value=view.toMap({x:event.x,y:event.y}).longitude
    lat.value=view.toMap({x:event.x,y:event.y}).latitude
  })//view的toScreen()方法将地图坐标转换成屏幕坐标,参数是一个对象,对象的x,y属性分别表示投影参考系下的x,y坐标值
})//onMounted()结尾
</script>

<style scoped>
  #viewDiv,#container{
    height:100%;width:100%;padding:0;margin:0;
  }
  span{
    white-space: pre-line;
  }
</style>