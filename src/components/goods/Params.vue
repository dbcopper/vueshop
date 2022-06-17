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
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addManyParams">添加参数</el-button>
                <!-- 动态参数表格 -->
                <el-table :data="manyTableDate" border stripe>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="scope">
                        <!-- 使用if else进行判断 -->
                        <el-button type="primary" icon="el-cion-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                        <el-button type="danger" icon="el-cion-delete" size="mini" @click="removeRoleById(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addOnlyParams">修改属性</el-button>
                <!-- 静态属性表格 -->
                <el-table :data="onlyTableDate" border stripe>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="scope">
                        <!-- 使用if else进行判断 -->
                        <el-button type="primary" icon="el-cion-edit" size="mini" @click="showEditDialog(scope.row.attr_id)" >编辑</el-button>
                        <el-button type="danger" icon="el-cion-delete" size="mini" @click="removeRoleById(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
    <!-- 动态 -->
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisable"
        width="30%"
        >
        <!-- <el-form :model="addForm"  label-width="100px" ref="addFormRef">
          <el-form-item label="分类名称：" prop="cat_name">
              <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
        </el-form> -->
          <span  slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisable=false">取 消</el-button>
            <el-button type="primary" @click="editCate(addForm.cat_id)">确 定</el-button>
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
      addDialogVisable: false
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
        this.$message.warning('请选择第三级分类')
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      if (this.activeName === 'many') { this.manyTableDate = res.data }
      this.onlyTableDate = res.data
    },
    // 页签点击的处理函数
    handleTabClick() { this.getParamDate() },
    // 添加动态参数
    addManyParams() {
      addDialogVisable = true
    },
    addOnlyParams() {}
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
</style>
