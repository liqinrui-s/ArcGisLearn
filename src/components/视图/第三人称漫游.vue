<template>
    <div id="container">
        <div id="viewDiv"></div>
        <div style="position:absolute;left:15px;top:15px;">
          <el-button @click="移动视点" type="primary">移动视点</el-button>
        </div>
   </div>
</template>
  
<script setup>
/*
整体思路---
1:创建一个草图工具对象用来绘制表示路径的线要素
2:创建一个图形图层对象用于存储表示路径的线要素
3:绘制线要素完成后立即执行回调函数,获取绘制的线要素的几何及其折点几何的集合
4:按照线折点的顺序依次执行视图对象的goto方法,实现视角的漫游
*/
import * as 天地图 from '../天地图'
import 汽车 from '../../assets/images/第三人称漫游_汽车.png'
import {onMounted,ref} from 'vue'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Point from '@arcgis/core/geometry/Point'
import Graphic from '@arcgis/core/Graphic'
var map,view,graphicsLayer,sketchViewModel
var 方位角=0//创建名为"方位角"的变量,存储当前移动物体的旋转角度
var line//创建名为line的变量用于存储绘制的线几何对象,注意区分几何和图形,几何对象是图形对象的一个属性
var points=[]//创建名为points的空数组用来存储绘制的线上的所有拐点的点几何的集合
var 计数=ref(0)//创建名为"计数"的变量用来存储当前移动到的点的编号
var 总数=ref(0)//创建名为"总数"的变量用来存储绘制的线的拐点的总数
var handle//存储对视图对象的animation属性的state属性的监听句柄,animation.state属性反映了视图当前动画的状态
var handle_interacting//存储对视图对象的interacting属性的监听句柄,interacting反映了当前用户是否正在跟视图交互(拖曳,缩放等)
var graphic//声明一个图形对象,用来显示移动中的物体
var handle_viewPoint//存储对视图对象的viewpoint属性的监听句柄,viewpoint对象反映了当前视图中心位置的点几何
var 重置=()=>{}//创建一个名为"重置"的方法,执行该方法将重置所有变量和相关句柄
const 移动视点=()=>{//执行一次重置方法并开始绘制线要素,绘制的线要素将作为物体移动的路径
  重置()
  sketchViewModel.create("polyline",{mode:"click"})
}
const 计算方位角=(point1,point2)=>{//该方法计算两个点几何连接成的线相对于正北的方位角度
    if((point2.x-point1.x)>0){
      return 90-Math.round(Math.atan((point2.y-point1.y) /(point2.x-point1.x)) * 180 / Math.PI)
    }else{
      return 90-Math.round(Math.atan((point2.y-point1.y) /(point2.x-point1.x)) * 180 / Math.PI)+180
    }
}
onMounted(()=>{//钩子函数
  graphic=new Graphic({visible:false})//实例化一个空的图形对象并设置为默认不显示
  graphicsLayer=new GraphicsLayer()//创建图形图层对象,用于存储并显示物体(汽车)
  map=new Map({//创建地图对象,关联底图图层并添加图形图层
    basemap:{
      baseLayers:天地图.天地图影像
    },
    layers:[graphicsLayer]
  })
  view=new MapView({//创建视图对象并设置约束(禁用旋转并设置允许缩放到的最大比例尺)
    map:map,
    container:"viewDiv",
    center:[120.4,36.1],
    zoom:15,
    constraints:{
        rotationEnabled:false,
        maxScale:1200
    }
  })
  view.graphics.add(graphic)//向视图添加创建的图形对象
  view.ui.remove(["zoom","attribution"])//移除默认的小部件(包括缩放小部件和显示属性小部件)
  sketchViewModel=new SketchViewModel({//创建草图工具对象,绑定对应的视图和图形图层
    layer:graphicsLayer,
    view:view,
    polylineSymbol:{
      type:"simple-line",
      color:[60,160,250],
      width:2
    }
  })
  sketchViewModel.on("create",(event)=>{//核心代码!;给草图工具对象的create事件添加回调函数
    if(event.state==="complete"){//当图形绘制完成后执行
      line=event.graphic.geometry//获取绘制的线几何对象
      graphicsLayer.removeAll()//如果先前有绘制的线图形,则移除
      for(let item of line.paths[0]){
        //👆遍历绘制的线几何的paths[0]属性,如果绘制的线并非多部件要素,则paths[0]属性表示该线的拐点坐标的集合
        var point=new Point({//paths[0]中仅包含点坐标,其成员并非点几何,所以要基于坐标构建点几何对象
          x:item[0],
          y:item[1],
          spatialReference:{wkid:3857}
        })
        points.push(point)//将这些点几何对象放到points数组中存储
      }
      总数.value=points.length//获取线上折点坐标的总数,用于判断是否继续执行goTo方法
      view.goTo({//将视点快速移动到线上面的第一个点,
        center:[points[0].longitude,points[0].latitude],
        scale:1300
      },{
        duration:100
      })
      handle=view.watch("animation.state",(event)=>{//创建对视图对象的anamation.state属性的监听句柄,监听动画状态
        //👆每次状态为"finished"时,执行移动视点到下一个点
        if(event==="finished"){//动画完成时执行下面代码
          graphic.visible=true//显示图形对象
          handle_viewPoint=view.watch("viewpoint",(event)=>{//创建对视图对象的viewpoint属性的监听句柄,监听屏幕视点的变化
            graphic.geometry=event.targetGeometry//实时将视点几何传递给创建的图形对象
          })
          handle_interacting=view.watch("interacting",(event)=>{
            重置()//创建对视图对象的interacting属性的监听句柄,当用户正在与视图交互时,执行重置方法
          })
          if(++计数.value<总数.value){//将当前计数+1然后判断其看是否超过了点的总数,如果未超过执行继续移动至下一个拐点,否则执行重置并隐藏图形
            graphic.symbol={//移动之前要给图形赋值一个符号并且设置方位角
              type:"picture-marker",
              url:汽车,//该路径必须是绝对路径,不能是相对路径,发布之前要进行相关配置否则会出问题
              width:50,
              height:60,
              angle:计算方位角(points[计数.value-1],points[计数.value])
            }
            view.goTo({//执行移动视点到这个点,设置动画时间为距离(米)除以速度100(米每秒),设置动画类型为线性
              center:[points[计数.value].longitude,points[计数.value].latitude],
              scale:1300
            },{
              duration:Math.sqrt(Math.pow(points[计数.value].x-points[计数.value-1].x,2)+Math.pow(points[计数.value].y-points[计数.value-1].y,2))*1000/100,
              easing:"linear"
            })
          }
          if(计数.value>=总数.value){
            重置()
          }
        }
      })
      重置=()=>{//重置所有变量的值并移除相关句柄,对句柄赋值null无效,必须使用remove()方法
        line=null;points=[];计数.value=0;总数.value=0;方位角=0;
        handle.remove();handle_interacting.remove();handle_viewPoint.remove();graphic.visible=false
      }
    }
  })
})
</script>

<style scoped>
  #container,#viewDiv{
  width:100%; height:100%; padding:0;margin:0;
  }
</style>
  