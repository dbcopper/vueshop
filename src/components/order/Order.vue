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
        <el-table-column width="140px" label="是否付款" prop="pay_stauts">
            <template slot-scope="scope">
                <!-- 添加过滤器 -->
            <el-tag type="success" v-if="scope.row.pay_stauts === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
            </template>
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
                <el-button type="primary" icon="el-cion-edit" size="mini" @click="showEditDialog(scope.row.order_id)" >修改地址</el-button>
                <el-button type="success" icon="el-cion-delete" size="mini" @click="showProgressOfOrders(scope.row.order_id)">物流进度</el-button>
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
    @close="editDialogClosed"
    >
    <!-- 为了方便酒先设置这几个参数 -->
    <el-form :model="editForm"  label-width="100px" ref="editFormRef" :rules="editFormRules">
      <el-form-item label="省市区/县"  prop="address1">
      <!-- 绑定导入的省市县 -->
        <el-cascader :options="cityData" v-model="editForm.address1"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input v-model="editForm.address2"></el-input>
      </el-form-item>
    </el-form>
      <span  slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable=false">取 消</el-button>
        <el-button type="primary" @click="editOrderList(editForm.order_id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度 -->
    <el-dialog
    title="物流进度"
    :visible.sync="progressDialogVisable"
    width="30%"
    >api接口写的有问题
        <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>
    </el-dialog>
</div>
</template>

<script>
// 导入js
import cityData from './citydata.js'

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
      progressDialogVisable: false,
      editForm: {
        address1: [],
        address2: ''
      },
      editFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]

      },
      //  导入省市县包
      cityData,
      progressInfo: []
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
    showProgressOfOrders() {
    // api接口写的有问题
    // this.progressOfOrders()
      this.progressDialogVisable = true
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
      await this.$http.put(`orders/${id}`, this.editForm)
      //   if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editDialogVisable = false
      // 重新获取用户的列表
      this.getOrdersList()
      this.$message.success('修改订单信息成功')
    },
    // 查询物流进度
    async progressOfOrders() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将获取的数据放入data中
      this.progressInfo = res.data
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
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    }
  }
}

</script>

<style lang="less" scoped>
</style>
