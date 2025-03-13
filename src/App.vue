<template >
    <div style="width:100%;height:3vw;position:absolute;top:0;left:0;z-index:10000">
     <my_menu></my_menu>
    </div>
    <div style="width:100%;height:calc(100% - 3vw);position:absolute;top:3vw;left:0;z-index:10;"> 
     <router-view></router-view>
    </div>
  </template>
  
  <script setup>
   import my_menu from './components/My_menu.vue';
  </script>
  
  <style scoped>
  </style>