<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
        <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
</div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      // 使用lodash需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  //   先于dom之前执行
  created() {
  },
  //   dom加载完后再执行
  async mounted() {
    // dom渲染完后，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))
    // 准备数据和配置项
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    // 进行数据的配置项，添加鼠标跟随效果
    const result = _.merge(res.data, this.options)
    // 展示数据
    myChart.setOption(result)
  },
  methods: {

  }
}

</script>

<style lang="less" scoped>
</style>
