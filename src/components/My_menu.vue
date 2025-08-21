<template>
    <div id="my_menu">
        <el-menu mode="horizontal" default-active="/" :router="true"
            style="height:45px;width:100%"><!--default-active表示默认激活的index所在的item-->
            <el-menu-item index="/"><img style="height:20px;margin-right:3px" :src="首页" />首页</el-menu-item>
            <el-sub-menu index="视图">
                <template #title>
                    <img style="height:27px;margin-right:2px" :src="视图" />
                    <el-text>视图</el-text>
                </template>
                <el-menu-item index="/二三维视图联动">二三维视图联动</el-menu-item>
                <el-menu-item index="/二三维视图切换">二三维视图切换</el-menu-item>
                <el-menu-item index="/切换3D视图天气">切换3D视图天气</el-menu-item>
                <el-menu-item index="/显示当前坐标">显示当前坐标</el-menu-item>
                <el-menu-item index="/移动视点">移动视点</el-menu-item>
                <el-menu-item index="/第三人称漫游">第三人称漫游</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="地图与图层">
                <template #title><img style="height:20px;margin-right:3px" :src="图层" />地图</template>
                <el-menu-item index="/加载天地图">加载天地图</el-menu-item>
                <el-menu-item index="/使用图形图层">使用图形图层</el-menu-item>
                <el-menu-item index="/客户端要素图层">客户端要素图层</el-menu-item>
                <el-menu-item index="/要素信息模板">要素信息模板</el-menu-item>
                <el-menu-item index="/动作按钮">动作按钮</el-menu-item>
                <el-menu-item index="/更新要素属性">更新要素属性</el-menu-item>
                <el-menu-item index="/更新要素几何">更新要素几何</el-menu-item>
                <el-menu-item index="/删除要素">删除要素</el-menu-item>
                <el-menu-item index="/使用KML图层">使用KML图层</el-menu-item>
                <el-menu-item index="/GeoJsonLayer">GeoJsonLayer图层</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="信息窗口">
                <template #title><img style="height:18px;margin-right:3px" :src="信息窗口" />信息窗口</template>
                <el-menu-item index="/点击事件触发信息窗口">点击事件触发信息窗口</el-menu-item>
                <el-menu-item index="/弹出自定义信息窗口">弹出自定义信息窗口</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="小部件">
                <template #title><img style="height:20px;margin-right:3px" :src="小部件" />小部件</template>
                <el-menu-item index="/Home小部件">Home小部件</el-menu-item>
                <el-menu-item index="/Sketch小部件">Sketch小部件</el-menu-item>
                <el-menu-item index="/LayerList小部件">LayerList小部件</el-menu-item>
                <el-menu-item index="/Measurement小部件">Measurement小部件</el-menu-item>
                <el-menu-item index="/Editor小部件">Editor小部件</el-menu-item>
                <el-menu-item index="/Legend小部件">Legend小部件</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="查询">
                <template #title><img style="height:20px;margin-right:3px" :src="查询" />查询</template>
                <el-menu-item index="/基于几何查询">基于几何查询</el-menu-item>
                <el-menu-item index="/基于条件查询">基于条件查询</el-menu-item>
                <el-menu-item index="/统计查询">统计查询</el-menu-item>
                <el-menu-item index="/分组统计查询">分组统计查询</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="客户端几何处理">
                <template #title><img style="height:20px;margin-right:3px" :src="几何" />几何处理</template>
                <el-menu-item index="/参考系统的转换">参考系统的转换</el-menu-item>
                <el-menu-item index="/计算长度和面积">计算长度和面积</el-menu-item>
                <el-menu-item index="/缓冲区分析">缓冲区分析</el-menu-item>
                <el-menu-item index="/图形切割">图形切割</el-menu-item>
                <el-menu-item index="/反向裁剪">反向裁剪</el-menu-item>
                <el-menu-item index="/相交分析">相交分析</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="符号">
                <template #title><img style="height:25px;margin-right:3px" :src="符号" />符号</template>
                <el-menu-item index="/点符号_2D">点符号_2D</el-menu-item>
                <el-menu-item index="/线符号_2D">线符号_2D</el-menu-item>
                <el-menu-item index="/面符号_2D">面符号_2D</el-menu-item>
                <el-menu-item index="/文字符号与标注_2D">文字符号与标注_2D</el-menu-item>
                <el-menu-item index='/点符号_icon_3D'>点符号(icon)_3D</el-menu-item>
                <el-menu-item index='/点符号_object_3D'>点符号(object)_3D</el-menu-item>
                <el-menu-item index="/多面体符号_3D">多面体符号_3D</el-menu-item>
                <el-menu-item index="/文字符号与标注_3D">文字符号与标注_3D</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="渲染器">
                <template #title><img style="height:20px;margin-right:3px" :src="渲染器" />渲染器</template>
                <el-menu-item index="/简单符号渲染器">简单符号渲染器</el-menu-item>
                <el-menu-item index="/唯一值符号渲染器">唯一值符号渲染器</el-menu-item>
                <el-menu-item index="/分级符号渲染器">分级符号染器</el-menu-item>
                <el-menu-item index="/饼型图表渲染器">饼型图表渲染器</el-menu-item>
            </el-sub-menu>
        </el-menu>
        <img src="../assets/images/头像.png" draggable="false" style="display:block;position:absolute;right:100px;top:50%;width:2vw;height:2vw;
          z-index:10000;transform: translate(0,-50%);" oncontextmenu="return false" />
        <el-text style="display:block;position:absolute;right:55px;top:50%;line-height:50px;
          z-index:10000;transform: translate(0,-50%);">地信Q</el-text>
    </div>
    </template>
    
    <script setup>
        import 头像 from '/src/assets/images/头像.png'
        import 视图 from '/src/assets/images/视图.png'
        import 图层 from '/src/assets/images/图层.png'
        import 信息窗口 from '/src/assets/images/信息窗口.png'
        import 小部件 from '/src/assets/images/小部件.png'
        import 查询 from '/src/assets/images/查询.png'
        import 几何 from '/src/assets/images/几何.png'
        import 符号 from '/src/assets/images/符号.png'
        import 渲染器 from '/src/assets/images/渲染器.png'
        import 首页 from '/src/assets/images/首页.png'
        import Web工具 from '/src/assets/images/Web工具.png'
    </script>
    
    <style scoped>
    #menu {
        width: 100%;
        height: 100%;
    }
    </style>