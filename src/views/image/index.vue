<template>
  <!-- 加载等待效果 -->
  <div class="container" v-loading="loading">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div style="margin-bottom:20px">
        <!-- 按钮式的单选框 -->
        <el-radio-group size="small" @change="search()" v-model="reqParams.collect">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 绿色按钮 -->
        <el-button
          @click="dialogVisible = true"
          size="small"
          style="float:right"
          type="success"
        >添加素材</el-button>
      </div>
      <!-- 图片列表 -->
      <ul class="img-list">
        <li v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <!-- 剔除操作栏 -->
          <div class="fot" v-if="!reqParams.collect">
            <span
              @click="toggleFav(item)"
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
            ></span>
            <span @click="delImage(item.id)" class="el-icon-delete"></span>
          </div>
        </li>
      </ul>
      <el-pagination
        v-if="total>reqParams.per_page"
        background
        layout="prev, pager, next"
        @current-change="pager"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- title="提示"  对话框的标题 -->
    <!-- :visible="dialogVisible" 显示隐藏 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="30%">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        :show-file-list="false"
        :on-success="handleSuccess"
        name="image"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 参数对象
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      // 加载数据
      loading: false,
      total: 0,
      dialogVisible: false,
      imageUrl: null,
      headers: {
        Authorization:
          'Bearer ' +
          JSON.parse(window.sessionStorage.getItem('hm-toutiao')).token
      }
    }
  },
  created () {
    // 获取素材列表数据
    this.getImages()
  },
  methods: {
    // 删除图片
    delImage (id) {
      this.$confirm('亲,此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.delete('user/images/' + id)
          this.$message.success('删除成功')
          this.getImages()
        })
        .catch(() => {})
    },
    // 切换收藏和取消收藏
    async toggleFav (item) {
      const {
        data: { data }
      } = await this.$http.put('user/images/' + item.id, {
        collect: !item.is_collected
      })
      // 成功
      this.$message.success('操作成功')
      // 把当前的图片的状态改成操作后后台给的状态
      item.is_collected = data.collect
    },
    // 上传成功
    handleSuccess (res) {
      // - 预览 2s 钟 ，提示上传成功
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      window.setTimeout(() => {
        // - 自动关闭对话框，更新列表数据。
        this.dialogVisible = false

        this.getImages()
        // 再次打开对话框的时候，预览的是上传按钮 而不是 之前的图片
        this.imageUrl = null
      }, 2000)
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    search () {
      this.reqParams.page = 1
      this.getImages()
    },
    async getImages () {
      this.loading = true
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      // 获取数据成功
      this.images = data.results
      this.loading = false
      this.total = data.total_count
    }
  }
}
</script>

<style scope lang="less">
.img-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  li {
    width: 160px;
    height: 160px;
    border: 1px dashed #ddd;
    float: left;
    margin-right: 30px;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .fot {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
