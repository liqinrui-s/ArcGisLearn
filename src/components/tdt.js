import WebTileLayer from '@arcgis/core/layers/WebTileLayer'//导入相关文件
/*说明:为了提高代码的重复使用性,将经常用到的天地图图层放到js文件中,供其他组件调用*/
const gdMapLayer_slbz = new WebTileLayer({
  title: 'tdtbz',
  spaticalReference:{wkid:3857},
  urlTemplate: 'https://t6.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=426bb69c295e5faa57b288803d5233d8'
})
const gdMapLayer_sl = new WebTileLayer({
  title: 'tdtsl',
  spaticalReference:{wkid:3857},
  urlTemplate:"https://t6.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=426bb69c295e5faa57b288803d5233d8"
})
export var tdtslbz=[gdMapLayer_sl,gdMapLayer_slbz]//创建两个网络切片图层,分别表示矢量和标注,放到一个数组变量中并导出

const gdMapLayer_yxbz = new WebTileLayer({
  title: 'bz',
  spaticalReference:{wkid:3857},
  urlTemplate: 'https://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=426bb69c295e5faa57b288803d5233d8'
})
const gdMapLayer_yx = new WebTileLayer({
  title: 'yx',
  spaticalReference:{wkid:3857},
  urlTemplate:"https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=426bb69c295e5faa57b288803d5233d8"
})
export var tdtyxbz=[gdMapLayer_yx,gdMapLayer_yxbz]//创建两个网络切片图层,分别表示影像和标注,放到一个数组变量中并导出
export var tdtslwbz=gdMapLayer_sl
export var tdtyxwbz=gdMapLayer_yx


