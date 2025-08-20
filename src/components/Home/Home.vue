<template>
     <div id="container">
         <div id="viewDiv"></div>
     </div>
 </template>
 <script setup>
 import { onMounted } from 'vue'
 import Map from '@arcgis/core/Map'
 import MapView from '@arcgis/core/views/MapView'
 import * as 天地图 from '../天地图'
 var map, view
 onMounted(() => {
     map = new Map({
         basemap: {
             baseLayers: 天地图.天地图矢量
         }
     })
     view = new MapView({
         center: [119, 36],
         zoom: 10,
         map: map,
         container: "viewDiv"
     })
     view.ui.remove(["zoom", "attribution"])
 })//onMounted结尾
 
 </script>
 
 <style scoped>
 #viewDiv,
 #container {
     height: 100%;
     width: 100%;
     padding: 0;
     margin: 0;
 }
 
 span {
     white-space: pre-line;
 }
 </style>
 