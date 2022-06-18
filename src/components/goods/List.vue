<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
        <!-- 设置每行的列之间的间距 -->
      <el-row :gutter="20">
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable>
                <!-- 通过对queryInfo.query进行操作，然后返回符合条件的商品列表-->
                <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
            <!-- 跳转页面 -->
            <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column  type="index"></el-table-column>
        <el-table-column  label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="140px" label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column width="140px" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column width="200px" label="创建时间" prop="add_time">
            <template slot-scope="scope">
                <!-- 添加过滤器 -->
                {{scope.row.add_time|dateFormat}}
            </template>
        </el-table-column>
        <el-table-column width="400px" label="操作">
            <template slot-scope="scope">
                <!-- 使用if else进行判断 -->
                <el-button type="primary" icon="el-cion-edit" size="mini" @click="showEditDialog(scope.row.goods_id)" >编辑</el-button>
                <el-button type="danger" icon="el-cion-delete" size="mini" @click="removeGoodsById(scope.row.goods_id)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
        <!-- 分页区域 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-size="queryInfo.pagesize"
            :page-sizes="[5, 10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total= "total" background>
        </el-pagination>
    </el-card>
    <!-- 编辑表格 -->
</div>
</template>

<script>
export default {
  data() {
    return {
      // query为空，默认返回所有数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 20
      },
      total: 0,
      //   商品列表,是数组
      goodsList: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将获取的数据放入data中
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 编辑页面
    showEditDialog() {

    },
    // 按照id进行删除
    async removeGoodsById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //   catch捕捉错误，取消也是错误噢
      // 如果用户确认删除，返回值为confirm，否则是cancel
      if (confirmResult !== 'confirm') { return this.$message.info('取消删除') }
      //   进行删除操作
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除商品信息失败')
      this.getGoodsList()
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // 更新表格
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      // 同步更新页码情况
      this.queryInfo.pagenum = newPage
      // 更新表格
      this.getGoodsList()
    },
    // 跳转页面
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}

</script>

<style lang="less" scoped>
</style>
