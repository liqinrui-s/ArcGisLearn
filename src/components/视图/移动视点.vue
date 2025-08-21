<template>
    <div id="container" style="color:gray;">
        <div id="viewDiv1" :style="{zIndex:viewDiv1_index}"></div>
        <div id="viewDiv2" :style="{zIndex:viewDiv2_index}"></div>
        <div style="position:absolute;left:10px;top:10px;z-index:1000"><!--构造两个按钮,一个用来切换视图,一个用来执行移动视点方法-->
            <el-button size="large" :circle="true" @click="click" >{{button_text}}</el-button>
            <el-button size="large" :circle="true" @click="gotoTarget" class="action-button esri-icon-applications"></el-button>
        </div>
        <!--两个dialog组件,一个用来输入2D视图移动视点方法的参数,一个用来输入3D视图移动视点方法的参数-->
        <el-dialog v-model="if_dialog_1" :show-close="false" icon="Search" style="white-space:pre-line;width:450px;margin-top:100px;margin-left:10px">
          <template #header>
            请输入2D视图状态下移动视点方法所需的各项参数
          </template>
          <div style="display:flex;flex-direction: column;">
            <div>
              <span>经度</span><el-input v-model="经度"></el-input>
              <span>纬度</span><el-input v-model="纬度"></el-input>
              <span>缩放级别:</span><el-input v-model="zoom"></el-input>
              <span>动画时间(ms):</span><el-input v-model="duration_2D"></el-input>
            </div>
          </div>
          <template #footer>
            <el-button @click="取消">取消</el-button><el-button @click="确定">确定</el-button>
          </template>
        </el-dialog>
        <el-dialog v-model="if_dialog_2" show-close="false" icon="Search" style="white-space:pre-line;width:450px;margin-top:100px;margin-left:10px">
          <template #header>
            请输入3D视图状态下移动视点所需的各项参数
          </template>
          <div style="display:flex;flex-direction: column;">
            <div>
              <span>X坐标</span><el-input v-model="x"></el-input>
              <span>Y坐标</span><el-input v-model="y"></el-input>
              <span>相机高度:</span><el-input v-model="z"></el-input>
              <span>俯仰角角度:</span><el-input v-model="tilt"></el-input>
              <span>方位角角度:</span><el-input v-model="heading"></el-input>
              <span>动画时间(ms):</span><el-input v-model="duration_3D"></el-input>
            </div>
          </div>
          <template #footer>
            <el-button @click="取消">取消</el-button><el-button @click="确定">确定</el-button>
          </template>
        </el-dialog>
    </div>
  </template>
    
  <script setup>
  import Map from '@arcgis/core/Map.js'
  import MapView from '@arcgis/core/views/MapView.js'
  import SceneView from '@arcgis/core/views/SceneView.js'
  import {onMounted,ref} from 'vue'
  var map,view1,view2,active,sync,views
  const if_dialog_1=ref(false)
  const if_dialog_2=ref(false)
  const 经度=ref(120.4)
  const 纬度=ref(36.1)
  const zoom=ref(15)
  const duration_2D=ref(1200)
  //👆以上是2D视图移动视点方法所需的参数
  const x=ref(120.4)
  const y=ref(36.1)
  const z=ref(1200)
  const tilt=ref(60)
  const heading=ref(0)
  const duration_3D=ref(2000)
  //👆以上是3D视图移动视点方法所需的参数
  const 取消=()=>{//点击取消按钮,隐藏dialog组件
    if_dialog_1.value=false
    if_dialog_2.value=false
  }
  const gotoTarget=()=>{//如果当前视图为2D视图,打开2D视图对应的dialog组件,否则打开3D视图对应的dialog组件
    switch(button_text.value){
      case '2D':
        if_dialog_1.value=true
        break
      case '3D':
        if_dialog_2.value=true
        break
    }
  }
  const 确定=()=>{//点击dialog组件的确定按钮,根据不同的视图,执行对应的goTo方法
    if(button_text.value==="2D"){
      if_dialog_1.value=false
      view1.goTo({//第一个参数的核心属性是center(视图中心点坐标)和zoom(缩放级别)
        center:[Number(经度.value),Number(纬度.value)],
        zoom:Number(zoom.value)
      },{
        duration:Number(duration_2D.value)
      })
    }else if(button_text.value==="3D"){
      if_dialog_2.value=false
      view2.goTo({//第一个参数是一个camera对象,核心属性是position(相机位置),tilt(相机俯仰角)和heading(相机方位角)
        position:{
          x:Number(x.value),
          y:Number(y.value),
          z:Number(z.value),
          spaticalReference:{wkid:3857}
        },
        tilt:Number(tilt.value),
        heading:Number(heading.value)
      },{
        duration:Number(duration_3D.value)
      })
    }
  }

  
  const viewDiv1_index=ref(200)
  const viewDiv2_index=ref(100)//利用css的z-index的属性,切换2D与3D视图
  const button_text=ref('2D')
  function click(){//点击按钮时调整两种视图的z-index属性,同时调整按钮文本
    viewDiv1_index.value=viewDiv1_index.value===100?200:100
    viewDiv2_index.value=viewDiv2_index.value===100?200:100
    button_text.value=button_text.value==="2D"?"3D":"2D"
  }
  onMounted(()=>{
    map = new Map({//创建地图对象
      basemap: "satellite"
    })
    view2 = new SceneView({//创建3D视图对象
      container: "viewDiv2",
      map: map,
    })
    view1 = new MapView({//创建2D视图对象
      container:"viewDiv1",
      map: map,
    })
    view2.ui.remove(["zoom","attribution","navigation-toggle","compass"])
    view1.ui.remove(["zoom","attribution"])
    views = [view1, view2]
    sync = (source) => {
      if (!active || !active.viewpoint || active !== source) {
        return;
      }
      for (const view of views) {
        if (view !== active) {
          view.viewpoint = active.viewpoint
        }
      }
    }
    for (const view of views) {
      view.watch(["interacting", "animation"], () => {
        active = view
        sync(active)
      });
      view.watch("viewpoint", () => sync(view));
    }
  })
  </script>
    
  <style scoped>
  #viewDiv1,#viewDiv2,#container{
    height:100%;width:100%;padding:0;margin:0;background-color:white;
    /*👆👆不设置背景会出问题*/
  }
  #viewDiv1,#viewDiv2{
    position:absolute;top:0px;left:0px
  }
  #tool_box{
    position:absolute;left:10px;top:10px;;z-index:10000;
  }
  </style>