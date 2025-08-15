import WebTileLayer from '@arcgis/core/layers/WebTileLayer'//导入相关文件
/*说明:为了提高代码的重复使用性,将经常用到的天地图图层放到js文件中,供其他组件调用*/
const gdMapLayer_矢量标注 = new WebTileLayer({
  title: '天地图标注',
  spaticalReference:{wkid:3857},
  urlTemplate: 'https://t6.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=82f785f8fb8fcb5fc9d092a7e030defc'
})
const gdMapLayer_矢量 = new WebTileLayer({
  title: '天地图矢量',
  spaticalReference:{wkid:3857},
  urlTemplate:"https://t6.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=82f785f8fb8fcb5fc9d092a7e030defc"
})
export var 天地图矢量=[gdMapLayer_矢量,gdMapLayer_矢量标注]//创建两个网络切片图层,分别表示矢量和标注,放到一个数组变量中并导出
const gdMapLayer_影像标注 = new WebTileLayer({
  title: '标注',
  spaticalReference:{wkid:3857},
  urlTemplate: 'https://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=82f785f8fb8fcb5fc9d092a7e030defc'
})
const gdMapLayer_影像 = new WebTileLayer({
  title: '影像',
  spaticalReference:{wkid:3857},
  urlTemplate:"https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=82f785f8fb8fcb5fc9d092a7e030defc"
})
export var 天地图影像=[gdMapLayer_影像,gdMapLayer_影像标注]//创建两个网络切片图层,分别表示影像和标注,放到一个数组变量中并导出
export var 天地图矢量_无标注=gdMapLayer_矢量
export var 天地图影像_无标注=gdMapLayer_影像


