// 一个template只能有一个div
<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 搜索区 -->
            <el-row>
                <!-- 栅格化layout 总共24格 -->
                <el-col :span="7">
                 <!-- 搜索和添加区 -->
                 <!-- clearable一键清空 -->
                    <el-input clearable @clear="getUserList" placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisable = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格区-->
            <!-- :userlist 绑定数据源 -->
            <el-table :data="userlist" border stripe style="width: 100%">
            <!-- 添加索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="姓名" width="180"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column prop="mg_state" label="状态">
              <!-- 返回这一行的数据，我认为是返回父属性 -->
              <template slot-scope="scope">
              <!-- 返回父属性的子状态-->
              <!-- 根据id查询信息 -->
                <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                <!-- 修改 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                <!-- 删除 -->
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                <!-- 分配角色 -->
                <!-- 添加提醒项 enterable 鼠标不可以进入-->
                <el-tooltip class="item" effect="dark" content="分配角色" :enterable="false" placement="top">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-size="queryInfo.pagesize"
                :page-sizes="[1, 5, 10, 20]"
                layout="total, sizes, prev, pager, next, jumper"
                :total= "total">
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <!-- addDialogVisable 是否显示对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisable"
        width="30%"
        @close="addDialogClosed">
        <!-- ref:表单的ref -->
        <!-- ：model父组件将值传给了子组件 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <!-- prop指定具体的校验规则 -->
        <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 修改对话框 -->
        <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisable"
        width="30%"
        >
        <el-form :model="editForm"  label-width="70px" :rules="editFormRules" ref="editFormRef">
            <!-- prop指定具体的校验规则 -->
        <el-form-item label="用户名" >
            <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
        </el-dialog>
    </div>

</template>

<script>
export default {
  data() {
    //   自定义校验规则
    // 箭头函数
    // rule 是规则，value是要校验的值，cb是回调函数
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regEmail.test(value)) {
        return cb()
      }
      //   否则
      cb(new Error('请输入合法的邮箱'))
    }
    const checkMobile = (rule, value, cb) => {
      const regEmail = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      if (regEmail.test(value)) {
        return cb()
      }
      //   否则
      cb(new Error('请输入合法的手机号'))
    }
    return {
    // 后端定义的
      queryInfo: {
        query: '',
        // 当前的的页数
        pagenum: 1,
        // 当前页显示多少数据
        pagesize: 5
      },
      userlist: [],
      total: 0,
      // 控制对话框的显示,默认是关闭的
      addDialogVisable: false,
      // 添加用户表单规则
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        //   当时去焦点时候出发验证
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度为3-10位' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度为6-15位' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }]
      },
      //   修改框属性
      editDialogVisable: false,
      //   用于保存查询到的用户信息,因为是查询就不用保存用户分支了
      editForm: {},
      //   修改规则
      editFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //   返回用户列表信息
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      // 将错误信息打出
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将获取的数据放入data中
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize（每页有多少个）变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // 更新表格
      this.getUserList()
    },
    // 监听页码值发生变化
    // newpage根据按钮对下面进行传参
    handleCurrentChange (newPage) {
      // 同步更新页码情况
      this.queryInfo.pagenum = newPage
      // 更新表格
      this.getUserList()
    },
    // 监听开关的改变
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}
      /state/${userInfo.mg_state}`)
      // 判断状态是否失败
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 关闭对话框后清除信息，ref是绑定在组件上的ref
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      //   表单预验证，validate valid返回true
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加用户成功')
        this.addDialogVisable = false
        // 重新获取用户的列表
        this.getUserList()
      })
    },
    async showEditDialog(id) {
      //   根据id进行查询,动态查询，使用字符串拼接
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      //   将查询成功的信息保存
      this.editForm = res.data
      this.editDialogVisable = true
    },
    editUser() {}
  }
}
</script>

<style lang="less" scoped>

</style>
