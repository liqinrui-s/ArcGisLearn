<template>
    <div id="container">
      <div id="viewDiv"></div> 
      <div ref="div"><!--被函数型信息模板引用的DOM节点,用一个表格显示要素属性-->
        <el-table :data="table_data"  stripe border :show-header="false" size="small" table-layout="auto">
            <el-table-column prop="字段名称"></el-table-column>
            <el-table-column prop="字段值" ></el-table-column>
        </el-table>
      </div>
    </div>
</template>
<script setup>
/*
    动作按钮---动作按钮是一种特别的按钮,在特定的位置,设置相应的id,title和class属性即可以创建相应的按钮
通过设置要素图层的popupTemplate属性可以设置动作条,也可以通过popup对象设置动作条
    1:在要素图层的popupTemplate中设置允许重写动作条(actions),并在actions属性中设置动作按钮
    2:给popup(信息窗口)的trigger-action事件添加回调函数,针对点击的不同动作按钮,执行相应的方法
*/
import {onMounted,ref} from 'vue'
import {ElMessageBox} from 'element-plus'
import MapView from '@arcgis/core/views/MapView'
import Popup from '@arcgis/core/widgets/Popup'
import Map from '@arcgis/core/Map'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer' 
import * as 天地图  from '../天地图'
var view
const div=ref()
const table_data=ref([])
var popup =new Popup({//创建信息窗口对象并设置内部元素的可见性,信息窗口对象是信息模板的容器
    visibleElements:{
        collapseButton:false,
        closeButton:false,
    },
    dockOptions:{
        buttonEnabled:false
    }
})
var layer = new FeatureLayer({//创建要素图层对象
    url:"https://ws8575.club/web/rest/services/Hosted/course_2D/FeatureServer/3",//引用的服务url地址
    outFields:["*"],//从服务获取要素图层的属性表并选取字段,星号表示选取了全部字段
    labelsVisible:false,//设置来自服务的标注为不可见
    renderer:{//设置渲染器,包括渲染器类型和要渲染的符号
        type:"simple",
        symbol:{
            type:"simple-fill",
            color:[60,160,250,0.5],
            outline:{
                color:[255,255,255,0]
            }
        }
    },
    popupTemplate:{//创建函数型信息模板
        content:(event)=>{
            table_data.value=[]//清空表格的源数组变量
            for(let key in event.graphic.attributes){//遍历选中的要素的属性,也可用通过popup.selectedFeature获取选中的图形
                if(event.graphic.attributes[key]){//忽略属性值为空的属性
                    table_data.value.push({//将包含属性名称和属性值的对象添加到表格的源数组变量
                        字段名称:key,
                        字段值:event.graphic.attributes[key]
                    })
                }
            }
            return div.value//返回这个DOM节点
        },
        overwriteActions:true,//删除默认存在的"缩放至"动作按钮
        actions:[{//自定义动作按钮集合
            title:'显示地址',
            id: '显示地址',
            className: 'action-button esri-icon-applications',
        },{
            title:"显示名称",
            id:"显示名称",
            className:'action-button esri-icon-review'
        },{//设置动作按钮
            title:"关闭",//动作按钮的title
            id:"关闭",//动作按钮的id,该属性唯一标识了动作按钮
            className:"action-button esri-icon-close",//动作按钮的类名称(引用来自系统的图片)
        },]
    },
})
popup.on("trigger-action",(event)=>{//给popup对象的trigger-action(点击动作按钮)事件添加回调函数
    if(event.action.id==='关闭'){//点击了title属性为'关闭'的动作按钮
        popup.close()//关闭信息窗口
    }else if(event.action.id==='显示地址'){//点击了title属性为'显示地址'的动作按钮
        ElMessageBox.alert(popup.selectedFeature.attributes.address,"地址",{//弹出信息窗并显示要素的地址
            type:'success',
            confirmButtonText:'返回'
        })
        popup.close()
    }else if(event.action.id==='显示名称'){
        ElMessageBox.alert(popup.selectedFeature.attributes.name,"地块名称",{//弹出信息窗并显示要素的地址
            type:'success',
            confirmButtonText:'返回'
        })
        popup.close()
    }
})
var map=new Map({
    basemap:{
        baseLayers:天地图.天地图矢量
    },
    layers:[layer]
})
onMounted(()=>{
    view=new MapView({
        map:map,container:"viewDiv",center:[120.4,36.1],zoom:15,
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
  