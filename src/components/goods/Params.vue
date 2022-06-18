<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
    <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" closeable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
            <span>选择商品分类：</span>
            <span>
            <el-cascader
                expandTrigger="hover"
                v-model="selectedKey"
                :options="parentCateList"
                :props="cascaderProps"
                change-on-select
                @change="handleChange"
                >
            </el-cascader>
            </span>
        </el-col>
      </el-row>
      <!-- tab页 -->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="动态参数" name="many" >
                <!-- 计算属性绑定 -->
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisable = true">添加参数</el-button>
                <!-- 动态参数表格 -->
                <el-table :data="manyTableDate" border stripe>
                    <!-- 循环渲染tag -->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                        <!-- 循环渲染tag标签 -->
                        <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i" type="warning" @close="handleClose(i,scope.row)">
                                    {{item}}</el-tag>
                        <!-- 输入文本框 -->
                        <!-- 根据每一个属性值的inputvisible来判断 -->
                        <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <!--  添加的按钮-->
                        <el-button v-else class="button-new-tag"  size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="scope">
                        <!-- 使用if else进行判断 -->
                        <el-button type="primary" icon="el-cion-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                        <el-button type="danger" icon="el-cion-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisable = true">添加属性</el-button>
                <!-- 静态属性表格 -->
                <el-table :data="onlyTableDate" border stripe>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                        <!-- 循环渲染tag标签 -->
                        <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i" type="warning" @close="handleClose(i,scope.row)">
                                    {{item}}</el-tag>
                        <!-- 输入文本框 -->
                        <!-- 根据每一个属性值的inputvisible来判断 -->
                        <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <!--  添加的按钮-->
                        <el-button v-else class="button-new-tag"  size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="scope">
                        <!-- 使用if else进行判断 -->
                        <el-button type="primary" icon="el-cion-edit" size="mini" @click="showEditDialog(scope.row.attr_id)" >编辑</el-button>
                        <el-button type="danger" icon="el-cion-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
    <!-- 动态添加表格 -->
    <!-- titleText为计算属性 -->
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisable"
        width="30%"
        @closed="addDialogClosed"
        >
        <el-form :model="addForm"  label-width="100px" ref="addFormRef"  :rules="addFormRules">
          <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
          <span  slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisable=false">取 消</el-button>
            <el-button type="primary" @click="addParamDate">确 定</el-button>
          </span>
        </el-dialog>
    <!-- 动态修改表格 -->
    <!-- titleText为计算属性 -->
      <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editDialogVisable"
        width="30%"
        @closed="editDialogClosed"
        >
        <el-form :model="editForm"  label-width="100px" ref="editFormRef"  :rules="addFormRules">
          <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
          <span  slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisable=false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
          </span>
        </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      cascaderProps: {
        // 选择器的值
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      parentCateList: [],
      selectedKey: [],
      // 被激活页签的名称(默认的)
      activeName: 'many',
      //   动态属性数据
      manyTableDate: [],
      //   静态属性数据
      onlyTableDate: [],
      addDialogVisable: false,
      editDialogVisable: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 修改表格
      editForm: {
        attr_name: ''
      },
      // 添加表单验证规律
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getParentCateList()
  },
  methods: {
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories/', { params: { type: 3 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将获取的数据放入data中
      this.parentCateList = res.data
    },
    // 选定三级标签
    async handleChange() { this.getParamDate() },
    // 函数抽离,获取不同界面的参数数据
    async getParamDate() {
      if (this.selectedKey.length !== 3) {
        this.selectedKey = []
        this.manyTableDate = []
        this.onlyTableDate = []
        this.$message.warning('请选择第三级分类')
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      // 将字符串转换为数组
      res.data.forEach(item => {
        // 三元表达式对空进行判断
        item.attr_vals = item.attr_vals
          ? item.attr_vals = item.attr_vals.split(',')
          : []
        //   控制文本框的显示与隐藏
        // 这样每行都不干涉了
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') { this.manyTableDate = res.data }
      this.onlyTableDate = res.data
    },
    // 页签点击的处理函数
    handleTabClick() { this.getParamDate() },
    // 添加动态/静态参数
    async addParamDate() {
      const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
        attr_name: this.addForm.attr_name,
        attr_sel: this.activeName
      })
      if (res.meta.status !== 201) return this.$message.error(`添加${this.titleText}列表失败`)
      this.$message.success(`添加${this.titleText}列表成功`)
      // 更新列表
      this.getParamDate()
      this.addDialogVisable = false
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addForm = {}
    },
    // 根据id查询属性
    async showEditDialog(id) {
      //   根据id进行查询商品属性,动态查询，使用字符串拼接
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error('查询参数信息失败')
      //   将查询成功的信息保存
      this.editForm = res.data
      this.editDialogVisable = true
      console.log(this.editForm)
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    // 修改属性
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editDialogVisable = false
        // 重新获取用户的列表
        this.getParamDate()
        this.$message.success('修改属性成功')
      })
    },
    async removeParamsById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //   catch捕捉错误，取消也是错误噢
      // 如果用户确认删除，返回值为confirm，否则是cancel
      if (confirmResult !== 'confirm') { return this.$message.info('取消删除') }
      //   进行删除操作
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) return console.log(res)
      // this.$message.error('删除角色信息失败')
      this.getParamDate()
      this.$message.success('删除成功!')
    },
    // 文本框失去焦点触发
    async handleInputConfirm(row) {
      // 判断是否输入无意义的东西
      if (row.inputValue.trim().length === 0) {
        // 重置
        row.inputValue = ''
        // 显示出来按钮
        row.inputVisible = false
        return
      }
      //   如果没有触发，就是输入了有意义的
      // 向row.attr_vals压入一个数
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      //   将操作保存到数据库中
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        //   服务器要求字符串，转换为字符串
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('添加参数项成功')
    },
    // 显示tag
    showInput(item) {
      item.inputVisible = true
      // 自动获取焦点
      // $nextTick 当页面上元素被重新渲染后，才会执行回调函数中的代码
      // 否则获取不了他的ref
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应参数可选项
    handleClose(i, row) {
      // 从这里面删除i的一项，会直接修改原数组
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  //  计算属性
  computed: {
    // 如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedKey.length !== 3) {
        return true
      }
      return false
    },
    // 选取三级分类id
    // 等于是三个等号
    cateId() {
      if (this.selectedKey.length === 3) {
        return this.selectedKey[2]
      }
      return null
    },
    // 动态计算标题面板
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0px;
}
.el-tag{
    margin: 5px;
}
.input-new-tag{
    width:120px;
}
</style>
