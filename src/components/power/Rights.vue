<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="rightsList" border stripe style="width: 100%">
            <!-- 添加索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="authName" label="权限名称"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <!-- 三个等于号噢 -->
                <!-- 根据level来划分级别 -->
                <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                <!-- 改成elseif更快一些 -->
                <el-tag type="success"  v-else-if="scope.row.level === '1'">二级</el-tag>
                <el-tag type="warning"  v-else-if="scope.row.level === '2'">三级</el-tag>
            </template>
            </el-table-column>
            </el-table>
        </el-card>
    </div>

</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      // 响应数据
      const { data: res } = await this.$http.get('rights/list')
      // 将错误信息打出
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将获取的数据放入data中
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
