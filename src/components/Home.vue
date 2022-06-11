<template>
    <el-container>
      <!-- 头部区域 -->
      <!-- 组件名称就是类名 -->
      <el-header>
        <div>
          <img src="../assets/logo.png" alt="">
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主题区 -->
      <el-container>
        <!-- 侧边栏 -->
        <!-- 根据iscollapse对width及逆行切换 -->
        <el-aside :width="isCollapse ? '64px' :'150px'">
          <!-- 将侧栏缩回 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- active-text-color 激活颜色 unique-opened 只能同时打开一个-->
          <!-- 假冒号表明后面的是一个变量或者表达式，没加冒号的后面对应的是字符串或者字面量 -->
          <!-- router开启路由模式 -->
          <el-menu background-color="rgb(18, 73, 87)" text-color="white"
          active-text-color="yellow" :unique-opened="true" :collapse="isCollapse"
          :collapse-transition="false" :router="true" :default-active="activePath">
            <!-- 一级菜单 -->
            <!-- 命名组建的index -->
            <!-- 但是index,跳转路径只接受字符串，所以在后面加一个字符串变成字符串 -->
            <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id" >
              <!-- 下拉菜单 -->
              <template slot="title">
                <!-- 图标 -->
                <!-- 根据字典返回 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
                :key='subItem.id' @click="saveNavState('/'+subItem.path)">
                 <template slot="title">
                <span>{{subItem.authName}}</span>
              </template>

                </el-menu-item>

            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主题 -->
        <el-main>
          <!-- 放置welcome的路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      // 从服务器获取的下拉列表值
      menulist: [],
      // 对不同的标题logo进行循环,根据id获取不同的icon
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: true,
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 重定向到登录页
      this.$router.push('/login')
    },
    // 从服务器获取左侧菜单
    async getMenuList() {
      // 因为返回是一个promise，所以使用异步操作，返回data的代词是res
      const { data: res } = await this.$http.get('menus')
      // 将错误信息打出
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将获取的数据放入data中
      this.menulist = res.data
    },
    // 点击按钮切换菜单的折叠和展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活方式
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
//  组件名称就是类名
  .el-container{
    height: 100%;
  }
  .el-header{
    background: rgb(9, 97, 138);
    display: flex;
    // 均匀排列每个元素首个元素放置于起点，末尾元素放置于终点
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    // 文本操作
    color: white;
    font-size: 20px;
    // 嵌套，就不用再设定class值了
    >div{
      display: flex;
      align-items: center;
      >img{
        height: 15%;
        width: 15%;
    }
    }

  }
  .el-button{
    font-size: 20px;
  }
  .el-aside{
    background: rgb(18, 73, 87);
  }
  .el-main{
    background: #0523;
  }
  .el-menu{
    width: 100%;
  }
  // 使得iconfont与右边的距离10px
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background: rgb(18, 73, 87);
    font-size:15px;
    line-height:24px;
    color:white;
    // 居中
    text-align: center;
    // 每个字符的间隔
    letter-spacing: 0.2em;
    // 点上去鼠标变成小手
    cursor:pointer;
  }
  .el-menu-item{
    text-align: center;
  }
</style>
