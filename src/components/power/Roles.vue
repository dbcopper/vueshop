<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisable=true">添加角色</el-button>
                </el-col>
                <el-col>
                    <el-table :data="rolesList" border stripe>
                      <!-- 添加索引列 -->
                      <!-- 展开列 -->
                      <el-table-column type="expand">
                      <template slot-scope="scope">
                        <!-- 栅格组件 -->
                        <!-- 循环渲染一级权限 -->
                        <!-- li是item中的第几个 -->
                        <!-- li=0时，代表为item中的第一个 -->
                         <el-row :class="['bdbottom','vcenter', l1 === 0 ? 'bdtop' :'']" v-for="(item1,l1) in scope.row.children" :key="item1.id">
                          <!-- 渲染一级权限 -->
                          <el-col :span="5">
                           <el-tag closable>{{item1.authName}}</el-tag>
                           <!-- 增加一个icon图标 -->
                           <i class="el-icon-caret-right"></i>
                          </el-col>
                          <!-- 渲染二级、三级权限 -->
                          <el-col :span="19">
                            <el-row :class=" ['vcenter',l2 === 0 ? '':'bdtop']"  v-for="(item2,l2) in item1.children" :key="item2.id">
                              <!-- 重新分配span -->
                              <el-col :span="6">
                                   <el-tag closable type="success" @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                   <i class="el-icon-caret-right"></i>
                              </el-col>
                              <el-col :span="18">
                                   <el-tag closable v-for="(item3) in item2.children" :key="item3.id" type="warning" @close="removeRightById(scope.row,item3.id)">
                                    {{item3.authName}}</el-tag>
                              </el-col>
                            </el-row>
                          </el-col>
                         </el-row>
                        <!-- 插件表达式：pre可以结构化显示数据
                        <pre>{{scope.row}}</pre> -->
                      </template>
                      </el-table-column>
                      <el-table-column type="index" label="#"></el-table-column>
                      <el-table-column prop="roleName" label="角色名称"></el-table-column>
                      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                      <el-table-column  label="操作">
                      <template slot-scope="scope">
                        <!-- 并非写在label中 -->
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                          <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                      </template>
                      </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>
        <!-- 修改对话框 -->
        <el-dialog
        title="修改角色信息"
        :visible.sync="editDialogVisable"
        width="30%"
        >
        <el-form :model="editForm"  label-width="70px" ref="editFormRef" @closed='editDialogClosed'>
        <el-form-item label="角色名称">
            <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
            <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>

        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog
        title="分配角色权限"
        :visible.sync="setDialogVisable"
        width="30%"
        @closed="setRightDialogClosed"
        >
        <!-- 使用树来渲染 -->
        <!-- show-checkbox显示候选框 -->
        <!-- node-key 当你选中了节点就是选中了我的id值 -->
        <!-- default-expand-all 默认展开-->
        <!-- 默认将原有的key：id绑定到上面 -->
          <el-tree show-checkbox default-expand-all :default-checked-keys="defKeys" :data="setForm" :props="treeProps" node-key="id"  ref="setFormRef" @closed='setDialogClosed'></el-tree>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="setDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="setRight">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 增加用户对话框 -->
        <el-dialog
        title="增加角色"
        :visible.sync="addDialogVisable"
        width="30%"
        >
        <el-form :model="addForm"  label-width="70px" ref="addFormRef" >
        <el-form-item label="角色名称">
            <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
            <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>

        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
        </el-dialog>
    </div>

</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      editForm: [],
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      setForm: [],
      editDialogVisable: false,
      setDialogVisable: false,
      addDialogVisable: false,
      // 树形控件的属性绑定对象
      treeProps: {
        // 显示哪个文本段
        label: 'authName',
        // 以什么来进行父子嵌套
        children: 'children'
      },
      // 默认选定的节点id值
      defKeys: [],
      // 当前节点的id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      // 响应数据
      const { data: res } = await this.$http.get('roles')
      // 将错误信息打出
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      // 将获取的数据放入data中
      this.rolesList = res.data
    },
    async showEditDialog(id) {
      //   根据id进行查询,动态查询，使用字符串拼接
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败')
      //   将查询成功的信息保存
      this.editForm = res.data
      this.editDialogVisable = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async editRole() {
      const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
      if (res.meta.status !== 200) return this.$message.error('修改角色失败')
      this.editDialogVisable = false
      // 重新获取用户的列表
      this.getRolesList()
      this.$message.success('修改角色成功')
    },
    // 弹窗询问是否删除用户
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
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色信息失败')
      this.getRolesList()
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //   catch捕捉错误，取消也是错误噢
      // 如果用户确认删除，返回值为confirm，否则是cancel
      if (confirmResult !== 'confirm') { return this.$message.info('取消删除') }
      //   进行删除操作
      // 反引号操作!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限信息失败')
      // 这个会让整个页面进行渲染
      // this.getRolesList()
      // 这样页面就不会整个渲染了
      role.children = res.data
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    // 展示分配权限的对话框
    async showSetRightDialog(node) {
      this.roleId = node.id
      // 以树控件形式获取数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限信息失败')
      //   将查询成功的信息保存
      this.setForm = res.data
      this.getLeafKeys(node, this.defKeys)
      this.setDialogVisable = true
    },
    setDialogClosed() {
      this.$refs.setFormRef.resetFields()
    },
    // 设定权限
    // 使用tree提供的方法,获取选中和半选中的id
    async setRight() {
      // 在数组中加三个点，代表将花括号脱掉，只生成一个一维数组
      const key = [
        ...this.$refs.setFormRef.getCheckedKeys(), ...this.$refs.setFormRef.getHalfCheckedKeys()
      ]
      // 将返回的数组生成一个由逗号拼接的字符串
      const keys = key.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights/`, { rids: keys })
      if (res.meta.status !== 200) return this.$message.error('分配权限信息失败')
      this.$message({ type: 'success', message: '分配权限成功' })
      this.getRolesList()
      this.setDialogVisable = false
    },
    // 递归地获取校色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果不包含children 则为三级节点
      if (!node.children) {
        // 将获得的id压入
        return arr.push(node.id)
      }
      // 对children的所有子节点进行循环，如果不是三级节点，就进行递归操作
      node.children.forEach(item =>
        this.getLeafKeys(item, arr))
    },
    // 监听分配对话框的关闭
    setRightDialogClosed() {
      this.defKeys = []
    },
    async addRole() {
      const { data: res } = await this.$http.post('roles/', { roleName: this.addForm.roleName, roleDesc: this.addForm.roleDesc })
      if (res.meta.status !== 201) return this.$message.error('添加角色失败')
      this.addDialogVisable = false
      // 重新获取用户的列表
      this.getRolesList()
      this.$message.success('添加角色成功')
      this.addForm = {}
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid rgb(241, 230, 230);
}
.bdbottom{
  border-bottom: 1px solid rgb(241, 230, 230);
}
// 水平居中对齐
.vcenter{
  display: flex;
  align-items: center;
}
</style>
