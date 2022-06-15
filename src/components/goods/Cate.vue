<template>
<div>

</div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类列表
      catelist: [],
      // 总数据条数
      tota: 0
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = this.$http.get('catagories', { params: this.querInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将获取的数据放入data中
      this.catelist = res.data.result
      this.total = res.total
    }
  }
}
</script>

<style lang="less" scoped>

</style>
