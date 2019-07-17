<template>
  <div class="article-container">
    <!-- 筛选区域 -->
    <el-card>
      <div slot="header">
        <!-- 面包屑 -->
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 筛选表单 -->
      <el-form :model="reqParams" size="small" label-width="80px">
        <el-form-item label="状态:">
          <!-- status是后台接口提供的数据 -->
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道:">
           <!-- :value="reqParams.channel_id"  @input="把改变的数据设置给reqParams.channel_id" -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期:">
          <el-date-picker
            @change="changeDate"
            value-format="yyyy-MM-dd"
            v-model="dateValues"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <!-- 结果区域 -->
      <!-- <my-test> -->
      <!-- scope 收集了该插槽上所有的自定义属性的数据 -->
      <!-- scope 是一个对象 包含了插槽上的所有数据  -->
      <!-- <template slot="content" slot-scope="scope">内容1{{scope.test}}</template> -->
      <!-- <template v-slot:content="scope">内容1{{scope.test}}</template>
           <template slot="bottom">底部1</template>
      </my-test>-->
      <div slot="header">
        根据筛选条件共查询到
        <b>{{total}}</b>条结果
      </div>
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" style="width:100px;height:75px">
              <div slot="error" class="image-slot">
                <img src="../../assets/images/error.gif" width="100" height="75" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag type="warning" v-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 4">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row.id)" icon="el-icon-edit" plain type="primary" circle></el-button>
            <el-button @click="del(scope.row.id)" icon="el-icon-delete"  plain type="danger" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="box">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="pager"
          :page-size="reqParams.per_page"
          :current-page="reqParams.page"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
// import MyBread from '@/components/my-bread.vue'

export default {
  // components: { MyBread },
  data () {
    return {
      // 提交后的筛选条件数据
      reqParams: {
        page: 1,
        per_page: 20,
        channel_id: null,
        // 默认数据 '' 与 null 区别
        // 如果是 null 该字段是不会提交给后台的。
        status: null,
        begin_pubdate: null,
        end_pubdate: null
      },
      // 频道的选项数组
      channelOptions: [
        { name: 'java', id: 1 },
        { name: 'pathon', id: 2 },
        { name: 'UI', id: 3 }
      ],
      // 日期数据
      dateValues: [],
      articles: [],
      total: 0
    }
  },
  created () {
    // 获取文件列表数据
    this.getArticles()
  },
  methods: {
    edit (id) {
      this.$router.push(`/publish?id=${id}`)
    },
    del (id) {
      this.$confirm('亲,此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.delete(`articles/${id}`)
          this.$message.success('删除成功')
          this.getArticles()
        })
        .catch(() => {

        })
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 搜索
    search () {
      this.reqParams.page = 1
      this.getArticles()
    },
    // 选择时间处理函数
    changeDate (values) {
      this.reqParams.begin_pubdate = values[0]
      this.reqParams.end_pubdate = values[1]
    },
    // 获取频道数据
    // async getchannelOptions () {
    //   // res ===> {data:响应内容}  ===> {data:{data:{channels:[{id,name},...]}}}//这个数据是根据接口外文档写的
    //   // 解构赋值 一层 const {data} = res
    //   // 解构赋值 二层 const {data:{data:data}} = res
    //   const {
    //     data: { data }
    //   } = await this.$http.get('channels')
    //   this.channelOptions = data.channels
    // },
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    }
  }
}
</script>

<style scope style="less">
.el-card {
  margin-bottom: 20px;
}
.box {
  text-align: center;
  margin: 0 auto;
}
</style>
