<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
        <!-- 设置每行的列之间的间距 -->
      <el-row :gutter="20">
        <el-col :span='8'>
            <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable>
                <!-- 通过对queryInfo.query进行操作，然后返回符合条件的商品列表-->
                <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
            </el-input>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column  type="index"></el-table-column>
        <el-table-column  label="订单编号" prop="order_number"></el-table-column>
        <el-table-column  label="订单价格" prop="order_price"></el-table-column>
        <el-table-column width="140px" label="是否付款" prop="order_pay">

        </el-table-column>
        <el-table-column width="140px" label="是否发货" prop="is_send"></el-table-column>
        <el-table-column width="200px" label="下单时间" prop="create_time">
            <template slot-scope="scope">
                <!-- 添加过滤器 -->
                {{scope.row.create_time|dateFormat}}
            </template>
        </el-table-column>
        <el-table-column width="400px" label="操作">
            <template slot-scope="scope">
                <!-- 使用if else进行判断 -->
                <el-button type="primary" icon="el-cion-edit" size="mini" @click="showEditDialog(scope.row.order_id)" >编辑</el-button>
                <el-button type="danger" icon="el-cion-delete" size="mini" @click="removeOrderById(scope.row.order_id)">删除</el-button>
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
    <!-- 修改分类 -->
    <el-dialog
    title="修改商品分类信息"
    :visible.sync="editDialogVisable"
    width="30%"
    >
    <!-- 为了方便酒先设置这几个参数 -->
    <el-form :model="editForm"  label-width="100px" ref="editFormRef">
      <el-form-item label="订单价格：" prop="order_price">
        <el-input v-model="editForm.order_price"></el-input>
      </el-form-item>
      <el-form-item label="是否付款" prop="order_pay">
        <el-input v-model="editForm.order_pay"></el-input>
      </el-form-item>
      <el-form-item label="是否发货" prop="is_send">
        <el-input v-model="editForm.is_send"></el-input>
      </el-form-item>
    </el-form>
      <span  slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable=false">取 消</el-button>
        <el-button type="primary" @click="editOrderList(editForm.order_id)">确 定</el-button>
      </span>
    </el-dialog>
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
        pagesize: 100
      },
      total: 0,
      //   商品列表,是数组
      ordersList: [],
      editDialogVisable: false,
      editForm: {}
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取商品数据
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将获取的数据放入data中
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 编辑页面
    showEditDialog(id) {
      this.getOrderById(id)
      this.editDialogVisable = true
    },
    // 根据id获取商品数据
    async getOrderById(id) {
      const { data: res } = await this.$http.get(`orders/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将获取的数据放入data中
      this.editForm = res.data
    },
    // 上传数据
    async editOrderList(id) {
      const { data: res } = await this.$http.put(`orders/${id}`, this.editForm)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editDialogVisable = false
      // 重新获取用户的列表
      this.getOrdersList()
      this.$message.success('修改商品信息成功')
    },
    // 按照id进行删除
    async removeOrderById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //   catch捕捉错误，取消也是错误噢
      // 如果用户确认删除，返回值为confirm，否则是cancel
      if (confirmResult !== 'confirm') { return this.$message.info('取消删除') }
      //   进行删除操作
      const { data: res } = await this.$http.delete(`orders/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除商品信息失败')
      this.getOrdersList()
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // 更新表格
      this.getOrdersList()
    },
    handleCurrentChange (newPage) {
      // 同步更新页码情况
      this.queryInfo.pagenum = newPage
      // 更新表格
      this.getOrdersList()
    }
  }
}

</script>

<style lang="less" scoped>
</style>
