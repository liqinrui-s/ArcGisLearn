<template>
      <div id="my_menu">
           <el-menu mode="horizontal" default-active="/Home" :router="true"
            style="height:3vw;"><!--default-active表示默认激活的index所在的item-->
                <el-menu-item index="/Home">Home</el-menu-item>
                <el-sub-menu index="视图">
                <template #title>视图</template>
                <el-menu-item index="/stld">二三维视图联动</el-menu-item>
                <el-menu-item index="/stqh">二三维视图切换</el-menu-item>
                <el-menu-item index="/tqqh">天气切换</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="地图与图层">
                <template #title>地图与图层</template>
                <el-menu-item index="/jztdt">加载天地图</el-menu-item>
            </el-sub-menu>
         </el-menu>
          </div>
</template>

<script setup>
</script>

<style scoped>
#menu {
    width: 100%;
    height: 100%;
}
</style>