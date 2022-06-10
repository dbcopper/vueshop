<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <!-- 引用即表单的实例对象-->
      <el-form
        ref="loginFormRef"
        label-width="80px"
        :model="loginForm"
        :rules="loginFormRules"
        class="login_form"
      >
        <!-- 用户名 -->
        <!-- prop 父组件向子组件传值 -->
        <el-form-item prop="username" label="用户名">
          <!-- 使用el库的logo ：el-icon-user-solid-->
          <!-- 双向数据绑定 -->
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="密码">
          <!-- 使用本地的logo -->
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-lock_fill"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 这里面的this指的是组件
export default {
  data() {
    return {
      // 登陆表单的数据绑定对象
      loginForm: {
        // 默认为空
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        //  验证用户名是否合法
        username: [
          // 当文本框失去焦点时触发
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    restLoginForm() {
      // $ref是组件下面的所有实例对象，resetfuekds为表单重置，恢复默认值
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // validate是表单验证函数
      // 根据编写的rules来进行表单验证
      // valid是 true或false
      this.$refs.loginFormRef.validate(async (valid) => {
        // 根据表单验证结果进行发起
        if (!valid) return
        // 使用axios进行发起
        // 请求路径login和请求参数
        // 将data属性解构重新命名为res
        // 待用axios的post！！！！！！！！！！！！！！！！！！！！！！！！
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 返回时promise格式时，使用async和await进行异步操作
        if (res.meta.status !== 200) { return this.$message.error('登陆失败：' + res.meta.msg) }
        this.$message.success('登陆成功')
        console.log(res)
        // 将登陆成功后的token保存到客户端的sessionStorage中，（当页面的打开时保存，并非永久保存）
        window.sessionStorage.setItem('token', res.data.token)
        // 通过编程式导航跳转到后台主页，/home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: rgb(37, 187, 224);
  /* 占上级的比例是多少 */
  height: 100%;
}

.login_box {
  width: 400px;
  height: 250px;
  background-color: white;
  /* 圆角的边框 */
  border-radius: 10px;
  /* 绝对定位 */
  position: absolute;
  left: 50%;
  top: 50%;
  /* 现在是元素的左上角被定位到中间，必须中间质心定位到中间 */
  /* 使用径向偏移 */
  transform: translate(-50%, -50%);
  /* less的语法嵌套 */
  .avatar_box {
    /* 设定他的尺寸 */
    height: 100px;
    width: 100px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    /* 加一个白色的的边框线 */
    border-radius: 50%;
    /*  class下面的img的尺寸*/
    img {
      width: 100%;
      height: 110%;
    }
  }
}
.btns {
  // 弹性布局
  display: flex;
  // 右对齐
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 0 20px;
  // 距离底部的距离
  // bottom: 0px;
  box-sizing: border-box;
}
</style>
