<template>
    <div id="container" style="color:gray;">
      <div id="viewDiv1" :style="{ zIndex: viewDiv1_index }"></div>
      <div id="viewDiv2" :style="{ zIndex: viewDiv2_index }"></div>
      <div style="position:absolute;left:10px;top:10px;z-index:1000">
        <!-- 构造两个按钮,一个用来切换视图,一个用来执行移动视点方法 -->
        <el-button size="large" :circle="true" @click="click">{{ button_text }}</el-button>
        <el-button size="large" :circle="true" @click="gotoTarget" class="action-button esri-icon-applications"></el-button>
      </div>
      <!-- 两个dialog组件,一个用来输入2D视图移动至方法的参数,一个用来输入3D视图移动视点方法的参数 -->
      <el-dialog v-model="if_dialog_1" :show-close="false" icon="Search" style="white-space:pre-line;width:450px;margin-top:3vw;">
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
      <el-dialog v-model="if_dialog_2" :show-close="false" icon="Search" style="white-space:pre-line;width:450px;margin-top:3vw">
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
  import Map from '@arcgis/core/Map.js';
  import MapView from '@arcgis/core/views/MapView.js';
  import SceneView from '@arcgis/core/views/SceneView.js';
  import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
  import { onMounted, ref } from 'vue';
  
  // 地图和视图对象
  let map, view1, view2, active, views;
  
  // 2D视图参数
  const if_dialog_1 = ref(false);
  const 经度 = ref(120.4);
  const 纬度 = ref(36.1);
  const zoom = ref(15);
  const duration_2D = ref(1200);
  
  // 3D视图参数
  const if_dialog_2 = ref(false);
  const x = ref(120.4);
  const y = ref(36.1);
  const z = ref(1200);
  const tilt = ref(60);
  const heading = ref(0);
  const duration_3D = ref(2000);
  
  // 视图切换相关
  const viewDiv1_index = ref(200);
  const viewDiv2_index = ref(100);
  const button_text = ref('2D');
  
  // 取消按钮逻辑
  const 取消 = () => {
    if_dialog_1.value = false;
    if_dialog_2.value = false;
  };
  
  // 打开对应的dialog组件
  const gotoTarget = () => {
    if (if_dialog_1.value === false && if_dialog_2.value === false) {
      switch (button_text.value) {
        case '2D':
          if_dialog_1.value = true;
          break;
        case '3D':
          if_dialog_2.value = true;
          break;
      }
    }
  };
  
  // 确定按钮逻辑
  const 确定 = () => {
    if (button_text.value === "2D") {
      if_dialog_1.value = false;
      view1.goTo(
        {
          center: [Number(经度.value), Number(纬度.value)],
          zoom: Number(zoom.value),
        },
        {
          duration: Number(duration_2D.value),
        }
      );
    } else if (button_text.value === "3D") {
      if_dialog_2.value = false;
      view2.goTo(
        {
          position: {
            x: Number(x.value),
            y: Number(y.value),
            z: Number(z.value),
            spatialReference: { wkid: 3857 }, // 修正拼写错误
          },
          tilt: Number(tilt.value),
          heading: Number(heading.value),
        },
        {
          duration: Number(duration_3D.value),
        }
      );
    }
  };
  
  // 切换视图
  const click = () => {
    viewDiv1_index.value = viewDiv1_index.value === 100 ? 200 : 100;
    viewDiv2_index.value = viewDiv2_index.value === 100 ? 200 : 100;
    button_text.value = button_text.value === "2D" ? "3D" : "2D";
  };
  
  // 初始化地图和视图
  onMounted(() => {
    map = new Map({
      basemap: "satellite",
    });
  
    view2 = new SceneView({
      container: "viewDiv2",
      map: map,
    });
  
    view1 = new MapView({
      container: "viewDiv1",
      map: map,
    });
  
    // 移除不需要的UI组件
    view2.ui.remove(["zoom", "attribution", "navigation-toggle", "compass"]);
    view1.ui.remove(["zoom", "attribution"]);
  
    // 同步视图
    views = [view1, view2];
    const sync = (source) => {
      if (!active || !active.viewpoint || active !== source) {
        return;
      }
      for (const view of views) {
        if (view !== active) {
          view.viewpoint = active.viewpoint;
        }
      }
    };
  
    // 使用 reactiveUtils.watch() 替换 view.watch
    for (const view of views) {
      reactiveUtils.watch(
        () => [view.interacting, view.animation],
        () => {
          active = view;
          sync(active);
        }
      );
  
      reactiveUtils.watch(
        () => view.viewpoint,
        () => sync(view)
      );
    }
  });
  </script>
  
  <style scoped>
  #viewDiv1,
  #viewDiv2,
  #container {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    background-color: white;
    /* 👆👆不设置背景会出问题 */
  }
  
  #viewDiv1,
  #viewDiv2 {
    position: absolute;
    top: 0px;
    left: 0px;
  }
  
  #tool_box {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 10000;
  }
  </style>