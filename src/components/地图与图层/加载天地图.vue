<template>
  <div id="container">
    <div id="viewDiv"></div>
    <el-main style="position: absolute; top: 0px; left: 0px">
      <el-checkbox-group v-model="checkbox_value" @change="checkbox_change">
        <el-checkbox-button value="矢量" label="矢量"></el-checkbox-button>
        <el-checkbox-button value="标注" label="标注"></el-checkbox-button>
      </el-checkbox-group>
    </el-main>
  </div>
</template>

<script setup>
/*整体思路:
1:使用WebTileLayer类加载天地图;基于天地图官方提供的url模板进行修改,并作为网络切片图层对象的url
2:创建两个网络切片图层对象,分别表示天地图的矢量图层和标注图层
3:创建两个checkbox-button分别控制矢量图层和标注图层的显隐
*/
import { onMounted, ref } from "vue";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
var map, view, gdMapLayer_标注, gdMapLayer_矢量;
const checkbox_value = ref(["矢量", "标注"]); //创建一个相应式数组变量,作为checkbox-group组件的双向绑定变量
const checkbox_change = () => {
  //checkbox-group组件的change事件的回调函数
  for (let layer of map.basemap.baseLayers) {
    //遍历两个图层
    layer.visible = false; //默认隐藏图层
    for (let value of checkbox_value.value) {
      //针对每个图层,遍历checkbox-group组件的双向绑定变量,判断其值是否等于图层的title属性值,如果为true则显示该图层
      if (layer.title === value) {
        layer.visible = true;
      }
    }
  }
};
onMounted(() => {
  gdMapLayer_标注 = new WebTileLayer({
    //创建网络切片图层对象,用于显示天地图标注切片图层
    title: "标注",
    spaticalReference: { wkid: 3857 },
    urlTemplate:
      "https://t6.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=426bb69c295e5faa57b288803d5233d8",
  });
  gdMapLayer_矢量 = new WebTileLayer({
    //创建网络切片图层对象,用于显示天地图矢量切片图层
    title: "矢量",
    spaticalReference: { wkid: 3857 },
    urlTemplate:
      "https://t6.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=426bb69c295e5faa57b288803d5233d8",
  });
  map = new Map({
    //创建地图对象,将天地图矢量图层和天地图标注图层作为底图,注意标注图层必须在矢量图层的前端否则无法显示
    basemap: {
      baseLayers: [gdMapLayer_矢量, gdMapLayer_标注],
    },
  });
  view = new MapView({
    //创建视图对象
    map: map,
    container: "viewDiv",
    center: [120.4, 36.1],
    zoom: 15,
  });
  view.ui.remove(["zoom", "attribution"]);
}); //onMounted()结尾
</script>

<style scoped>
#viewDiv,
#container {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
