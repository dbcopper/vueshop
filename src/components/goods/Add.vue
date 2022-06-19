<template>
<div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-alert title="添加商品信息" type="info" center show-icon closeable="false"></el-alert>
        <!-- 将长得像数字的字符串转为数字，最简单的方法就是减0 -->
        <el-steps :space="400" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
        </el-steps>
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!--  指定position-->
        <!-- style:指定他的css样式 -->
        <!-- beforeTabLeave钩子函数 -->
            <el-tabs v-model='activeIndex'  :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                <!-- 指定的name会自动绑定到activeIndex上 -->
                <el-tab-pane label="基本信息" name='0'>
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <!-- type限制输入 -->
                        <el-input v-model="addForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number" >
                        <el-input v-model="addForm.goods_number" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat" >
                        <!-- 绑定的参数，列表，规则，改变时的触发 -->
                        <el-cascader
                            expandTrigger="hover"
                            v-model="addForm.goods_cat"
                            :options="parentCateList"
                            :props="cascaderProps"
                            change-on-select
                            @change="handleChange"
                            >
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name='1'>
                    <el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id" >
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox v-for="(item,i) in item.attr_vals"
                            :label="item"  :key="i" border></el-checkbox>
                    </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name='2'>
                    <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id" >
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name='3'>
                    <!-- 图片上传的接口 -->
                    <!-- 为upload上配置一个新的axios -->
                    <el-upload
                    :action="uploadUrl"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture"
                    :headers="headersObj"
                    :on-success="handleSuccess"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip"></div>
                    </el-upload>
                </el-tab-pane>
                <!-- 渲染一个富文本编辑器 -->
                <!-- 需要添加新的依赖 -->
                <el-tab-pane label="商品内容" name='4'>
                    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                    <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
    <!-- 预览对话框 -->
    <el-dialog
    title="提示"
    :visible.sync="previewDialogVisible"
    width="50%"
    >
    <img :src="previewPath" alt="" srcset="" class="previewImg">
    </el-dialog>
</div>
</template>

<script>
// 导入包
import _ from 'lodash'

export default {
  data() {
    return {
      cascaderProps: {
        // 选择器的值
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品描述
        goods_introduce: '',
        attrs: []
      },
      // 版式信息
      manyTableDate: [],
      onlyTableDate: [],
      // 列表信息
      parentCateList: [],
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 上传接口
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 为upload绑定axios
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //   preview图片地址
      previewPath: '',
      previewDialogVisible: false
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
      console.log(res.data)
      this.parentCateList = res.data
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        this.$message.warning('请选择第三级分类')
      }
    },
    // 传入两个参数，一个是老标签页一个是新标签页
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabClicked() {
    // 第二个tab
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
        // 字符串转数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0
            ? []
            : item.attr_vals.split(',')
        })
        this.manyTableDate = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
        this.onlyTableDate = res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 处理移除图片的效果
    handleRemove(file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pics数组中，找到这个图片的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 使用数组的splice方法，删除图片
      // 根据索引删除一项
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功
    handleSuccess(response) {
      // 拼接得出一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      //   将图片信息push到图片中
      //   因为实际上是图片列表，所以用push
      this.addForm.pics.push(picInfo)
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的信息')
        }
        // 执行添加的业务
        // 将数组转换为字符串
        // 但是这样会影响到数据绑定的类型，所以先进行深拷贝
        // lodash cloneDeep（obj）
        const form = _.cloneDeep(this.addForm)
        // 对深拷贝的进行操作
        form.goods_cat.join(',')
        // 处理动态参数和静态属性
        this.manyTableDate.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            // 转换为字符串
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 静态属性
        this.onlyTableDate.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起请求
        // 但是商品的名称必须唯一
        const { data: res } = await this.$http.post('goods', form)
        console.log(this.onlyTableDate)
        if (res.meta.status !== 201) return console.log(form)
        // this.$message.error(res.meta.msg + '添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      }
      )
    }

  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
    margin: 0 10px !important;
}
.previewImg{
    width: 100%;
}
.btnAdd{
    margin-top: 15px;
}
</style>
