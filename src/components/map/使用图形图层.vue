<template>
    <div id="container">
      <div id="viewDiv"></div>
      <el-main style="position:absolute;top:10px;left:20px;line-height:40px;
      z-index:100;width:auto;background-color:white;border-radius:10px;">
        <el-button type="primary" v-for="item in button_list" :key="item" @click="button_click(item)">{{item}}</el-button>
        <el-button type="danger" @click="清空所有图形">清空所有图形</el-button><br/>
        <span >{{info}}</span><!--设置一个span用于显示指定的信息-->
      </el-main>
    </div>
</template>
  
<script setup>
/*整体思路:
    图形图层:图形图层允许用草图对象或草图小部件绘制不同类型的图形(如点,线,面),这些图形在客户端中是临时
存在的,多用于在客户端进行一些临时的显示,其运行效率比要素图层低且不支持要素图层支持的很多功能,比如自定义标注,查询等
    1:创建一个草图工具对象用于绘制图形
    2:创建一个图形图层用于存储并显示草图工具绘制的图形
    3:创建一系列响应式变量用于存储当前绘制的不同种类的图形的数量
    4:每当创建或删除图形的时候,遍历一次图形图层里的图形集合并重新计算一次不同类型图形的数量
*/
import * as 天地图 from '../天地图' 
import {onMounted,ref,computed} from 'vue'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
var map,view,graphicsLayer,sketchViewModel
const button_list=["点","线","多边形"]//创建一个数组用于提供批量创建button组件的数据
const info=computed(()=>{//创建一个计算变量用于实时存储当前信息
    return `当前绘制了${点数目.value}个点要素`+"\n"+`当前绘制了${线数目.value}个线要素`+"\n"+`当前绘制了${面数目.value}个面要素`
})
const 清空所有图形=()=>{//重置点线面的数目为0并清空图形图层上的所有图形对象
    graphicsLayer.graphics.removeAll()
    点数目.value=0;线数目.value=0;面数目.value=0
}
const 点数目=ref(0);const 线数目=ref(0);const 面数目=ref(0)//创建三个变量,分别用于存储图形图层中点,线,面的实时数量
const button_click=(item)=>{//创建按钮点击按钮事件的回调函数,根据点击的按钮类型分别创建不同类型的图形
    switch(item){
        case '点':
            sketchViewModel.create('point',{mode:'click'})
            break
        case '线':
            sketchViewModel.create('polyline',{mode:'click'})
            break
        case '多边形':
            sketchViewModel.create('polygon',{mode:'click'})
            break
    }
}
onMounted(()=>{
    graphicsLayer=new GraphicsLayer()//创建一个图形图层对象
    map=new Map({//创建地图对象,关联底图图层和图形图层
        basemap:{
        baseLayers:天地图.天地图矢量
        },
        layers:[graphicsLayer]
    })
    view=new MapView({//创建视图对象,关联地图对象并挂载DOM元素
        map:map,
        center:[120.4,36.1],
        zoom:16,
        container:"viewDiv",
        constraints:{
            rotationEnabled:false,
            maxScale:1300
        }
    })
    view.ui.remove(["zoom","attribution"])//移除视图的默认组件
    sketchViewModel=new SketchViewModel({//创建草图工具对象,非重点,这里仅需了解
        view:view,//关联视图对象
        layer:graphicsLayer,//关联图形图层对象
        tooltipOptions:{ enabled:true},//指示绘制时是否在鼠标旁边显示提示信息,如偏转角度和距离等
        polylineSymbol:{//修改默认创建的面要素的符号
            type:"simple-line",
            color:[64,158,255],
            width:2
        },
        polygonSymbol:{//修改默认创建的面要素的符号
            type:"simple-fill",
            style:"diagonal-cross",
            color:[64,158,255],
            outline:{
                color:[64,158,255],
                width:2
            }
        },
        pointSymbol:{
            type:"simple-marker",
            color:[64,158,255],
            size:15,
            outline:{
                color:[200,200,200],
                width:1
            }
        }
    })
    sketchViewModel.on(["delete","create"],(event)=>{//草图工具创建/删除事件的回调函数
        //每当创建或删除图形时,首先重置点线面要素的数目并执行一次遍历,然后重新分别计算点线面的数目
        点数目.value=0;线数目.value=0;面数目.value=0
        for(let graphic of graphicsLayer.graphics.items){
            switch(graphic.geometry.type){
                case "point":
                    点数目.value++
                    break
                case 'polyline':
                    线数目.value++
                    break
                case "polygon":
                    面数目.value++
            }
        }
    })
})//onMounted结尾
</script>
  
<style scoped>
#viewDiv,#container{
    height:100%;width:100%;padding:0;margin:0;
}
span{
    white-space: pre-line;color:rgb(80,80,80)
}
</style>
  