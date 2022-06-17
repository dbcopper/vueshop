<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"  @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
        <!-- 根据官方文档得知 -->
        <tree-table class="tebleTree" :data="catelist" :selection-type="false" :expand-type="false" :show-index="true"
        index-text="#" border :show-row-hover="false" :columns="conlmns">
        <!-- 下面定义的模板，插槽的名字叫做isok -->
          <template slot="isok" slot-scope="scope">
            <!-- 使用if else进行判断 -->
            <i class="el-icon-success" style="color:lightgreen;" v-if="scope.row.cat_deleted===false"></i>
            <i class="el-icon-false"  style="color:red;" v-else></i>
          </template>
            <template slot="order" slot-scope="scope">
            <!-- 使用if else进行判断 -->
            <el-tag size="mini"  v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <template slot="operation" slot-scope="scope">
            <!-- 使用if else进行判断 -->
            <el-button type="primary" icon="el-cion-edit" size="mini" @click="showEditDialog(scope.row.cat_id)" >编辑</el-button>
            <el-button type="danger" icon="el-cion-delete" size="mini" @click="removeRoleById(scope.row.cat_id)">删除</el-button>
          </template>
        </tree-table>
        <!-- 分页区 -->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum"
                :page-size="querInfo.pagesize"
                :page-sizes="[1, 5, 10, 20]"
                layout="total, sizes, prev, pager, next, jumper"
                :total= "total">
        </el-pagination>
        <!-- 添加类型 -->
         <el-dialog
        title="添加商品分类"
        :visible.sync="addDialogVisable"
        width="30%"
        @closed='addDialogClosed'
        ref="addDialogRef"
        >
          <el-form :model="addForm" :rules="addFormRules" label-width="100px" ref="addFormRef" >
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
              <!-- 级联选择器 -->
              <!-- props指定配置对象 -->
              <!-- change-on-select可以选取一级 -->
                <el-cascader
                  expandTrigger="hover"
                  v-model="selectedKey"
                  :options="parentCateList"
                  :props="cascaderProps"
                  @change="parentCateChanged"
                  change-on-select></el-cascader>
            </el-form-item>
          </el-form>
          <span  slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisable=false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改分类 -->
        <el-dialog
        title="修改商品分类信息"
        :visible.sync="editDialogVisable"
        width="30%"
        >
        <el-form :model="editForm"  label-width="100px" ref="editFormRef">
          <el-form-item label="分类名称：" prop="cat_name">
              <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
          <span  slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisable=false">取 消</el-button>
            <el-button type="primary" @click="editCate(editForm.cat_id)">确 定</el-button>
          </span>
        </el-dialog>
    </el-card>
</div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      editDialogVisable: false,
      addDialogVisable: false,
      // 商品分类列表
      catelist: [],
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 修改
      editForm: {},
      addFormRules: {
        cat_name: { required: true, message: '请输入商品种类', trigger: 'blur' }
      },
      // 总数据条数
      total: 0,
      // 为table指定列表名称
      conlmns: [{
        label: '分类名称',
        // 对应属性名
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 将当前列定义为模板列
        type: 'template',
        template: 'isok'
      },
      {
        label: '排序',
        // 对应属性名
        type: 'template',
        template: 'order'
      },
      {
        label: '操作',
        // 对应属性名
        type: 'template',
        template: 'operation'
      }
      ],
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 选择器的值
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数
      selectedKey: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将获取的数据放入data中
      this.catelist = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      // 更新表格
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      // 同步更新页码情况
      this.querInfo.pagenum = newPage
      // 更新表格
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addDialogVisable = true
    },
    // 获取父级列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将获取的数据放入data中
      this.parentCateList = res.data
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addForm = {}
      this.selectedKey = []
    },
    // 选择项发生变化
    parentCateChanged() {
      // console.log(this.selectedKey)
      if (this.selectedKey.length > 0) {
        // 选取最后一个作为其父级id
        this.addForm.cat_pid = this.selectedKey[this.selectedKey.length - 1]
        this.addForm.cat_level = this.selectedKey.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    async addCate() {
      console.log(this.addForm)
      const { data: res } = await this.$http.post('categories', this.addForm
      )
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success('添加成功')
      this.getCateList()
      // 将获取的数据放入data中
      // this.parentCateList = res.data
      this.addDialogVisable = false
    },
    // 根据id进行删除
    async removeRoleById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //   catch捕捉错误，取消也是错误噢
      // 如果用户确认删除，返回值为confirm，否则是cancel
      if (confirmResult !== 'confirm') { return this.$message.info('取消删除') }
      //   进行删除操作
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return console.log(res)
      // this.$message.error('删除角色信息失败')
      this.getCateList()
      this.$message.success('删除成功!')
    },
    // 边界栏
    async showEditDialog(id) {
      //   根据id进行查询,动态查询，使用字符串拼接
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询商品分类信息失败')
      //   将查询成功的信息保存
      this.editForm = res.data
      this.editDialogVisable = true
    },
    // 编辑提交分类
    async editCate(id) {
      const { data: res } = await this.$http.put('categories/' + id, { cat_name: this.editForm.cat_name })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editDialogVisable = false
      // 重新获取用户的列表
      this.getCateList()
      this.$message.success('更新分类成功')
    }
  }
}
</script>

<style lang="less" scoped>
.tebleTree{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
