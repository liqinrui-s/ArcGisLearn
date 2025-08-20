<template>
  <div id = "container">
    <div id="viewDiv"></div>
 
  </div>
</template>

<script setup>
/*
    整体思路:要素图层是一种专门用来存储某一单一类型图形的图层,其功能比图形图层全面且强大,支持两种形式,客户端形式的要素图层和
服务形式的要素图层,要素图层支持自定义标注,并可以创建统一的信息模板;要素图层必需使用专门的工具或方法来执行增删改操作
    1:创建三个客户端要素图层,分别用来存储并显示点,线,面要素
    2:创建一个草图工具小部件,当绘制不同类型的图形时,分别添加到对应的要素图层,添加时赋予相应的属性并且标注出来
*/
import * as 天地图 from '../天地图'
import {onMounted} from 'vue'
import Map from '@arcgis/core/Map'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import MapView from '@arcgis/core/views/MapView'
import Sketch from '@arcgis/core/widgets/Sketch'
import Popup from '@arcgis/core/widgets/Popup'
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine'

var map,view,sketch,popup;
var id点=-1,id线=-1,id面=-1;

var 点图形要素图层= new FeatureLayer({
    title:"客户端点要素图层",
    fields:[
    {name: "经度",  alias: "经度",  type: "string" },
    {name:"纬度", alias:"纬度",  type:"string", }
],
    geometryType:"point",//geometryType属性用来设置要素图层的几何类型,当source为空数组时必须设置这个属性
    objectIdField:"oid",//objecIdField属性用于设置图层属性表的oid字段,理解成主键字段,每个要素该字段的值必须唯一
    source:[],//设置图层的数据源,这是图形的集合,
    renderer:{//设置图层的渲染器,用于批量对图层中的要素进行渲染,符号将在创建绘图工具小部件后进行
        type:"simple",
        label:"自定义点",//定义渲染的样式的图例名称,采用默认的symbol
    },
    labelingInfo:[{ //配置图层的标注,标注将基于属性表中的数据
        labelExpressionInfo: {//配置标注表达式
            expression:`'经度:'+$feature.经度+'°'+TextFormatting.NewLine+'纬度:'+$feature.纬度+'°'`,
        },
        minScale: 200000,//设置显示标注的最小比例尺,小于该比例尺将不显示标注
        labelPlacement:"center-right"//设置标注相对于图形的位置
    }]
})
var 线图形要素图层=new FeatureLayer({
    title:"客户端线要素图层",
    fields: [
        { name: "length",  alias: "length",  type: "string"}
    ] ,
    geometryType:"polyline",
    source:[],
    objectIdField:"oid",
    renderer:{
        type:"simple",
        label:"自定义线"
    },
    labelingInfo:[{
        labelExpressionInfo: {
            expression:"'长度:'+$feature.length+'米'",
        },
        minScale: 200000,
    }],
})
var 面图形要素图层=new FeatureLayer({
    title:"客户端面要素图层",
    fields: [
        { name: "area",  alias: "area",  type: "string"},
        { name: "length",  alias: "length",  type: "string" }
    ] ,
    geometryType:"polygon",
    source:[],
    objectIdField:"oid",
    renderer:{
        type:"simple",
        label:"自定义面"
    },
    labelingInfo:[{
        labelExpressionInfo: {
            expression:"'面积:'+$feature.area+'平方米'+TextFormatting.NewLine+'周长:'+$feature.length+'米'",
        },
        minScale: 200000,
    }]
})
map=new Map({//创建地图对象,添加相应的底图和图层
    basemap: { baseLayers: 天地图.天地图矢量 },
    layers:[点图形要素图层,线图形要素图层,面图形要素图层]
})
onMounted(()=>{
    popup=new Popup({//创建信息窗口对象,信息窗口对象必须关联视图
        defaultPopupTemplateEnabled:true,//如果要素图层或场景图层没有配置信息模板,则自动提供这些图层的信息模板
        visibleElements:{//设置视觉元素
            actionBar:false,//禁用动作条
            collapseButton:false,//禁用折叠按钮
        },
        dockOptions:{
            buttonEnabled:false//禁用停靠按钮
        }
    })
    view = new MapView({
        map: map,  container: "viewDiv",
        scale:150000, center: [120.4, 36.1],
        constraints:{
            minScale:500000,maxScale:1300
        },
        spatialReference:{
            wkid:3857
        },
        popup:popup
    })
    view.ui.remove(["zoom","attribution"]);
    sketch = new Sketch({//创建绘图工具小部件
        layer: view.graphics,//绑定图层
        view: view,//绑定视图
        creationMode: "single",
        tooltipOptions:{
            enabled:true,
        },
    })
    view.ui.add(sketch,"top-left")
    面图形要素图层.renderer.symbol=sketch.viewModel.polygonSymbol
    线图形要素图层.renderer.symbol=sketch.viewModel.polylineSymbol
    点图形要素图层.renderer.symbol=sketch.viewModel.pointSymbol
    //👆将绘图工具小部件的默认图形符号分别作为三个要素图层的符号
    sketch.on("create", function(event) {//绘图工具小部件的"create"事件的回调函数
        if (event.state=== "complete") {
            switch(event.graphic.geometry.type){//基于绘制的要素几何的类型,向对应的要素图层添加数据
                case "polygon":
                    面图形要素图层.applyEdits({//该方法用于向要素图层添加/更新或删除要素
                        addFeatures: [{//addFeatures属性用于向要素图层添加要素,属性类型是数组,数组成员是图形对象的集合
                            attributes:{
                                oid:id面++,//图形对象的属性要跟于要素图层的fields属性中的字段对应,且oid字段必须有值且唯一
                                area:geometryEngine.planarArea(event.graphic.geometry, "square-meters").toFixed(3),
                                length:geometryEngine.planarLength(event.graphic.geometry,"meters").toFixed(3),
                                //👆👆使用geometryEngine的两个方法分别计算了绘制的图形的周长和面积
                            },
                            geometry:event.graphic.geometry,
                        }],
                    })
                    break
                case "polyline":
                    线图形要素图层.applyEdits({
                        addFeatures: [{
                            attributes:{
                                oid:id线++,
                                length:geometryEngine.planarLength(event.graphic.geometry,"meters").toFixed(3),
                            },
                            geometry:event.graphic.geometry,
                        }],
                    })
                    view.graphics.removeAll();
                    break
                case "point":
                    点图形要素图层.applyEdits({
                        addFeatures: [{
                            attributes:{
                                oid:id线++,
                                纬度:event.graphic.geometry.latitude.toFixed(8),
                                经度:event.graphic.geometry.longitude.toFixed(8),
                            },
                            geometry:event.graphic.geometry,
                        }],
                    }); 
                    view.graphics.removeAll();
                    break
            }
        }
    })
})
</script>

<style scoped>
#viewDiv,#container{
height:100%;width:100%;padding:0;margin:0;
}
</style>