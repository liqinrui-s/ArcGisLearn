<template>
     <div id="container">
      <div id="viewDiv"></div>
     </div>
    </template>
    
    <script setup>
    import {onMounted} from 'vue'//导入钩子函数
    import Map from '@arcgis/core/Map'//导入Map类
    import MapView from '@arcgis/core/views/MapView'//导入MapView类
    var map,view//声明map和view变量
    onMounted(()=>{//钩子函数
     map=new Map({//创建Map对象
      basemap:"hybrid"//设置底图为标注影像混合切片
     })
     view=new MapView({
      container:"viewDiv",//挂载DOM节点
      map:map,//绑定map对象
      center:[120.4,36.1],//设置视图初始状态的中心点坐标
      zoom:10,//设置视图初始状态的缩放级别
     })
     view.ui.remove(["zoom","attribution"])
    })
    </script>
    
    <style scoped>
    #viewDiv,#container{
     height:100%;width:100%;padding:0;margin:0;
    }
    span{
     white-space: pre-line;
    }
    </style>