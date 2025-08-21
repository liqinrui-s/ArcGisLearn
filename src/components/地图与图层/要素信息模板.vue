<template>
    <div id="container">
      <div id="viewDiv"></div> 
      <div style="position:absolute;top:10px;left:10px;">
        <el-radio-group size="large" v-model="模板类型" @change="radio_change">
          <el-radio-button value="函数型信息模板" label="函数型信息模板"></el-radio-button>
          <el-radio-button value="表格型信息模板" label="表格型信息模板"></el-radio-button>
          <el-radio-button value="文本型信息模板" label="文本型信息模板"></el-radio-button>
          <el-radio-button value="展示图片" label="展示图片"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div ref="popup_div" ><!--函数型信息模板引用的dom节点,用来显示要素地址信息-->
      <el-tag type="primary" size="large">{{popup_message}}</el-tag>
    </div>
    <div ref="popup_image"><!--函数型信息模板引用的dom节点,用来显示图片-->
      <img :src="image_url" style="height:200px;"/>
    </div>
  </template>
  
<script setup>
/*整体思路:使用radio-button组件切换不同的信息模板,并为要素图层设置不同的信息模板类型*/
import {onMounted,ref} from 'vue'
import MapView from '@arcgis/core/views/MapView'
import Popup from '@arcgis/core/widgets/Popup'
import Map from '@arcgis/core/Map'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import * as 天地图  from '../天地图'
const 模板类型=ref("函数型信息模板")//创建radio-group组件的双向绑定变量,设置默认的信息模板类型
const popup_div=ref()
const popup_image=ref()//创建两个变量,分别引用两个DOM节点,其分别用于显示地址信息和图片信息
const popup_message=ref('')//该变量用来存储从要素属性中获取的地址文本信息
const image_url=ref()//该变量用来存储从要素属性中获取的图片url信息
var view,layer,map,popup
const radio_change=()=>{//切换radio-button的事件回调函数
  switch(模板类型.value){//基于当前选择的模板类型执行相应的代码
    case "函数型信息模板":
      layer.popupTemplate={//设置函数型信息模板
        title:`{name}`,//设置name字段的值为信息模板的标题
        content:function(){  //函数形式的content属性,将选中的要素的address属性值传递给相应变量,然后返回DOM元素节点
            popup_message.value="地址:"+popup.selectedFeature.attributes.address
            return popup_div.value
        }
      }
      break
    case "表格型信息模板":
      layer.popupTemplate={
        title:"{name}",
        content:[{
          type:"fields",
          fieldInfos:[
            {fieldName:"一级类",label:"类别"},
            {fieldName:"address",label:"地址"},
          ]
        }]
      }
      break
    case "文本型信息模板":
      layer.popupTemplate={
        title:"<div style='color:red'>{name}</div>",
        content:`类别:{一级类}<br/>地址:{address}`
      }
      break
    case "展示图片":
      layer.popupTemplate={
        title:"{name}",
        content:function(){
          image_url.value=popup.selectedFeature.attributes.image
          return popup_image.value
        }
      }
  }
}
onMounted(()=>{
  layer = new FeatureLayer({//创建要素图层对象
    url:"https://ws8575.club/web/rest/services/Hosted/course_2D/FeatureServer/3",
    outFields:["*"],
    labelsVisible:false,//禁用显示标注
    renderer:{
        type:"simple",
        symbol:{
            type:"simple-fill",
            color:[60,160,250,0.5],
            outline:{
                color:[60,160,250],
                width:1.5
            }
        }
    },
    popupTemplate:{//配置默认的信息模板
        title:`{name}`,
        content:function(){
            popup_message.value="地址:"+popup.selectedFeature.attributes.address
            return popup_div.value
        }
    }
})
  map=new Map({//创建地图对象
    basemap:{
      baseLayers:天地图.天地图矢量
    },
    layers:[layer]
  })
  popup =new Popup({//创建并配置信息窗口对象
    visibleElements:{//对可见元素进行相关配置
      collapseButton:false,//禁用折叠按钮
      actionBar:false,//禁用动作条
      closeButton:false//禁用右上角关闭按钮
    },
    dockOptions:{
      buttonEnabled:false//禁用停靠按钮
    }
  })
  view=new MapView({//创建视图对象
    map:map,
    container:"viewDiv",
    center:[120.4,36.1],
    zoom:15,
    constraints:{
      maxScale:1300
    },
    popup:popup
  })
  view.ui.remove(["zoom","attribution"])

})
</script>
  
  <style scoped>
  #viewDiv,#container{
    height:100%;width:100%;padding:0;margin:0;
  }
  </style>
  